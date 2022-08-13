/// <reference path="./AnimationContainer.ts" />

namespace RG.Animation {
    type IndexableType = { [key: string]: any };

    interface SimultaniousAnimationConfig {
        config: GeneralConfig;
        animation: Interface;
    }

    export enum UnionType {
        // Каждая анимация следует за другой в порядке, указанном в менеджере
        Continuous = 'continuous',
        // Все анимации запускаются одновременно и дожидаются завершения самой долгой перед новым циклом
        Simultaneous = 'simultaneous',
        // Все анимации запускаются одновременно и не дожидаются завершения цикла самой долгой, а работают с бесконечной итерацией, пока цикл самой долгой не закончится
        SimultaneousDeferred = 'simultaneous-deferred'
        // Для одновременных анимаций основная анимация не должна иметь циклы в своих настройках!
    }

    export interface UnionConfig extends GeneralConfig {
        type: UnionType;
    }

    class UnionManager extends Utils.ArrayManager<Interface, (animation: Interface) => Interface> {
        createItem(animation: Interface) {
            return animation;
        }
    }

    export class Union extends EventEmitter<Events, GeneralEventListener> implements Interface {
        public readonly animations: UnionManager;

        private readonly config: UnionConfig = {
            type: UnionType.Continuous,
            duration: 0,
            delay: 0,
            endDelay: 0,
            iterations: 0
        };
        protected mainAnimation?: Interface;
        protected isPlaying: boolean = false;
        private currentAnimation?: Interface;
        private skippedAnimations: Interface[] = [];

        constructor(animations?: Interface[], config?: Partial<UnionConfig>) {
            super();
            if (!animations) {
                animations = []
            }
            this.animations = new UnionManager(...animations);
            if (config) {
                this.setConfig(config);
            }
        }

        /**
         * Возвращает играется ли сейчас анимация
         * @returns {boolean}
         */
        get inProgress () {
            return this.isPlaying;
        }

        /**
         * Меняет часть конфига, в соответствии с исходным параметром
         * @param {Partial<RG.Animation.UnionConfig>} config
         * @returns {this}
         */
        setConfig(config: Partial<UnionConfig>) {
            Object.assign(this.config, config);
            return this;
        }

        /**
         * Установка основной анимации для одновременного запуска нескольких (иначе будет выбрана самая длинная, на которой нет итераций)
         * @param {RG.Animation.Interface} animation
         * @returns {this}
         */
        setMainAnimation(animation: Interface) {
            if (this.animations.indexOf(animation) === -1) {
                throw new Exception('Данная анимация не входит в юнион');
            }
            this.mainAnimation = animation;
            return this;
        }

        /**
         * Меняет тип юниона
         * @param {RG.Animation.UnionType} type
         * @returns {this}
         */
        type(type: UnionType) {
            this.config.type = type;
            return this;
        }

        /**
         * Возвращает тип юниона
         * @returns {RG.Animation.UnionType}
         */
        getType() {
            return this.config.type;
        }

        /**
         * Меняет длительность анимации
         * @param {number} duration
         * @returns {this}
         */
        duration(duration: number) {
            this.config.duration = duration;
            return this;
        }

        /**
         * Возвращает текущее значение длины анимации
         * @returns {number}
         */
        getDuration() {
            return this.config.duration;
        }

        /**
         * Меняет задержку перед началом циклов анимаций
         * @param {number} delay
         * @returns {this}
         */
        delay(delay: number) {
            this.config.delay = delay;
            return this;
        }

        /**
         * Возвращает текущее значение задержки перед началом циклов
         * @returns {number}
         */
        getDelay() {
            return this.config.delay;
        }

        /**
         * Меняет задержку по завершению цикла анимаций
         * @param {number} endDelay
         * @returns {this}
         */
        endDelay(endDelay: number) {
            this.config.endDelay = endDelay;
            return this;
        }

        /**
         * Возвращает текущее значение задержки по завершению цикла
         * @returns {number}
         */
        getEndDelay() {
            return this.config.endDelay;
        }

        /**
         * Меняет значение кол-ва циклов анимаций (или Infinity)
         * @param {number} iterations
         * @returns {this}
         */
        iterations(iterations: number) {
            this.config.iterations = iterations;
            return this;
        }

        /**
         * Возвращает текущее значение кол-ва циклов
         * @returns {number}
         */
        getIterations() {
            return this.config.iterations;
        }

        /**
         * Пропускает конкретную анимацию в Continuous юнионе
         * @param {RG.Animation.Interface} animation
         * @returns {this}
         */
        skipAnimation(animation: Interface) {
            if (this.skippedAnimations.indexOf(animation) === -1) {
                this.skippedAnimations.push(animation);
            }
            return this;
        }

        /**
         * Пропускает конкретную анимацию в Continuous юнионе
         * @param {RG.Animation.Interface} animation
         * @returns {this}
         */
        removeSkippedAnimation(animation: Interface) {
            const index = this.skippedAnimations.indexOf(animation);
            if (index !== -1) {
                this.skippedAnimations.splice(index, 1);
            }
            return this;
        }

        /**
         * Получает текущие настройки конкретной анимации
         * @param {RG.Animation.Interface} animation
         * @returns {RG.Animation.GeneralConfig}
         */
        private getAnimationConfig(animation: Interface): GeneralConfig {
            return {
                duration: animation.getDuration(),
                iterations: animation.getIterations(),
                delay: animation.getDelay(),
                endDelay: animation.getEndDelay()
            };
        }

        /**
         * Восстанавливает конфигурацию анимации
         * @param {RG.Animation.Interface} animation
         * @param {RG.Animation.GeneralConfig} config
         * @returns {this}
         */
        private restoreAnimationConfig(animation: Interface, config: GeneralConfig) {
            for (const key in config) {
                const value = (config as IndexableType)[key] as number;
                const func = (animation as IndexableType)[key] as (arg: number) => any;
                func.call(animation, value);
            }
            return this;
        }

        /**
         * Возвращает длину анимации в мс.
         * @param {RG.Animation.Interface} animation
         * @returns {number}
         */
        private getAnimationLength(animation: Interface): number {
            const delay = animation.getDelay();
            const endDelay = animation.getEndDelay();
            const duration = animation.getDuration();
            const iterations = animation.getIterations();
            const iterationDuration = duration + endDelay;
            return delay + duration + iterationDuration * iterations;
        }

        /**
         * Переадресовывает ивент из анимации и возвращает слушатель
         * @param {RG.Animation.Interface} animation
         * @param {RG.Animation.Events} event
         * @param args
         * @returns {RG.Animation.GeneralEventListener}
         */
        private passthroughEvent(animation: Interface, event: Events, ...args: any[]): GeneralEventListener {
            const listener = () => {
                this.emit(event, ...args);
            };
            animation.on(event, listener);
            return listener;
        }

        /**
         * Переадресовывает ивенты из анимации и возвращает массив слушателей
         * @param {RG.Animation.Interface} animation
         * @param {RG.Animation.Events[]} events
         * @param args
         * @returns {RG.Animation.GeneralEventListener[]}
         */
        private passthroughEvents(animation: Interface, events: Events[], ...args: any): GeneralEventListener[] {
            const listeners: GeneralEventListener[] = [];
            for (const event of events) {
                listeners.push(this.passthroughEvent(animation, event, ...args));
            }
            return listeners;
        }

        /**
         * Удалит все слушатели со всех ивентов из аргументов
         * @param {RG.Animation.Interface} animation
         * @param {RG.Animation.Events[]} events
         * @param {RG.Animation.GeneralEventListener[]} listeners
         * @returns {this}
         */
        private removePassthroughEvents(animation: Interface, events: Events[], listeners: GeneralEventListener[]) {
            for (const event of events) {
                for (const listener of listeners) {
                    animation.off(event, listener);
                }
            }
            return this;
        }

        getAnimationTotalLength (): number {
            return this.animations.reduce((accumulator: number, current: Interface) => accumulator + this.getAnimationLength(current), 0);
        }

        /**
         * Запускает цикл анимаций последовательно
         * @param {number} time
         * @param {number} currentIteration
         * @returns {Promise<boolean>}
         */
        private async playContinuously(time?: number, currentIteration = 0): Promise<boolean> {
            if (!this.animations.length) {
                return false;
            }
            if (currentIteration === 0) {
                if (this.isPlaying) {
                    console.error('already playing', [...this.animations]);
                    this.stop()
                }
            }
            const totalLength: number = this.getAnimationTotalLength();
            const multi = this.config.duration > 0 && Number.isFinite(totalLength) ? (this.config.duration / totalLength) : 1; // Множитель из основной анимации по полной длине
            this.isPlaying = true;
            let isFirst: boolean = true;
            let step: number = 0;
            for (const animation of this.animations) {
                // Остановили на полпути
                if (!this.isPlaying) {
                    return false;
                }
                if (this.skippedAnimations.indexOf(animation) !== -1) {
                    continue;
                }
                const config = this.getAnimationConfig(animation);
                let delay = config.delay * multi;
                let events: Events[] = [];
                let listeners: GeneralEventListener[] = [];
                if (isFirst) {
                    if (currentIteration === 0) {
                        // Для первой итерации добавляем делей начала
                        if (this.config.delay) {
                            delay += this.config.delay;
                        }

                        // Начало берём из основной анимации
                        events = [Events.Start];
                        listeners.push(...this.passthroughEvents(animation, events));
                    }
                    else {
                        // Для последующих - делей конца
                        if (this.config.endDelay) {
                            delay += this.config.endDelay;
                        }
                        this.emit(Events.Repeat);
                    }
                    isFirst = false;
                }

                this.emit(Events.Step, step++);
                // Настраиваем текущую анимацию
                animation
                    .delay(delay)
                    .endDelay(config.endDelay * multi)
                    .duration(config.duration * multi);

                if (!isFirst || currentIteration > 0) {
                    animation.instantUpdate();
                }

                this.currentAnimation = animation;
                let result = await animation.play(time);
                this.currentAnimation = undefined;

                time = animation.getLastTime();

                // Остановили данную анимацию
                if (!result) {
                    return false;
                }

                // Удаляем из анимации, что натворили
                this.restoreAnimationConfig(animation, config);
                if (events.length && listeners.length) {
                    this.removePassthroughEvents(animation, events, listeners);
                }
            }

            const iterations = this.config.iterations;
            if (iterations > 0) {
                if (!isFinite(iterations) || currentIteration < iterations) {
                    return this.playContinuously(time, ++currentIteration);
                }
            }

            this.isPlaying = false;
            this.emit(Events.Complete);
            return true;
        }

        /**
         * Запускает цикл анимаций параллельно
         * @param {number} time
         * @returns {Promise<boolean>}
         */
        private async playSimultaneously(time?: number): Promise<boolean> {
            if (!this.animations.length) {
                return false;
            }
            if (this.isPlaying) {
                console.error('already playing', [...this.animations])
                this.stop()
            }
            let maxLength: number = 0,
                maxAnimation: Interface = this.animations[0];
            for (const animation of this.animations) {
                const length = this.getAnimationLength(animation);
                if (length > maxLength) {
                    maxAnimation = animation;
                    maxLength = length;
                }
            }

            if (!Number.isFinite(maxLength) || !maxLength) {
                throw new Exception('Длина внутренних анимаций юниона не может быть бесконечно большой. Для этого можно выставить бесконечную итерацию сверху анимации');
            }

            const isAllSameAnimations = this.animations.findIndex(e => (
                this.getAnimationLength(e) !== maxLength)) === -1;

            if (this.mainAnimation) {
                if (this.animations.indexOf(this.mainAnimation) === -1) {
                    throw new Exception('Основная анимация не входит в юнион');
                }
                maxAnimation = this.mainAnimation;
                const length = this.getAnimationLength(maxAnimation);
                if (length < maxLength) {
                    throw new Exception('Основная анимация не является самой длинной');
                }
            }

            if (maxAnimation.getIterations() > 0) {
                throw new Exception('Невозможно запустить одновременную анимацию с основной, которая сама зациклена');
            }

            this.isPlaying = true;
            const isDeferred = this.config.type === UnionType.SimultaneousDeferred;
            const multi = this.config.duration > 0 ? (this.config.duration / maxLength) : 1; // Множитель из основной анимации по полной длине

            let configs: SimultaniousAnimationConfig[] = [];
            // Начало берём из основной анимации
            let events: Events[] = [Events.Start];
            if (isDeferred || isAllSameAnimations) {
                events.push(Events.Repeat);
            }
            let listeners: GeneralEventListener[] = [...this.passthroughEvents(maxAnimation, events)];
            let maxPromise: Promise<boolean>;

            for (const animation of this.animations) {
                const config = this.getAnimationConfig(animation);
                configs.push({config, animation});

                let endDelay = config.endDelay * multi;

                animation
                    .delay(this.config.delay + config.delay * multi)
                    .duration(config.duration * multi);

                if (isAllSameAnimations || animation === maxAnimation) {
                    animation.iterations(this.config.iterations);
                    endDelay += this.config.endDelay;
                }
                else if (isDeferred) {
                    // Проигрываем всегда остальные анимации, пока проигрываем основную
                    animation.iterations(Infinity);
                }
                animation.endDelay(endDelay);
                const promise = animation.play(time);
                if (animation === maxAnimation) {
                    maxPromise = promise;
                }
            }

            // На каждом шагу заново запускаем все остальные анимации
            if (!isDeferred && !isAllSameAnimations) {
                const listener: GeneralEventListener = () => {
                    for (const animation of this.animations) {
                        if (animation === maxAnimation) {
                            continue;
                        }
                        const configObj = configs.find(e => e.animation === animation);
                        if (!configObj) {
                            continue;
                        }
                        animation
                            .delay(this.config.endDelay + configObj.config.delay * multi)
                            .forceFinish()
                            .instantUpdate()
                            .play(maxAnimation.getLastTime());
                    }
                    this.emit(Events.Repeat);
                };
                listeners.push(listener);
                events.push(Events.Repeat);
                maxAnimation.on(Events.Repeat, listener);
            }

            const result = await maxPromise!;

            if (events.length && listeners.length) {
                this.removePassthroughEvents(maxAnimation, events, listeners);
            }

            // Останавливаем и восстанавливаем все настройки остальных анимаций
            for (const value of configs) {
                if (result) {
                    value.animation.forceFinish();
                }
                else {
                    value.animation.stop();
                }

                this.restoreAnimationConfig(value.animation, value.config);
            }
            
            this.isPlaying = false;

            if (result) {
                this.emit(Events.Complete);
            }

            return result;
        }

        /**
         * Добавил проигрывание единичной анимации
         * @param {number} time
         * @returns {Promise<boolean>}
         */
        private async playSingleAnimation(time?: number): Promise<boolean> {
            if (this.animations.length !== 1) {
                return false;
            }
            if (this.isPlaying) {
                console.error('already playing', [...this.animations])
                this.stop()
            }
            
            const events: Events[] = [Events.Start, Events.Repeat, Events.Complete];
            const animation = this.animations[0];
            const config = this.getAnimationConfig(animation);
            const listeners = this.passthroughEvents(animation, events);
            if (this.config.duration > 0) {
                animation.duration(this.config.duration);
            }

            this.isPlaying = true;
            const result = await animation
                .delay(this.config.delay)
                .endDelay(this.config.endDelay)
                .iterations(this.config.iterations)
                .play(time);
            this.isPlaying = false;

            this.removePassthroughEvents(animation, events, listeners);
            this.restoreAnimationConfig(animation, config);
            return result;
        }

        /**
         * Возвращает последнее время проигрывания анимации
         * @returns {number}
         */
        getLastTime(): number {
            return Math.max(...this.animations.map(e => e.getLastTime()));
        }

        /**
         * Заставляет анимации обновиться сразу после начала проигрывания
         * @returns {this}
         */
        instantUpdate() {
            for (const animation of this.animations) {
                animation.instantUpdate();
            }
            return this;
        }

        /**
         * Проигрывает анимации в юнионе
         * @param {number} time
         * @returns {Promise<boolean>}
         */
        async play(time?: number): Promise<boolean> {
            this.emit(Events.BeforeStart);
            if (this.animations.length === 1) {
                return this.playSingleAnimation(time);
            }

            switch (this.config.type) {
                case UnionType.Continuous:
                    return this.playContinuously(time);
                case UnionType.Simultaneous:
                case UnionType.SimultaneousDeferred:
                    return this.playSimultaneously(time);
            }
            return false;
        }

        /**
         * Запускает цикл анимаций и уничтожает их по завершению
         * @param {number} time
         * @returns {Promise<boolean>}
         */
        async playAndDestroy(time?: number): Promise<boolean> {
            const result = await this.play(time);
            this.destroy();
            return result;
        }

        /**
         * Останавливает текущую проигрываемую в бесконечности анимацию в последовательном юнионе
         * Иначе просто вызывает forceFinish
         * @returns {this}
         */
        forceFinishInfinite() {
            if (!this.isPlaying) {
                return this;
            }
            if (this.config.type !== UnionType.Continuous || !this.currentAnimation) {
                return this.forceFinish();
            }
            if (this.currentAnimation instanceof Union) {
                this.currentAnimation.forceFinishInfinite();
            }
            else {
                if (!Number.isFinite(this.currentAnimation.getIterations())) {
                    this.currentAnimation.forceFinish();
                }
                else {
                    this.forceFinish();
                }
            }
            return this;
        }

        /**
         * Останавливает текущую проигрываемую в бесконечности анимацию
         * Иначе просто вызывает stop
         * @returns {this}
         */
        stopInfinite() {
            if (this.config.type !== UnionType.Continuous || !this.currentAnimation) {
                return this.stop();
            }
            if (this.currentAnimation instanceof Union) {
                this.currentAnimation.stopInfinite();
            }
            else {
                if (!Number.isFinite(this.currentAnimation.getIterations())) {
                    this.currentAnimation.stop();
                }
                else {
                    this.stop();
                }
            }
            return this;
        }

        /**
         * Останавливает все текущие анимации на конечной точке
         * @returns {this}
         */
        forceFinish() {
            if (!this.isPlaying) {
                return this;
            }
            for (const animation of this.animations) {
                animation.forceFinish();
            }
            return this;
        }

        /**
         * Останавливает все текущие анимации
         * @returns {this}
         */
        stop() {
            if (!this.isPlaying) {
                return this;
            }
            for (const animation of this.animations) {
                animation.stop();
            }
            this.isPlaying = false;
            this.emit(Events.Stop);
            return this;
        }

        /**
         * Уничтожает все анимации в объединении
         * @returns {boolean}
         */
        destroy() {
            for (const animation of this.animations) {
                animation.destroy();
            }
            this.animations.clear();
            return true;
        }
    }
}

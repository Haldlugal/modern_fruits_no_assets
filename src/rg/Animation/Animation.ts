/// <reference path="./AnimationManager.ts" />

namespace RG.Animation {
    export class Exception extends Error {
    }

    export enum Events {
        BeforeStop = 'before-stop',
        BeforeStart = 'before-start',
        Start = 'start',
        Stop = 'stop',
        Update = 'update',
        Complete = 'complete',
        Repeat = 'repeat',
        Step = 'step'
    }

    export enum Direction {
        Normal = 'normal',
        Reverse = 'reverse',
        Alternate = 'alternate',
        AlternateReverse = 'alternate-reverse'
    }

    export type SimpleType = {value: number};

    export interface GeneralConfig {
        duration: number;
        delay: number;
        endDelay: number;
        iterations: number;
    }

    export interface Config extends GeneralConfig {
        easing: Easing.EasingFunction;
        direction: Direction;
        defaultDuration: number; // общая длительность анимации по-умолчанию (для расчёта relativeOffset из relativeTime фреймов)
    }

    export interface KeyframeProperties {
        [key: string]: number;
    }

    export interface KeyframeConfig {
        easing?: Easing.EasingFunction;
        // 3 одинаковых значения, но считаются по-разному
        offset?: number; // позиция фрейма на шкале от 0 до 1
        relativeOffset?: number; // позиция фрейма на шкале от 0 до 1, относительно предыдущего фрейма
        relativeTime?: number; // время начала текущего фрейма относительно времени начала предыдущего, если установлена общая длительность
    }

    export interface Keyframe<T extends KeyframeProperties> {
        props: Readonly<Partial<T>>;
        config?: KeyframeConfig;
    }

    export type BoundaryKeyframeConfig = Pick<KeyframeConfig, 'easing'>;

    export interface BoundaryKeyframe<T extends KeyframeProperties> {
        props: Readonly<T>;
        config?: BoundaryKeyframeConfig;
    }

    class KeyframeManager<T extends KeyframeProperties> extends Utils.ArrayManager<Keyframe<T>, (props: Partial<T>, config?: KeyframeConfig) => Keyframe<T>> {
        createItem(props: Partial<T>, config?: KeyframeConfig) {
            return {
                props: Object.seal(Object.freeze(Object.assign({}, props))),
                config
            };
        }
    }

    export type GeneralEvent = string | symbol;

    export type PropEventListener<T extends KeyframeProperties> = (props: T, value?: number, elapsed?: number, isReversed?: boolean) => void;
    export type GeneralEventListener = (...args: any[]) => void;

    export interface Interface {
        readonly inProgress: boolean;

        on(event: GeneralEvent, fn: GeneralEventListener, context?: any): this;

        off(event: GeneralEvent, fn?: GeneralEventListener, context?: any): this;

        delay(delay: number): this;

        getDelay(): number;

        endDelay(endDelay: number): this;

        getEndDelay(): number;

        iterations(iterations: number): this;

        getIterations(): number;

        duration(duration: number): this;

        getDuration(): number;

        instantUpdate(): this;

        getLastTime(): number;

        play(time?: number): Promise<boolean>;

        playAndDestroy(time?: number): Promise<boolean>;

        stop(): this;

        forceFinish(): this;

        destroy(): boolean;
    }

    export abstract class EventEmitter<T extends GeneralEvent, F extends GeneralEventListener> extends PIXI.utils.EventEmitter {
        // Расписываем новые доступные аргументы для eventEmitter'а
        listeners(event: T): Array<Function>;
        listeners(event: GeneralEvent): Array<Function>;
        listeners(event: GeneralEvent): Array<Function> {
            return super.listeners(event);
        }

        listenerCount(event: T): number;
        listenerCount(event: GeneralEvent): number;
        listenerCount(event: GeneralEvent): number {
            return super.listenerCount(event)
        }

        emit(event: T, ...args: Parameters<F>): boolean;
        emit(event: GeneralEvent, ...args: Parameters<GeneralEventListener>): boolean;
        emit(event: GeneralEvent, ...args: Parameters<GeneralEventListener>): boolean {
            return super.emit(event, ...args)
        }

        on(event: T, fn: F, context?: any): this;
        on(event: GeneralEvent, fn: GeneralEventListener, context?: any): this;
        on(event: GeneralEvent, fn: GeneralEventListener, context?: any): this {
            return super.on(event, fn, context)
        }

        once(event: T, fn: F, context?: any): this;
        once(event: GeneralEvent, fn: GeneralEventListener, context?: any): this;
        once(event: GeneralEvent, fn: GeneralEventListener, context?: any): this {
            return super.once(event, fn, context)
        }

        removeListener(event: T, fn?: F, context?: any, once?: boolean): this;
        removeListener(event: GeneralEvent, fn?: GeneralEventListener, context?: any, once?: boolean): this;
        removeListener(event: GeneralEvent, fn?: GeneralEventListener, context?: any, once?: boolean): this {
            return super.removeListener(event, fn, context, once)
        }

        removeAllListeners(event?: T): this;
        removeAllListeners(event?: GeneralEvent): this;
        removeAllListeners(event?: GeneralEvent): this {
            return super.removeAllListeners(event)
        }

        off(event: T, fn?: F, context?: any, once?: boolean): this;
        off(event: GeneralEvent, fn?: GeneralEventListener, context?: any, once?: boolean): this;
        off(event: GeneralEvent, fn?: GeneralEventListener, context?: any, once?: boolean): this {
            return super.off(event, fn, context, once)
        }

        addListener(event: T, fn: F, context?: any): this;
        addListener(event: GeneralEvent, fn: GeneralEventListener, context?: any): this;
        addListener(event: GeneralEvent, fn: GeneralEventListener, context?: any): this {
            return super.addListener(event, fn, context)
        }
    }

    export class Animation<T extends KeyframeProperties=SimpleType> extends EventEmitter<Exclude<Events, Events.BeforeStart>, PropEventListener<T>> implements Interface {
        protected manager: Manager = Manager.shared;
        private readonly config: Config = {
            easing: Easing.Linear.None,
            direction: Direction.Normal,
            duration: 1000,
            delay: 0,
            endDelay: 0,
            iterations: 0,
            defaultDuration: 0
        };
        protected readonly keyframes: KeyframeManager<T>;
        private startKeyframe?: BoundaryKeyframe<T>;
        private endKeyframe?: BoundaryKeyframe<T>;

        private keyframeOffsets: number[] = [];
        private currentProps?: T;

        private currentIteration: number = 0;
        private isPlaying: boolean = false;
        private startEmitted: boolean = false;
        private startTime: number = NaN;
        private lastTime: number = NaN;
        private isInstantUpdate: boolean = false;
        private completeNow: boolean = false;

        constructor(config?: Partial<Config>, keyframes?: Keyframe<T>[], manager?: Manager) {
            super();
            if (!keyframes) {
                keyframes = [];
            }
            this.keyframes = new KeyframeManager<T>(...keyframes);
            if (manager) {
                this.setManager(manager);
            }
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
         * Возвращает последний индекс промежуточного кейфрейма (или -1, если таковых ещё не было)
         * @returns {number}
         */
        get lastIntermediateKeyframeIndex(): number {
            const firstIndex = this.firstIntermediateIndex;
            const lastIndex = this.lastIntermediateIndex;
            if (lastIndex <= firstIndex) {
                return -1;
            }
            return lastIndex
        }

        /**
         * Вставляет/заменяет начальный(основной) кейфрейм
         * @param {T} props
         * @param {RG.Animation.BoundaryKeyframeConfig} config
         * @returns {this<T extends RG.Animation.KeyframeProperties>}
         */
        from(props: T, config?: BoundaryKeyframeConfig) {
            return this.replaceBoundaryKeyframe(false, props, config);
        }

        /**
         * Возвращает свойста начального фрейма
         * @returns {Readonly<T extends RG.Animation.KeyframeProperties> | false}
         */
        getFromProps(): Readonly<T> | false {
            if (!this.startKeyframe) {
                return false;
            }
            return Object.seal(Object.freeze(Object.assign({}, this.startKeyframe.props)))
        }

        /**
         * Вставляет/заменяет конечный(основной) кейфрейм
         * @param {T} props
         * @param {RG.Animation.BoundaryKeyframeConfig} config
         * @returns {this<T extends RG.Animation.KeyframeProperties>}
         */
        to(props: T, config?: BoundaryKeyframeConfig) {
            return this.replaceBoundaryKeyframe(true, props, config);
        }

        /**
         * Возвращает свойста конечного фрейма
         * @returns {Readonly<T extends RG.Animation.KeyframeProperties> | false}
         */
        getToProps(): Readonly<T> | false {
            if (!this.endKeyframe) {
                return false;
            }
            return Object.seal(Object.freeze(Object.assign({}, this.endKeyframe.props)))
        }

        /**
         * Вставляет/заменяет промежуточный кейфрейм
         * @param {number} index
         * @param {Partial<T extends RG.Animation.KeyframeProperties>} props
         * @param {RG.Animation.KeyframeConfig} config
         * @returns {this<T extends RG.Animation.KeyframeProperties>}
         */
        intermediate(index: number, props: Partial<T>, config?: KeyframeConfig) {
            const keyframeIndex = this.getIntermediateIndex(index, true);
            // Добавляем кейфрейм в конец
            if (keyframeIndex === (this.lastIntermediateIndex + 1)) {
                this.keyframes.addOnIndex(keyframeIndex, props, config);
            }
            else {
                this.keyframes.replaceByIndex(keyframeIndex, props, config);
            }
            return this;
        }

        /**
         * Удаляет промежуточный кейфрейм
         * @param {number} index
         * @return {this}
         */
        removeIntermediate(index: number) {
            const keyframeIndex = this.getIntermediateIndex(index);
            this.keyframes.splice(keyframeIndex, 1);
            return this;
        }

        /**
         * Возвращает первый индекс промежуточного фрейма
         * @returns {number}
         */
        private get firstIntermediateIndex(): number {
            return (this.startKeyframe ? 1 : 0);
        }

        /**
         * Возвращает первый индекс промежуточного фрейма
         * @returns {number}
         */
        private get lastIntermediateIndex(): number {
            return this.keyframes.length - 1 - (this.endKeyframe ? 1 : 0);
        }

        /**
         * Возвращает промежуточный индекс
         * @param {number} index
         * @param {boolean} allowNew разрешает новый промежуточный индекс
         * @returns {number}
         */
        private getIntermediateIndex(index: number, allowNew: boolean = false) {
            // Индекс промежуточного кейфрейма в массиве всех кейфремов
            const firstIndex = this.firstIntermediateIndex;
            const lastIndex = this.lastIntermediateIndex;
            const availableIndex = lastIndex + (allowNew ? 1 : 0);
            const keyframeIndex = index + firstIndex;
            if (keyframeIndex > availableIndex || keyframeIndex < firstIndex) {
                throw new Exception('Неверный индекс ' + keyframeIndex + ' для промежуточного кейфрейма. Доступные значения [' + firstIndex + ', ' + availableIndex + ']');
            }
            return keyframeIndex;
        }

        /**
         * Возвращает свойства промежуточного фрейма
         * @param {number} index
         * @returns {Readonly<Partial<T extends RG.Animation.KeyframeProperties>> | false}
         */
        getIntermediateProps(index: number): Readonly<Partial<T>> | false {
            let keyframeIndex: number;
            try {
                keyframeIndex = this.getIntermediateIndex(index);
            }
            catch (e) {
                return false;
            }
            const keyframe = this.keyframes[keyframeIndex];
            return Object.seal(Object.freeze(Object.assign({}, keyframe.props)))
        }

        /**
         * Меняет менеджер анимаций
         * @param {RG.Animation.Manager} manager
         * @returns {this}
         */
        setManager(manager: Animation.Manager) {
            this.manager = manager;
            return this;
        }

        /**
         * Меняет часть конфига, в соответствии с исходным параметром
         * @param {Partial<RG.Animation.Config>} config
         * @returns {this}
         */
        setConfig(config: Partial<Config>) {
            Object.assign(this.config, config);
            return this;
        }

        /**
         * Меняет функцию Easing по-умолчанию
         * @param {RG.Animation.Easing.EasingFunction} func
         * @returns {this}
         */
        easing(func: Easing.EasingFunction) {
            this.config.easing = func;
            return this;
        }

        /**
         * Возвращает текущее значение Easing
         * @returns {RG.Animation.Easing.EasingFunction}
         */
        getEasing() {
            return this.config.easing;
        }

        /**
         * Меняет направление анимации
         * @param {RG.Animation.Direction} dir
         * @returns {this}
         */
        direction(dir: Direction) {
            this.config.direction = dir;
            return this;
        }

        /**
         * Возвращает текущее значение направления анимации
         * @returns {RG.Animation.Direction}
         */
        getDirection() {
            return this.config.direction;
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
         * Меняет длительность анимации по-умолчанию для расчёта оффсетов промежуточных кейфремов
         * @param {number} defaultDuration
         * @returns {this}
         */
        defaultDuration(defaultDuration: number) {
            this.config.defaultDuration = defaultDuration;
            return this;
        }

        /**
         * Возвращает текущее значение длины анимации по-умолчанию для расчёта оффсетов промежуточных кейфремов
         * @returns {number}
         */
        getDefaultDuration() {
            return this.config.defaultDuration;
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
         * Возвращает true, если включено обратное направление анимации
         * @returns {boolean}
         * @private
         */
        getIsReversed(): boolean {
            const dir = this.config.direction,
                dirs = Direction;
            switch (dir) {
                case dirs.Reverse:
                    return true;
                case dirs.AlternateReverse:
                    return this.currentIteration % 2 === 0;
                case dirs.Alternate:
                    return this.currentIteration % 2 === 1;
                default:
                    return false;
            }
        }

        /**
         * Возвращает последнее время обновления анимации
         * @returns {number}
         */
        getLastTime(): number {
            return this.lastTime;
        }

        /**
         * Заменяет граничный кейфрейм в анимации
         * @param {boolean} isEnd конечный кейфрем?
         * @param {T} props
         * @param {RG.Animation.BoundaryKeyframeConfig} config
         * @returns {this<T extends RG.Animation.KeyframeProperties>}
         * @private
         */
        private replaceBoundaryKeyframe(isEnd: boolean, props: T, config?: BoundaryKeyframeConfig) {
            const curValue = isEnd ? this.endKeyframe : this.startKeyframe;
            let newValue: BoundaryKeyframe<T>;
            if (!curValue) {
                const f = isEnd ? 'add' : 'prepend';
                newValue = (this.keyframes[f](props, config) as BoundaryKeyframe<T>);
            }
            else {
                const index = isEnd ? this.keyframes.length - 1 : 0;
                if (curValue !== this.keyframes[index]) {
                    throw new Exception('Граничный кейфрейм не совпадает с тем, что указан в анимации');
                }
                newValue = (this.keyframes.replaceByIndex(index, props, config) as BoundaryKeyframe<T>);
            }
            if (isEnd) {
                this.endKeyframe = newValue;
            }
            else {
                this.startKeyframe = newValue;
            }
            return this;
        }

        /**
         * Возвращает список текущих значений в данный момент анимации
         * @returns {Readonly<T extends RG.Animation.KeyframeProperties>}
         * @private
         */
        private getCurrentPropsForEvent(): Readonly<T> {
            return Object.seal(Object.freeze(Object.assign({}, this.currentProps)))
        }

        /**
         * Преобразует данные первого (или последнего) кейфрейма в массив значений для анимации
         * Если в первом (последнем) кейфрейме каких-то значений не достаёт, то они заполнятся из следующих
         * @returns {T}
         * @private
         */
        private keyframesToCurrentProps(): T {
            const isReversed = this.getIsReversed();
            const keyframe = isReversed ? this.endKeyframe : this.startKeyframe;
            if (!keyframe) {
                throw new Exception('Граничный кейфрейм пуст')
            }
            return Object.assign({}, keyframe.props)
        }

        /**
         * Считаем оффсеты кейфреймов
         * @tutorial https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats#Syntax
         * @returns {number[]}
         * @private
         */
        private keyframesToOffsetsArray(): number[] {
            const length = this.keyframes.length;
            let offsets: number[] = [];
            // Начальный оффсет - 0
            offsets.push(0);
            let i = 1;
            while (i < length) {
                const keyframe = this.keyframes[i];
                // Если во фрейме указан свой оффсет, то берём его
                if (keyframe.config) {
                    const lastOffset: number = offsets[offsets.length - 1];
                    let nextOffset: number = 0;
                    if (keyframe.config.offset) {
                        nextOffset = keyframe.config.offset;
                    }
                    else if (keyframe.config.relativeOffset) {
                        nextOffset = lastOffset + keyframe.config.relativeOffset;
                    }
                    else if (keyframe.config.relativeTime && this.config.defaultDuration > 0) {
                        nextOffset = lastOffset + keyframe.config.relativeTime / this.config.defaultDuration;
                    }
                    if (nextOffset > 0 && nextOffset > lastOffset && nextOffset < 1) {
                        offsets.push(nextOffset);
                        i++;
                        continue;
                    }
                }
                // Считаем следующий указанный оффсет и кол-во кейфреймов без оффсета до него
                let nextOffset = 1, countToNextOffset = 0;
                for (let j = i + 1; j < length; j++) {
                    countToNextOffset++;
                    // Не учитываем последний оффсет - он всегда 1
                    if (j === length - 1) {
                        break
                    }
                    const nextKeyframe = this.keyframes[j];
                    if (nextKeyframe.config && nextKeyframe.config.offset) {
                        nextOffset = nextKeyframe.config.offset;
                        break;
                    }
                }
                // Считаем, по сколько придётся на каждый кейфрейм
                const prevOffset = offsets[offsets.length - 1];
                const diff = (nextOffset - prevOffset) / (countToNextOffset + 1);
                // Заполняем все эти оффсеты
                for (let j = 1; j <= countToNextOffset; j++) {
                    offsets.push(prevOffset + diff * j);
                    i++
                }
                offsets.push(nextOffset);
                i++;
            }
            return offsets;
        }

        /**
         * Возвращает индекс для оффсета в соответствии с текущим временем в анимации
         * @param {number} elapsed
         * @returns {number}
         * @private
         */
        private getOffsetIndexByElapsed(elapsed: number): number {
            const offsets = this.keyframeOffsets;
            if (!offsets.length) {
                throw new Exception('Пустой массив оффсетов')
            }
            const isReversed = this.getIsReversed();
            return Utils.iterateArrayWithReverse(offsets, (offset: number) => {
                if (isReversed ? offset <= elapsed : offset >= elapsed) {
                    return false;
                }
            }, isReversed)
        }

        /**
         * Возвращает индекс текущего и следующего кейфрейма на основе индекса оффсета
         * @param {number} index
         * @returns {number[]}
         * @private
         */
        private getKeyframeIndexesByOffsetIndex(index: number): number[] {
            const length = this.keyframes.length;
            const lastIndex = length - 1;
            let nextIndex: number;
            if (index < 0 || index > lastIndex) {
                throw new Exception('Индекс не может быть меньше нуля или больше максимального индекса')
            }
            if (this.getIsReversed()) {
                // Ибо nextIndex перед index
                index++;
                if (index > lastIndex) {
                    index = lastIndex;
                }
                nextIndex = index - 1;
            }
            else {
                index--;
                if (index < 0) {
                    index = 0;
                }
                nextIndex = index + 1;
            }
            return [index, nextIndex];
        }

        /**
         * Ищет ненулевой индекс для свойства кейфрейма
         * @param {keyof T} prop
         * @param {number} index
         * @param {boolean} isEnd
         * @returns {number}
         * @private
         */
        private findNonEmptyKeyframeIndex(prop: keyof T, index: number, isEnd: boolean) {
            const isReversed = this.getIsReversed();
            const length = this.keyframes.length;
            let i = index;
            while (i >= 0 && i < length) {
                const keyframe = this.keyframes[i];
                if (keyframe.props.hasOwnProperty(prop)) {
                    break
                }
                // Если прямой ход, то начало вычитается false === false, если обратный - то конец, true === true
                if (isReversed === isEnd) {
                    i--
                }
                else {
                    i++
                }
            }
            return i
        }

        /**
         * Завершает цикл анимации и проверяет необходимость его повтора
         * @param {number} time
         * @returns {boolean} false, если анимация закончилась
         * @private
         */
        private onFinish(time?: number): boolean {
            if (!(this.config.iterations > 0) || this.completeNow) {
                return false;
            }
            if (isFinite(this.config.iterations) && this.currentIteration >= this.config.iterations) {
                return false;
            }
            this.currentIteration++;
            this.emit(Events.Repeat, this.getCurrentPropsForEvent(), this.currentIteration);

            this.currentProps = this.keyframesToCurrentProps();
            this.keyframeOffsets = this.keyframesToOffsetsArray();

            this.startTime = time || Utils.getCurrentTime();
            if (this.config.endDelay) {
                this.startTime += this.config.endDelay
            }

            return true;
        }

        /**
         * Обновляет текущие значения анимации по значению elapsed от 0 до 1
         * @param {number} elapsed
         * @returns {this<T extends RG.Animation.KeyframeProperties>}
         */
        private updateByElapsed(elapsed: number) {
            const calcElapsed = this.getIsReversed() ? 1 - elapsed : elapsed;

            const elapsedIndex = this.getOffsetIndexByElapsed(calcElapsed);
            const [index, nextIndex] = this.getKeyframeIndexesByOffsetIndex(elapsedIndex);

            const defaultValue = this.getEasingValue(calcElapsed, index, nextIndex);

            // console.log('upd', elapsedIndex, index, nextIndex, this.keyframes.length, this.keyframeOffsets)

            for (const prop in this.currentProps) {
                const startIndex = this.findNonEmptyKeyframeIndex(prop, index, false),
                    endIndex = this.findNonEmptyKeyframeIndex(prop, nextIndex, true);

                let value = defaultValue;
                if (startIndex !== index || endIndex !== nextIndex) {
                    value = this.getEasingValue(calcElapsed, startIndex, endIndex);
                }

                // Всегда есть граничные кейфреймы, у которых должны быть все пропсы указаны
                const start = this.keyframes[startIndex].props[prop]!,
                    end = this.keyframes[endIndex].props[prop]!;

                (this.currentProps[prop] as KeyframeProperties[string]) = start + (end - start) * value;
            }

            this.emit(Events.Update, this.getCurrentPropsForEvent(), defaultValue, elapsed, this.getIsReversed());

            return this;
        }

        /**
         * Возвращает easing значение между двумя кейфреймами
         * @param {number} elapsed
         * @param {number} startIndex
         * @param {number} endIndex
         * @returns {number}
         * @private
         */
        private getEasingValue(elapsed: number, startIndex: number, endIndex: number): number {
            const isReversed = this.getIsReversed();

            const startKeyframe = this.keyframes[startIndex];
            const endKeyframe = this.keyframes[endIndex];

            const startOffset = this.keyframeOffsets[startIndex];
            const endOffset = this.keyframeOffsets[endIndex];

            // В обратном порядке easing и interpolation функции содержатся в следующем кейфрейме
            const funcKeyframeConfig = isReversed ? endKeyframe.config : startKeyframe.config;
            const easing: Easing.EasingFunction = funcKeyframeConfig && funcKeyframeConfig.easing ? funcKeyframeConfig.easing : this.config.easing;

            // Даже если startOffset > endOffset, то elapsed - startOffset < 0 и endOffset - startOffset < 0
            let elapsedPart = (elapsed - startOffset) / (endOffset - startOffset);

            if (elapsedPart > 1) {
                elapsedPart = 1;
            }
            if (elapsedPart < 0) {
                elapsedPart = 0;
            }

            return easing(elapsedPart);
        }

        /**
         * Заставляет сразу обновиться анимацию при начале проигрывания (необходимо для чейнинга в юнионе)
         * @returns {this<T extends RG.Animation.KeyframeProperties>}
         */
        instantUpdate () {
            this.isInstantUpdate = true;
            return this;
        }

        /**
         * Запускает анимацию
         * @param {number} time
         * @returns {this}
         */
        start(time?: number) {
            if (this.isPlaying) {
                console.error('already playing', this.currentIteration, [...this.keyframes], {...this.currentProps})
                this.stop()
            }
            this.manager.add(this);

            this.emit(Events.BeforeStart);

            this.isPlaying = true;
            this.startEmitted = false;
            this.currentIteration = 0;

            const currentTime = time || Utils.getCurrentTime();
            this.startTime = currentTime;
            this.startTime += this.config.delay;

            this.currentProps = this.keyframesToCurrentProps();
            this.keyframeOffsets = this.keyframesToOffsetsArray();

            if (this.isInstantUpdate) {
                this.isInstantUpdate = false;
                this.update(currentTime);
            }

            return this;
        }

        /**
         * Запускает анимацию и дожидается её завершения
         * @param {number} time
         * @returns {Promise<boolean>}
         */
        async play(time?: number): Promise<boolean> {
            type ResolveFn = (result: boolean) => void
            let resolver: ResolveFn;
            this.completeNow = false;
            const promise = new Promise((resolve: ResolveFn) => {
                resolver = resolve
            });
            this.start(time).on(Events.Complete, () => {
                resolver!(true)
            }).on(Events.Stop, () => {
                resolver!(false)
            });
            return promise
        }

        /**
         * Запускает анимацию и дожидается её завершения, а потом уничтожает анимацию
         * @param {number} time
         * @returns {Promise<boolean>}
         */
        async playAndDestroy(time?: number): Promise<boolean> {
            const result = await this.play(time);
            this.destroy();
            return result
        }

        /**
         * Останавливает анимацию и уничтожает всех слушателей
         * @returns {boolean}
         */
        destroy() {
            this.stop();
            this.removeAllListeners();

            return true;
        }

        /**
         * Обновляет текущий фрейм в анимации
         * @param {number} time
         * @returns {boolean}
         */
        update(time: number) {
            if (time < this.startTime || !this.currentProps) {
                return true;
            }

            if (!this.startEmitted) {
                this.emit(Events.Start, this.getCurrentPropsForEvent());
                this.startEmitted = true;
            }
            this.lastTime = time;
            // 0 to 1
            let elapsed = (time - this.startTime) / this.config.duration;
            elapsed = elapsed > 1 ? 1 : elapsed;
            const isFinish = elapsed === 1;

            this.updateByElapsed(elapsed);

            if (isFinish) {
                if (!this.onFinish(time)) {
                    this.isPlaying = false;
                    this.emit(Events.Complete, this.getCurrentPropsForEvent());
                    return false;
                }
            }

            return true;
        }

        /**
         * Останавливает анимацию
         * @returns {this}
         */
        stop() {
            if (!this.isPlaying) {
                return this;
            }

            this.manager.remove(this);
            this.isPlaying = false;
            this.emit(Events.Stop, this.getCurrentPropsForEvent());

            return this;
        }

        /**
         * Принудительно завершает анимацию и перемещает на последний кейфрейм
         * @returns {this<T extends RG.Animation.KeyframeProperties>}
         */
        forceFinish () {
            if (!this.isPlaying) {
                return this;
            }
            this.manager.remove(this);
            this.updateByElapsed(1);
            this.isPlaying = false;
            this.emit(Events.Complete, this.getCurrentPropsForEvent());
            return this;
        }

        /**
         * Принудительно завершает анимацию, при этом доигрывая текущий цикл до конца
         * @returns {this<T extends RG.Animation.KeyframeProperties>}
         */
        forceComplete () {
            this.completeNow = true;
            return this;
        }

    }
}

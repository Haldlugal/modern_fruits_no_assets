/// <reference path="./../Animation/AnimationUnion.ts" />

namespace RG.Abstract {
    import GeneralEvent = RG.Animation.GeneralEvent;
    import GeneralEventListener = RG.Animation.GeneralEventListener;
    import Events = RG.Animation.Events;

    type ContainerType = PIXI.Container;
    type AnimationType = Animation.Interface;

    export abstract class Effect implements Animation.Interface {
        // контейнер, над которым производим эффект
        public container?: ContainerType;
        // анимация, которой выполняем эффект
        public animation?: AnimationType;

        protected isAutoHide: boolean = true;
        protected isDestroyed: boolean = false;

        /**
         * Биндит автохайд на анимацию
         * @returns {this}
         */
        protected bindAutoHide() {
            if (!this.animation) {
                return this;
            }
            if (this.isAutoHide) {
                this.hide();
            }
            this.animation
                .on(Events.Start, () => {
                    if (this.isAutoHide) {
                        this.show();
                    }
                })
                .on(Events.Stop, () => {
                    if (this.isAutoHide) {
                        this.hide();
                    }
                })
                .on(Events.Complete, () => {
                    if (this.isAutoHide) {
                        this.hide();
                    }
                });
            return this;
        }

        /**
         * Включает автоматическое скрытие
         * @param {boolean} value
         * @returns {this}
         */
        autoHide(value: boolean) {
            this.isAutoHide = value;
            return this;
        }

        /**
         * Возвращает играется ли сейчас анимация
         * @returns {boolean}
         */
        get inProgress () {
            return this.animation ? this.animation.inProgress : false;
        }

        /**
         * Навешивает слушателя на эффект
         * @param {RG.Animation.GeneralEvent} event
         * @param {RG.Animation.GeneralEventListener} fn
         * @param context
         * @returns {this}
         */
        on(event: GeneralEvent, fn: GeneralEventListener, context?: any) {
            if (this.animation) {
                this.animation.on(event, fn, context);
            }
            return this;
        }

        /**
         * Снимает слушателя с эффекта
         * @param {RG.Animation.GeneralEvent} event
         * @param {RG.Animation.GeneralEventListener} fn
         * @param context
         * @returns {this}
         */
        off(event: GeneralEvent, fn?: GeneralEventListener, context?: any) {
            if (this.animation) {
                this.animation.off(event, fn, context);
            }
            return this;
        }

        /**
         * Изменяет задержку перед началом эффекта
         * @param {number} delay
         * @returns {this}
         */
        delay(delay: number) {
            if (this.animation) {
                this.animation.delay(delay);
            }
            return this;
        }

        /**
         * Возвращает задержку перед началом эффекта
         * @returns {number}
         */
        getDelay() {
            if (this.animation) {
                return this.animation.getDelay();
            }
            return -1;
        }

        /**
         * Изменяет задержку по окончанию(перед началом новой итерации) эффекта
         * @param {number} endDelay
         * @returns {this}
         */
        endDelay(endDelay: number) {
            if (this.animation) {
                this.animation.endDelay(endDelay);
            }
            return this;
        }

        /**
         * Возвращает задержку по окончанию(перед началом новой итерации) эффекта
         * @returns {number}
         */
        getEndDelay() {
            if (this.animation) {
                return this.animation.getEndDelay();
            }
            return -1;
        }

        /**
         * Изменяет кол-во циклов эффекта
         * @param {number} iterations
         * @returns {this}
         */
        iterations(iterations: number) {
            if (this.animation) {
                this.animation.iterations(iterations);
            }
            return this;
        }

        /**
         * Возвращает кол-во циклов эффекта
         * @returns {number}
         */
        getIterations() {
            if (this.animation) {
                return this.animation.getIterations();
            }
            return -1;
        }

        /**
         * Изменяет длительность эффекта
         * @param {number} duration
         * @returns {this}
         */
        duration(duration: number) {
            if (this.animation) {
                this.animation.duration(duration);
            }
            return this;
        }

        /**
         * Возвращает длительность эффекта
         * @returns {number}
         */
        getDuration() {
            if (this.animation) {
                return this.animation.getDuration();
            }
            return -1;
        }

        /**
         * Показывает контейнер эффект
         * @returns {this}
         */
        show() {
            if (this.container) {
                this.container.visible = true;
            }
            return this;
        }

        /**
         * Скрывает контейнер эффекта
         * @returns {this}
         */
        hide() {
            if (this.container) {
                this.container.visible = false;
            }
            return this;
        }

        /**
         * Возвращает последнее время проигрывания анимации
         * @returns {number}
         */
        getLastTime(): number {
            if (!this.animation || this.isDestroyed) {
                return NaN;
            }
            return this.animation.getLastTime();
        }

        /**
         * Заставляет анимацию обновиться сразу после начала проигрывания
         * @returns {this}
         */
        instantUpdate() {
            if (!this.animation || this.isDestroyed) {
                return this;
            }
            this.animation.instantUpdate();
            return this;
        }

        /**
         * Проигрывает эффект
         * @param {number} time
         * @returns {Promise<boolean>}
         */
        async play(time?: number): Promise<boolean> {
            if (!this.animation || this.isDestroyed) {
                return false;
            }
            return this.animation.play(time);
        }

        /**
         * Останавливает эффект
         * @returns {this}
         */
        stop() {
            if (this.animation) {
                this.animation.stop();
            }
            return this;
        }

        /**
         * Принудительно останавливает эффект в конечной точке анимации
         * @returns {this}
         */
        forceFinish() {
            if (this.animation) {
                this.animation.forceFinish();
            }
            return this;
        }

        /**
         * Проигрывает эффект и уничтожает его по завершению
         * @param {number} time
         * @returns {Promise<boolean>}
         */
        async playAndDestroy(time?: number): Promise<boolean> {
            if (this.isDestroyed) {
                return false;
            }
            const result = await this.play(time);
            this.destroy();
            return result;
        }

        /**
         * Уничтожает эффект
         * @returns {boolean}
         */
        destroy(): boolean {
            if (this.isDestroyed) {
                return false;
            }
            if (this.container) {
                this.container.destroy();
            }
            if (this.animation) {
                this.animation.destroy();
            }
            this.isDestroyed = true;
            return true;
        }

        /**
         * Возвращает, уничтожен ли эффект
         * @returns {boolean}
         */
        getIsDestroyed(): boolean {
            return this.isDestroyed;
        }
    }
}

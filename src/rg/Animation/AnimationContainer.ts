/// <reference path="./Animation.ts" />

namespace RG.Animation {
    export type Align = 'left' | 'center' | 'right' | 'none';
    export type VerticalAlign = 'top' | 'center' | 'bottom' | 'none';

    export type ScaleProperties = 'scaleX' | 'scaleY' | 'scale';
    export type PositionalProperties = 'posX' | 'posY' | 'pos';
    export type ContainerProperties = ScaleProperties | PositionalProperties | 'angle' | 'alpha';
    export type AllContainerProperties = 'scale' | 'pos' | 'angle' | 'alpha';

    export interface ContainerConfig {
        scaleVAlign: VerticalAlign;
        scaleAlign: Align;
    }

    interface ScaleDiff {
        x: number;
        y: number;
    }

    export type Props<K extends ContainerProperties> = Pick<KeyframeProperties, K>;

    export class Container<K extends ContainerProperties=AllContainerProperties> extends Animation<Props<K>> {
        protected readonly containerConfig: ContainerConfig = {
            scaleVAlign: 'top',
            scaleAlign: 'left'
        };

        private prevScaleDiff: Partial<ScaleDiff> = {};

        constructor(protected container: PIXI.Container, containerConfig?: Partial<ContainerConfig>, config?: Partial<Config>, manager?: Manager) {
            super(config, undefined, manager);
            this.setupAnimation();
            if (containerConfig) {
                this.setContainerConfig(containerConfig);
            }
        }

        /**
         * Меняет настройки анимации контейнера
         * @param {Partial<RG.Animation.ContainerConfig>} config
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        setContainerConfig(config: Partial<ContainerConfig>) {
            Object.assign(this.containerConfig, config);
            return this;
        }

        /**
         * Меняет контейнер, к которому привязана анимация
         * @param {PIXI.Container} container
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        setContainer(container: PIXI.Container) {
            this.container = container;
            return this;
        }

        getContainer (): PIXI.Container {
            return this.container
        }

        /**
         * Меняет привязку скейлинга к линии по вертикали (верх, середина, низ)
         * @param {Base.Type.VerticalAlign} valign
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        scaleVAlign(valign: VerticalAlign) {
            this.containerConfig.scaleVAlign = valign;
            return this
        }

        /**
         * Меняет привязку скейлинга к линии по горизонтали (лево, середина, право)
         * @param {Base.Type.Align} align
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        scaleAlign(align: Align) {
            this.containerConfig.scaleAlign = align;
            return this
        }

        /**
         * Передвижение контейнера по оси X
         * @param {number} value
         * @param {boolean} isAdd добавить значение к текущей позиции?
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        moveContainerX(value: number, isAdd: boolean = false) {
            if (isAdd) {
                value += this.container.position.x;
            }
            this.container.position.x = value;
            return this;
        }

        /**
         * Скейлинг контейнера по оси X
         * @param {number} value
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        scaleContainerX(value: number) {
            this.container.scale.x = value;
            const diff = this.getScalePositionDiff('x');
            if (diff !== 0) {
                this.moveContainerX(diff, true);
            }
            return this;
        }

        /**
         * Передвижение контейнера по оси Y
         * @param {number} value
         * @param {boolean} isAdd добавить значение к текущей позиции?
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        moveContainerY(value: number, isAdd: boolean = false) {
            if (isAdd) {
                value += this.container.position.y;
            }
            this.container.position.y = value;
            return this;
        }

        /**
         * Скейлинг контейнера по оси Y
         * @param {number} value
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        scaleContainerY(value: number) {
            this.container.scale.y = value;
            const diff = this.getScalePositionDiff('y');
            if (diff !== 0) {
                this.moveContainerY(diff, true);
            }
            return this;
        }

        /**
         * Изменение угла контейнера
         * @param {number} value
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        angleContainer(value: number) {
            this.container.angle = value;
            return this;
        }

        /**
         * Изменение прозрачности контейнера
         * @param {number} value
         * @returns {this<K extends RG.Animation.ContainerProperties>}
         */
        alphaContainer(value: number) {
            this.container.alpha = value;
            return this;
        }

        /**
         * Возвращает разницу в изменённой позиции контейнера при скейлинге
         * @param {keyof RG.Animation.ScaleDiff} coord координата x или y
         * @returns {number}
         */
        protected getScalePositionDiff(coord: keyof ScaleDiff): number {
            let result = 0;
            const prevDiff = this.prevScaleDiff;
            if (prevDiff.hasOwnProperty(coord)) {
                const f = coord === 'x' ? this.scaleDiffX : this.scaleDiffY;
                const newDiff = f.call(this);
                result = prevDiff[coord]! - newDiff;
                prevDiff[coord] = newDiff;
            }
            return result;
        }

        /**
         * Бинд ивентов для анимации
         */
        private setupAnimation(): void {
            this.on(Events.Start, this.startAnimation);
            this.on(Events.Update, this.updateContainer);
        }

        /**
         * Разница позиции для скейлинга с привязкой по оси X (или -1, если не надо менять позицию)
         * @returns {number}
         */
        private scaleDiffX(): number {
            switch (this.containerConfig.scaleAlign) {
                case 'center':
                    return this.container.width / 2;
                case 'right':
                    return this.container.width
            }
            return -1
        }

        /**
         * Разница позиции для скейлинга с привязкой по оси Y (или -1, если не надо менять позицию)
         * @returns {number}
         */
        private scaleDiffY(): number {
            switch (this.containerConfig.scaleVAlign) {
                case 'center':
                    return this.container.height / 2;
                case 'bottom':
                    return this.container.height
            }
            return -1
        }

        /**
         * Коллбэк на начало анимации
         * @param {RG.Animation.Props<K extends RG.Animation.ContainerProperties>} props
         */
        private startAnimation(props: Props<K>): void {
            const diffX = this.scaleDiffX();
            const diffY = this.scaleDiffY();
            this.prevScaleDiff = {};
            if (diffX >= 0) {
                this.prevScaleDiff.x = diffX
            }
            if (diffY >= 0) {
                this.prevScaleDiff.y = diffY
            }
        }

        /**
         * Обновление параметров контейнера
         * @param {RG.Animation.Props<K extends RG.Animation.ContainerProperties>} props
         */
        private updateContainer(props: Props<K>): void {
            for (let prop in props) {
                const value: number = props[prop];
                switch (prop) {
                    case 'scaleX':
                        this.scaleContainerX(value);
                        break;
                    case 'scaleY':
                        this.scaleContainerY(value);
                        break;
                    case 'scale':
                        this.scaleContainerX(value);
                        this.scaleContainerY(value);
                        break;
                    case 'posX':
                        this.moveContainerX(value);
                        break;
                    case 'posY':
                        this.moveContainerY(value);
                        break;
                    case 'pos':
                        this.moveContainerX(value);
                        this.moveContainerY(value);
                        break;
                    case 'angle':
                        this.angleContainer(value);
                        break;
                    case 'alpha':
                        this.alphaContainer(value);
                        break;
                }
            }
        }
    }
}

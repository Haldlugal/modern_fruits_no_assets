/// <reference path="./Animation.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RG;
(function (RG) {
    var Animation;
    (function (Animation) {
        var Container = /** @class */ (function (_super) {
            __extends(Container, _super);
            function Container(container, containerConfig, config, manager) {
                var _this = _super.call(this, config, undefined, manager) || this;
                _this.container = container;
                _this.containerConfig = {
                    scaleVAlign: 'top',
                    scaleAlign: 'left'
                };
                _this.prevScaleDiff = {};
                _this.setupAnimation();
                if (containerConfig) {
                    _this.setContainerConfig(containerConfig);
                }
                return _this;
            }
            /**
             * Меняет настройки анимации контейнера
             * @param {Partial<RG.Animation.ContainerConfig>} config
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.setContainerConfig = function (config) {
                Object.assign(this.containerConfig, config);
                return this;
            };
            /**
             * Меняет контейнер, к которому привязана анимация
             * @param {PIXI.Container} container
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.setContainer = function (container) {
                this.container = container;
                return this;
            };
            Container.prototype.getContainer = function () {
                return this.container;
            };
            /**
             * Меняет привязку скейлинга к линии по вертикали (верх, середина, низ)
             * @param {Base.Type.VerticalAlign} valign
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.scaleVAlign = function (valign) {
                this.containerConfig.scaleVAlign = valign;
                return this;
            };
            /**
             * Меняет привязку скейлинга к линии по горизонтали (лево, середина, право)
             * @param {Base.Type.Align} align
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.scaleAlign = function (align) {
                this.containerConfig.scaleAlign = align;
                return this;
            };
            /**
             * Передвижение контейнера по оси X
             * @param {number} value
             * @param {boolean} isAdd добавить значение к текущей позиции?
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.moveContainerX = function (value, isAdd) {
                if (isAdd === void 0) { isAdd = false; }
                if (isAdd) {
                    value += this.container.position.x;
                }
                this.container.position.x = value;
                return this;
            };
            /**
             * Скейлинг контейнера по оси X
             * @param {number} value
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.scaleContainerX = function (value) {
                this.container.scale.x = value;
                var diff = this.getScalePositionDiff('x');
                if (diff !== 0) {
                    this.moveContainerX(diff, true);
                }
                return this;
            };
            /**
             * Передвижение контейнера по оси Y
             * @param {number} value
             * @param {boolean} isAdd добавить значение к текущей позиции?
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.moveContainerY = function (value, isAdd) {
                if (isAdd === void 0) { isAdd = false; }
                if (isAdd) {
                    value += this.container.position.y;
                }
                this.container.position.y = value;
                return this;
            };
            /**
             * Скейлинг контейнера по оси Y
             * @param {number} value
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.scaleContainerY = function (value) {
                this.container.scale.y = value;
                var diff = this.getScalePositionDiff('y');
                if (diff !== 0) {
                    this.moveContainerY(diff, true);
                }
                return this;
            };
            /**
             * Изменение угла контейнера
             * @param {number} value
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.angleContainer = function (value) {
                this.container.angle = value;
                return this;
            };
            /**
             * Изменение прозрачности контейнера
             * @param {number} value
             * @returns {this<K extends RG.Animation.ContainerProperties>}
             */
            Container.prototype.alphaContainer = function (value) {
                this.container.alpha = value;
                return this;
            };
            /**
             * Возвращает разницу в изменённой позиции контейнера при скейлинге
             * @param {keyof RG.Animation.ScaleDiff} coord координата x или y
             * @returns {number}
             */
            Container.prototype.getScalePositionDiff = function (coord) {
                var result = 0;
                var prevDiff = this.prevScaleDiff;
                if (prevDiff.hasOwnProperty(coord)) {
                    var f = coord === 'x' ? this.scaleDiffX : this.scaleDiffY;
                    var newDiff = f.call(this);
                    result = prevDiff[coord] - newDiff;
                    prevDiff[coord] = newDiff;
                }
                return result;
            };
            /**
             * Бинд ивентов для анимации
             */
            Container.prototype.setupAnimation = function () {
                this.on(Animation.Events.Start, this.startAnimation);
                this.on(Animation.Events.Update, this.updateContainer);
            };
            /**
             * Разница позиции для скейлинга с привязкой по оси X (или -1, если не надо менять позицию)
             * @returns {number}
             */
            Container.prototype.scaleDiffX = function () {
                switch (this.containerConfig.scaleAlign) {
                    case 'center':
                        return this.container.width / 2;
                    case 'right':
                        return this.container.width;
                }
                return -1;
            };
            /**
             * Разница позиции для скейлинга с привязкой по оси Y (или -1, если не надо менять позицию)
             * @returns {number}
             */
            Container.prototype.scaleDiffY = function () {
                switch (this.containerConfig.scaleVAlign) {
                    case 'center':
                        return this.container.height / 2;
                    case 'bottom':
                        return this.container.height;
                }
                return -1;
            };
            /**
             * Коллбэк на начало анимации
             * @param {RG.Animation.Props<K extends RG.Animation.ContainerProperties>} props
             */
            Container.prototype.startAnimation = function (props) {
                var diffX = this.scaleDiffX();
                var diffY = this.scaleDiffY();
                this.prevScaleDiff = {};
                if (diffX >= 0) {
                    this.prevScaleDiff.x = diffX;
                }
                if (diffY >= 0) {
                    this.prevScaleDiff.y = diffY;
                }
            };
            /**
             * Обновление параметров контейнера
             * @param {RG.Animation.Props<K extends RG.Animation.ContainerProperties>} props
             */
            Container.prototype.updateContainer = function (props) {
                for (var prop in props) {
                    var value = props[prop];
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
            };
            return Container;
        }(Animation.Animation));
        Animation.Container = Container;
    })(Animation = RG.Animation || (RG.Animation = {}));
})(RG || (RG = {}));

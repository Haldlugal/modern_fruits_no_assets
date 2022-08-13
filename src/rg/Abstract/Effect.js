/// <reference path="./../Animation/AnimationUnion.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var RG;
(function (RG) {
    var Abstract;
    (function (Abstract) {
        var Events = RG.Animation.Events;
        var Effect = /** @class */ (function () {
            function Effect() {
                this.isAutoHide = true;
                this.isDestroyed = false;
            }
            /**
             * Биндит автохайд на анимацию
             * @returns {this}
             */
            Effect.prototype.bindAutoHide = function () {
                var _this = this;
                if (!this.animation) {
                    return this;
                }
                if (this.isAutoHide) {
                    this.hide();
                }
                this.animation
                    .on(Events.Start, function () {
                    if (_this.isAutoHide) {
                        _this.show();
                    }
                })
                    .on(Events.Stop, function () {
                    if (_this.isAutoHide) {
                        _this.hide();
                    }
                })
                    .on(Events.Complete, function () {
                    if (_this.isAutoHide) {
                        _this.hide();
                    }
                });
                return this;
            };
            /**
             * Включает автоматическое скрытие
             * @param {boolean} value
             * @returns {this}
             */
            Effect.prototype.autoHide = function (value) {
                this.isAutoHide = value;
                return this;
            };
            Object.defineProperty(Effect.prototype, "inProgress", {
                /**
                 * Возвращает играется ли сейчас анимация
                 * @returns {boolean}
                 */
                get: function () {
                    return this.animation ? this.animation.inProgress : false;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Навешивает слушателя на эффект
             * @param {RG.Animation.GeneralEvent} event
             * @param {RG.Animation.GeneralEventListener} fn
             * @param context
             * @returns {this}
             */
            Effect.prototype.on = function (event, fn, context) {
                if (this.animation) {
                    this.animation.on(event, fn, context);
                }
                return this;
            };
            /**
             * Снимает слушателя с эффекта
             * @param {RG.Animation.GeneralEvent} event
             * @param {RG.Animation.GeneralEventListener} fn
             * @param context
             * @returns {this}
             */
            Effect.prototype.off = function (event, fn, context) {
                if (this.animation) {
                    this.animation.off(event, fn, context);
                }
                return this;
            };
            /**
             * Изменяет задержку перед началом эффекта
             * @param {number} delay
             * @returns {this}
             */
            Effect.prototype.delay = function (delay) {
                if (this.animation) {
                    this.animation.delay(delay);
                }
                return this;
            };
            /**
             * Возвращает задержку перед началом эффекта
             * @returns {number}
             */
            Effect.prototype.getDelay = function () {
                if (this.animation) {
                    return this.animation.getDelay();
                }
                return -1;
            };
            /**
             * Изменяет задержку по окончанию(перед началом новой итерации) эффекта
             * @param {number} endDelay
             * @returns {this}
             */
            Effect.prototype.endDelay = function (endDelay) {
                if (this.animation) {
                    this.animation.endDelay(endDelay);
                }
                return this;
            };
            /**
             * Возвращает задержку по окончанию(перед началом новой итерации) эффекта
             * @returns {number}
             */
            Effect.prototype.getEndDelay = function () {
                if (this.animation) {
                    return this.animation.getEndDelay();
                }
                return -1;
            };
            /**
             * Изменяет кол-во циклов эффекта
             * @param {number} iterations
             * @returns {this}
             */
            Effect.prototype.iterations = function (iterations) {
                if (this.animation) {
                    this.animation.iterations(iterations);
                }
                return this;
            };
            /**
             * Возвращает кол-во циклов эффекта
             * @returns {number}
             */
            Effect.prototype.getIterations = function () {
                if (this.animation) {
                    return this.animation.getIterations();
                }
                return -1;
            };
            /**
             * Изменяет длительность эффекта
             * @param {number} duration
             * @returns {this}
             */
            Effect.prototype.duration = function (duration) {
                if (this.animation) {
                    this.animation.duration(duration);
                }
                return this;
            };
            /**
             * Возвращает длительность эффекта
             * @returns {number}
             */
            Effect.prototype.getDuration = function () {
                if (this.animation) {
                    return this.animation.getDuration();
                }
                return -1;
            };
            /**
             * Показывает контейнер эффект
             * @returns {this}
             */
            Effect.prototype.show = function () {
                if (this.container) {
                    this.container.visible = true;
                }
                return this;
            };
            /**
             * Скрывает контейнер эффекта
             * @returns {this}
             */
            Effect.prototype.hide = function () {
                if (this.container) {
                    this.container.visible = false;
                }
                return this;
            };
            /**
             * Возвращает последнее время проигрывания анимации
             * @returns {number}
             */
            Effect.prototype.getLastTime = function () {
                if (!this.animation || this.isDestroyed) {
                    return NaN;
                }
                return this.animation.getLastTime();
            };
            /**
             * Заставляет анимацию обновиться сразу после начала проигрывания
             * @returns {this}
             */
            Effect.prototype.instantUpdate = function () {
                if (!this.animation || this.isDestroyed) {
                    return this;
                }
                this.animation.instantUpdate();
                return this;
            };
            /**
             * Проигрывает эффект
             * @param {number} time
             * @returns {Promise<boolean>}
             */
            Effect.prototype.play = function (time) {
                return __awaiter(this, void 0, Promise, function () {
                    return __generator(this, function (_a) {
                        if (!this.animation || this.isDestroyed) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, this.animation.play(time)];
                    });
                });
            };
            /**
             * Останавливает эффект
             * @returns {this}
             */
            Effect.prototype.stop = function () {
                if (this.animation) {
                    this.animation.stop();
                }
                return this;
            };
            /**
             * Принудительно останавливает эффект в конечной точке анимации
             * @returns {this}
             */
            Effect.prototype.forceFinish = function () {
                if (this.animation) {
                    this.animation.forceFinish();
                }
                return this;
            };
            /**
             * Проигрывает эффект и уничтожает его по завершению
             * @param {number} time
             * @returns {Promise<boolean>}
             */
            Effect.prototype.playAndDestroy = function (time) {
                return __awaiter(this, void 0, Promise, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this.isDestroyed) {
                                    return [2 /*return*/, false];
                                }
                                return [4 /*yield*/, this.play(time)];
                            case 1:
                                result = _a.sent();
                                this.destroy();
                                return [2 /*return*/, result];
                        }
                    });
                });
            };
            /**
             * Уничтожает эффект
             * @returns {boolean}
             */
            Effect.prototype.destroy = function () {
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
            };
            /**
             * Возвращает, уничтожен ли эффект
             * @returns {boolean}
             */
            Effect.prototype.getIsDestroyed = function () {
                return this.isDestroyed;
            };
            return Effect;
        }());
        Abstract.Effect = Effect;
    })(Abstract = RG.Abstract || (RG.Abstract = {}));
})(RG || (RG = {}));

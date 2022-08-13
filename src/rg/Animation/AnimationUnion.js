/// <reference path="./AnimationContainer.ts" />
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var RG;
(function (RG) {
    var Animation;
    (function (Animation) {
        var UnionType;
        (function (UnionType) {
            // Каждая анимация следует за другой в порядке, указанном в менеджере
            UnionType["Continuous"] = "continuous";
            // Все анимации запускаются одновременно и дожидаются завершения самой долгой перед новым циклом
            UnionType["Simultaneous"] = "simultaneous";
            // Все анимации запускаются одновременно и не дожидаются завершения цикла самой долгой, а работают с бесконечной итерацией, пока цикл самой долгой не закончится
            UnionType["SimultaneousDeferred"] = "simultaneous-deferred";
            // Для одновременных анимаций основная анимация не должна иметь циклы в своих настройках!
        })(UnionType = Animation.UnionType || (Animation.UnionType = {}));
        var UnionManager = /** @class */ (function (_super) {
            __extends(UnionManager, _super);
            function UnionManager() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UnionManager.prototype.createItem = function (animation) {
                return animation;
            };
            return UnionManager;
        }(Animation.Utils.ArrayManager));
        var Union = /** @class */ (function (_super) {
            __extends(Union, _super);
            function Union(animations, config) {
                var _this = _super.call(this) || this;
                _this.config = {
                    type: UnionType.Continuous,
                    duration: 0,
                    delay: 0,
                    endDelay: 0,
                    iterations: 0
                };
                _this.isPlaying = false;
                _this.skippedAnimations = [];
                if (!animations) {
                    animations = [];
                }
                _this.animations = new (UnionManager.bind.apply(UnionManager, __spreadArrays([void 0], animations)))();
                if (config) {
                    _this.setConfig(config);
                }
                return _this;
            }
            Object.defineProperty(Union.prototype, "inProgress", {
                /**
                 * Возвращает играется ли сейчас анимация
                 * @returns {boolean}
                 */
                get: function () {
                    return this.isPlaying;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Меняет часть конфига, в соответствии с исходным параметром
             * @param {Partial<RG.Animation.UnionConfig>} config
             * @returns {this}
             */
            Union.prototype.setConfig = function (config) {
                Object.assign(this.config, config);
                return this;
            };
            /**
             * Установка основной анимации для одновременного запуска нескольких (иначе будет выбрана самая длинная, на которой нет итераций)
             * @param {RG.Animation.Interface} animation
             * @returns {this}
             */
            Union.prototype.setMainAnimation = function (animation) {
                if (this.animations.indexOf(animation) === -1) {
                    throw new Animation.Exception('Данная анимация не входит в юнион');
                }
                this.mainAnimation = animation;
                return this;
            };
            /**
             * Меняет тип юниона
             * @param {RG.Animation.UnionType} type
             * @returns {this}
             */
            Union.prototype.type = function (type) {
                this.config.type = type;
                return this;
            };
            /**
             * Возвращает тип юниона
             * @returns {RG.Animation.UnionType}
             */
            Union.prototype.getType = function () {
                return this.config.type;
            };
            /**
             * Меняет длительность анимации
             * @param {number} duration
             * @returns {this}
             */
            Union.prototype.duration = function (duration) {
                this.config.duration = duration;
                return this;
            };
            /**
             * Возвращает текущее значение длины анимации
             * @returns {number}
             */
            Union.prototype.getDuration = function () {
                return this.config.duration;
            };
            /**
             * Меняет задержку перед началом циклов анимаций
             * @param {number} delay
             * @returns {this}
             */
            Union.prototype.delay = function (delay) {
                this.config.delay = delay;
                return this;
            };
            /**
             * Возвращает текущее значение задержки перед началом циклов
             * @returns {number}
             */
            Union.prototype.getDelay = function () {
                return this.config.delay;
            };
            /**
             * Меняет задержку по завершению цикла анимаций
             * @param {number} endDelay
             * @returns {this}
             */
            Union.prototype.endDelay = function (endDelay) {
                this.config.endDelay = endDelay;
                return this;
            };
            /**
             * Возвращает текущее значение задержки по завершению цикла
             * @returns {number}
             */
            Union.prototype.getEndDelay = function () {
                return this.config.endDelay;
            };
            /**
             * Меняет значение кол-ва циклов анимаций (или Infinity)
             * @param {number} iterations
             * @returns {this}
             */
            Union.prototype.iterations = function (iterations) {
                this.config.iterations = iterations;
                return this;
            };
            /**
             * Возвращает текущее значение кол-ва циклов
             * @returns {number}
             */
            Union.prototype.getIterations = function () {
                return this.config.iterations;
            };
            /**
             * Пропускает конкретную анимацию в Continuous юнионе
             * @param {RG.Animation.Interface} animation
             * @returns {this}
             */
            Union.prototype.skipAnimation = function (animation) {
                if (this.skippedAnimations.indexOf(animation) === -1) {
                    this.skippedAnimations.push(animation);
                }
                return this;
            };
            /**
             * Пропускает конкретную анимацию в Continuous юнионе
             * @param {RG.Animation.Interface} animation
             * @returns {this}
             */
            Union.prototype.removeSkippedAnimation = function (animation) {
                var index = this.skippedAnimations.indexOf(animation);
                if (index !== -1) {
                    this.skippedAnimations.splice(index, 1);
                }
                return this;
            };
            /**
             * Получает текущие настройки конкретной анимации
             * @param {RG.Animation.Interface} animation
             * @returns {RG.Animation.GeneralConfig}
             */
            Union.prototype.getAnimationConfig = function (animation) {
                return {
                    duration: animation.getDuration(),
                    iterations: animation.getIterations(),
                    delay: animation.getDelay(),
                    endDelay: animation.getEndDelay()
                };
            };
            /**
             * Восстанавливает конфигурацию анимации
             * @param {RG.Animation.Interface} animation
             * @param {RG.Animation.GeneralConfig} config
             * @returns {this}
             */
            Union.prototype.restoreAnimationConfig = function (animation, config) {
                for (var key in config) {
                    var value = config[key];
                    var func = animation[key];
                    func.call(animation, value);
                }
                return this;
            };
            /**
             * Возвращает длину анимации в мс.
             * @param {RG.Animation.Interface} animation
             * @returns {number}
             */
            Union.prototype.getAnimationLength = function (animation) {
                var delay = animation.getDelay();
                var endDelay = animation.getEndDelay();
                var duration = animation.getDuration();
                var iterations = animation.getIterations();
                var iterationDuration = duration + endDelay;
                return delay + duration + iterationDuration * iterations;
            };
            /**
             * Переадресовывает ивент из анимации и возвращает слушатель
             * @param {RG.Animation.Interface} animation
             * @param {RG.Animation.Events} event
             * @param args
             * @returns {RG.Animation.GeneralEventListener}
             */
            Union.prototype.passthroughEvent = function (animation, event) {
                var _this = this;
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                var listener = function () {
                    _this.emit.apply(_this, __spreadArrays([event], args));
                };
                animation.on(event, listener);
                return listener;
            };
            /**
             * Переадресовывает ивенты из анимации и возвращает массив слушателей
             * @param {RG.Animation.Interface} animation
             * @param {RG.Animation.Events[]} events
             * @param args
             * @returns {RG.Animation.GeneralEventListener[]}
             */
            Union.prototype.passthroughEvents = function (animation, events) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                var listeners = [];
                for (var _a = 0, events_1 = events; _a < events_1.length; _a++) {
                    var event = events_1[_a];
                    listeners.push(this.passthroughEvent.apply(this, __spreadArrays([animation, event], args)));
                }
                return listeners;
            };
            /**
             * Удалит все слушатели со всех ивентов из аргументов
             * @param {RG.Animation.Interface} animation
             * @param {RG.Animation.Events[]} events
             * @param {RG.Animation.GeneralEventListener[]} listeners
             * @returns {this}
             */
            Union.prototype.removePassthroughEvents = function (animation, events, listeners) {
                for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
                    var event = events_2[_i];
                    for (var _a = 0, listeners_1 = listeners; _a < listeners_1.length; _a++) {
                        var listener = listeners_1[_a];
                        animation.off(event, listener);
                    }
                }
                return this;
            };
            Union.prototype.getAnimationTotalLength = function () {
                var _this = this;
                return this.animations.reduce(function (accumulator, current) { return accumulator + _this.getAnimationLength(current); }, 0);
            };
            /**
             * Запускает цикл анимаций последовательно
             * @param {number} time
             * @param {number} currentIteration
             * @returns {Promise<boolean>}
             */
            Union.prototype.playContinuously = function (time, currentIteration) {
                if (currentIteration === void 0) { currentIteration = 0; }
                return __awaiter(this, void 0, Promise, function () {
                    var totalLength, multi, isFirst, step, _i, _a, animation, config, delay, events, listeners, result, iterations;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!this.animations.length) {
                                    return [2 /*return*/, false];
                                }
                                if (currentIteration === 0) {
                                    if (this.isPlaying) {
                                        console.error('already playing', __spreadArrays(this.animations));
                                        this.stop();
                                    }
                                }
                                totalLength = this.getAnimationTotalLength();
                                multi = this.config.duration > 0 && Number.isFinite(totalLength) ? (this.config.duration / totalLength) : 1;
                                this.isPlaying = true;
                                isFirst = true;
                                step = 0;
                                _i = 0, _a = this.animations;
                                _b.label = 1;
                            case 1:
                                if (!(_i < _a.length)) return [3 /*break*/, 4];
                                animation = _a[_i];
                                // Остановили на полпути
                                if (!this.isPlaying) {
                                    return [2 /*return*/, false];
                                }
                                if (this.skippedAnimations.indexOf(animation) !== -1) {
                                    return [3 /*break*/, 3];
                                }
                                config = this.getAnimationConfig(animation);
                                delay = config.delay * multi;
                                events = [];
                                listeners = [];
                                if (isFirst) {
                                    if (currentIteration === 0) {
                                        // Для первой итерации добавляем делей начала
                                        if (this.config.delay) {
                                            delay += this.config.delay;
                                        }
                                        // Начало берём из основной анимации
                                        events = [Animation.Events.Start];
                                        listeners.push.apply(listeners, this.passthroughEvents(animation, events));
                                    }
                                    else {
                                        // Для последующих - делей конца
                                        if (this.config.endDelay) {
                                            delay += this.config.endDelay;
                                        }
                                        this.emit(Animation.Events.Repeat);
                                    }
                                    isFirst = false;
                                }
                                this.emit(Animation.Events.Step, step++);
                                // Настраиваем текущую анимацию
                                animation
                                    .delay(delay)
                                    .endDelay(config.endDelay * multi)
                                    .duration(config.duration * multi);
                                if (!isFirst || currentIteration > 0) {
                                    animation.instantUpdate();
                                }
                                this.currentAnimation = animation;
                                return [4 /*yield*/, animation.play(time)];
                            case 2:
                                result = _b.sent();
                                this.currentAnimation = undefined;
                                time = animation.getLastTime();
                                // Остановили данную анимацию
                                if (!result) {
                                    return [2 /*return*/, false];
                                }
                                // Удаляем из анимации, что натворили
                                this.restoreAnimationConfig(animation, config);
                                if (events.length && listeners.length) {
                                    this.removePassthroughEvents(animation, events, listeners);
                                }
                                _b.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4:
                                iterations = this.config.iterations;
                                if (iterations > 0) {
                                    if (!isFinite(iterations) || currentIteration < iterations) {
                                        return [2 /*return*/, this.playContinuously(time, ++currentIteration)];
                                    }
                                }
                                this.isPlaying = false;
                                this.emit(Animation.Events.Complete);
                                return [2 /*return*/, true];
                        }
                    });
                });
            };
            /**
             * Запускает цикл анимаций параллельно
             * @param {number} time
             * @returns {Promise<boolean>}
             */
            Union.prototype.playSimultaneously = function (time) {
                return __awaiter(this, void 0, Promise, function () {
                    var maxLength, maxAnimation, _i, _a, animation, length, isAllSameAnimations, length, isDeferred, multi, configs, events, listeners, maxPromise, _b, _c, animation, config, endDelay, promise, listener, result, _d, configs_1, value;
                    var _this = this;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (!this.animations.length) {
                                    return [2 /*return*/, false];
                                }
                                if (this.isPlaying) {
                                    console.error('already playing', __spreadArrays(this.animations));
                                    this.stop();
                                }
                                maxLength = 0, maxAnimation = this.animations[0];
                                for (_i = 0, _a = this.animations; _i < _a.length; _i++) {
                                    animation = _a[_i];
                                    length = this.getAnimationLength(animation);
                                    if (length > maxLength) {
                                        maxAnimation = animation;
                                        maxLength = length;
                                    }
                                }
                                if (!Number.isFinite(maxLength) || !maxLength) {
                                    throw new Animation.Exception('Длина внутренних анимаций юниона не может быть бесконечно большой. Для этого можно выставить бесконечную итерацию сверху анимации');
                                }
                                isAllSameAnimations = this.animations.findIndex(function (e) { return (_this.getAnimationLength(e) !== maxLength); }) === -1;
                                if (this.mainAnimation) {
                                    if (this.animations.indexOf(this.mainAnimation) === -1) {
                                        throw new Animation.Exception('Основная анимация не входит в юнион');
                                    }
                                    maxAnimation = this.mainAnimation;
                                    length = this.getAnimationLength(maxAnimation);
                                    if (length < maxLength) {
                                        throw new Animation.Exception('Основная анимация не является самой длинной');
                                    }
                                }
                                if (maxAnimation.getIterations() > 0) {
                                    throw new Animation.Exception('Невозможно запустить одновременную анимацию с основной, которая сама зациклена');
                                }
                                this.isPlaying = true;
                                isDeferred = this.config.type === UnionType.SimultaneousDeferred;
                                multi = this.config.duration > 0 ? (this.config.duration / maxLength) : 1;
                                configs = [];
                                events = [Animation.Events.Start];
                                if (isDeferred || isAllSameAnimations) {
                                    events.push(Animation.Events.Repeat);
                                }
                                listeners = __spreadArrays(this.passthroughEvents(maxAnimation, events));
                                for (_b = 0, _c = this.animations; _b < _c.length; _b++) {
                                    animation = _c[_b];
                                    config = this.getAnimationConfig(animation);
                                    configs.push({ config: config, animation: animation });
                                    endDelay = config.endDelay * multi;
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
                                    promise = animation.play(time);
                                    if (animation === maxAnimation) {
                                        maxPromise = promise;
                                    }
                                }
                                // На каждом шагу заново запускаем все остальные анимации
                                if (!isDeferred && !isAllSameAnimations) {
                                    listener = function () {
                                        var _loop_1 = function (animation) {
                                            if (animation === maxAnimation) {
                                                return "continue";
                                            }
                                            var configObj = configs.find(function (e) { return e.animation === animation; });
                                            if (!configObj) {
                                                return "continue";
                                            }
                                            animation
                                                .delay(_this.config.endDelay + configObj.config.delay * multi)
                                                .forceFinish()
                                                .instantUpdate()
                                                .play(maxAnimation.getLastTime());
                                        };
                                        for (var _i = 0, _a = _this.animations; _i < _a.length; _i++) {
                                            var animation = _a[_i];
                                            _loop_1(animation);
                                        }
                                        _this.emit(Animation.Events.Repeat);
                                    };
                                    listeners.push(listener);
                                    events.push(Animation.Events.Repeat);
                                    maxAnimation.on(Animation.Events.Repeat, listener);
                                }
                                return [4 /*yield*/, maxPromise];
                            case 1:
                                result = _e.sent();
                                if (events.length && listeners.length) {
                                    this.removePassthroughEvents(maxAnimation, events, listeners);
                                }
                                // Останавливаем и восстанавливаем все настройки остальных анимаций
                                for (_d = 0, configs_1 = configs; _d < configs_1.length; _d++) {
                                    value = configs_1[_d];
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
                                    this.emit(Animation.Events.Complete);
                                }
                                return [2 /*return*/, result];
                        }
                    });
                });
            };
            /**
             * Добавил проигрывание единичной анимации
             * @param {number} time
             * @returns {Promise<boolean>}
             */
            Union.prototype.playSingleAnimation = function (time) {
                return __awaiter(this, void 0, Promise, function () {
                    var events, animation, config, listeners, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this.animations.length !== 1) {
                                    return [2 /*return*/, false];
                                }
                                if (this.isPlaying) {
                                    console.error('already playing', __spreadArrays(this.animations));
                                    this.stop();
                                }
                                events = [Animation.Events.Start, Animation.Events.Repeat, Animation.Events.Complete];
                                animation = this.animations[0];
                                config = this.getAnimationConfig(animation);
                                listeners = this.passthroughEvents(animation, events);
                                if (this.config.duration > 0) {
                                    animation.duration(this.config.duration);
                                }
                                this.isPlaying = true;
                                return [4 /*yield*/, animation
                                        .delay(this.config.delay)
                                        .endDelay(this.config.endDelay)
                                        .iterations(this.config.iterations)
                                        .play(time)];
                            case 1:
                                result = _a.sent();
                                this.isPlaying = false;
                                this.removePassthroughEvents(animation, events, listeners);
                                this.restoreAnimationConfig(animation, config);
                                return [2 /*return*/, result];
                        }
                    });
                });
            };
            /**
             * Возвращает последнее время проигрывания анимации
             * @returns {number}
             */
            Union.prototype.getLastTime = function () {
                return Math.max.apply(Math, this.animations.map(function (e) { return e.getLastTime(); }));
            };
            /**
             * Заставляет анимации обновиться сразу после начала проигрывания
             * @returns {this}
             */
            Union.prototype.instantUpdate = function () {
                for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    animation.instantUpdate();
                }
                return this;
            };
            /**
             * Проигрывает анимации в юнионе
             * @param {number} time
             * @returns {Promise<boolean>}
             */
            Union.prototype.play = function (time) {
                return __awaiter(this, void 0, Promise, function () {
                    return __generator(this, function (_a) {
                        this.emit(Animation.Events.BeforeStart);
                        if (this.animations.length === 1) {
                            return [2 /*return*/, this.playSingleAnimation(time)];
                        }
                        switch (this.config.type) {
                            case UnionType.Continuous:
                                return [2 /*return*/, this.playContinuously(time)];
                            case UnionType.Simultaneous:
                            case UnionType.SimultaneousDeferred:
                                return [2 /*return*/, this.playSimultaneously(time)];
                        }
                        return [2 /*return*/, false];
                    });
                });
            };
            /**
             * Запускает цикл анимаций и уничтожает их по завершению
             * @param {number} time
             * @returns {Promise<boolean>}
             */
            Union.prototype.playAndDestroy = function (time) {
                return __awaiter(this, void 0, Promise, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.play(time)];
                            case 1:
                                result = _a.sent();
                                this.destroy();
                                return [2 /*return*/, result];
                        }
                    });
                });
            };
            /**
             * Останавливает текущую проигрываемую в бесконечности анимацию в последовательном юнионе
             * Иначе просто вызывает forceFinish
             * @returns {this}
             */
            Union.prototype.forceFinishInfinite = function () {
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
            };
            /**
             * Останавливает текущую проигрываемую в бесконечности анимацию
             * Иначе просто вызывает stop
             * @returns {this}
             */
            Union.prototype.stopInfinite = function () {
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
            };
            /**
             * Останавливает все текущие анимации на конечной точке
             * @returns {this}
             */
            Union.prototype.forceFinish = function () {
                if (!this.isPlaying) {
                    return this;
                }
                for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    animation.forceFinish();
                }
                return this;
            };
            /**
             * Останавливает все текущие анимации
             * @returns {this}
             */
            Union.prototype.stop = function () {
                if (!this.isPlaying) {
                    return this;
                }
                for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    animation.stop();
                }
                this.isPlaying = false;
                this.emit(Animation.Events.Stop);
                return this;
            };
            /**
             * Уничтожает все анимации в объединении
             * @returns {boolean}
             */
            Union.prototype.destroy = function () {
                for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    animation.destroy();
                }
                this.animations.clear();
                return true;
            };
            return Union;
        }(Animation.EventEmitter));
        Animation.Union = Union;
    })(Animation = RG.Animation || (RG.Animation = {}));
})(RG || (RG = {}));

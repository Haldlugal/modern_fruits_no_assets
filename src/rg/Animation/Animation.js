/// <reference path="./AnimationManager.ts" />
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    (function (Animation_1) {
        var Exception = /** @class */ (function (_super) {
            __extends(Exception, _super);
            function Exception() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return Exception;
        }(Error));
        Animation_1.Exception = Exception;
        var Events;
        (function (Events) {
            Events["BeforeStop"] = "before-stop";
            Events["BeforeStart"] = "before-start";
            Events["Start"] = "start";
            Events["Stop"] = "stop";
            Events["Update"] = "update";
            Events["Complete"] = "complete";
            Events["Repeat"] = "repeat";
            Events["Step"] = "step";
        })(Events = Animation_1.Events || (Animation_1.Events = {}));
        var Direction;
        (function (Direction) {
            Direction["Normal"] = "normal";
            Direction["Reverse"] = "reverse";
            Direction["Alternate"] = "alternate";
            Direction["AlternateReverse"] = "alternate-reverse";
        })(Direction = Animation_1.Direction || (Animation_1.Direction = {}));
        var KeyframeManager = /** @class */ (function (_super) {
            __extends(KeyframeManager, _super);
            function KeyframeManager() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            KeyframeManager.prototype.createItem = function (props, config) {
                return {
                    props: Object.seal(Object.freeze(Object.assign({}, props))),
                    config: config
                };
            };
            return KeyframeManager;
        }(Animation_1.Utils.ArrayManager));
        var EventEmitter = /** @class */ (function (_super) {
            __extends(EventEmitter, _super);
            function EventEmitter() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            EventEmitter.prototype.listeners = function (event) {
                return _super.prototype.listeners.call(this, event);
            };
            EventEmitter.prototype.listenerCount = function (event) {
                return _super.prototype.listenerCount.call(this, event);
            };
            EventEmitter.prototype.emit = function (event) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return _super.prototype.emit.apply(this, __spreadArrays([event], args));
            };
            EventEmitter.prototype.on = function (event, fn, context) {
                return _super.prototype.on.call(this, event, fn, context);
            };
            EventEmitter.prototype.once = function (event, fn, context) {
                return _super.prototype.once.call(this, event, fn, context);
            };
            EventEmitter.prototype.removeListener = function (event, fn, context, once) {
                return _super.prototype.removeListener.call(this, event, fn, context, once);
            };
            EventEmitter.prototype.removeAllListeners = function (event) {
                return _super.prototype.removeAllListeners.call(this, event);
            };
            EventEmitter.prototype.off = function (event, fn, context, once) {
                return _super.prototype.off.call(this, event, fn, context, once);
            };
            EventEmitter.prototype.addListener = function (event, fn, context) {
                return _super.prototype.addListener.call(this, event, fn, context);
            };
            return EventEmitter;
        }(PIXI.utils.EventEmitter));
        Animation_1.EventEmitter = EventEmitter;
        var Animation = /** @class */ (function (_super) {
            __extends(Animation, _super);
            function Animation(config, keyframes, manager) {
                var _this = _super.call(this) || this;
                _this.manager = Animation_1.Manager.shared;
                _this.config = {
                    easing: Easing.Linear.None,
                    direction: Direction.Normal,
                    duration: 1000,
                    delay: 0,
                    endDelay: 0,
                    iterations: 0,
                    defaultDuration: 0
                };
                _this.keyframeOffsets = [];
                _this.currentIteration = 0;
                _this.isPlaying = false;
                _this.startEmitted = false;
                _this.startTime = NaN;
                _this.lastTime = NaN;
                _this.isInstantUpdate = false;
                _this.completeNow = false;
                if (!keyframes) {
                    keyframes = [];
                }
                _this.keyframes = new (KeyframeManager.bind.apply(KeyframeManager, __spreadArrays([void 0], keyframes)))();
                if (manager) {
                    _this.setManager(manager);
                }
                if (config) {
                    _this.setConfig(config);
                }
                return _this;
            }
            Object.defineProperty(Animation.prototype, "inProgress", {
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
            Object.defineProperty(Animation.prototype, "lastIntermediateKeyframeIndex", {
                /**
                 * Возвращает последний индекс промежуточного кейфрейма (или -1, если таковых ещё не было)
                 * @returns {number}
                 */
                get: function () {
                    var firstIndex = this.firstIntermediateIndex;
                    var lastIndex = this.lastIntermediateIndex;
                    if (lastIndex <= firstIndex) {
                        return -1;
                    }
                    return lastIndex;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Вставляет/заменяет начальный(основной) кейфрейм
             * @param {T} props
             * @param {RG.Animation.BoundaryKeyframeConfig} config
             * @returns {this<T extends RG.Animation.KeyframeProperties>}
             */
            Animation.prototype.from = function (props, config) {
                return this.replaceBoundaryKeyframe(false, props, config);
            };
            /**
             * Возвращает свойста начального фрейма
             * @returns {Readonly<T extends RG.Animation.KeyframeProperties> | false}
             */
            Animation.prototype.getFromProps = function () {
                if (!this.startKeyframe) {
                    return false;
                }
                return Object.seal(Object.freeze(Object.assign({}, this.startKeyframe.props)));
            };
            /**
             * Вставляет/заменяет конечный(основной) кейфрейм
             * @param {T} props
             * @param {RG.Animation.BoundaryKeyframeConfig} config
             * @returns {this<T extends RG.Animation.KeyframeProperties>}
             */
            Animation.prototype.to = function (props, config) {
                return this.replaceBoundaryKeyframe(true, props, config);
            };
            /**
             * Возвращает свойста конечного фрейма
             * @returns {Readonly<T extends RG.Animation.KeyframeProperties> | false}
             */
            Animation.prototype.getToProps = function () {
                if (!this.endKeyframe) {
                    return false;
                }
                return Object.seal(Object.freeze(Object.assign({}, this.endKeyframe.props)));
            };
            /**
             * Вставляет/заменяет промежуточный кейфрейм
             * @param {number} index
             * @param {Partial<T extends RG.Animation.KeyframeProperties>} props
             * @param {RG.Animation.KeyframeConfig} config
             * @returns {this<T extends RG.Animation.KeyframeProperties>}
             */
            Animation.prototype.intermediate = function (index, props, config) {
                var keyframeIndex = this.getIntermediateIndex(index, true);
                // Добавляем кейфрейм в конец
                if (keyframeIndex === (this.lastIntermediateIndex + 1)) {
                    this.keyframes.addOnIndex(keyframeIndex, props, config);
                }
                else {
                    this.keyframes.replaceByIndex(keyframeIndex, props, config);
                }
                return this;
            };
            /**
             * Удаляет промежуточный кейфрейм
             * @param {number} index
             * @return {this}
             */
            Animation.prototype.removeIntermediate = function (index) {
                var keyframeIndex = this.getIntermediateIndex(index);
                this.keyframes.splice(keyframeIndex, 1);
                return this;
            };
            Object.defineProperty(Animation.prototype, "firstIntermediateIndex", {
                /**
                 * Возвращает первый индекс промежуточного фрейма
                 * @returns {number}
                 */
                get: function () {
                    return (this.startKeyframe ? 1 : 0);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Animation.prototype, "lastIntermediateIndex", {
                /**
                 * Возвращает первый индекс промежуточного фрейма
                 * @returns {number}
                 */
                get: function () {
                    return this.keyframes.length - 1 - (this.endKeyframe ? 1 : 0);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Возвращает промежуточный индекс
             * @param {number} index
             * @param {boolean} allowNew разрешает новый промежуточный индекс
             * @returns {number}
             */
            Animation.prototype.getIntermediateIndex = function (index, allowNew) {
                if (allowNew === void 0) { allowNew = false; }
                // Индекс промежуточного кейфрейма в массиве всех кейфремов
                var firstIndex = this.firstIntermediateIndex;
                var lastIndex = this.lastIntermediateIndex;
                var availableIndex = lastIndex + (allowNew ? 1 : 0);
                var keyframeIndex = index + firstIndex;
                if (keyframeIndex > availableIndex || keyframeIndex < firstIndex) {
                    throw new Exception('Неверный индекс ' + keyframeIndex + ' для промежуточного кейфрейма. Доступные значения [' + firstIndex + ', ' + availableIndex + ']');
                }
                return keyframeIndex;
            };
            /**
             * Возвращает свойства промежуточного фрейма
             * @param {number} index
             * @returns {Readonly<Partial<T extends RG.Animation.KeyframeProperties>> | false}
             */
            Animation.prototype.getIntermediateProps = function (index) {
                var keyframeIndex;
                try {
                    keyframeIndex = this.getIntermediateIndex(index);
                }
                catch (e) {
                    return false;
                }
                var keyframe = this.keyframes[keyframeIndex];
                return Object.seal(Object.freeze(Object.assign({}, keyframe.props)));
            };
            /**
             * Меняет менеджер анимаций
             * @param {RG.Animation.Manager} manager
             * @returns {this}
             */
            Animation.prototype.setManager = function (manager) {
                this.manager = manager;
                return this;
            };
            /**
             * Меняет часть конфига, в соответствии с исходным параметром
             * @param {Partial<RG.Animation.Config>} config
             * @returns {this}
             */
            Animation.prototype.setConfig = function (config) {
                Object.assign(this.config, config);
                return this;
            };
            /**
             * Меняет функцию Easing по-умолчанию
             * @param {RG.Animation.Easing.EasingFunction} func
             * @returns {this}
             */
            Animation.prototype.easing = function (func) {
                this.config.easing = func;
                return this;
            };
            /**
             * Возвращает текущее значение Easing
             * @returns {RG.Animation.Easing.EasingFunction}
             */
            Animation.prototype.getEasing = function () {
                return this.config.easing;
            };
            /**
             * Меняет направление анимации
             * @param {RG.Animation.Direction} dir
             * @returns {this}
             */
            Animation.prototype.direction = function (dir) {
                this.config.direction = dir;
                return this;
            };
            /**
             * Возвращает текущее значение направления анимации
             * @returns {RG.Animation.Direction}
             */
            Animation.prototype.getDirection = function () {
                return this.config.direction;
            };
            /**
             * Меняет длительность анимации
             * @param {number} duration
             * @returns {this}
             */
            Animation.prototype.duration = function (duration) {
                this.config.duration = duration;
                return this;
            };
            /**
             * Возвращает текущее значение длины анимации
             * @returns {number}
             */
            Animation.prototype.getDuration = function () {
                return this.config.duration;
            };
            /**
             * Меняет длительность анимации по-умолчанию для расчёта оффсетов промежуточных кейфремов
             * @param {number} defaultDuration
             * @returns {this}
             */
            Animation.prototype.defaultDuration = function (defaultDuration) {
                this.config.defaultDuration = defaultDuration;
                return this;
            };
            /**
             * Возвращает текущее значение длины анимации по-умолчанию для расчёта оффсетов промежуточных кейфремов
             * @returns {number}
             */
            Animation.prototype.getDefaultDuration = function () {
                return this.config.defaultDuration;
            };
            /**
             * Меняет задержку перед началом циклов анимаций
             * @param {number} delay
             * @returns {this}
             */
            Animation.prototype.delay = function (delay) {
                this.config.delay = delay;
                return this;
            };
            /**
             * Возвращает текущее значение задержки перед началом циклов
             * @returns {number}
             */
            Animation.prototype.getDelay = function () {
                return this.config.delay;
            };
            /**
             * Меняет задержку по завершению цикла анимаций
             * @param {number} endDelay
             * @returns {this}
             */
            Animation.prototype.endDelay = function (endDelay) {
                this.config.endDelay = endDelay;
                return this;
            };
            /**
             * Возвращает текущее значение задержки по завершению цикла
             * @returns {number}
             */
            Animation.prototype.getEndDelay = function () {
                return this.config.endDelay;
            };
            /**
             * Меняет значение кол-ва циклов анимаций (или Infinity)
             * @param {number} iterations
             * @returns {this}
             */
            Animation.prototype.iterations = function (iterations) {
                this.config.iterations = iterations;
                return this;
            };
            /**
             * Возвращает текущее значение кол-ва циклов
             * @returns {number}
             */
            Animation.prototype.getIterations = function () {
                return this.config.iterations;
            };
            /**
             * Возвращает true, если включено обратное направление анимации
             * @returns {boolean}
             * @private
             */
            Animation.prototype.getIsReversed = function () {
                var dir = this.config.direction, dirs = Direction;
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
            };
            /**
             * Возвращает последнее время обновления анимации
             * @returns {number}
             */
            Animation.prototype.getLastTime = function () {
                return this.lastTime;
            };
            /**
             * Заменяет граничный кейфрейм в анимации
             * @param {boolean} isEnd конечный кейфрем?
             * @param {T} props
             * @param {RG.Animation.BoundaryKeyframeConfig} config
             * @returns {this<T extends RG.Animation.KeyframeProperties>}
             * @private
             */
            Animation.prototype.replaceBoundaryKeyframe = function (isEnd, props, config) {
                var curValue = isEnd ? this.endKeyframe : this.startKeyframe;
                var newValue;
                if (!curValue) {
                    var f = isEnd ? 'add' : 'prepend';
                    newValue = this.keyframes[f](props, config);
                }
                else {
                    var index = isEnd ? this.keyframes.length - 1 : 0;
                    if (curValue !== this.keyframes[index]) {
                        throw new Exception('Граничный кейфрейм не совпадает с тем, что указан в анимации');
                    }
                    newValue = this.keyframes.replaceByIndex(index, props, config);
                }
                if (isEnd) {
                    this.endKeyframe = newValue;
                }
                else {
                    this.startKeyframe = newValue;
                }
                return this;
            };
            /**
             * Возвращает список текущих значений в данный момент анимации
             * @returns {Readonly<T extends RG.Animation.KeyframeProperties>}
             * @private
             */
            Animation.prototype.getCurrentPropsForEvent = function () {
                return Object.seal(Object.freeze(Object.assign({}, this.currentProps)));
            };
            /**
             * Преобразует данные первого (или последнего) кейфрейма в массив значений для анимации
             * Если в первом (последнем) кейфрейме каких-то значений не достаёт, то они заполнятся из следующих
             * @returns {T}
             * @private
             */
            Animation.prototype.keyframesToCurrentProps = function () {
                var isReversed = this.getIsReversed();
                var keyframe = isReversed ? this.endKeyframe : this.startKeyframe;
                if (!keyframe) {
                    throw new Exception('Граничный кейфрейм пуст');
                }
                return Object.assign({}, keyframe.props);
            };
            /**
             * Считаем оффсеты кейфреймов
             * @tutorial https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats#Syntax
             * @returns {number[]}
             * @private
             */
            Animation.prototype.keyframesToOffsetsArray = function () {
                var length = this.keyframes.length;
                var offsets = [];
                // Начальный оффсет - 0
                offsets.push(0);
                var i = 1;
                while (i < length) {
                    var keyframe = this.keyframes[i];
                    // Если во фрейме указан свой оффсет, то берём его
                    if (keyframe.config) {
                        var lastOffset = offsets[offsets.length - 1];
                        var nextOffset_1 = 0;
                        if (keyframe.config.offset) {
                            nextOffset_1 = keyframe.config.offset;
                        }
                        else if (keyframe.config.relativeOffset) {
                            nextOffset_1 = lastOffset + keyframe.config.relativeOffset;
                        }
                        else if (keyframe.config.relativeTime && this.config.defaultDuration > 0) {
                            nextOffset_1 = lastOffset + keyframe.config.relativeTime / this.config.defaultDuration;
                        }
                        if (nextOffset_1 > 0 && nextOffset_1 > lastOffset && nextOffset_1 < 1) {
                            offsets.push(nextOffset_1);
                            i++;
                            continue;
                        }
                    }
                    // Считаем следующий указанный оффсет и кол-во кейфреймов без оффсета до него
                    var nextOffset = 1, countToNextOffset = 0;
                    for (var j = i + 1; j < length; j++) {
                        countToNextOffset++;
                        // Не учитываем последний оффсет - он всегда 1
                        if (j === length - 1) {
                            break;
                        }
                        var nextKeyframe = this.keyframes[j];
                        if (nextKeyframe.config && nextKeyframe.config.offset) {
                            nextOffset = nextKeyframe.config.offset;
                            break;
                        }
                    }
                    // Считаем, по сколько придётся на каждый кейфрейм
                    var prevOffset = offsets[offsets.length - 1];
                    var diff = (nextOffset - prevOffset) / (countToNextOffset + 1);
                    // Заполняем все эти оффсеты
                    for (var j = 1; j <= countToNextOffset; j++) {
                        offsets.push(prevOffset + diff * j);
                        i++;
                    }
                    offsets.push(nextOffset);
                    i++;
                }
                return offsets;
            };
            /**
             * Возвращает индекс для оффсета в соответствии с текущим временем в анимации
             * @param {number} elapsed
             * @returns {number}
             * @private
             */
            Animation.prototype.getOffsetIndexByElapsed = function (elapsed) {
                var offsets = this.keyframeOffsets;
                if (!offsets.length) {
                    throw new Exception('Пустой массив оффсетов');
                }
                var isReversed = this.getIsReversed();
                return Animation_1.Utils.iterateArrayWithReverse(offsets, function (offset) {
                    if (isReversed ? offset <= elapsed : offset >= elapsed) {
                        return false;
                    }
                }, isReversed);
            };
            /**
             * Возвращает индекс текущего и следующего кейфрейма на основе индекса оффсета
             * @param {number} index
             * @returns {number[]}
             * @private
             */
            Animation.prototype.getKeyframeIndexesByOffsetIndex = function (index) {
                var length = this.keyframes.length;
                var lastIndex = length - 1;
                var nextIndex;
                if (index < 0 || index > lastIndex) {
                    throw new Exception('Индекс не может быть меньше нуля или больше максимального индекса');
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
            };
            /**
             * Ищет ненулевой индекс для свойства кейфрейма
             * @param {keyof T} prop
             * @param {number} index
             * @param {boolean} isEnd
             * @returns {number}
             * @private
             */
            Animation.prototype.findNonEmptyKeyframeIndex = function (prop, index, isEnd) {
                var isReversed = this.getIsReversed();
                var length = this.keyframes.length;
                var i = index;
                while (i >= 0 && i < length) {
                    var keyframe = this.keyframes[i];
                    if (keyframe.props.hasOwnProperty(prop)) {
                        break;
                    }
                    // Если прямой ход, то начало вычитается false === false, если обратный - то конец, true === true
                    if (isReversed === isEnd) {
                        i--;
                    }
                    else {
                        i++;
                    }
                }
                return i;
            };
            /**
             * Завершает цикл анимации и проверяет необходимость его повтора
             * @param {number} time
             * @returns {boolean} false, если анимация закончилась
             * @private
             */
            Animation.prototype.onFinish = function (time) {
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
                this.startTime = time || Animation_1.Utils.getCurrentTime();
                if (this.config.endDelay) {
                    this.startTime += this.config.endDelay;
                }
                return true;
            };
            /**
             * Обновляет текущие значения анимации по значению elapsed от 0 до 1
             * @param {number} elapsed
             * @returns {this<T extends RG.Animation.KeyframeProperties>}
             */
            Animation.prototype.updateByElapsed = function (elapsed) {
                var calcElapsed = this.getIsReversed() ? 1 - elapsed : elapsed;
                var elapsedIndex = this.getOffsetIndexByElapsed(calcElapsed);
                var _a = this.getKeyframeIndexesByOffsetIndex(elapsedIndex), index = _a[0], nextIndex = _a[1];
                var defaultValue = this.getEasingValue(calcElapsed, index, nextIndex);
                // console.log('upd', elapsedIndex, index, nextIndex, this.keyframes.length, this.keyframeOffsets)
                for (var prop in this.currentProps) {
                    var startIndex = this.findNonEmptyKeyframeIndex(prop, index, false), endIndex = this.findNonEmptyKeyframeIndex(prop, nextIndex, true);
                    var value = defaultValue;
                    if (startIndex !== index || endIndex !== nextIndex) {
                        value = this.getEasingValue(calcElapsed, startIndex, endIndex);
                    }
                    // Всегда есть граничные кейфреймы, у которых должны быть все пропсы указаны
                    var start = this.keyframes[startIndex].props[prop], end = this.keyframes[endIndex].props[prop];
                    this.currentProps[prop] = start + (end - start) * value;
                }
                this.emit(Events.Update, this.getCurrentPropsForEvent(), defaultValue, elapsed, this.getIsReversed());
                return this;
            };
            /**
             * Возвращает easing значение между двумя кейфреймами
             * @param {number} elapsed
             * @param {number} startIndex
             * @param {number} endIndex
             * @returns {number}
             * @private
             */
            Animation.prototype.getEasingValue = function (elapsed, startIndex, endIndex) {
                var isReversed = this.getIsReversed();
                var startKeyframe = this.keyframes[startIndex];
                var endKeyframe = this.keyframes[endIndex];
                var startOffset = this.keyframeOffsets[startIndex];
                var endOffset = this.keyframeOffsets[endIndex];
                // В обратном порядке easing и interpolation функции содержатся в следующем кейфрейме
                var funcKeyframeConfig = isReversed ? endKeyframe.config : startKeyframe.config;
                var easing = funcKeyframeConfig && funcKeyframeConfig.easing ? funcKeyframeConfig.easing : this.config.easing;
                // Даже если startOffset > endOffset, то elapsed - startOffset < 0 и endOffset - startOffset < 0
                var elapsedPart = (elapsed - startOffset) / (endOffset - startOffset);
                if (elapsedPart > 1) {
                    elapsedPart = 1;
                }
                if (elapsedPart < 0) {
                    elapsedPart = 0;
                }
                return easing(elapsedPart);
            };
            /**
             * Заставляет сразу обновиться анимацию при начале проигрывания (необходимо для чейнинга в юнионе)
             * @returns {this<T extends RG.Animation.KeyframeProperties>}
             */
            Animation.prototype.instantUpdate = function () {
                this.isInstantUpdate = true;
                return this;
            };
            /**
             * Запускает анимацию
             * @param {number} time
             * @returns {this}
             */
            Animation.prototype.start = function (time) {
                if (this.isPlaying) {
                    console.error('already playing', this.currentIteration, __spreadArrays(this.keyframes), __assign({}, this.currentProps));
                    this.stop();
                }
                this.manager.add(this);
                this.emit(Events.BeforeStart);
                this.isPlaying = true;
                this.startEmitted = false;
                this.currentIteration = 0;
                var currentTime = time || Animation_1.Utils.getCurrentTime();
                this.startTime = currentTime;
                this.startTime += this.config.delay;
                this.currentProps = this.keyframesToCurrentProps();
                this.keyframeOffsets = this.keyframesToOffsetsArray();
                if (this.isInstantUpdate) {
                    this.isInstantUpdate = false;
                    this.update(currentTime);
                }
                return this;
            };
            /**
             * Запускает анимацию и дожидается её завершения
             * @param {number} time
             * @returns {Promise<boolean>}
             */
            Animation.prototype.play = function (time) {
                return __awaiter(this, void 0, Promise, function () {
                    var resolver, promise;
                    return __generator(this, function (_a) {
                        this.completeNow = false;
                        promise = new Promise(function (resolve) {
                            resolver = resolve;
                        });
                        this.start(time).on(Events.Complete, function () {
                            resolver(true);
                        }).on(Events.Stop, function () {
                            resolver(false);
                        });
                        return [2 /*return*/, promise];
                    });
                });
            };
            /**
             * Запускает анимацию и дожидается её завершения, а потом уничтожает анимацию
             * @param {number} time
             * @returns {Promise<boolean>}
             */
            Animation.prototype.playAndDestroy = function (time) {
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
             * Останавливает анимацию и уничтожает всех слушателей
             * @returns {boolean}
             */
            Animation.prototype.destroy = function () {
                this.stop();
                this.removeAllListeners();
                return true;
            };
            /**
             * Обновляет текущий фрейм в анимации
             * @param {number} time
             * @returns {boolean}
             */
            Animation.prototype.update = function (time) {
                if (time < this.startTime || !this.currentProps) {
                    return true;
                }
                if (!this.startEmitted) {
                    this.emit(Events.Start, this.getCurrentPropsForEvent());
                    this.startEmitted = true;
                }
                this.lastTime = time;
                // 0 to 1
                var elapsed = (time - this.startTime) / this.config.duration;
                elapsed = elapsed > 1 ? 1 : elapsed;
                var isFinish = elapsed === 1;
                this.updateByElapsed(elapsed);
                if (isFinish) {
                    if (!this.onFinish(time)) {
                        this.isPlaying = false;
                        this.emit(Events.Complete, this.getCurrentPropsForEvent());
                        return false;
                    }
                }
                return true;
            };
            /**
             * Останавливает анимацию
             * @returns {this}
             */
            Animation.prototype.stop = function () {
                if (!this.isPlaying) {
                    return this;
                }
                this.manager.remove(this);
                this.isPlaying = false;
                this.emit(Events.Stop, this.getCurrentPropsForEvent());
                return this;
            };
            /**
             * Принудительно завершает анимацию и перемещает на последний кейфрейм
             * @returns {this<T extends RG.Animation.KeyframeProperties>}
             */
            Animation.prototype.forceFinish = function () {
                if (!this.isPlaying) {
                    return this;
                }
                this.manager.remove(this);
                this.updateByElapsed(1);
                this.isPlaying = false;
                this.emit(Events.Complete, this.getCurrentPropsForEvent());
                return this;
            };
            /**
             * Принудительно завершает анимацию, при этом доигрывая текущий цикл до конца
             * @returns {this<T extends RG.Animation.KeyframeProperties>}
             */
            Animation.prototype.forceComplete = function () {
                this.completeNow = true;
                return this;
            };
            return Animation;
        }(EventEmitter));
        Animation_1.Animation = Animation;
    })(Animation = RG.Animation || (RG.Animation = {}));
})(RG || (RG = {}));

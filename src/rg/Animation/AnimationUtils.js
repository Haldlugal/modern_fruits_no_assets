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
        var Utils;
        (function (Utils) {
            /**
             * Итерирует по массиву в поиске нужного значения (остановки через функцию fn)
             * @param {Array<T>} arr
             * @param {(value: T, index: number) => (boolean | void)} fn
             * @param {boolean} isReverse итерация от последнего к первому?
             * @returns {number} возвращает индекс массива, на котором закончилась итерация (или первый/последний индекс)
             */
            function iterateArrayWithReverse(arr, fn, isReverse) {
                if (isReverse === void 0) { isReverse = false; }
                var len = arr.length;
                var i = isReverse ? len - 1 : 0;
                while (isReverse ? i >= 0 : i < len) {
                    var result = fn(arr[i], i);
                    if (result === false) {
                        break;
                    }
                    isReverse ? i-- : i++;
                }
                if (i >= len) {
                    return len - 1;
                }
                if (i < 0) {
                    return 0;
                }
                return i;
            }
            Utils.iterateArrayWithReverse = iterateArrayWithReverse;
            /**
             * Возвращает текущее время
             * @returns {number}
             */
            function getCurrentTime() {
                return (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now());
            }
            Utils.getCurrentTime = getCurrentTime;
            var ArrayManager = /** @class */ (function (_super) {
                __extends(ArrayManager, _super);
                function ArrayManager() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Создаёт и добавляет элемент в конец в массиве менеджера
                 * @param {Parameters<C extends (...args: any[]) => T>} args
                 * @returns {T}
                 */
                ArrayManager.prototype.add = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var item = this.createItem.apply(this, args);
                    this.push(item);
                    return item;
                };
                /**
                 * Создаёт и добавляет элемент в начало в массиве менеджера
                 * @param {Parameters<C extends (...args: any[]) => T>} args
                 * @returns {T}
                 */
                ArrayManager.prototype.prepend = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var item = this.createItem.apply(this, args);
                    this.unshift(item);
                    return item;
                };
                /**
                 * Вставляет элемент на указанный индекс (перед текущим элементом на этом индексе) в массиве менеджера
                 * @param {number} index
                 * @param {Parameters<C extends (...args: any[]) => T>} args
                 * @returns {T}
                 */
                ArrayManager.prototype.addOnIndex = function (index) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var item = this.createItem.apply(this, args);
                    this.splice(index, 0, item);
                    return item;
                };
                /**
                 * Заменяет элемент в массиве менеджера
                 * @param {T} item
                 * @param {Parameters<C extends (...args: any[]) => T>} args
                 * @returns {false | T}
                 */
                ArrayManager.prototype.replace = function (item) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var index = this.indexOf(item);
                    return this.replaceByIndex.apply(this, __spreadArrays([index], args));
                };
                /**
                 * Заменяет элемент в массиве менеджера по индексу
                 * @param {number} index
                 * @param {Parameters<C extends (...args: any[]) => T>} args
                 * @returns {false | T}
                 */
                ArrayManager.prototype.replaceByIndex = function (index) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    if (index < 0 || index >= this.length) {
                        return false;
                    }
                    var newItem = this.createItem.apply(this, args);
                    this.splice(index, 1, newItem);
                    return newItem;
                };
                /**
                 * Удаляет элемент в массиве менеджера
                 * @param {T} item
                 * @returns {this<T, C extends (...args: any[]) => T>}
                 */
                ArrayManager.prototype.remove = function (item) {
                    var index = this.indexOf(item);
                    if (index !== -1) {
                        this.splice(index, 1);
                    }
                    return this;
                };
                /**
                 * Очищает элементы в массиве менеджера
                 * @returns {this<T, C extends (...args: any[]) => T>}
                 */
                ArrayManager.prototype.clear = function () {
                    this.splice(0, this.length);
                    return this;
                };
                return ArrayManager;
            }(Array));
            Utils.ArrayManager = ArrayManager;
        })(Utils = Animation.Utils || (Animation.Utils = {}));
    })(Animation = RG.Animation || (RG.Animation = {}));
})(RG || (RG = {}));

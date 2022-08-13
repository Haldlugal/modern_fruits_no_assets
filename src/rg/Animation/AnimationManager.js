/// <reference path="./AnimationUtils.ts" />
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
        var Manager = /** @class */ (function (_super) {
            __extends(Manager, _super);
            function Manager() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Manager.prototype.createItem = function (item) {
                return item;
            };
            /**
             * Обновляет все анимации в менеджере
             * @param {number} time
             * @returns {boolean}
             */
            Manager.prototype.update = function (time) {
                if (!this.length) {
                    return false;
                }
                time = time || Animation.Utils.getCurrentTime();
                for (var _i = 0, _a = this; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (!item.update(time)) {
                        this.remove(item);
                    }
                }
                return true;
            };
            return Manager;
        }(Animation.Utils.ArrayManager));
        Animation.Manager = Manager;
        (function (Manager) {
            Manager.shared = new Manager();
        })(Manager = Animation.Manager || (Animation.Manager = {}));
    })(Animation = RG.Animation || (RG.Animation = {}));
})(RG || (RG = {}));

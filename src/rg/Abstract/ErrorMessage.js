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
    var Abstract;
    (function (Abstract) {
        var ErrorMessage = /** @class */ (function (_super) {
            __extends(ErrorMessage, _super);
            function ErrorMessage(message, title, iconName) {
                var _this = _super.call(this) || this;
                console.error('ErrorMessage', message);
                if (typeof message === 'string') {
                    _this.message = message;
                }
                else {
                    _this.message = _this.parseError(message);
                }
                _this.title = title;
                _this.button = new RG.Button(iconName);
                return _this;
            }
            ErrorMessage.prototype.parseError = function (error, defaultMessage) {
                var f = function (message) {
                    if (message === 'Network Error') {
                        message = RG.Translator.get('PROBLEM_WITH_INTERNET_CONNECTION');
                    }
                    if (!message || typeof message !== 'string') {
                        message = defaultMessage || 'Please check your internet connection or try later';
                    }
                    return message;
                };
                var arrayValues = function (mixed) {
                    if (!mixed) {
                        return [];
                    }
                    if (typeof mixed === 'string') {
                        return [mixed];
                    }
                    if (typeof mixed !== 'object') {
                        return [];
                    }
                    if (!Array.isArray(mixed)) {
                        var object = mixed;
                        var values = [];
                        for (var key in object) {
                            values.push(object[key]);
                        }
                        return values;
                    }
                    return mixed;
                };
                var hasKey = function (mixed, key) {
                    return Object.prototype.hasOwnProperty.call(mixed, key);
                };
                var parseResponse = function (data) {
                    if (hasKey(data, 'errors')) {
                        var errors = arrayValues(data.errors);
                        errors = errors.map(function (e) { return arrayValues(e).join('\n'); });
                        return f(errors.join('\n'));
                    }
                    if (hasKey(data, 'error') && data.error && hasKey(data.error, 'description')) {
                        return f(data.error.description);
                    }
                    if (hasKey(data, 'description')) {
                        return f(data.description);
                    }
                    if (hasKey(data, 'message')) {
                        return f(data.message);
                    }
                };
                if (error) {
                    if (typeof error === 'string') {
                        return f(error);
                    }
                    var message = void 0;
                    if (typeof error === 'object') {
                        if (message = parseResponse(error)) { // general error
                            return message;
                        }
                    }
                }
                return f();
            };
            return ErrorMessage;
        }(PIXI.Container));
        Abstract.ErrorMessage = ErrorMessage;
    })(Abstract = RG.Abstract || (RG.Abstract = {}));
})(RG || (RG = {}));

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
        /**
         * В каком состоянии находится сцена
         */
        var SceneState;
        (function (SceneState) {
            SceneState[SceneState["CREATE"] = 0] = "CREATE";
            SceneState[SceneState["LOAD"] = 1] = "LOAD";
            SceneState[SceneState["PROCESS"] = 2] = "PROCESS";
            SceneState[SceneState["FINALIZE"] = 3] = "FINALIZE";
            SceneState[SceneState["DONE"] = 4] = "DONE";
        })(SceneState = Abstract.SceneState || (Abstract.SceneState = {}));
        var SceneEvents;
        (function (SceneEvents) {
            SceneEvents["CREATED"] = "created";
            SceneEvents["LOADED"] = "loaded";
            SceneEvents["FINALIZE"] = "finalized";
        })(SceneEvents = Abstract.SceneEvents || (Abstract.SceneEvents = {}));
        var Scene = /** @class */ (function (_super) {
            __extends(Scene, _super);
            function Scene(game) {
                var _this = _super.call(this) || this;
                // Callback, выполняемый по завершению сцены (когда получен статус SceneState.DONE)
                _this.onDoneCallback = function () {
                };
                _this.game = game;
                _this.name = _this.constructor.name;
                _this.state = SceneState.CREATE;
                _this.sortableChildren = true;
                return _this;
            }
            /**
             * Запуск сцены
             */
            Scene.prototype.start = function () {
                // меняем стейт на самый начальный
                this.state = SceneState.CREATE;
                this.lastState = undefined;
                this.onDoneCallback = function () {
                };
                // удаляем в основном контейнере всех деток
                this.game.app.stage.removeChildren();
                // Добавляем контейнер сцены на основную
                this.game.app.stage.addChild(this);
                if (this.children.length > 0) {
                    // Уже контейнер заполнен - ничего делать не надо
                    this.state = SceneState.LOAD;
                }
                else {
                    // запускаем сетап сцены в этом контейнере
                    this.setup();
                }
            };
            /**
             * Завершение сцены
             * Возвращается Promise, который зарезолвится после завершение сцены
             *
             */
            Scene.prototype.finalize = function () {
                var _this = this;
                this.state = SceneState.FINALIZE;
                return new Promise(function (resolve) {
                    _this.onDoneCallback = resolve;
                });
            };
            /**
             * Выполняется при отображении каждого кадра сцены, когда стейт находится в состоянии SceneState.CREATE
             * Скорее всего он и не понадобится в дальнейшем.. пока пусть будет, при рефакторинге сможем удалить
             *
             * @param delta Время в милисекундах с последнего кадра
             * @param first Это первый кадр в этом статусе?
             */
            Scene.prototype.onCreate = function (delta, first) {
                this.emit('created');
            };
            /**
             * Выполняется при отображении каждого кадра сцены, когда стейт находится в состоянии SceneState.LOAD
             *
             * @param delta Время в милисекундах с последнего кадра
             * @param first Это первый кадр в этом статусе?
             */
            Scene.prototype.onLoad = function (delta, first) {
                if (first) {
                    this.state = SceneState.PROCESS;
                }
                this.emit('loaded');
            };
            /**
             * Выполняется при отображении каждого кадра сцены, когда стейт находится в состоянии SceneState.PROCESS
             *
             * @param delta Время в милисекундах с последнего кадра
             * @param first Это первый кадр в этом статусе?
             */
            Scene.prototype.onProcess = function (delta, first) {
            };
            /**
             * Выполняется при отображении каждого кадра сцены, когда стейт находится в состоянии SceneState.FINALIZE
             *
             * @param delta Время в милисекундах с последнего кадра
             * @param first Это первый кадр в этом статусе?
             */
            Scene.prototype.onFinalize = function (delta, first) {
                if (first) {
                    this.state = SceneState.DONE;
                }
                this.emit('finalized');
            };
            /**
             * Выполняется при ресайзе игрового поля
             * Сама игра вызывает этот метод у текущей сцены
             */
            Scene.prototype.onResize = function () { };
            Scene.prototype.update = function (delta) {
                var first = (this.lastState !== this.state);
                this.lastState = this.state;
                switch (this.state) {
                    case SceneState.CREATE:
                        this.onCreate(delta, first);
                        break;
                    case SceneState.LOAD:
                        this.onLoad(delta, first);
                        break;
                    case SceneState.PROCESS:
                        this.onProcess(delta, first);
                        break;
                    case SceneState.FINALIZE:
                        this.onFinalize(delta, first);
                        break;
                    case SceneState.DONE:
                        // Когда переходим в стутус завершено, запускаем onDoneCallback,
                        // проверка на first нужна, что бы предотвратить возможное повторение вызова onDoneCallback:
                        // onDoneCallback может отработать не сразу и тогда update может вызваться для этой сцены еще ...
                        first && this.onDoneCallback();
                        break;
                }
            };
            return Scene;
        }(PIXI.Container));
        Abstract.Scene = Scene;
    })(Abstract = RG.Abstract || (RG.Abstract = {}));
})(RG || (RG = {}));

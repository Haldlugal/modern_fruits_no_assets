namespace RG.Abstract {
    /**
     * В каком состоянии находится сцена
     */
    export enum SceneState {
        CREATE,
        LOAD,
        PROCESS,
        FINALIZE,
        DONE
    }

    export enum SceneEvents {
        CREATED = 'created',
        LOADED = 'loaded',
        FINALIZE = 'finalized'
    }

    export abstract class Scene extends PIXI.Container {
        // Имя сцены, определяем автоматом в конструкторе как имя класса
        public readonly name: string;

        // Текущее состояние сцены
        protected state: SceneState;

        // состояние сцены которое было в последний запуск функции update
        private lastState?: SceneState;

        // Основное приложение игры
        protected game: Game;

        // Callback, выполняемый по завершению сцены (когда получен статус SceneState.DONE)
        protected onDoneCallback = () => {
        };

        protected constructor(game: Game) {
            super();
            this.game = game;
            this.name = this.constructor.name;
            this.state = SceneState.CREATE;
            this.sortableChildren = true;
        }

        /**
         * Настройка сцены
         */
        protected abstract setup(): void;

        /**
         * Запуск сцены
         */
         start(): void {
            // меняем стейт на самый начальный
            this.state = SceneState.CREATE;
            this.lastState = undefined;
            this.onDoneCallback = () => {
            };

            // удаляем в основном контейнере всех деток
            this.game.app.stage.removeChildren();

            // Добавляем контейнер сцены на основную
            this.game.app.stage.addChild(this);

            if (this.children.length > 0) {
                // Уже контейнер заполнен - ничего делать не надо
                this.state = SceneState.LOAD;
            } else {
                // запускаем сетап сцены в этом контейнере
                this.setup();
            }
        }

        /**
         * Завершение сцены
         * Возвращается Promise, который зарезолвится после завершение сцены
         *
         */
        finalize(): Promise<void> {
            this.state = SceneState.FINALIZE;
            return new Promise<void>((resolve) => {
                this.onDoneCallback = resolve;
            });
        }

        /**
         * Выполняется при отображении каждого кадра сцены, когда стейт находится в состоянии SceneState.CREATE
         * Скорее всего он и не понадобится в дальнейшем.. пока пусть будет, при рефакторинге сможем удалить
         *
         * @param delta Время в милисекундах с последнего кадра
         * @param first Это первый кадр в этом статусе?
         */
        onCreate(delta: number, first: boolean) {
            this.emit('created');
        }

        /**
         * Выполняется при отображении каждого кадра сцены, когда стейт находится в состоянии SceneState.LOAD
         *
         * @param delta Время в милисекундах с последнего кадра
         * @param first Это первый кадр в этом статусе?
         */
        onLoad(delta: number, first: boolean) {
            if (first) {
                this.state = SceneState.PROCESS;
            }
            this.emit('loaded');
        }

        /**
         * Выполняется при отображении каждого кадра сцены, когда стейт находится в состоянии SceneState.PROCESS
         *
         * @param delta Время в милисекундах с последнего кадра
         * @param first Это первый кадр в этом статусе?
         */
        onProcess(delta: number, first: boolean) {
        }

        /**
         * Выполняется при отображении каждого кадра сцены, когда стейт находится в состоянии SceneState.FINALIZE
         *
         * @param delta Время в милисекундах с последнего кадра
         * @param first Это первый кадр в этом статусе?
         */
        onFinalize(delta: number, first: boolean) {
            if (first) {
                this.state = SceneState.DONE;
            }
            this.emit('finalized');
        }

        /**
         * Выполняется при ресайзе игрового поля
         * Сама игра вызывает этот метод у текущей сцены
         */
        onResize() {}

        update(delta: number): void {
            const first = (this.lastState !== this.state);
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
        }

        abstract lock(): this
        abstract unlock(): this
        abstract errorMessage(message: Error | string, title: string): void;
        abstract hideErrorMessage(): void;
    }
}

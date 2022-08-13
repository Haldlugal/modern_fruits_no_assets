namespace RG.Abstract {

    export abstract class Game {

        // HTML контейнер, в котором запускается игра
        private container: HTMLElement;

        // PIXI Application
        public abstract app: PIXI.Application;

        // АПИ для работы с backend
        protected api: GameApi;

        // настройки игры
        public abstract settings: Object;

        // Набор сцен игры
        protected abstract scenes: Scene[];

        // Название сцены, которая была до текущей
        protected lastSceneName?: string;

        // Текущая сцена
        public currentScene?: Scene;

        // Имя стартовой сцены
        protected startSceneName: string = 'StartScene';

        // Отношение котейнера игры в видимых размерах html / внутренние размеры игры
        public scale: number = 1;

        // ширина игры (внутренние размеры PIXI)
        public abstract width: number;

        // высота игры (внутренние размеры PIXI)
        public abstract height: number;

        protected constructor(container: HTMLElement, api: GameApi) {
            this.container = container;
            this.api = api;
        }

        /**
         * Создание PIXI приложения
         */
        protected createApplication(): PIXI.Application {
            const app = new PIXI.Application({
                width: this.width,
                height: this.height,
                antialias: true,
                transparent: true,
                resolution: 1
            });
            app.renderer.view.style.position = "relative";
            app.renderer.view.style.display = "block";

            return app;
        }

        /**
         * Создание сцен, используемых в приложении
         */
        protected abstract initScenes(): void;

        /**
         * Создание плагинов, используемых в приложении
         */
        protected abstract initPlugins(): void;

        protected abstract setTranslations(): this;

        /**
         * Запуск игры
         */
        async start() {
            // Добавляем PIXI приложение в HTML контейнер
            this.container.appendChild(this.app.renderer.view);

            // Добаваляем плагины
            this.initPlugins();

            // Создаем сцены используемые в приложении
            this.initScenes();

            this.setTranslations();

            // Устанавливаем функцию - обновлятор интерфейса
            this.app.ticker.add(delta => {
                if (this.currentScene) {
                    this.currentScene.update(delta);
                    RG.Animation.Manager.shared.update();
                }
            });

            // Запускаем стартовую сцену
            this.switchTo(this.startSceneName);
        }

        /**
         * Переключение на указанную сцену
         * @param name
         */
        switchTo(name: string): void {
            const scene = this.scenes.find((s: Scene) => s.name === name) || this.scenes[0];

            // Если еще нет активной сцены (загрузка страницы), то просто стартуем запрошенную
            if (!this.currentScene)
                return this.startScene(scene);

            // Запоминаем название текущей сцены
            const lastSceneName = this.currentScene.name;

            // В данный момент активна другая сцена, ее нужно завершить, и по завершению стартануть новую
            this.currentScene.finalize().then(() => {
                this.lastSceneName = lastSceneName;
                this.startScene(scene);
            });
        }

        /**
         * Перейти на сцену, предшедствующей текущей
         */
        back(): void {
            if (this.lastSceneName) {
                this.switchTo(this.lastSceneName);
            }
        }

        /**
         * Запуск сцены, запоминаем ее как текущую и стартуем
         * @param scene
         */
        protected startScene(scene: Scene): void {
            this.currentScene = scene;
            this.currentScene.start()
        }

        abstract resize(scale: number): this;
        abstract move(left: number, top: number): this;
    }
}

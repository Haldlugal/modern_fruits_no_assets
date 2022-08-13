namespace RG.Plugins {
    export class StayGameInContainer {
        /**
         * Игра, для которой используется этот плагин
         */
        private game: RG.Abstract.Game;

        public offsets = {
            minOffsetX: 0,
            minOffsetY: 0,
            maxOffsetX: 0,
            maxOffsetY: 0
        };

        private readonly ratio: number;
        /**
         *
         * @param game Сама игра
         * @param minX Минимальная ширина, до которой отступ по горизонтали делается (меньше уже без отступа)
         * @param minY Минимальная ширина, до которой отступ по вертикали делается (меньше уже без отступа)
         * @param minOffsetX Минимальный отступ от краев HTML контейнера игры по горизонтали
         * @param minOffsetY Минимальный отступ от краев HTML контейнера игры по вертикали
         * @param maxOffsetX Максимальный отступ от левого края экрана
         * @param maxOffsetY Максимальный отступ от верха экрана
         * @param mobileMinOffsetX Минимальный мобильный отступ от краев HTML контейнера игры по горизонтали
         * @param mobileMinOffsetY Минимальный мобильный отступ от краев HTML контейнера игры по вертикали
         * @param mobileMaxOffsetX Максимальный мобильный отступ от левого края экрана
         * @param mobileMaxOffsetY Максимальный мобильный отступ от верха экрана
         */
        constructor(game: Game,
                    private minX = 400,
                    private minY = 600,
                    minOffsetX = 20,
                    minOffsetY = 20,
                    maxOffsetX = 100,
                    maxOffsetY = 100,
                    mobileMinOffsetX = 0,
                    mobileMinOffsetY = 0,
                    mobileMaxOffsetX = 0,
                    mobileMaxOffsetY = 0
        ) {

            this.game = game;
            this.ratio = game.app.screen.width / game.app.screen.height;

            this.offsets.minOffsetX = RG.Helper.isMobile() ? mobileMinOffsetX : minOffsetX;
            this.offsets.minOffsetY = RG.Helper.isMobile() ? mobileMinOffsetY : minOffsetY;
            this.offsets.maxOffsetX = RG.Helper.isMobile() ? mobileMaxOffsetX : maxOffsetX;
            this.offsets.maxOffsetY = RG.Helper.isMobile() ? mobileMaxOffsetY : maxOffsetY;

            this.onResize();
            window.addEventListener('resize', this.onResize.bind(this));
        }

        onResize() {

            const container = this.game.app.renderer.view.parentNode as HTMLElement;

            let clientWidth = container.clientWidth;
            let clientHeight = container.clientHeight;

            const offsetX = (clientWidth > this.minX) ? this.offsets.minOffsetX : 0;
            const offsetY = (clientHeight > this.minY) ? this.offsets.minOffsetY : 0;

            let height, width;
            if (clientWidth / clientHeight >= this.ratio) {
                if (this.ratio > 1) {
                    clientHeight -= offsetY * 2;
                }
                width = clientHeight * this.ratio;
                height = clientHeight;
            } else {
                if (this.ratio > 1) {
                    clientWidth -= offsetX * 2;
                }
                width = clientWidth;
                height = clientWidth / this.ratio;
            }

            const scale = width / this.game.app.screen.width;

            let marginTop = (container.clientHeight - height) / 2;
            let marginLeft = (container.clientWidth - width) / 2;

            if (this.offsets.maxOffsetY)
                marginTop = Math.min(this.offsets.maxOffsetY, marginTop);

            this.game.resize(scale).move(marginLeft, marginTop);
        }
    }
}

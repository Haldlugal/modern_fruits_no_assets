class StayGameInContainer {

    /**
     * Игра, для которой используется этот плагин
     */
    private game: Game;

    // Минимальная ширина, до которой отступ по горизонтали делается (меньше уже без отступа)
    private minX = 1200;

    // Минимальная высота, до которой отступ по вертикали делается (меньше уже без отступа)
    private minY = 850;

    private readonly desktop = {
        // Минимальный отступ от краев HTML контейнера игры по горизонтали
        minOffsetX: 120,

        // Минимальный отступ от краев HTML контейнера игры по вертикали
        minOffsetY: 350,

        // Максимальный отступ от верха экрана
        maxOffsetY: 0,
   };

    private readonly mobile = {
        minOffsetX: 0,
        minOffsetY: 0,
        maxOffsetY: 0,
    };

    private readonly ratio: number;

    constructor(game: Game) {

        this.game = game;
        this.ratio = game.app.screen.width / game.app.screen.height;

        this.onResize();
        window.addEventListener('resize', this.onResize.bind(this));
    }

    onResize () {
        const config = RG.Helper.isMobile() ? this.mobile : this.desktop;

        const container = this.game.app.renderer.view.parentNode as HTMLElement;

        let clientWidth = container.clientWidth;
        let clientHeight = container.clientHeight;

        const offsetX = (clientWidth > this.minX) ? config.minOffsetX : 0;
        const offsetY = (clientHeight > this.minY) ? (clientHeight - this.minY) / 2 : 0;

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
            width = clientWidth ;
            height = clientWidth / this.ratio;
        }

        const scale = width / this.game.app.screen.width;
        let marginTop = (container.clientHeight - height) / 2;
        let marginLeft = (container.clientWidth - width) / 2;

        if (config.maxOffsetY) {
            marginTop = Math.min(config.maxOffsetY, marginTop);
        }

        this.game.resize(scale).move(marginLeft, marginTop);
    }
}

import SceneHelper = Component.SceneHelper;

class SlotsSceneBuilder {

    scene: SlotsScene;
    game: Game;

    interactiveElements!: SlotsSceneInteractiveElements;

    private BACKGROUND_SPRITE_DIFF_POSITION_X = 1;
    private BACKGROUND_SPRITE_DIFF_POSITION_Y = 5;

    constructor(scene: SlotsScene, game: Game) {
        this.scene = scene;
        this.game = game;
    }

    /**
     * Method that is invoked only once, when the scene is build
     */
    build() : SlotsSceneInteractiveElements{
        const bg = this.createBackground();
        const winningPoints = this.createWinningLines(bg);
        const reels = this.createReels(winningPoints);
        const startButton = this.createStartButton(bg);
        const initialFreeSpinsComponent = this.createInitialFreeSpins(bg);
        const autoSpinsComponent = this.createAutoSpinsComponent(startButton, bg);
        this.interactiveElements = new SlotsSceneInteractiveElements(bg, winningPoints, reels, startButton, initialFreeSpinsComponent, autoSpinsComponent);
        return this.interactiveElements;
    }

    /**
     * Method that is invoked every time when the stage is loaded
     */
    buildOnLoad() {

    }

    createBackground() {
        const background = Component.SceneHelper.setBackground('slot_bg', this.scene);
        if (RG.Helper.isMobile()) {
            background.scale.set(
                Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x,
                Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y
            );
        }
        return background;
    }

    createWinningLines(background: PIXI.Sprite) : Component.WinPoint[]{
        const winLineBuilder = new WinLineBuilder(this.scene, background);
        return winLineBuilder.build();
    }

    createReels(winningPoints: Component.WinPoint[]) : ReelComponent.Main{
        const reelsComponent = new ReelComponent.Main(
            this.scene,
            this.game.settings.playData.reelsMatrix,
            this.game.settings.help.symbolsMap,
            this.game.settings.stake,
            winningPoints
        );

        reelsComponent!.position.y += 65 + Component.SceneHelper.MOBILE_OFFSET_TOP;
        reelsComponent!.position.x += RG.Helper.isMobile() ? 75 + Component.SceneHelper.LEFT_OFFSET: 105;

        if (RG.Helper.isMobile()) {
            reelsComponent!.scale.set(
                Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x,
                Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y
            );
        }

        return reelsComponent;
    }

    createStartButton(bg: PIXI.Sprite) : RG.Button{
        const startSlotButton = (new RG.Button('start'))
            .remap('disabled', 4);

        let positionX = bg.width
            ? bg.position.x + bg.width / 2 - startSlotButton.width / 2 - 2
            : 675;
        const positionY = bg.height
            ? bg.position.y + bg.height - startSlotButton.height
            : 765;

        startSlotButton.position.set(positionX, positionY - 4);
        this.scene.addChild(startSlotButton);
        if (RG.Helper.isMobile()) {
            startSlotButton.scale.set(1.8);
            startSlotButton.position.set(1295, 320 - Game.mobilePadding);
        }
        return startSlotButton;
    }

    createInitialFreeSpins(bg: PIXI.Sprite) : any {
        const freeSpinStakes = new Component.FreeSpinStakes();
        this.scene.addChild(freeSpinStakes);
        freeSpinStakes.visible = false;
        freeSpinStakes.position.set(
            this.scene.shared.stakes.x + (this.scene.shared.stakes.width - freeSpinStakes.width)/2,
            this.scene.shared.stakes.y + (!RG.Helper.isMobile() ? 40 : 30)
        );

        const freeSpinComponent = new Component.FreeSpin(
            this.game.width,
            this.game.height
        );
        this.scene.addChild(freeSpinComponent);
        // ставим фон
        if (!RG.Helper.isMobile()) {
            freeSpinComponent.x = SceneHelper.LEFT_OFFSET;
        }
        freeSpinComponent.zIndex = 10001;
        freeSpinComponent.setBet(this.game.settings.gambleFreeSpin.bet);
        freeSpinComponent.setSpins(this.game.settings.gambleFreeSpin.spins);
        freeSpinComponent.disable();
        if (this.game.settings.gambleFreeSpin.id !== 0) {
            freeSpinComponent.enable();
        }

        const freeSpinResultsComponent = new Component.FreeSpinResults(this.game.width, this.game.height);
        if (!RG.Helper.isMobile()) {
            freeSpinResultsComponent.x = SceneHelper.LEFT_OFFSET;
        }
        freeSpinResultsComponent.zIndex = 10000;
        freeSpinResultsComponent.disable();

        this.scene.addChild(freeSpinResultsComponent);

        return {initialFreeSpinsTable: freeSpinComponent, initialFreeSpinsStakes: freeSpinStakes, results: freeSpinResultsComponent};
    }

    getBackgroundDisablePosition(backgroundSprite: PIXI.Sprite) {
        // ставим фон
        const backgroundPositionX = backgroundSprite.position.x
            ? backgroundSprite.position.x - this.BACKGROUND_SPRITE_DIFF_POSITION_X
            : 0;
        const backgroundPositionY = backgroundSprite.position.y
            ? backgroundSprite.position.y - Component.SceneHelper.TOP_OFFSET - this.BACKGROUND_SPRITE_DIFF_POSITION_Y
            : 0;

        return {
            x: backgroundPositionX,
            y: backgroundPositionY
        }
    }

    createAutoSpinsComponent(startButton: RG.Button, background: PIXI.Sprite) {
        const isMobile = RG.Helper.isMobile();
        const autoSpinButton = new RG.Button('auto_spin').remap('disabled', 4);
        const stopAutoSpinButton = new RG.Button('auto_stop');
        stopAutoSpinButton.visible = false;

        let positionXAutoSpinButton = startButton.position.x
            ? startButton.position.x + startButton.width + SlotsScene.MARGIN_BETWEEN_BUTTON
            : 825;

        const positionYAutoSpinButton = background.height
            ? background.position.y + background.height - autoSpinButton.height
            : 820;

        const positionYAutoSpinComponent = background.height
            ? background.position.y + background.height + 3
            : 908;

        const autoSpinComponent = new Component.AutoSpin(
            this.game.settings.autoPlayData,
            this.scene.shared.stakes.getValue(),
            this.game.width,
            this.game.height,
            !RG.Helper.isMobile() ? positionXAutoSpinButton : 0,
            !RG.Helper.isMobile() ? positionYAutoSpinComponent : -Game.mobilePadding,
            background.width,
            this.scene.height + Game.mobilePadding
        );
        this.scene.addChild(autoSpinComponent);
        autoSpinComponent.zIndex = 1010;

        const loadingTextStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#fbe595'
        });

        //TODO: вот эти 2 маленьких компонента надо загнать в общий компонент
        const spinsCountComponent = new PIXI.Text( '0', loadingTextStyle);
        const infiniteSpinsCount = new PIXI.Sprite(PIXI.Texture.from('infinity'));

        this.scene.addChild(autoSpinButton).position.set(positionXAutoSpinButton, positionYAutoSpinButton - 4);
        this.scene.addChild(stopAutoSpinButton).position.set(positionXAutoSpinButton, positionYAutoSpinButton - 4);

        this.scene.addChild(spinsCountComponent).position.set(
            stopAutoSpinButton.x + (stopAutoSpinButton.width - spinsCountComponent.width)/2,
            stopAutoSpinButton.y + (stopAutoSpinButton.height - spinsCountComponent.height)/2
        );
        this.scene.addChild(infiniteSpinsCount).position.set(
            stopAutoSpinButton.x + (stopAutoSpinButton.width - infiniteSpinsCount.width)/2,
            stopAutoSpinButton.y + (stopAutoSpinButton.height - infiniteSpinsCount.height)/2
        );

        spinsCountComponent.visible = false;
        infiniteSpinsCount.visible = false;

        if (isMobile) {
            autoSpinButton.scale.set(1.8);
            stopAutoSpinButton.scale.set(1.8);
            const xPos = startButton.x + (startButton.width - autoSpinButton.width )/2;
            const yPos = startButton.y + startButton.height + 30 ;
            autoSpinButton.position.set(xPos, yPos);
            stopAutoSpinButton.position.set(xPos, yPos);
            spinsCountComponent.position.set(
                stopAutoSpinButton.x + (stopAutoSpinButton.width - spinsCountComponent.width)/2,
                stopAutoSpinButton.y + (stopAutoSpinButton.height - spinsCountComponent.height)/2
            );
            infiniteSpinsCount.position.set(
                stopAutoSpinButton.x + (stopAutoSpinButton.width - infiniteSpinsCount.width)/2,
                stopAutoSpinButton.y + (stopAutoSpinButton.height - infiniteSpinsCount.height)/2
            );
        }

        return {table: autoSpinComponent, openButton: autoSpinButton, stopButton: stopAutoSpinButton, spinsCount: spinsCountComponent, infiniteSpins: infiniteSpinsCount};
    }
}

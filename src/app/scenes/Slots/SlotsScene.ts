///<reference path="../BaseScene.ts"/>
class SlotsScene extends BaseScene {

    builder: SlotsSceneBuilder;
    presenter: SlotsScenePresenter;
    interactiveElements!: SlotsSceneInteractiveElements;

    public static MAIN_MARGIN_TOP = 4;
    public static MARGIN_BETWEEN_BUTTON = 10;

    constructor(game:Game) {
        super(game);
        this.builder = new SlotsSceneBuilder(this, this.game);
        this.presenter = new SlotsScenePresenter(this, this.game);
    }

    setup(): void {
        this.interactiveElements = this.builder.build();
        this.setupReels();
        this.setupStartButton();
        this.setupFreeSpins();
        this.setupAutoSpin();
        this.onSetupComplete();

    }

    setupShared() {
        this.addChild(this.shared.logo);
        this.addChild(this.shared.soundManagerComponent);
        this.addChild(this.shared.helpButton);
        this.addChild(this.shared.balance);
        this.addChild(this.shared.stakes);
        this.addChild(this.shared.stakes.on('change', this.interactiveElements.reels.setStake, this.interactiveElements.reels));
        this.shared.stakes.on('change', this.interactiveElements.autoSpins.table.setStake, this.interactiveElements.autoSpins.table);
        this.shared.soundManagerComponent.zIndex = 1000;
    }

    setupStartButton() {
        this.interactiveElements.startButton
            .on('click', () => {
                this.presenter.playSlots();
                // this.playSlots();
            });
    }

    setupAutoSpin() {
        this.interactiveElements.autoSpins.table.on('autospin', (settings: AutoPlaySettings) => {
            this.presenter.startAutoSpins(settings);
        });
        this.interactiveElements.autoSpins.openButton
            .on('click', () => {
                this.presenter.openAutoSpinsTable();
            });
        this.interactiveElements.autoSpins.stopButton
            .on('click', () => {
                this.presenter.stopAutoSpinsPlaying();
            });
    }

    setupReels() {
        this.interactiveElements.reels
            .on('spin.win-wait', (status: Logic.WinWaitStatus) => {
                this.presenter.switchReelsWinWaitStatus(status);
                this.presenter.playWinWaitSoundEffects();
            })
            .on('spin.stop', (index: number) => {
                this.presenter.playWinWaitStopSoundEffect(index);
            });
    }

    setupFreeSpins(){
        this.interactiveElements.initialFreeSpins.initialFreeSpinsTable.on('cancel_clicked', () => {
            this.presenter.switchOffInitialFreeSpins();
        });
        this.interactiveElements.initialFreeSpins.initialFreeSpinsTable.on('ok_clicked', () => {
            this.presenter.acceptFreeSpins();
        });
        this.interactiveElements.initialFreeSpins.results.on('ok_clicked', () => {
            this.presenter.freeSpinsResultsOkClicked();
        });
    }

    onSetupComplete() {
        //Посылаем ивент для того, чтобы после загрузки сцены сменить бэкграунд
        const event = new Event('slots_scene_ready');
        document.dispatchEvent(event);
        this.state = RG.Abstract.SceneState.LOAD;
    }

    onProcess(delta: number): void {
    }

    async onLoad(delta: number, first: boolean) {
        super.onLoad(delta, first);
        this.setupShared();

        if (this.game.settings.previousSceneName === 'FreeSpinScene') {
            this.playSlotsAmbient();
            this.shared.helpButton.disable(false);
        }

        this.presenter.checkForSymbolsPreset();
        this.resetVisualState();
        this.presenter.checkAutoSpinsOnPause();
    }

    onFinalize(delta: number, first: boolean) {
        super.onFinalize(delta, first);

        if (first) {
            this.interactiveElements.reels.stopWonEffects();
            this.shared.stakes.off('change', this.interactiveElements.reels.setStake, this.interactiveElements.reels);
        }
    }

    resetVisualState() {
        this.interactiveElements.autoSpins.table.visible = false;
        this.interactiveElements.reels.reset();
    }

    beginPlayingSlots(callback: () => void) {
        this.interactiveElements.reels.spin(callback);
    }

    renewFreeSpinsStakes(amount: number) {
        this.interactiveElements.initialFreeSpins.initialFreeSpinsStakes.setSpins(amount);
    }

    onFreeSpinsDecline() {
        this.interactiveElements.initialFreeSpins.initialFreeSpinsTable.disable();
        Locker.unlock(this);
    }

    onFreeSpinsAccept() {
        this.shared.stakes.visible = false;
        this.interactiveElements.initialFreeSpins.initialFreeSpinsTable.disable();
        this.interactiveElements.initialFreeSpins.initialFreeSpinsStakes.visible = true;
        this.interactiveElements.initialFreeSpins.initialFreeSpinsStakes.setBet(this.game.settings.gambleFreeSpin.bet);
        this.interactiveElements.initialFreeSpins.initialFreeSpinsStakes.setSpins(this.game.settings.gambleFreeSpin.spins);
        Locker.unlock(this);
    }
    onFreeSpinsError() {
        this.interactiveElements.initialFreeSpins.initialFreeSpinsTable.disable();
        this.interactiveElements.initialFreeSpins.initialFreeSpinsStakes.visible = false;
        this.shared.stakes.visible = true;
    }

    onAutoSpinsStarted(settings: AutoPlaySettings) {
        this.interactiveElements.autoSpins.table.visible = false;
        this.interactiveElements.autoSpins.stopButton.visible = true;
        this.interactiveElements.autoSpins.openButton.visible = false;
        this.presenter.playAutoSpin(settings);
    }

    onAutoSpinsTableOpened() {
        this.interactiveElements.autoSpins.table.visible = true;
    }

    /**
     * Stop button was pressed
     */
    onAutoSpinsStopped() {
        this.interactiveElements.autoSpins.stopButton.visible = false;
        this.interactiveElements.autoSpins.openButton.visible = true;
        this.interactiveElements.autoSpins.spinsCount.visible = false;
        this.interactiveElements.autoSpins.infiniteSpins.visible = false;
    }

    /**
     * Autospins ended by another cause
     */
    onAutoSpinsEnded() {
        this.interactiveElements.autoSpins.spinsCount.visible = false;
        this.interactiveElements.autoSpins.stopButton.visible = false;
        this.interactiveElements.autoSpins.openButton.visible = true;
        this.interactiveElements.autoSpins.infiniteSpins.visible = false;

        this.interactiveElements.startButton.disable(false);
        this.interactiveElements.autoSpins.openButton.disable(false);
        this.shared.helpButton.disable(false);
        this.shared.stakes.enable();
    }

    setBalance(amount: number) {
        this.shared.balance.setValue(amount);
    }

    setAutoSpinsToInfiniteMode() {
        this.interactiveElements.autoSpins.infiniteSpins.visible = true;
        this.interactiveElements.autoSpins.spinsCount.visible = false;
    }

    setAutoSpinsToNormalMode(amount: number) {
        this.interactiveElements.autoSpins.spinsCount.text = String(amount);
        this.interactiveElements.autoSpins.spinsCount.x = this.interactiveElements.autoSpins.stopButton.x + (this.interactiveElements.autoSpins.stopButton.width - this.interactiveElements.autoSpins.spinsCount.width)/2;
        this.interactiveElements.autoSpins.spinsCount.visible = true;
        this.interactiveElements.autoSpins.infiniteSpins.visible = false;
    }

    enableAutoSpinStopButton() {
        this.interactiveElements.autoSpins.stopButton.visible = true;
        this.interactiveElements.autoSpins.openButton.visible = false;
    }

    sendResultToReels(result: PlayRoundResult) {
        this.interactiveElements.reels.setResult(result);
    }

    beforePlayingSlots() {
        this.interactiveElements.startButton.disable();
        this.interactiveElements.autoSpins.openButton.disable();
        this.shared.helpButton.disable();
        this.shared.stakes.disable();
    }

    async playBalanceEffect() {
        await this.shared.balance.effect!.to(this.game.settings.balance).playAndDestroy();
    }

    async normalRoundResultEffectsBegin(roundWon: boolean) {
        if (roundWon) {
            await this.interactiveElements.reels.showWonLinesOnce();
        }
    }

    async playWonEffect(delayWinEffect: boolean) {
        await this.interactiveElements.reels.playWonEffects();
    }

    async playLostEffects() {
        this.shared.balance.setValue(this.game.settings.balance);
    }

    normalRoundEnded() {
        this.interactiveElements.startButton.disable(false);
        this.interactiveElements.autoSpins.openButton.disable(false);
        this.shared.helpButton.disable(false);
        this.shared.stakes.enable();
    }

    playSpecialWinEffect(mode: string, wonAmount: number, autoSpins: boolean) : Promise<void> {
        return new Promise((resolve) => {
            // По дефолту - для big вина
            let pause = 3000;
            let numberPlayTime = 1000;
            let bounceRepeat = 0;

            switch (mode) {
                case 'super':
                    pause = 3000;
                    numberPlayTime = 2000;
                    bounceRepeat = 0;
                    break;

                case 'mega':
                    pause = 4000;
                    numberPlayTime = 5000;
                    bounceRepeat = 3;
                    break;
            }
            this.interactiveElements.reels.stopWonEffects();
            this.lock();
            Utils.Pause.delay(0). then(() => {
                (new Effect.WinCongratulations(this, 'win_' + mode + '_win', 1, true, 0, -1, -4))
                    .setTimings(2000, 300, pause)
                    .setNumberValues(wonAmount, numberPlayTime)
                    .setContentWidth(this.interactiveElements.background.width)
                    .moveSprites((RG.Helper.isMobile() ? 40 : 0), 0)
                    .playAndDestroy()
                    .then(() => {
                        this.shared.balance.effect!.to(this.game.settings.balance).playAndDestroy().then(() => {
                            resolve();
                            this.unlock();
                        });
                        if (!autoSpins) {
                            this.interactiveElements.reels.playWonEffects();
                        }
                    });
                RG.GameSound.instance.play(mode + "_win");
            });
        });
    }

    setAutoSpins(spinsCount: number) {
        this.interactiveElements.autoSpins.spinsCount.text = String(spinsCount);
        this.interactiveElements.autoSpins.spinsCount.x = this.interactiveElements.autoSpins.stopButton.x + (this.interactiveElements.autoSpins.stopButton.width - this.interactiveElements.autoSpins.spinsCount.width)/2;
    }

    /**
     * Это тестовый метод для старта фриспинов
     */
    startFreeSpins() {
        this.game.startFreeSpin(new PlayRoundRequest(this.game.settings.stake)).then((res: FreeSpinData)=>{
            Locker.lock(this, this.width, this.height);
            this.game.settings.gambleFreeSpin.id = res.id;
            this.interactiveElements.initialFreeSpins.initialFreeSpinsTable.enable();
            this.interactiveElements.initialFreeSpins.initialFreeSpinsTable.setBet(res.bet);
            this.interactiveElements.initialFreeSpins.initialFreeSpinsTable.setSpins(res.spins);
        });
    }

    showFreeSpinResults(amountWon: number) {
        Locker.lock(this, this.width, this.height);
        this.interactiveElements.initialFreeSpins.results.setWinValue(amountWon);
        this.interactiveElements.initialFreeSpins.results.enable();
    }

    onFreeSpinsResultsOkClicked() {
        this.interactiveElements.initialFreeSpins.results.disable();
        this.shared.stakes.visible = true;
        this.interactiveElements.initialFreeSpins.initialFreeSpinsStakes.visible = false;
        Locker.unlock(this);
    }

    public testReel(name: string) {
        this.interactiveElements.autoSpins.openButton.disable();

        // дизаблим кнопки и компоненты
        this.shared.helpButton.disable();
        this.shared.stakes.disable();
        this.interactiveElements.startButton.disable();

        this.interactiveElements.reels.spin(() => {
            this.interactiveElements.startButton.disable(false);
            this.interactiveElements.autoSpins.openButton.disable(false);
            this.shared.helpButton.disable(false);
            this.shared.stakes.enable();
            this.playSpecialWinEffect(name, 14400, false);
        });

        let result: PlayRoundResult;

        switch (name) {
            case 'mega':
                result = new PlayRoundResult({
                    adapter_play_data: {
                        symbols_position_indexes: [
                            [4,3,1,2,0],
                            [6,6,6,6,6],
                            [3,5,4,1,2]
                        ]
                    }
                }, 0, [name]);
                break;
            case 'big':
                result = new PlayRoundResult({
                    adapter_play_data: {
                        symbols_position_indexes: [
                            [4,3,1,2,0],
                            [0,1,5,3,6],
                            [4,4,4,4,2]
                        ]
                    }
                }, 0, [name]);
                break;
            case 'super':
                result = new PlayRoundResult({
                    adapter_play_data: {
                        symbols_position_indexes: [
                            [1,1,1,1,1],
                            [0,1,5,3,6],
                            [1,1,1,1,1]
                        ]
                    }
                }, 0, [name]);
                break;
            default:
                result = new PlayRoundResult({}, 0, []);
        }
        setTimeout(() => {
            this.interactiveElements.reels.setResult(result);
        }, 200);
    }

    playSlotsAmbient() {
        RG.AmbientSound.instance.stopAll();
        RG.AmbientSound.instance.setConfig([
                {
                    asset: 'ambient_drum_',
                    variants: [1, 2],
                    simultaneously: [1, 1, 2]
                },
                {
                    asset: 'ambient_theme_',
                    variants: [1, 2, 3],
                    simultaneously: [0, 1, 2]
                },
                {
                    asset: 'ambient_effect_',
                    variants: [1, 2, 3, 4],
                    simultaneously: [1, 2]
                }
            ]
        );
        RG.AmbientSound.instance.playDefault();
    }

    playFreeSpinsAmbient() {
        RG.AmbientSound.instance.stopAll();
        RG.AmbientSound.instance.setConfig([
                {
                    asset: 'free_spins_ambient_drum_',
                    variants: [1, 2],
                    simultaneously: [2]
                },
                {
                    asset: 'free_spins_ambient_theme_',
                    variants: [1, 2, 3],
                    simultaneously: [1, 2, 2]
                },
                {
                    asset: 'free_spins_ambient_effect_',
                    variants: [1, 2, 3],
                    simultaneously: [1, 2, 2, 3]
                }
            ]
        );
        RG.AmbientSound.instance.playDefault();
    }

    setupAutoSpinsForDebug(spinsCount: number) {
        this.interactiveElements.autoSpins.table.visible = false;
        this.interactiveElements.autoSpins.stopButton.visible = true;
        this.interactiveElements.autoSpins.openButton.visible = false;
        this.interactiveElements.autoSpins.spinsCount.text = String(spinsCount);
        this.interactiveElements.autoSpins.spinsCount.x = this.interactiveElements.autoSpins.stopButton.x + (this.interactiveElements.autoSpins.stopButton.width - this.interactiveElements.autoSpins.spinsCount.width)/2;
        this.interactiveElements.autoSpins.spinsCount.visible = true;
        this.interactiveElements.autoSpins.infiniteSpins.visible = false;
    }

    restoreStake(): number {
        return this.shared.stakes.getValue()
    }

    forceSetSymbols(matrix: ReelsMatrix) {
        this.interactiveElements.reels.stopWonEffects();
        this.interactiveElements.reels.forceSetSymbols(matrix);
    }
}

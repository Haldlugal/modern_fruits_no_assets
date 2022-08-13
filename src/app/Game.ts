///<reference path="../rg/Abstract/Game.ts"/>
class Game extends RG.Abstract.Game {

    protected api: GameApi;

    // настройки игры
    public settings: GameSettings;

    // Набор сцен игры
    protected scenes: BaseScene[] = [];

    // Имя стартовой сцены
    protected startSceneName: string = 'StartScene';

    // набор компонент, расшаренных между сценами
    public sharedComponents: SharedComponents;

    // Отношение котейнера игры в видимых размерах html / внутренние размеры игры
    public scale: number = 1;

    // ширина игры (внутренние размеры PIXI)
    public width: number;

    // высота игры (внутренние размеры PIXI)
    public height: number;

    //Отступ для мобилок
    public static mobilePadding = 40;

    // PIXI Application
    public app: PIXI.Application;

    public devMode: boolean;

    public heartBeating = true;

    /**
     * @param container  HTMLElement, куда встраивается app
     * @param api GameApi - работа с данными
     * @param token - user token
     * @param devMode - режим разработки
     */
    constructor(container: HTMLElement, api: GameApi, devMode: boolean = false) {
        super(container, api);

        this.api = api;

        const isMobile = RG.Helper.isMobile();
        this.devMode = devMode;
        this.width = isMobile ? 1570 : 1464;
        this.height = isMobile ? 885 : 1009;

        RG.Utils.Cookie.prefix ='Book_of_AT';
        RG.AmbientSound.instance.setConfig([
                // {
                //     asset: 'ambient_drum_',
                //     variants: [1, 2],
                //     simultaneously: [1, 1, 2]
                // },
                {
                    asset: 'game_ambience_',
                    variants: [1],
                    simultaneously: [ 1]
                }
                // {
                //     asset: 'ambient_effect_',
                //     variants: [1, 2, 3, 4],
                //     simultaneously: [1, 2]
                // }
            ]
        );
        RG.AmbientSound.instance.setup(0.3);
        RG.GameSound.instance.setup(1);
        this.settings = new GameSettings({});

        this.sharedComponents = new SharedComponents(this);
        this.app = this.createApplication();
    }

    heartBeat () {
        if (this.heartBeating) {
            this.api
                .heartBeat()
                .then((data) => {
                    setTimeout(() => this.heartBeat(), 30000)
                })
                .catch((e) => {
                    this.currentScene!.errorMessage(e, 'NOTICE');
                });
        }
    }

    /**
     * Создание сцен, используемых в приложении
     */
    protected initScenes(): void {
        this.scenes.push(
            new StartScene(this),
            new SlotsScene(this),
            new HelpScene(this),
        );
    }

    /**
     * Создание плагинов, используемых в приложении
     */
    protected initPlugins(): void {
        new StayGameInContainer(this);
    }

    /**
     * Заресайзить контейнер игры в указанное кол-во раз относительно оригинального размера
     */
    resize(scale: number): this {
        this.app.renderer.view.style.width = (this.app.renderer.view.width * scale) + 'px';
        this.app.renderer.view.style.height = (this.app.renderer.view.height * scale) + 'px';
        if(RG.Helper.isMobile()) {
            this.onChangeLayout((document.documentElement.clientWidth / document.documentElement.clientHeight) > 1);
        }
        this.scale = scale;
        if (this.currentScene)
            this.currentScene.onResize();
        return this;
    }

    onChangeLayout(isHorizontal: boolean) {
    }

    /**
     * Указать отступы контейнера с игрой
     */
    move(left: number, top: number): this {
        this.app.renderer.view.style.marginLeft = left + 'px';
        this.app.renderer.view.style.marginTop = top + 'px';
        return this;
    }

    fullScreen(enable: boolean = true): Promise<void> {
        return (enable) ? Utils.FullScreen.open(document.documentElement) : Utils.FullScreen.close();
    }

    /**
     * Инициализация соединения с backend (создание игровой сессии)
     */
    async initBackend(): Promise<boolean> {
        if (!this.api.token) {
            return this.api.open();
        }
        return true;
    }



    switchTo(name: string) {
        if (this.devMode) {
            const event = new CustomEvent('scene_switched', {'detail': {scene_name: name, debug: this.settings.debugMode}});
            document.dispatchEvent(event);
        }
        this.settings.previousSceneName = this.currentScene ? this.currentScene.name : '';
        super.switchTo(name);
    }

    /**
     * Получение настроек игры и данных игровой сессии из backend
     */
    public initSettings(): Promise<void> {
        return this.api.init().then((settings: GameSettings) => {
            this.settings = settings;
        });
    }

    /**
     * Один раунд игры
     */
    public playRound(request: PlayRoundRequest | TestRoundRequest): Promise<PlayRoundResult> {
        return new Promise<PlayRoundResult>((resolve, reject) => {
            this.api.playRound(request, this.settings.specialWinStage).then((result: PlayRoundResult) => {
                this.settings.balance = result.balance;
                this.settings.roundId = result.round_id;
                this.settings.gamblingData.history = result.gambleHistory;
                resolve(result);
            }).catch((e) => {
                if (e.error && e.error.code === 10007) {
                    reject(e);
                    return;
                }
                this.currentScene!.errorMessage(e, 'NOTICE');
                if (e.message === 'Network Error') {
                    this.restore(resolve, PlayRoundResult, {name: 'playRound', payload: request},  this.settings.stake, this.settings.specialWinStage);
                }
            });
        });
    };

    public playTestRound(request: TestRoundRequest): Promise<PlayRoundResult> {
        return this.api.playTestRound(request, this.settings.specialWinStage).then((result: PlayRoundResult) => {
            this.settings.balance = result.balance;
            return result;
        });
    };

    public startAutoSpin(request: AutoPlayDataRequest): Promise<AutoPlayResponse> {
        return new Promise<AutoPlayResponse>((resolve, reject) => {
            return this.api.startAutoSpin(request).then((result: AutoPlayResponse) => {
                resolve(result);
            }).catch((e) => {
                this.currentScene!.errorMessage(e, 'NOTICE');
                if (e.message === 'Network Error') {
                    this.restore(resolve, AutoPlayResponse, {name: 'startAutoSpin'});
                }
            });
        });
    }

    public startFreeSpin(request: PlayRoundRequest): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            return this.api.startFreeSpin(request,  this.settings.specialWinStage).then((result: PlayRoundResult) => {
                resolve(result);
            }).catch((e) => {
                this.currentScene!.errorMessage(e, 'NOTICE');
                if (e.message === 'Network Error') {
                    this.restore(resolve, AutoPlayResponse, {name: 'startFreeSpin'});
                }
            });
        });
    }

    public acceptFreeSpin(id: number): (Promise<FreeSpinData | null>) {
        if (this.settings.gambleFreeSpin.needAccept) {
            return this.api.acceptFreeSpin(id).then((result: FreeSpinData) => {
                this.settings.gambleFreeSpin = result;
                return result;
            });
        } else return Promise.resolve(null);
    }

    public restore(resolve: (result: any) => void, type: any, method: any, ...arg: any): Promise<any> {
        return this.api.restore(this.settings.roundId === null ? -1: this.settings.roundId, type, ...arg).then((result)=>{
            switch (method.name) {
                case 'playRound': {
                    if (result.round_id === this.settings.roundId) {
                        this.api.playRound(method.payload, this.settings.specialWinStage).then(res=>{
                            resolve(res);
                        })
                    } else {
                        resolve(result);
                    }
                    this.currentScene!.hideErrorMessage();
                    break;
                }
                default: {
                    this.currentScene!.hideErrorMessage();
                    resolve(result);
                    break;
                }
            }
        }).catch((e) => {
            console.dir(e);
            setTimeout(() => this.restore(resolve,  type, method, ...arg), 2500)
        });
    }

    protected setTranslations(): this {
        {
            RG.Translator.set({
                "E_OPEN_GAME_TITLE": "ERROR (1)",
                "E_OPEN_GAME_MESSAGE": "Connection problem\n\nplease reload page",
                "E_INIT_GAME_TITLE": "ERROR (2)",
                "E_INIT_GAME_MESSAGE": "Connection problem\n\nplease reload page",
                "E_PLAY_ROUND_TITLE": "ERROR (3)",
                "E_PLAY_ROUND_MESSAGE": "Connection problem\n\nCan not get results from backend\n\nplease reload page"
            });
            return this;
        }
    }

    public testEffect (name: string) {
        if (this.currentScene!.name !== 'SlotsScene') {
            return false;
        }
        const scene = (this.currentScene! as SlotsScene);
        if (name === 'freeSpin') {
            this.settings.freeSpinDebugMode = Utils.FreeSpinDebugMode.FS_STATUS_NORMAL;
            scene.presenter.playSlots(new TestRoundRequest(this.settings.stake, 1, 200, 1));
        } else if (name === 'freeSpinVictory') {
            this.settings.freeSpinDebugMode = Utils.FreeSpinDebugMode.FS_STATUS_VICTORY;
            scene.presenter.playSlots(new TestRoundRequest(this.settings.stake, 1, 200, 1));
        } else if (name === 'freeSpinLooser') {
            this.settings.freeSpinDebugMode = Utils.FreeSpinDebugMode.FS_STATUS_LOST;
            scene.presenter.playSlots(new TestRoundRequest(this.settings.stake, 1, 200, 1));
        } else if (name === 'freeSpinPlus') {
            this.settings.freeSpinDebugMode = Utils.FreeSpinDebugMode.FS_STATUS_PLUS;
            scene.presenter.playSlots(new TestRoundRequest(this.settings.stake, 1, 200, 1));
        } else if (name === 'winSpin') {
            scene.presenter.playSlots(new TestRoundRequest(this.settings.stake, 13, 20));
        } else if (name === 'autoSpin')
            scene.presenter.playAutoSpin(new AutoPlaySettings(200 * this.settings.stake, 200 * this.settings.stake, 5, false), true);
        else {
            scene.testReel(name);
        }
    }

    public resetFreeSpinsDebugMode() {
        this.settings.freeSpinDebugMode = Utils.FreeSpinDebugMode.FS_STATUS_NORMAL;
    }
}

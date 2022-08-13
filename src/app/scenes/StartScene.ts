///<reference path="./BaseScene.ts"/>

class StartScene extends BaseScene {

    private mainView?: Component.StartLoader;

    onTap() {
        this.game.fullScreen(true)
            .then(() => {
                window.removeEventListener('touchstart', this.onTap.bind(this));
            })
            .catch(() => {});
    }

    onLoad(delta: number, first: boolean) {
        super.onLoad(delta, first);
        if (first && RG.Helper.isMobile()) {
            // window.addEventListener('touchstart', this.onTap.bind(this));
        }
    }

    onResize() {
        const view = this.mainView!;

        // Максимальный видимый размер картинки
        const viewMax = RG.Helper.isMobile()
            ? {width: 1200, height: 1200}
            : {width: 800, height: 600};

        // Максимальный размер картинки, который влезет в контейнер с верхним ограничением в терминах PIXI размеров
        const max = {
            height: Math.min(viewMax.height / this.game.scale, this.game.height),
            width: Math.min(viewMax.width / this.game.scale, this.game.width)
        };

        if (view) {
            view.fitTo(max.width, max.height);
        }
    }

    /**
     * Настройка сцены
     */
    async setup() {
        const loader = PIXI.Loader.shared;

        //Если у нас мобилка, то возвращаем смещение стартовой сцены по вертикали в ноль (а так есть паддинг)
        const url = RG.Helper.isMobile() ? 'assets/mobile.json' : 'assets/desktop.json';
        const assets = new RG.Assets(url, loader);

        if (! await assets.fetch()) {
            this.errorMessage('E_OPEN_GAME_MESSAGE', 'E_OPEN_GAME_TITLE');
            return;
        }

        // подгрузим ресурсы для отображения загрузчика
        if (! await assets.load(0)) {
            this.errorMessage('E_OPEN_GAME_MESSAGE', 'E_OPEN_GAME_TITLE');
            return;
        }

        this.mainView = new Component.StartLoader();
        this.addChild(this.mainView).position.set(this.game.width / 2, this.game.height / 2);

        this.mainView.button
            .on('click', () => {
                this.switchScene();
            });

        this.onResize();

        // меняем статус сцены на ЗАГРУЗКА
        this.state = RG.Abstract.SceneState.LOAD;

        // а теперь пытаемся подготовить работу с backend-ом (установить соединение)
        // и в удачном случае продолжаем загрузку
        this.game.initBackend()
            .then(() => {
                // Пока грузятся все ресурсы, стягиваем настройки игры с backend-а
                const initSettingsPromise = this.game.initSettings();
                let i = 0;
                loader.onProgress.add((loader: any) => {
                    i++;
                    return this.mainView!.progress.setValue(loader.progress)
                });

                assets.load(1).then((ok: boolean) => {
                    // Все ресурсы загружены,
                    // теперь ожидаем завершения инициализации
                    initSettingsPromise.then(() => {
                        this.mainView!.displayButton();
                        this.on('key_pressed', (key: KeyboardEvent)=>{
                            if (key.code === 'Space') {
                                this.switchScene();
                            }
                        });
                    })
                        .catch((e) => {
                            console.log('error', e);
                            this.errorMessage(e, 'NOTICE');
                        });
                    this.game.heartBeat();
                })
                    .catch((e)=>{
                        console.log('backend error');
                        console.log('error on loading', e);
                    });
            })
            .catch((e) => {
                this.errorMessage(e, 'NOTICE');
            });
    }

    switchScene() {
        this.game.switchTo('SlotsScene');

    }
}

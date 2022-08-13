namespace Component.Sound {

    export class Manager extends PIXI.Container {

        private readonly volumeSettings: VolumeSettings;

        public soundButton: SoundButton;
        private previousSoundEffectVolume = 0;
        private previousAmbientVolume = 0;
        private volumeOpened = false;
        private readonly DISPLAY_DELAY = 500;

        constructor(gameWidth: number, gameHeight: number, sbPosX: number, sbPosY: number, sbScale: number) {
            super();

            //Кнопка панели с громкостями
            this.soundButton = new SoundButton();
            this.soundButton.position.set(sbPosX, sbPosY);
            this.soundButton.scale.set(sbScale);
            this.addChild(this.soundButton);

            const gameSound = RG.GameSound.instance;
            const ambientSound = RG.AmbientSound.instance;

            //Берем значения громкости звуков и перерисовывем иконку
            this.previousSoundEffectVolume = gameSound.getVolume();
            this.previousAmbientVolume = ambientSound.getVolume();

            this.redrawSoundButton();

            //Панель
            this.volumeSettings = new VolumeSettings(gameSound.getVolume(), ambientSound.getVolume());
            this.volumeSettings.position.set(
                this.soundButton.x - (this.volumeSettings.width - this.soundButton.width),
                this.soundButton.y + this.soundButton.height
            );
            this.volumeSettings.visible = false;
            this.addChild(this.volumeSettings);

            //Обработчики на выбор звука
            this.volumeSettings
                .on('sound_effect_choice', (choice: number) => {
                    gameSound.setVolume(choice);
                    this.redrawSoundButton();
                })
                .on('ambient_sound_choice', (choice: number) => {
                    ambientSound.setVolume(choice);
                    this.redrawSoundButton();
                });

            this.soundButton
                .on('open_volume', () => {
                    this.showVolumeComponent();
                    this.volumeOpened = true;
                }).on('mouseout', () => {
                this.hideVolumeComponent();
            });

            this.volumeSettings
                .on('mouseover', () => {
                    this.volumeOpened = true;
                }).on('mouseout', () => {
                this.hideVolumeComponent();
            });

            //Тык в кнопку звука переключает звук
            this.soundButton.on('switch_sounds', () => {
                this.volumeSettings.switch();
            });

            //Ну и после создания этого компонента включаем фоновую музыку
            ambientSound.playDefault();
        }

        redrawSoundButton() {
            if (RG.GameSound.instance.getVolume() > 0 || RG.AmbientSound.instance.getVolume() > 0) {
                this.soundButton.soundOn();
            } else {
                this.soundButton.soundOff();
            }
        }

        showVolumeComponent() {
            this.soundButton.isVolumeOpened = true;
            this.volumeSettings.visible = true;
        }

        async hideVolumeComponent() {
            this.volumeOpened = false;
            await RG.Helper.sleep(this.DISPLAY_DELAY);
            if (!this.volumeOpened) {
                this.soundButton.isVolumeOpened = false;
                this.volumeSettings.visible = false;
            }
        }
    }
}

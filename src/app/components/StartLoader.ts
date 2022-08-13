namespace Component {

    import Button = RG.Button;

    export class StartLoader extends PIXI.Sprite {

        private readonly _progress: StartLoaderProgressBar;
        private readonly _button: Button;

        public get button(): Button {
            return this._button;
        }

        public get progress(): StartLoaderProgressBar {
            return this._progress;
        }

        constructor() {
            super(PIXI.Texture.from('loader_image'));
            this.anchor.set(0.5, 0.5);

            this._progress = new StartLoaderProgressBar();
            this.addChild(this._progress).position.set(- this._progress.width/2, 40);

            this._button = new Button('loader_start', true);
            this._button.label = new RG.Text('TAP_TO_START', {
                fontSize: 30,
                fill: '#301805',
                fontFamily: 'Roboto',
                fontWeight: 800
            });
            this.button.position.set(-this.button.width/2, 30);

            this._button.visible = false;
            this.addChild(this._button);
        }

        fitTo(width: number, height: number): this {
            const scale = Math.min(width / this.width, height / this.height);
            this.scale.x = this.scale.y = this.scale.x * scale;
            return this;
        }

        displayButton(): this {
            this._progress.visible = false;
            this._button.label!.text = 'TAP_TO_START';
            this._button.visible = true;
            return this;
        }
    }
}

namespace Component {

    export class GambleSettings extends PIXI.Container {
        private PADDING_VERTICAL = 40;
        private MARGIN_LEFT = 0;
        private DIFF_WIDTH_GAMBLE_AMOUNT = 310;
        private fromValueComponent?: RG.Text;
        private maxValueComponent?: RG.Text;
        private gambleAmountComponent?: GambleAmount;
        private maxValue?: number;
        private fromValue?: number;
        private targetValue?: number;
        private step: number;
        private backgroundSprite?: PIXI.Sprite;
        private backgroundXPosition: number = 0;
        private backgroundYPosition: number = 0;

        constructor(width = 0, height = 0) {
            super();
            const isMobile = RG.Helper.isMobile();
            console.log('mobile from gamble settings', isMobile);
            this.interactive = true;
            this.step = 1;

            if(isMobile) {
                this.MARGIN_LEFT = 0;
            }

            const graphics = isMobile
                ? (new PIXI.Graphics())
                    .lineStyle(!isMobile ? 6 : 0, 0xb7aa64, 0.75)
                    .beginFill(0x24190b, 1)
                    .drawRoundedRect(0, 0, width, height, 16)
                    .endFill()
                : PIXI.Sprite.from('modal_bg');
            this.addChild(graphics);

            // Название
            const title = new Text('GAMBLE_POPUP_TITLE', {fontSize: !RG.Helper.isMobile() ? 38 : 63});
            title.position.set(
                (graphics.width - title.width) / 2,
                !RG.Helper.isMobile() ? - title.height - this.PADDING_VERTICAL : this.PADDING_VERTICAL
            );

            graphics.addChild(title);

            let offset = this.PADDING_VERTICAL;

            //Компонент выбора ставки
            const gambleAmountComponent = this.initGambleAmount();
            gambleAmountComponent.position.set(
                (this.width - gambleAmountComponent.width) / 2 + this.MARGIN_LEFT,
                !RG.Helper.isMobile() ? offset : title.position.y + title.height + offset
            );

            this.addChild(gambleAmountComponent);
            offset = (gambleAmountComponent.y + gambleAmountComponent.height + 25);

            // Значение от и до
            const containerFrom = this.initFromValueText();
            containerFrom.position.set(
                (this.width - containerFrom.width) / 2 + this.MARGIN_LEFT,
                offset
            );
            offset = (containerFrom.y + containerFrom.height + (!isMobile ? 10 : 0));
            const containerMaxWin = this.initMaxValueText();
            containerMaxWin.position.set(
                (this.width - containerMaxWin.width) / 2 + this.MARGIN_LEFT,
                offset
            );

            //Кнопка Ок
            const okBtn = this.initOkBtn();
            okBtn.position.set(
                (this.width - okBtn.width) / 2 + this.MARGIN_LEFT,
                graphics.height - okBtn.height - (!RG.Helper.isMobile() ? 70 : 110)
            );

            // Кнопка отмены
            const cancelBtn = this.initCancelBtn();
            cancelBtn.x = (this.width - cancelBtn.width) / 2 + this.MARGIN_LEFT;
            cancelBtn.y = okBtn.y + okBtn.height + 20;
        }

        initFromValueText() {
            const containerFrom = new PIXI.Container();
            const labelFrom = new Text('GAMBLE_POPUP_TOTAL_TITLE', {fontSize: !RG.Helper.isMobile() ? 20 : 42});
            this.fromValueComponent = new Text(String(0), {fontSize: !RG.Helper.isMobile() ? 30 : 63});
            containerFrom.addChild(labelFrom);
            containerFrom.addChild(this.fromValueComponent);
            labelFrom.y = containerFrom.height - labelFrom.height  - (!RG.Helper.isMobile() ? 3 : 8);
            this.fromValueComponent.x = labelFrom.width + 5;
            this.addChild(containerFrom);
            return containerFrom;
        }

        initMaxValueText() {
            const containerMaxWin = new PIXI.Container();
            const labelMaxWin = new Text('GAMBLE_POPUP_MAX_WIN_TITLE', {fontSize: !RG.Helper.isMobile() ? 20 : 42});
            this.maxValueComponent = new Text(String(300), {fontSize: !RG.Helper.isMobile() ? 30 : 63});
            containerMaxWin.addChild(labelMaxWin);
            containerMaxWin.addChild(this.maxValueComponent);
            labelMaxWin.y = containerMaxWin.height - labelMaxWin.height  - (!RG.Helper.isMobile() ? 3 : 8);
            this.maxValueComponent.x = labelMaxWin.width + 5;
            this.addChild(containerMaxWin);
            return containerMaxWin;
        }

        initGambleAmount() {
            this.gambleAmountComponent = new GambleAmount(this.width - this.DIFF_WIDTH_GAMBLE_AMOUNT);
            this.gambleAmountComponent.on('increase_value', () => {
                const value = (this.gambleAmountComponent!.getValue() + this.step) > this.fromValue!
                    ? this.fromValue!
                    : this.gambleAmountComponent!.getValue() + this.step;
                this.targetValue = value;
                this.gambleAmountComponent!.setValue(value);
            });
            this.gambleAmountComponent.on('decrease_value', () => {
                const value = (this.gambleAmountComponent!.getValue() - this.step) < 0 ? 0 : this.gambleAmountComponent!.getValue() - this.step;
                this.targetValue = value;
                this.gambleAmountComponent!.setValue(value);
            });
            this.gambleAmountComponent.on('input_value', (text: string) => {
                let value = Number(text);
                if (!value || value < 0) {
                    this.targetValue = 0;
                    return
                }
                this.targetValue = value > this.maxValue! ? this.maxValue! : value;
            });
            return this.gambleAmountComponent;
        }

        initOkBtn() {
            const button = new RG.Button(!RG.Helper.isMobile()? 'loader_error_bnt' : 'start_autospin_new');
            button.remap('down', 2);
            this.addChild(button);
            const buttonText = new Text('GAMBLE_PARTIAL_OK_BUTTON', {fontSize: !RG.Helper.isMobile() ? 20 : 42}, true, true);
            buttonText.position.set((button.width - buttonText.width) / 2, (button.height - buttonText.height) / 2);
            button.addChild(buttonText);
            button.on('click', () => {
                this.emit('ok', this.targetValue);
            });

            return button;
        }

        initCancelBtn() {
            const cancelBtn = new Text('GAMBLE_PARTIAL_CANCEL_BUTTON', {fontSize: !RG.Helper.isMobile() ? 20 : 42});
            cancelBtn.interactive = true;
            cancelBtn.buttonMode = true;
            cancelBtn.alpha = 0.5;
            cancelBtn.on('mouseover', ()=> {
                cancelBtn.alpha = 1;
            });
            cancelBtn.on('mouseout', () => {
                cancelBtn.alpha = 0.5;
            });
            if (!RG.Helper.isMobile()) {
                cancelBtn.on('click', () => {
                    this.emit('cancel_clicked');
                });
            } else {
                cancelBtn.on('pointertap', () => {
                    this.emit('cancel_clicked');
                });
            }
            this.addChild(cancelBtn);
            return cancelBtn;
        }

        setFromValue(value: number) {
            this.fromValue = value;
            this.fromValueComponent!.text = String(value);
        }

        setMaxValue(value: number) {
            this.maxValue = value;
            this.maxValueComponent!.text = String(value);
        }

        setTargetValue(value: number) {
            this.targetValue = value;
            this.gambleAmountComponent!.setValue(value);
        }

        setStep(value: number) {
            this.step = value;
        }

        getBackground(alpha: number = 1) {
            const winBg = PIXI.Sprite.from("settings_bg");
            winBg.interactive = true;
            winBg.zIndex = 9000;
            winBg.y = !RG.Helper.isMobile() ? -5 : 45 - Game.mobilePadding;
            winBg.alpha = alpha;
            return winBg;
        }

        setBackground() {
            const winBg = this.getBackground(1);
            if (this.backgroundSprite) {
                this.parent.removeChild(this.backgroundSprite);
            }
            this.backgroundSprite = winBg;
            this.parent.addChild(this.backgroundSprite);
            this.backgroundSprite.x = this.backgroundXPosition;
            this.backgroundSprite.y = this.backgroundYPosition;
            return this;
        }

        setBackgroundPosition(backgroundXPosition?: number, backgroundYPosition?: number) {
            this.backgroundXPosition = backgroundXPosition ? backgroundXPosition : 0;
            this.backgroundYPosition = backgroundYPosition ? backgroundYPosition : 0;
        }

        enable() {
            this.visible = true;
            this.setBackground();
        }

        disable() {
            this.visible = false;
            if (this.backgroundSprite) {
                this.parent.removeChild(this.backgroundSprite);
            }
        }

    }
}

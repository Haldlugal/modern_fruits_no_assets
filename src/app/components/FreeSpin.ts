namespace Component {

    export class FreeSpin extends PIXI.Container{
        private PADDING_VERTICAL = !RG.Helper.isMobile() ? 20 : 50;
        private spinsAmountComponent?: Text;
        private betComponent?: Text;
        private backgroundSprite?: PIXI.Sprite;
        public BOX_WIDTH: number;
        public BOX_HEIGHT: number;
        public okEnabled = true;
        private backgroundXPosition: number = 0;
        private backgroundYPosition: number = 0;
        private widthBetText: number = 0;
        private widthSpinsAmountText: number = 0;
        private static SPIN_OFFSET_TOP = 10;
        private static MARGIN_LABEL_TOP = 20;
        private static TITLE_STYLE = {
            fontSize: !RG.Helper.isMobile() ? 46 : 63,
        };

        private static LABEL_STYLE = {
            fontSize: !RG.Helper.isMobile() ? 25 : 42,
        };

        private static TEXT_STYLE = {
            fontSize: !RG.Helper.isMobile() ? 40 : 56,
        };

        private static BUTTON_STYLE = {
            fontSize: !RG.Helper.isMobile() ? 20 : 42,
            strokeThickness: 0,
        };

        constructor(width = 0, height = 0) {
            super();
            const isMobile = RG.Helper.isMobile();
            this.interactive = true;
            this.zIndex = 10000;
            const backGround = PIXI.Sprite.from("win_bg");
            this.addChild(backGround);
            let box;
            if (!isMobile) {
                box = PIXI.Sprite.from('modal_bg');
                this.addChild(box);
                this.BOX_WIDTH = box.width;
                this.BOX_HEIGHT = box.height;
                RG.Helper.setCenter(this, box);
            }
            else {
                box = new PIXI.Graphics();
                this.BOX_HEIGHT = height;
                this.BOX_WIDTH = width;
                box.lineStyle(0, 0xb7aa64, 0.75)
                    .beginFill(0x274400, 1)
                    .drawRoundedRect(0, 0, this.BOX_WIDTH, this.BOX_HEIGHT, 16)
                    .endFill();
                this.addChild(box);
                RG.Helper.setCenterX(this, box);
            }

            const mainContainer = new PIXI.Container();
            mainContainer.addChild(new RG.Simplers.Spacer(367, 1));

            // Название
            const title = new Component.Text('FREE_SPINS_POPUP_TITLE', FreeSpin.TITLE_STYLE, true, true);
            if (!RG.Helper.isMobile()) {
                title.y = box.y - title.height - this.PADDING_VERTICAL;
            } else {
                title.y = this.PADDING_VERTICAL * 2;
            }
            this.addChild(title);
            RG.Helper.setCenterX(this, title);

            const statsContainer = new PIXI.Container();
            const spins = this.initSpinsAmount();
            const bet = this.initBet();

            statsContainer.addChild(spins);
            statsContainer.addChild(bet);

            spins.position.set(
                (statsContainer.width - spins.width) / 2,
                FreeSpin.SPIN_OFFSET_TOP
            );
            bet.position.set(
                (statsContainer.width - bet.width) / 2,
                spins.height + FreeSpin.MARGIN_LABEL_TOP
            );
            mainContainer.addChild(statsContainer);
            RG.Helper.setCenterX(mainContainer, statsContainer);
            statsContainer.y = 40;
            // Кнопка отмены
            const cancelBtn = this.initCancelBtn();
            mainContainer.addChild(cancelBtn);
            RG.Helper.setCenterX(mainContainer, cancelBtn);
            cancelBtn.y = box.height - cancelBtn.height - this.PADDING_VERTICAL * 2;

            //Кнопка Ок
            const okBtn = this.initOkBtn();
            mainContainer.addChild(okBtn);
            RG.Helper.setCenterX(mainContainer, okBtn);
            okBtn.y = cancelBtn.y - okBtn.height - this.PADDING_VERTICAL;
            box.addChild(mainContainer);
            if (!RG.Helper.isMobile()) {
                mainContainer.x = 286;
            } else {
                RG.Helper.setCenterX(box, mainContainer);
            }
        }

        initSpinsAmount() {
            const containerFrom = new PIXI.Container();
            const labelFrom = this.setLabel('FREE_SPINS_ROW_SPINS_AMOUNT_TITLE', containerFrom);
            this.spinsAmountComponent = this.setText(String(0));
            containerFrom.addChild(this.spinsAmountComponent);
            this.widthSpinsAmountText = labelFrom.width;
            this.updateSpinsPositionX();
            this.spinsAmountComponent.y = labelFrom.y + labelFrom.height;
            this.addChild(containerFrom);
            return containerFrom;
        }

        initBet() {
            const containerMaxWin = new PIXI.Container();
            const labelMaxWin = this.setLabel('FREE_SPINS_ROW_BET_TITLE', containerMaxWin);
            this.betComponent = this.setText(String(0));
            containerMaxWin.addChild(this.betComponent);
            this.widthBetText = labelMaxWin.width;
            this.updateBetPositionX();
            this.betComponent.y = labelMaxWin.y + labelMaxWin.height;

            this.addChild(containerMaxWin);
            return containerMaxWin;
        }

        initOkBtn() {
            const button = new RG.Button(!RG.Helper.isMobile()? 'loader_error_bnt' : 'loader_error_bnt');
            button.remap('down', 2);
            const buttonText = new Text('OK', FreeSpin.BUTTON_STYLE, true, true);
            buttonText.position.set((button.width - buttonText.width) / 2, (button.height - buttonText.height) / 2);
            button.addChild(buttonText);
            button.on('click', () => {
                this.emit('ok_clicked');
            });
            return button;
        }

        initCancelBtn() {
            const cancelBtn = new Text('FREE_SPINS_CANCEL_BUTTON', FreeSpin.BUTTON_STYLE);
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
            return cancelBtn;
        }

        setSpins(value: number) {
            this.spinsAmountComponent!.text = String(value);
            this.updateSpinsPositionX()
        }

        setBet(value: number) {
            this.betComponent!.text = String(value);
            this.updateBetPositionX()
        }

        updateBetPositionX() {
            this.betComponent!.x = (this.widthBetText - this.betComponent!.width) / 2;
        }

        updateSpinsPositionX() {
            this.spinsAmountComponent!.x = (this.widthSpinsAmountText - this.spinsAmountComponent!.width) / 2;
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

        public enableOk() {
            this.okEnabled = true;
        }

        public disableOk() {
            this.okEnabled = false;
        }

        setLabel(rawText: string, containerFrom: PIXI.Container) {
            const labelFrom = new Component.Text(rawText, FreeSpin.LABEL_STYLE, true, true);
            containerFrom.addChild(labelFrom);
            labelFrom.x = (containerFrom.width - labelFrom.width) / 2;
            labelFrom.y = (containerFrom.height - labelFrom.height) / 2 - (!RG.Helper.isMobile() ? 3 : -50);
            return labelFrom;
        }

        setText(rawText: string) {
            return new Component.Text(rawText, FreeSpin.TEXT_STYLE);
        }
    }
}

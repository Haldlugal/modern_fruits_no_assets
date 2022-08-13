namespace Component {

    export class FreeSpinResults extends PIXI.Container{
        private PADDING_VERTICAL = 50;
        private MARGIN_LEFT = 60;
        private winnings?: Text;
        private backgroundSprite?: PIXI.Sprite;
        private BOX_WIDTH: number;
        private BOX_HEIGHT: number;

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
            const title = new Component.Text('SPINS', {
                fontSize: !RG.Helper.isMobile() ? 46 : 63,
            }, true, true);
            if (!RG.Helper.isMobile()) {
                title.y = box.y - title.height - this.PADDING_VERTICAL;
            } else {
                title.y = this.PADDING_VERTICAL * 2;
            }
            this.addChild(title);
            RG.Helper.setCenterX(this, title);

            const winnings = this.initWinAmount();
            mainContainer.addChild(winnings);
            RG.Helper.setCenterX(mainContainer, winnings);
            if (RG.Helper.isMobile()) {
                winnings.y = this.PADDING_VERTICAL * 5;
            } else {
                winnings.y = this.PADDING_VERTICAL;
            }
            //Кнопка Ок
            const okBtn = this.initOkBtn();
            mainContainer.addChild(okBtn);
            RG.Helper.setCenterX(mainContainer, okBtn);
            okBtn.y = box.height - okBtn.height - this.PADDING_VERTICAL - (RG.Helper.isMobile()? this.PADDING_VERTICAL * 2: 0);

            box.addChild(mainContainer);
            if (!RG.Helper.isMobile()) {
                mainContainer.x = 286;
            } else {
                RG.Helper.setCenterX(box, mainContainer);
            }
        }


        initWinAmount() {
            const containerFrom = new PIXI.Container();
            const labelFrom = new Text('WON AMOUNT', {fontSize: !RG.Helper.isMobile() ? 20 : 42});
            this.winnings = new Text(String(0), {fontSize: !RG.Helper.isMobile() ? 42 : 63, fontWeight: 'Bold'});
            containerFrom.addChild(labelFrom);
            containerFrom.addChild(this.winnings);
            this.winnings.x = (containerFrom.width - this.winnings.width) / 2;
            this.winnings.y = labelFrom.height + 5;
            this.addChild(containerFrom);
            return containerFrom;
        }

        initOkBtn() {
            const button = new RG.Button(!RG.Helper.isMobile()? 'loader_error_bnt' : 'loader_error_bnt');
            button.remap('down', 2);
            const buttonText = new Text('OK', {
                fontSize: !RG.Helper.isMobile() ? 20 : 42,
                strokeThickness: 0,
            }, true, true);
            buttonText.position.set((button.width - buttonText.width) / 2, (button.height - buttonText.height) / 2);
            button.addChild(buttonText);
            button.on('click', () => {
                this.emit('ok_clicked');
            });

            return button;
        }

        setWinValue(value: number) {
            this.winnings!.text = String(Math.round(value*100)/100);
            this.winnings!.x = (this.winnings!.parent.width - this.winnings!.width) / 2;
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
            this.backgroundSprite.x = 1;
            return this;
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

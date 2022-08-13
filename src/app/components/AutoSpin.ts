namespace Component {

    export class AutoSpin extends PIXI.Container {
        public static WIDTH = 480;
        private PADDING_LEFT = 25;
        private DEFAULT_LOSS_LIMIT_POS = 0;
        private DEFAULT_WIN_LIMIT_POS = 0;
        private DEFAULT_SPINS_QUANTITY = Infinity;

        public readonly button: RG.Button;
        private readonly lossLimitsComponent: DottedChooser;
        private readonly winLimitsComponent: DottedChooser;
        private readonly spinsComponent: RadioButtonList;
        // private readonly checkbox: Checkbox;

        private stake: number;
        private spinsQuantity: number;
        private lossLimitPos: number;
        private winLimitPos: number;
        private stopAtFreespins: boolean;
        private autoPlayData: AutoPlayData;
        private background: PIXI.Graphics;

        constructor(autoPlayData: AutoPlayData, currentStake: number, gameWidth: number, gameHeight: number, xCoord: number, yCoord: number, width = 0, height = 0) {
            super();
            const isMobile = RG.Helper.isMobile();
            //Нужен, чтобы было можно по нему кликать, чтобы убирать панельку
            this.background = new PIXI.Graphics().beginFill(0x8B0000, 0.01).drawRect(0, 0, gameWidth, gameHeight);
            this.background.interactive = true;
            this.background.visible = true;
            this.addChild(this.background);

            this.stake = currentStake;
            this.lossLimitPos = 0;
            this.winLimitPos = 0;
            this.spinsQuantity = 0;
            this.stopAtFreespins = false;
            this.autoPlayData = autoPlayData;
            // Чтобы не прокали события у элементов под контейнером
            this.interactive = true;

            // --------------------------------------------------------------------------------
            // Константы
            // --------------------------------------------------------------------------------
            const BOX_WIDTH = !isMobile ? AutoSpin.WIDTH : gameWidth;
            const BOX_MIN_HEIGHT = !isMobile ? 400 : gameHeight;
            const BOX_BORDER = 6;

            // --------------------------------------------------------------------------------
            // Слой для рамки создаем сразу (он должен быть позади)
            // --------------------------------------------------------------------------------

            const graphics = new PIXI.Graphics();
            this.addChild(graphics);
            graphics.interactive = true;

            if (!isMobile) {
                graphics.lineStyle(BOX_BORDER, 0xf7e48f, 0.75);
            }
            graphics.beginFill(0x274400, 1);
            graphics.drawRoundedRect(0, 0, BOX_WIDTH, BOX_MIN_HEIGHT, 16);
            graphics.endFill();

            // --------------------------------------------------------------------------------

            let offset = 0;

            // --------------------------------------------------------------------------------
            // Лимиты
            // --------------------------------------------------------------------------------

            offset += (!isMobile ? 20 : 80);

            this.lossLimitsComponent = new DottedChooser('LOSS_LIMIT', autoPlayData.lossLimits, currentStake, graphics.width);
            this.lossLimitsComponent.position.set(this.PADDING_LEFT, offset);
            graphics.addChild(this.lossLimitsComponent);

            this.lossLimitsComponent.on('choice', (limitPos: any)=>{
                this.lossLimitPos = limitPos;
            });
            this.lossLimitPos = this.DEFAULT_LOSS_LIMIT_POS;
            this.lossLimitsComponent.redrawDots(0);

            offset += this.lossLimitsComponent.height + (!isMobile ? 15 : 40);

            this.winLimitsComponent = new DottedChooser('SINGLE_WIN_LIMIT', autoPlayData.singleWinLimits, currentStake, graphics.width);
            this.winLimitsComponent.position.set(this.PADDING_LEFT, offset);
            graphics.addChild(this.winLimitsComponent);

            this.winLimitsComponent.on('choice', (limitPos: any)=>{
                this.winLimitPos = limitPos;
            });
            this.winLimitPos = this.DEFAULT_WIN_LIMIT_POS;
            this.winLimitsComponent.redrawDots(0);

            // --------------------------------------------------------------------------------
            // Спины
            // --------------------------------------------------------------------------------

            offset += this.winLimitsComponent.height + (!isMobile ? 15 : 40);

            this.spinsComponent = new RadioButtonList('NUMBER_OF_SPINS', autoPlayData.spins);
            this.spinsComponent.position.set(
                !isMobile? this.PADDING_LEFT : (this.width - this.spinsComponent.width) / 2,
                offset);
            graphics.addChild(this.spinsComponent);

            this.spinsComponent.on('choice', (spinPos: any) => {
                if (spinPos === 0) {
                    this.spinsQuantity = Infinity;
                } else {
                    this.spinsQuantity = autoPlayData.spins[spinPos];
                }
            });
            this.spinsQuantity = this.DEFAULT_SPINS_QUANTITY;
            this.spinsComponent.redrawRadios(0);


            // --------------------------------------------------------------------------------
            // Чекбокс
            // --------------------------------------------------------------------------------

            // offset += this.spinsComponent.height + (!isMobile ? 35 : 70);
            //
            // this.checkbox = new Checkbox('checkbox', 'STOP_AT_FREE_SPINS',{x: 40, y: 0}, isMobile);
            // this.checkbox.position.set(this.PADDING_LEFT, offset);
            // graphics.addChild(this.checkbox);
            //
            // this.checkbox.on('click', ()=>{
            //     if (this.checkbox.mode === 'checked') {
            //         this.stopAtFreespins = true;
            //     } else {
            //         this.stopAtFreespins = false;
            //     }
            // });

            // --------------------------------------------------------------------------------
            // Кнопка закрытия
            // --------------------------------------------------------------------------------

            offset += this.spinsComponent.height + 50;

            const closeButton = new RG.Button('close_autospin');
            if(isMobile) {
                closeButton.scale.set(2);
            }
            closeButton
                .remap('down', 2)
                .on('click', ()=>{
                    this.visible = false;
                })
                .position.set(this.PADDING_LEFT, offset)
            ;

            graphics.addChild(closeButton);

            // --------------------------------------------------------------------------------
            // Кнопка старта
            // --------------------------------------------------------------------------------

            this.button = new RG.Button('start_autospin');
            this.button.remap('down', 2);
            this.button.label = new Text('START_AUTO_SPIN', {
                fontSize: !isMobile ? 20 : 42,
                fill: '#fbe595'
            });
            if (RG.Helper.isMobile()) {
                this.button.width = this.spinsComponent.width - closeButton.width;
                console.log(this.button.height);
            } else {
                this.button.width = graphics.width - this.PADDING_LEFT * 2 - 10 - closeButton.width;
            }

            this.button.position.set(closeButton.width + this.PADDING_LEFT + 10, offset);

            graphics.addChild(this.button);

            this.button.on('click', () => {
                const autoPlaySettings = new AutoPlaySettings(
                    this.autoPlayData.lossLimits[this.lossLimitPos] * this.stake,
                    this.autoPlayData.singleWinLimits[this.winLimitPos] * this.stake,
                    this.spinsQuantity, this.stopAtFreespins);
                this.emit('autospin',  autoPlaySettings );
            });

            this.button.y = !isMobile ? graphics.height - this.button.height - 35 : offset;
            closeButton.y = this.button.y + 3;

            // --------------------------------------------------------------------------------
            // Корректировка расположения компонентов для мобилки
            // --------------------------------------------------------------------------------

            if (isMobile) {
                this.lossLimitsComponent.position.x = (this.width - this.lossLimitsComponent.width) / 2;
                this.winLimitsComponent.position.x = (this.width - this.winLimitsComponent.width) / 2;
                // this.checkbox.x = this.winLimitsComponent.position.x;
                closeButton.x = this.winLimitsComponent.position.x;
                this.button.x = this.winLimitsComponent.position.x + this.winLimitsComponent.width - this.button.width;
            }
            else {
                yCoord = yCoord - graphics.height;
            }

            //Выключаем панель
            this.background.on('click', () => {
                this.visible = false;
            });

            graphics.position.set(xCoord, yCoord);
        }

        /**
         * Установка текущей ставки
         */
        public setStake(stake: number): this {
            this.stake = stake;
            this.lossLimitsComponent.setStake(stake);
            this.winLimitsComponent.setStake(stake);
            return this;
        }
    }
}

namespace Component {

    import VolumeBar = Component.Sound.VolumeBar;

    export class Stakes extends PIXI.Container {

        // Компонента - заголовок и число
        private numbersWithTitle: NumbersWithTitle;

        // Компонента - Кнопка увеличения ставки на один шаг
        private btnUp: RG.Button;

        // Компонента - Кнопка уменьшения ставки на один шаг
        private btnDown: RG.Button;

        // Компонента - Кнопка увеличения ставки до максимального значения
        private btnMax: RG.Button;

        // Используемые размеры ставок
        private readonly steps: number[];

        // Индекс текущей ставки в масиве ставок this.steps
        public valueIndex: number = 0;

        // Максимально возможный индекс ставки в масиве ставок this.steps
        private readonly maxValueIndex: number;

        private bar?: Component.Sound.Volume;

        private static readonly MAX_BTN_POSITION_X = 180;
        private static readonly MAX_BTN_POSITION_Y = 15;
        private static readonly MAX_BTN_SIZE       = null;

        private static readonly BTN_POSITION_X  = 180;
        private static readonly BTN_POSITION_Y  = 60;
        private static readonly BTN_SIZE        = 45;
        private static readonly BTN_SIZE_MOBILE = 80;
        private static readonly BTN_OFFSET      = 0;

        private static readonly BAR_POSITION_X  = 155;
        private static readonly BAR_POSITION_Y  = 20;

        private static readonly STAKE_POSITION_X   = -20;
        private static readonly STAKE_POSITION_Y   = 35;
        private static readonly STAKE_WIDTH        = 200;
        private static readonly STAKE_WIDTH_MOBILE = 150;
        private readonly OFFSET_Y = 35;

        constructor(steps: number[]) {
            super();
            const isMobile = RG.Helper.isMobile();

            // Распорка
            if (!isMobile) {
                const spacer = new RG.Simplers.Spacer(300, 150);
                this.addChild(spacer);
            }

            this.steps = steps;
            this.maxValueIndex = this.steps.length - 1;

            this.numbersWithTitle = new NumbersWithTitle(!isMobile? 'BET_SIZE_LABEL' : '',
                !isMobile ? Stakes.STAKE_WIDTH : Stakes.STAKE_WIDTH_MOBILE);

            this.btnDown = (new RG.Button('arrow_down'))
                .remap('down', 2)
                .remap('disabled', 3)
                .on('click', () => this.setValueIndex(this.valueIndex - 1));
            this.btnUp = (new RG.Button('arrow_up'))
                .remap('down', 2)
                .remap('disabled', 3)
                .on('click', () => this.setValueIndex(this.valueIndex + 1));

            this.btnMax = (new RG.Button('max_bet_'))
                .on('click', () => this.setValueIndex(this.maxValueIndex));

            const btnSize = isMobile ? Stakes.BTN_SIZE_MOBILE : Stakes.BTN_SIZE;

            this.btnDown.width = btnSize;
            this.btnDown.height = btnSize;
            this.btnUp.width = btnSize;
            this.btnUp.height = btnSize;

            if (!isMobile) {
                this.numbersWithTitle.position.set(Stakes.STAKE_POSITION_X + SlotPosition.OFFSET_X, Stakes.STAKE_POSITION_Y);
                this.btnDown.position.set(Stakes.BTN_POSITION_X + SlotPosition.OFFSET_X,
                    Stakes.BTN_POSITION_Y + btnSize + Stakes.BTN_OFFSET);
                this.btnUp.position.set(Stakes.BTN_POSITION_X + SlotPosition.OFFSET_X, Stakes.BTN_POSITION_Y);
                this.btnMax.position.set(Stakes.MAX_BTN_POSITION_X + SlotPosition.OFFSET_X, Stakes.MAX_BTN_POSITION_Y);
            } else {
                let offsetX = 0;
                this.btnDown.position.set(offsetX, this.OFFSET_Y);
                offsetX += this.btnDown.width;
                this.numbersWithTitle.position.set(offsetX, 15);
                offsetX += this.numbersWithTitle.width;
                this.btnUp.position.set(offsetX, this.OFFSET_Y);
                offsetX += this.btnUp.width + 50;
                this.btnMax.position.set(offsetX, this.OFFSET_Y);
                this.btnMax.width = btnSize;
                this.btnMax.height = btnSize;
            }

            this.addChild(this.numbersWithTitle);
            this.addChild(this.btnDown);
            this.addChild(this.btnUp);
            this.addChild(this.btnMax);

            //Установка бара с отображением значения ставки. В мобилке его нет, поэтому и добавлять его не будем
            if (!isMobile) {
                this.bar = new Component.Sound.Volume(steps.length - 1);
                this.bar.position.set(Stakes.BAR_POSITION_X + SlotPosition.OFFSET_X, Stakes.BAR_POSITION_Y);
                this.addChild(this.bar);
                this.bar.on('choice', (position: number) => {
                    console.dir(position)
                    this.setValueIndex(Math.round(position * this.steps.length - 1));
                });
            }
        }

        public setValueIndex(valueIndex: number): this {
            this.valueIndex = (valueIndex < 0)
                ? 0
                : ((valueIndex > this.maxValueIndex) ? this.maxValueIndex : valueIndex);

            const value = this.getValue();
            this.numbersWithTitle.setValue(value);
            this.updateBar();

            (this.valueIndex === 0) ? this.btnDown.disable() : this.btnDown.disable(false);
            (this.valueIndex === this.maxValueIndex) ? this.btnUp.disable() : this.btnUp.disable(false);

            this.emit('change', value);
            return this;
        }

        private updateBar(): this {
            if (this.bar) {
                this.bar.redraw(this.valueIndex / (this.steps.length - 1));
            }
            return this;
        }

        disable(): this {
            this.btnUp.disable();
            this.btnDown.disable();
            this.btnMax.disable();
            if(this.bar) {
                this.bar.disable();
            }
            // this.alpha = 0.5;
            return this;
        }

        enable(): this {
            if(this.valueIndex!==this.maxValueIndex) {
                this.btnUp.disable(false);
            }
            if(this.valueIndex!==0) {
                this.btnDown.disable(false);
            }
            this.btnMax.disable(false);
            if(this.bar) {
                this.bar.enable();
            }
            this.alpha = 1;
            return this;
        }

        getValue(): number {
            return Number(this.steps[this.valueIndex] || 0);
        }

        setValue(stake: number): this {
            this.valueIndex = this.steps.findIndex(v => String(v) === String(stake)) || 0;
            return this.setValueIndex(this.valueIndex);
        }
    }
}

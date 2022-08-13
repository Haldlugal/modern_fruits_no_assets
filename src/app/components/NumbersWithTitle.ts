namespace Component {

    export class NumbersWithTitle extends PIXI.Container {

        /**
         * Компонента текста заголовка
         */
        public label: Text;

        public scaling: number;
        public fontSize: number;
        public fontMultiplier: number;
        private labelDefaultFont: number;
        private numbersDefaultFont: number;

        private labelMargin: number;

        /**
         * Компонента с цифрами в виде картинок
         */
        public numbers: Text;

        private _effect?: Effect.TextNumber;

        /**
         * @param label Ключ для перевода или сам текст заголовка
         * @param width Ширина контейнера с компонентой, по ней будут центрироваться заголовок и цифры
         * @param highlight Для разработки - подсветить область
         * @param titleStyle стиль заголовка
         * @param numberStyle стиль циферок
         */
        constructor(label: string, width: number = 250, highlight: boolean = false, titleStyle = {}, numberStyle = {fontSize: 42, fontWeight: 900}, labelMargin = 0 ) {
            super();

            // Рисуем прямоугольник - он распорка
            const spacer = new RG.Simplers.Spacer(width, 70, highlight);
            this.addChild(spacer);

            this.label = new Text(label, titleStyle);
            this.label.position.x = (this.width - this.label.width) / 2;

            this.addChild(this.label);

            this.numbers = new Text('0', numberStyle);
            this.labelMargin = labelMargin;

            this.numbers.y = this.label.y + this.label.height + labelMargin;
            this.addChild(this.numbers);

            this.on('added', () => {
                this.label.position.x = (this.width - this.label.width) / 2;
                this.numbers.position.x = (this.width - this.numbers.width) / 2
            });
            this.fontSize = numberStyle.fontSize;
            this.scaling = 1;
            this.fontMultiplier = 1;
            this.labelDefaultFont = this.label.style.fontSize;
            this.numbersDefaultFont = this.numbers.style.fontSize;
        }

        setValue(value: number): this {
            this.numbers.text = String(Math.round(value*100)/100);
            this.numbers.position.x = (this.width - this.numbers.width) / 2;
            return this;
        }

        setFont(fontSize: number) {
            this.fontSize = fontSize;
            this.label.style = {...this.label.style, fontSize: fontSize};
            this.numbers.style = {...this.numbers.style, fontSize: fontSize};
            this.numbers.y = (this.label.y + this.label.height) + this.labelMargin;
            this.label.position.x = (this.width - this.label.width) / 2;
            this.numbers.position.x = (this.width - this.numbers.width) / 2;
        }

        multiplyFont(multiplier: number) {
            this.fontMultiplier = multiplier;
            this.label.style = {...this.label.style, fontSize: this.labelDefaultFont * multiplier};
            this.numbers.style = {...this.numbers.style, fontSize: this.numbersDefaultFont * multiplier};
            this.numbers.y = (this.label.y + this.label.height) + this.labelMargin;
            this.label.position.x = (this.width - this.label.width) / 2;
            this.numbers.position.x = (this.width - this.numbers.width) / 2;
        }

        setScale(scale: number) {
            this.scaling = scale;
            this.label.scale.set(scale);
            this.numbers.scale.set(scale);
            this.numbers.y = (this.label.y + this.label.height) + this.labelMargin * scale;
            this.label.position.x = (this.width - this.label.width) / 2;
            this.numbers.position.x = (this.width - this.numbers.width) / 2;
        }

        getValue(): number {
            return Number(this.numbers.text);
        }

        get effect() {
            if (!this._effect || this._effect.getIsDestroyed()) {
                this._effect = new Effect.TextNumber(this);
            }
            return this._effect;
        }
    }
}

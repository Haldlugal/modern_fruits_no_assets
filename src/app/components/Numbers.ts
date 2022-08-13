namespace Component {

    type NumbersSheet =
        | "numbers"
        | "numbers_big"
        | "line_numbers"

    export class Numbers extends PIXI.Container {

        /**
         * Ресурс, из которого берутся текстуры
         */
        private sheet: RG.Simplers.SpriteSheet;

        /**
         * Текущее отображаемое значение
         */
        private _value: number = 0;

        private scaleSize: number = 1;

        private _effect?: Effect.Numbers;

        /**
         * @param sheet  Название ресурса, из которого тащим картинки цифр
         * @param scaleSize С каким скейлом рисовать спрайты
         */
        constructor(sheet: NumbersSheet = "numbers", scaleSize: number = 1) {
            super();
            this.scaleSize = scaleSize;
            this.sheet = new RG.Simplers.SpriteSheet(sheet);
            this.on('added', () => {
                this.position.x = (this.parent.width - this.width) / 2;
            });
        }

        /**
         * Установка значения
         * @param number
         */
        setValue(number: number): this {
            this._value = number;

            // Цифры (точка заменяется на '10')
            let numbers = number.toFixed(2).split('').map(c => (c.match(/\d/) ? c : '10'));

            // удаляем предыдущий набор текстур
            this.removeChildren().forEach((child: PIXI.DisplayObject) => child.destroy());

            // и добавляем новый набор текстур
            numbers.forEach(num => {
                const sprite = new PIXI.Sprite(this.sheet.getTexture(num));
                sprite.scale.set(this.scaleSize);
                sprite.x = this.width;
                this.addChild(sprite);
            });
            this.position.x = (this.parent.width - this.width) / 2;

            return this;
        }

        getValue(): number {
            return this._value;
        }

        get effect() {
            if (!this._effect || this._effect.getIsDestroyed()) {
                this._effect = new Effect.Numbers(this);
            }
            return this._effect;
        }
    }
}

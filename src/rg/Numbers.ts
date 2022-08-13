namespace RG {

    export enum NumbersEvents {
        OnValueSet = 'OnValueSet'
    }

    export class Numbers extends PIXI.Container {

        /**
         * Ресурс, из которого берутся текстуры
         */
        private sheet: RG.Simplers.SpriteSheet;

        /**
         * Текущее отображаемое значение
         */
        private _value: number = 0;

        private _effect?: Effect.Numbers;

        /**
         * @param sheet  Название ресурса, из которого тащим картинки цифр
         * @param fixed До какого знака
         */
        constructor(sheet: string = "numbers", public fixed = 2) {
            super();
            this.sheet = new RG.Simplers.SpriteSheet(sheet);
            this.on('added', () => {
                this.position.x = (this.parent.width - this.width) / 2;
            });
        }

        /**
         * Установка значения
         * @param number
         */
        setValue(number: number) {
            this._value = number;

            // Цифры (точка заменяется на '10')
            let numbers = number.toFixed(this.fixed).split('').map(c => (c.match(/\d/) ? c : '10'));

            // удаляем предыдущий набор текстур
            this.removeChildren().forEach((child: PIXI.DisplayObject) => child.destroy());

            // и добавляем новый набор текстур
            for (let num of numbers) {
                const sprite = new PIXI.Sprite(this.sheet.getTexture(num));
                sprite.x = this.width / this.scale.x;
                this.addChild(sprite);
            }

            this.emit(NumbersEvents.OnValueSet);
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

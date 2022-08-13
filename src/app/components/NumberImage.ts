namespace Component {

    export type NumberImageResource =
        | "numbers"
        | "numbers_big"
        | "line_numbers"

    export class NumberImage extends PIXI.Container {

        /**
         * Текущее отображаемое значение
         */
        private value: number = 0;

        /**
         * Ресурс, из которого берутся текстуры
         */
        private sheet: RG.Simplers.SpriteSheet;

        private _effect?: Effect.Numbers;

        /**
         * @param x Позиция компонента в родительском контейнере
         * @param y Позиция компонента в родительском контейнере
         * @param resource название ресурса, из которого тащим картинки цифр
         */
        constructor(x: number, y: number, resource: NumberImageResource = "numbers") {
            super();
            this.sheet = new RG.Simplers.SpriteSheet(resource);
            this.position.set(x, y);
        }

        /**
         * Установка значения
         * @param number
         */
        setValue(number: number): this {
            this.value = number;

            // Цифры (точка заменяется на '10')
            let numbers = String(number).split('').map(c => (c.match(/\d/) ? c : '10'));

            // Позиция точки в наборе цифр
            const dotIndex = numbers.findIndex(c => c === '10');

            if (dotIndex === -1) {
                // Если нет точки в числе (т.е. целое число), то добавляем числу .00
                numbers.push('10', '0', '0');
            } else if ((numbers.length - dotIndex) !== 3) {
                // Если число с одной цифрой после точки в числе (например 100.5), то добавляем еще один 0
                numbers.push('0');
            }

            // удаляем предыдущий набор текстур
            this.removeChildren();

            // и добавляем новый набор текстур
            numbers.forEach(num => {
                const sprite = new PIXI.Sprite(this.sheet.getTexture(num));
                sprite.x = this.width;
                this.addChild(sprite);
            });

            return this;
        }

        getValue(): number {
            return this.value;
        }

        get effect() {
            if (!this._effect || this._effect.getIsDestroyed()) {
                this._effect = new Effect.Numbers(this);
            }
            return this._effect;
        }
    }
}

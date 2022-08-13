namespace RG.Simplers {

    export class SpriteSheet {

        private _name: string;

        /**
         * Имя картинки - которая используется как spritesheet (без расширения .png)
         *
         * Рядом с картинкой обязательно должен лежать файл {name}.json с конфигурацией
         *
         * Требования к конфигурации:
         * - frames должны именоваться в виде {name}_frame_{number}.png
         * - animations должны именоваться в виде {name}_animation_{number}
         *
         * Например:
         *
         * name = 'fire.png'
         * - файл конфигурации называется 'fire.json'
         * - 1-ый фрейм имеет имя: 'fire_frame_1.png'
         * - 2-ый фрейм имеет имя: 'fire_frame_2.png'
         * ...
         * - 1-ая анимация имеет имя 'fire_animation_1'
         * - 2-ая анимация имеет имя 'fire_animation_2'
         * ...
         *
         * @param name
         */
        constructor(name: string) {
            this._name = name;
        }

        /**
         * Загружен ли сейчас ресурс с таким именем?
         */
        public is(name: string): boolean {
            return this._name === name;
        }

        /**
         * Использовать другой ресурс
         */
        public changeTo(name: string): this {
            this._name = name;
            return this;
        }

        /**
         * Получение текстуры по ее номеру в spritesheet
         */
        public getTexture(number: number | string): PIXI.Texture {
            return PIXI.Loader.shared.resources[this._name].textures![this._name + '_frame_' + number + '.png']
        }

        /**
         * Получение массива текстур по номеру анимации (подходит для замены текстур у PIXI.AnimatedSprite)
         */
        public getAnimationTextures(number: number = 1): PIXI.Texture[] {
            const sheet = PIXI.Loader.shared.resources[this._name].spritesheet!;
            return sheet.animations[this._name + '_animation_' + number];
        }

        /**
         * Создание PIXI.AnimatedSprite по номеру анимации с указанной скорость проигрывания
         */
        public createAnimatedSprite(options: { number?: number, speed?: number } = {}) : PIXI.AnimatedSprite {
            const sprite = new PIXI.AnimatedSprite(this.getAnimationTextures(options.number || 1));
            if (options.speed !== undefined)
                sprite.animationSpeed = options.speed;
            return sprite;
        }
    }
}

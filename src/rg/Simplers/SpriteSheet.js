var RG;
(function (RG) {
    var Simplers;
    (function (Simplers) {
        var SpriteSheet = /** @class */ (function () {
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
            function SpriteSheet(name) {
                this._name = name;
            }
            /**
             * Загружен ли сейчас ресурс с таким именем?
             */
            SpriteSheet.prototype.is = function (name) {
                return this._name === name;
            };
            /**
             * Использовать другой ресурс
             */
            SpriteSheet.prototype.changeTo = function (name) {
                this._name = name;
                return this;
            };
            /**
             * Получение текстуры по ее номеру в spritesheet
             */
            SpriteSheet.prototype.getTexture = function (number) {
                return PIXI.Loader.shared.resources[this._name].textures[this._name + '_frame_' + number + '.png'];
            };
            /**
             * Получение массива текстур по номеру анимации (подходит для замены текстур у PIXI.AnimatedSprite)
             */
            SpriteSheet.prototype.getAnimationTextures = function (number) {
                if (number === void 0) { number = 1; }
                var sheet = PIXI.Loader.shared.resources[this._name].spritesheet;
                return sheet.animations[this._name + '_animation_' + number];
            };
            /**
             * Создание PIXI.AnimatedSprite по номеру анимации с указанной скорость проигрывания
             */
            SpriteSheet.prototype.createAnimatedSprite = function (options) {
                if (options === void 0) { options = {}; }
                var sprite = new PIXI.AnimatedSprite(this.getAnimationTextures(options.number || 1));
                if (options.speed !== undefined)
                    sprite.animationSpeed = options.speed;
                return sprite;
            };
            return SpriteSheet;
        }());
        Simplers.SpriteSheet = SpriteSheet;
    })(Simplers = RG.Simplers || (RG.Simplers = {}));
})(RG || (RG = {}));

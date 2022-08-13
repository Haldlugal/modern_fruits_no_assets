/// <reference path="../../rg/Abstract/Effect.ts"/>

namespace Effect {

    import Animation = RG.Animation;
    import Events = RG.Animation.Events;
    
    type FireSheet = | "fire" | "big_fire"

    export class Fire extends RG.Abstract.Effect {
        public parent?: PIXI.Container;

        /**
         * PIXI элемент, контейнер содержаший всю компоненту
         */
        public readonly container: PIXI.AnimatedSprite;

        /**
         * Эффект изменения размера огня
         */
        public readonly animation: Animation.Container<'scaleY'>;

        /**
         * Ресурс, из которого берутся текстуры и анимация
         */
        public sheet: RG.Simplers.SpriteSheet = new RG.Simplers.SpriteSheet('fire');

        /**
         * Точка, из которой выходит огонь,
         */
        private fireSource: { x: number, y: number } = { x: -100, y: -100 };

        /**
         * Скорость анимации
         */
        private speed: number = 0.3;

        /**
         *
         */
        constructor(parent?: PIXI.Container) {
            super();

            this.container = this.sheet.createAnimatedSprite({speed: this.speed});
            if (parent) {
                this.setParent(parent);
            }
            this.stopContainer();

            this.animation = new Animation.Container(this.container);
            this.setupAnimation();
        }

        private setupAnimation() {
            this.animation
                .scaleVAlign('bottom')
                .scaleAlign('center')
                .on(Events.BeforeStart, () => {
                    this.animation.from({scaleY: this.container.scale.y});
                })
                .on(Events.Update, this.updatePosition.bind(this));

            this.to(1)
                .duration(2500);
            return this;
        }

        private updateFireSource(): this {
            const currentScale = { x: this.container.scale.x, y: this.container.scale.y };

            // Уменьшаем огонь в 0 - что бы огонь попал именно в ту точку, которую задали компоненте
            this.container.scale.x = 0;
            this.container.scale.y = 0;

            // теперь эта точка - источник огня
            this.fireSource = { x: this.container.x, y: this.container.y };

            // возвращаем оригинальный scale
            this.container.scale.x = currentScale.x;
            this.container.scale.y = currentScale.y;

            // подправляем позицию
            this.updatePosition();
            return this;
        }

        /**
         * Смещение по Y от центра (источника) огня в зависимости от текущего scale
         */
        private delta(): number {
            return (this.sheet.is('fire'))
                ? (1 - this.container.scale.y) * 80 - 80
                : (1 - this.container.scale.y) * 35 - 35;
        }

        /**
         * Позиционирование огня
         */
        private updatePosition() {
            this.container.x = this.fireSource.x - this.container.width / 2;
            this.container.y = this.fireSource.y - this.container.height - this.delta();
        }

        /**
         * Переключение огня
         */
        private changeFire(sheetName: FireSheet, scale: number): this {
            if (!this.sheet.is(sheetName)) {
                this.container.stop();
                this.container.textures = this.sheet.changeTo(sheetName).getAnimationTextures();
            }
            this.container.scale.y = scale;

            if (this.container.parent)
                this.updatePosition();
            return this;
        }

        setParent(parent: PIXI.Container) {
            this.parent = parent;
            this.parent.addChild(this.container);

            if (this.fireSource.x === -100 && this.fireSource.y === -100) {
                this.updateFireSource();
            }
            return this;
        }
        
        playContainer () {
            this.container.play();
            this.show();
            return this;
        }
        
        stopContainer () {
            this.container.stop();
            this.hide();
            return this;
        }

        /**
         * Переключиться на большой огонь с указанным scale
         */
        big(scale: number = 1) {
            this.changeFire('big_fire', scale);
            this.playContainer();
            return this;
        }

        /**
         * Переключиться на обычный огонь с указанным scale
         */
        normal(scale: number = 1) {
            this.changeFire('fire', scale);
            this.stopContainer();
            return this;
        }

        /**
         * Загружен ли сейчас большой огонь?
         */
        isBig() {
            return this.sheet.is('big_fire');
        }

        /**
         * Загружен ли сейчас обычный огонь?
         */
        isNormal() {
            return this.sheet.is('fire');
        }

        to(scaleY: number) {
            this.animation.to({
                scaleY
            });
            return this;
        }
    }
}

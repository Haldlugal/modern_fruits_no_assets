/// <reference path="../../rg/Abstract/Effect.ts"/>

namespace Effect {

    import Animation = RG.Animation;

    export class BookWinSymbol extends RG.Abstract.Effect {
        public parent?: PIXI.Container;

        /**
         * PIXI элемент, контейнер содержаший всю компоненту
         */
        public readonly container: PIXI.AnimatedSprite;

        /**
         * Эффект изменения позиции
         */
        public readonly animation: RG.Animation.Container<'scale'>;

        /**
         * Ресурс, из которого берутся текстуры и анимация
         */
        public sheet: RG.Simplers.SpriteSheet = new RG.Simplers.SpriteSheet('book_win');

        /**
         * Скорость анимации
         */
        private speed: number = 0.3;

        constructor(parent?: PIXI.Container, symbol?: ReelComponent.ReelSymbol) {
            super();

            this.container = this.sheet.createAnimatedSprite({speed: this.speed});

            if (parent) {
                this.setParent(parent);
            }

            if (parent && symbol) {
                const parentPos = parent.getGlobalPosition();
                const symbolPos = symbol.getGlobalPosition();
                const position = {
                    x: symbolPos.x + parentPos.x - (!RG.Helper.isMobile() ? -2 : 0),
                    y: symbolPos.y - parentPos.y
                };

                this.container.x = position.x;
                this.container.y = position.y;
            }

            this.animation = new Animation.Container(this.container);
            this.setupAnimation();
            this.bindAutoHide();
        }

        private setupAnimation() {
            this.container.play();

            if (RG.Helper.isMobile()) {
                //this.from(Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x).to(Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x)
                this.from(ReelWinSymbol.MOBILE_SCALE.x).to(ReelWinSymbol.MOBILE_SCALE.y);
            }
            else {
                this.from(0.99).to(0.99)
            }

            return this;
        }

        setParent(parent: PIXI.Container) {
            this.parent = parent;
            this.parent.addChild(this.container);
            return this;
        }

        from(scale: number) {
            this.animation.from({
                scale
            });
            return this;
        }

        to(scale: number) {
            this.animation.to({
                scale
            });
            return this;
        }
    }
}

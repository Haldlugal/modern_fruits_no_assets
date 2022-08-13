/// <reference path="../../rg/Abstract/Effect.ts"/>

namespace Effect {
    import Animation = RG.Animation;

    export class BlinkStar extends RG.Abstract.Effect {
        public container: PIXI.Sprite;
        public readonly animation: Animation.Container<'scale' | 'alpha' | 'angle'>;

        constructor(public readonly parent: PIXI.Container, x?: number, y?: number, container?: PIXI.Sprite) {
            super();
            this.container = container || PIXI.Sprite.from('blick_star');
            this.setupContainer(x, y);

            this.animation = new Animation.Container(this.container);
            this.setupAnimation();
            this.bindAutoHide();
        }

        private setupContainer(x?: number, y?: number) {
            this.container.anchor.set(0.5, 0.5);
            if (x !== undefined) {
                this.container.position.x = x;
            }
            if (y !== undefined) {
                this.container.position.y = y;
            }
            this.parent.addChild(this.container);
            return this;
        }

        private setupAnimation() {
            this.from(0, 0, 1)
                .to(2, 360, 0);
            return this;
        }

        setContainer(container: PIXI.Sprite) {
            if (this.container) {
                this.container.destroy();
            }
            this.container = container;
            this.parent.addChild(this.container);
            return this;
        }

        from(scale: number = 0, rotation: number = 0, alpha: number = 1): this {
            this.animation.from({
                scale,
                angle: rotation,
                alpha
            });
            return this;
        }

        to(scale: number = 2, rotation: number = 360, alpha: number = 0): this {
            this.animation.to({
                scale,
                angle: rotation,
                alpha
            });
            return this;
        }
    }
}

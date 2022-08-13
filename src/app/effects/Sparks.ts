/// <reference path="../../rg/Abstract/Effect.ts"/>

namespace Effect {
    import Events = RG.Animation.Events;

    type SparksItem = {
        sprite: PIXI.Sprite,
        offset: number,
        shouldChangeX: boolean
    }

    type SparkType = {
        value: number;
    };


    export class Sparks extends RG.Abstract.Effect {
        public parent?: PIXI.Container;
        /**
         * Контейнер, содержащий звездочки
         */
        public readonly container: PIXI.Container;

        public readonly animation: RG.Animation.Animation<SparkType>;

        public texture: PIXI.Texture;

        private sparks: SparksItem[] = [];

        private readonly width: number;
        private readonly height: number;

        private config : { [key: string] : [any, any] } = {
            "alpha": [ 1, 0.2 ],
            "scale": [ 1, 0.7 ],
            "color": [ PIXI.utils.hex2rgb(0xffffff), PIXI.utils.hex2rgb(0xd13f1c) ]
        };

        /**
         *
         * @param quantity
         * @param width
         * @param height
         * @param duration
         * @param texture
         * @param highlight
         */
        constructor(parent?: PIXI.Container, quantity: number = 40, width: number = 100, height: number = 100, texture: string = 'fire_dot', highlight: boolean = false) {
            super();

            this.texture = PIXI.Texture.from(texture);
            this.container = new RG.Simplers.Spacer(width, height, highlight);
            this.setSparks(quantity);
            if (parent) {
                this.setParent(parent);
            }

            this.width = this.container.width;
            this.height = this.container.height;

            this.animation = new RG.Animation.Animation();

            this.setupAnimation();
            this.bindAutoHide();
        }

        private setupAnimation () {
            this.animation
                .iterations(Infinity)
                .on(Events.Update, (props: { value: number }) => {
                    this.sparks.forEach((spark: SparksItem) => {
                        let elapsed = props.value + spark.offset;

                        if (elapsed > 1) {
                            elapsed -= 1;
                            if (spark.shouldChangeX) {
                                spark.sprite.x = Math.floor(Math.random() * this.width);
                                spark.shouldChangeX = false;
                            }
                            spark.sprite.visible = true;
                        } else {
                            spark.shouldChangeX = true;
                        }

                        spark.sprite.y = (1 - elapsed) * this.height;
                        spark.sprite.alpha = this.value(elapsed, this.config.alpha);
                        spark.sprite.scale.x = spark.sprite.scale.y =  this.value(elapsed, this.config.scale);
                        spark.sprite.tint = this.tint(elapsed);
                    })
                });
            
            this.from(0)
                .to(1);
        }

        private value(elapsed: number, config: [number, number]): number {
            return config[0] + (config[1] - config[0]) * elapsed;
        }

        private tint (elapsed: number): number {
            elapsed = elapsed * 0.5; // поправочка
            return PIXI.utils.rgb2hex([0, 1, 2].map((index: number) => {
                return this.value(elapsed, [ this.config.color[0][index], this.config.color[1][index] ]);
            }));
        }
        
        setParent(parent: PIXI.Container) {
            this.parent = parent;
            this.parent.addChild(this.container);
            return this;
        }
        
        setTexture(texture: string) {
            this.texture = PIXI.Texture.from(texture);
            return this;
        }

        setSparks(quantity: number) {
            this.sparks = [];
            this.container.removeChildren();
            // А теперь тупо добавляем в этот контейнер звездочки (столько штук, сколько запросили)
            for (let i = 0; i < quantity; i++) {
                const child: PIXI.Sprite = new PIXI.Sprite(this.texture);
                child.visible = false;
                this.container.addChild(child);
                this.sparks.push({
                    sprite: child,
                    offset: Math.random(),
                    shouldChangeX: false,
                });
            }
            return this;
        }

        from (value: number) {
            this.animation.from({value: value});
            return this;
        }

        to (value: number) {
            this.animation.to({value: value});
            return this;
        }
    }
}

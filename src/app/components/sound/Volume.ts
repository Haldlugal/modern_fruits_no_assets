import InteractionEvent = PIXI.interaction.InteractionEvent;

namespace Component.Sound {

    export class Volume extends PIXI.Sprite {

        private readonly segment: PIXI.Graphics;
        private readonly interactiveLayer: PIXI.Graphics;

        public static readonly STEPS_COUNT = 10;
        private steps: number;

        constructor(steps?: number) {
            super(PIXI.Texture.from('stake_bar_border'));

            this.steps = steps ? steps : Volume.STEPS_COUNT;

            this.segment = new PIXI.Graphics();
            this.segment.beginFill(0xf8e590, 1);
            // 1 - обводочка
            this.segment.drawRoundedRect(1, 1, this.width - 2, this.height - 2, 4);
            this.addChild(this.segment);

            //Слой для взаимодействия. Он несколько шире отображаемых сегментов
            let canBeChanged = false;
            this.interactiveLayer = new PIXI.Graphics();
            this.interactiveLayer.interactive = true;
            this.interactiveLayer.buttonMode = true;
            // возьмём чучь шире, чтобы попасть было легче
            this.interactiveLayer.beginFill(0x8B0000, 0.01).drawRect(-2, 0, this.width + 2, this.height)
                .on('mousedown', () => {
                    //При нажатии мышкой на компоненте подписываемся на движение мышкой и соответственно меняем изображение
                    canBeChanged = true;
                })
                .on('mouseup', (event: InteractionEvent) => {
                    if (canBeChanged) {
                        const mousePos = event.data.getLocalPosition(this.interactiveLayer).y;
                        this.changePosition(mousePos);
                        canBeChanged = false;
                    }

                })
                //Если мышку нажали на компоненте, а отпустили вне его
                .on('mouseupoutside', () => {
                    if (canBeChanged) {
                        canBeChanged = false;
                    }
                })
                .on('mousemove', (event: InteractionEvent) => {
                    if (canBeChanged) {
                        const mousePos = event.data.getLocalPosition(this.interactiveLayer).y;
                        this.changePosition(mousePos);
                    }
                })
                .endFill();
            this.addChild(this.interactiveLayer);
        }

        private changePosition(mousePos: number) {
            let position = Math.floor((this.height - mousePos) / (this.height / this.steps)) + 1;

            if (position > this.steps) {
                position = this.steps;
            } else if (position < 0) {
                position = 0;
            }
            const value = position / this.steps;
            this.redraw(value);
            this.emit('choice', value);
        }

        /**
         * @param position - значение громкости от 0 до 1
         */
        redraw(position: number = 0): void {
            const height = (this.height - 2) * position;
            this.segment.height = height;
            this.segment.position.y = this.height - height - 1;
        }

        disable() {
            this.interactiveLayer.interactive = false;
        }

        enable() {
            this.interactiveLayer.interactive = true;
        }
    }
}

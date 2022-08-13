namespace Component {

    export class Locker extends PIXI.Sprite {
        /**
         * Полупрозрачный контейнер с цветом как HTML background-color у страницы
         * накрывающий все остальные элементы и за счет interactive = true - не передает вниз управление
         */


        /**
         * @param width Ширина локера
         * @param height Высота локера
         */
        constructor(width: number, height: number) {
            super(PIXI.Texture.WHITE);

            this.name = '_locker';
            this.tint = 0x2a1c0d;
            this.alpha = 0;

            this.width = width;
            this.height = height;
            this.interactive = true;
        }

        static lock(stage: PIXI.Container, width: number, height: number): Locker {
            const locker = (stage.getChildByName('_locker') as Locker) || new Locker(width, height);
            locker.zIndex = 10000;
            stage.addChild(locker);
            return locker
        }

        static unlock(stage: PIXI.Container): void {
            stage.getChildByName('_locker')?.destroy();
        }
    }
}

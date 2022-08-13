namespace ReelComponent {

    export class ReelsWinLineAmount extends PIXI.Container {

        /**
         * Компонента для отображения числа
         */
        private numberImage: Component.NumberImage;

        constructor() {
            super();
            this.numberImage = new Component.NumberImage(0, 0, 'line_numbers');
            this.addChild(this.numberImage);
            this.zIndex = 1001;
            this.visible = true;
            this.position.set(0, 0);

            if (RG.Helper.isMobile()) {
                this.scale.set(
                    Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x,
                    Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y
                );
            } else {
                this.scale.set(1.5);
            }
        }

        /**
         * Показ текущей компоненты с указанием числа, который должен отобразиться в данный момент и его позицией
         */
        show(number: number, stage: PIXI.Container, isTotal: boolean = false) {
            this.numberImage.setValue(number);

            // const posX = stage.x + stage.width/2 + (!RG.Helper.isMobile() ? 10: -10);
            const positionY = stage.y + stage.height/2;

            this.x = stage.getGlobalPosition().x + stage.width/2 - this.width/2 + 25;
            this.y = stage.getGlobalPosition().y + 200;
            this.visible = true;
        }

        hide() {
            this.visible = false;
        }
    }
}

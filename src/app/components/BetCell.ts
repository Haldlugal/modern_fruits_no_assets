namespace Component {

    export class BetCell extends RG.Simplers.Spacer {

        //Если убрать ховер с кнопкис неактивными клеткамИ, с них уберется выделение
        private isActive: boolean = false;

        constructor(width: number, height: number) {
            super(width, height);

            this.beginFill(0xffc104);
            this.drawRect(0, 0, this.width, this.height);
            this.endFill();

            this.alpha = 0;
        }

        showHightLight() {
            this.alpha = 1;
        }

        hideHighLight() {
            if (!this.isActive) {
                this.alpha = 0;
            }
        }

        makeActive() {
            this.isActive = true;
            this.showHightLight();
        }

        makeInactive() {
            this.isActive = false;
            this.hideHighLight();
        }

    }
}

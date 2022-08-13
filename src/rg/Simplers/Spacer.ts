namespace RG.Simplers {
    export class Spacer extends PIXI.Graphics {

        constructor(width: number, height: number, highlight: boolean = false) {
            super();

            highlight && this.beginFill(0xff0000);
            this.drawRect(0, 0, width, height);
            highlight && this.endFill();

            if (highlight) {
              this.alpha = 0.8;
            }
        }
    }
}

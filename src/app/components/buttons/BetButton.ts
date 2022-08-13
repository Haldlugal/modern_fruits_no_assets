namespace Component {

    export class BetButton extends RG.Simplers.Spacer {

        public static readonly EVENT_CURSOR_OVER = 'cursor_over';
        public static readonly EVENT_CURSOR_OUT = 'cursor_out';
        public static readonly EVENT_CURSOR_CLICK = 'cursor_click';

        private isActive: boolean = false;

        constructor(width: number, height: number) {
            super(width, height);

            this.beginFill(0xffc104);
            this.drawRect(0, 0, this.width, this.height);
            this.endFill();
            this.alpha = 0;

            this.interactive = true;
            this.cursor = 'pointer';

            this.on('pointerover', () => {
                this.alpha = 1;
                this.emit(BetButton.EVENT_CURSOR_OVER);
            });
            this.on('pointerout', () => {
                if (!this.isActive) {
                    this.alpha = 0;
                }
                this.emit(BetButton.EVENT_CURSOR_OUT);
            });
            this.on('pointerdown', () => {
                console.log('bet clicked');
                this.emit(BetButton.EVENT_CURSOR_CLICK);
                this.makeActive();
            })
        }

        makeActive() {
            this.isActive = true;
            this.alpha = 1;
        }

        makeInactive() {
            this.isActive = false;
            this.alpha = 0;
        }
    }
}

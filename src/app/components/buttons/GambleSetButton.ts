namespace Component {

    export class GambleSetButton extends PIXI.Container {

        private readonly icon: RG.Button;
        private readonly button: RG.Button;

        constructor(icon: string, label: string, isBig: boolean = false) {
            super();

            this.icon = new RG.Button(icon, true);
            this.button = new RG.Button(isBig ? 'gamble_big_btn' : 'gamble_small_btn');

            this.icon.on('pointerover', () => {
                this.button.emit('pointerover');
            });
            this.icon.on('pointerout', () => {
                this.button.emit('pointerout');
            });

            const iconPosition = {
                x: (this.button.width - this.icon.width)/2, // по центру кнопки
                y: 15 - this.icon.height                              // 15px скрыто под кнопкой
            };

            this.icon
                .on('click', () => this.emit('click'))
                .position.set(iconPosition.x, iconPosition.y);

            this.addChild(this.icon);

            this.button
                .remap('disabled', 4)
                .on('click', () => this.emit('click'))
            ;
            this.button.label = new Text(label, {
                fontSize: 20
            });

            this.addChild(this.button);
        }

        disable(): this {
            this.icon.disable();
            this.button.disable();
            return this;
        }

        enable(): this {
            this.icon.disable(false);
            this.button.disable(false);
            return this;
        }
    }
}

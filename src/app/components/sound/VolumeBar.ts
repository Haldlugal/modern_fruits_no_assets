namespace Component.Sound {
    export class VolumeBar extends PIXI.Container {

        private readonly icon: PIXI.Sprite;
        private readonly volume: Volume;
        private previous = 0;

        private static readonly VERTICAL_PADDING_BOTTOM = 15;

        constructor(private readonly iconName: string, private value: number) {
            super();

            this.icon = RG.Helper.getSprite(iconName + (this.value > 0 ? '_on' : '_off'));
            this.icon.interactive = true;
            this.icon.buttonMode = true;

            this.volume = new Volume();

            this.addChild(this.icon, this.volume);

            RG.Helper.setCenterX(this.icon, this.volume);

            this.volume.position.y = this.icon.height + VolumeBar.VERTICAL_PADDING_BOTTOM;

            this.icon.on('click', () => {
                this.switch();
            });

            this.volume.on('choice', (value: number) => this.emit('choice', value));

            this.volume.redraw(this.value);
            if (this.value === 0) {
                this.previous = 1;
            }
        }

        switch () {
            let texturePostfix = '';
            if (this.value) {
                this.previous = this.value;
                this.value = 0;
                texturePostfix = '_off';
            } else {
                this.value = this.previous;
                this.previous = 0;
                texturePostfix = '_on';
            }
            this.emit('choice', this.value);
            this.icon.texture = PIXI.Texture.from(this.iconName + texturePostfix);
            this.volume.redraw(this.value);
        }
    }
}

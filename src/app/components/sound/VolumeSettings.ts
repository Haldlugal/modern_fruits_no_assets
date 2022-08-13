namespace Component.Sound {

    export class VolumeSettings extends PIXI.Container {
        private readonly BOX_BORDER = 6;

        private readonly ambient: VolumeBar;
        private readonly effect: VolumeBar;
        constructor(initialSoundVolume: number, initialAmbientVolume: number) {
            super();
            this.interactive = true;

            const background = new PIXI.Graphics();

            background.lineStyle(this.BOX_BORDER, 0xf7e48f, 0.75)
                .beginFill(0x274400, 1)
                .drawRoundedRect(0,
                    0,
                    160,
                    250,
                    16
                )
                .endFill();
            this.addChild(background);

            this.ambient = new VolumeBar('icon_sound_ambient', initialAmbientVolume);
            RG.Helper.setCenterY(this, this.ambient);
            // 5 - рамочка
            this.ambient.position.x = background.width / 4 - this.ambient.width / 2 + 5;
            this.addChild(this.ambient);


            this.effect = new VolumeBar('icon_sound_effects', initialSoundVolume);
            RG.Helper.setCenterY(this, this.effect);
            // 5 - рамочка
            this.effect.position.x = 3 * background.width / 4 - this.effect.width / 2 - 5;
            this.addChild(this.effect);

            //Обработчики
            this.ambient.on('choice', (value: number) => {
                this.emit('ambient_sound_choice', value);
            });

            this.effect.on('choice', (value: number) => {
                this.emit('sound_effect_choice', value);
            });
        }

        switch () {
            this.ambient.switch();
            this.effect.switch();
        }
    }
}


namespace Component {
    export class SoundButton extends RG.Button {

        public isVolumeOpened: boolean = false;
        constructor() {
            super('sound_on');

            this
                .on('click', () => {
                    RG.GameSound.instance.play('btn_click');
                    this.emit('switch_sounds');
                })
                .on('mouseover', () => {
                    this.emit('open_volume');
                })

            ;
        }

        soundOn () : this {
            this.icon = 'sound_on';
            return this;
        }

        soundOff () : this {
            this.icon = 'sound_off';
            return this;
        }
    }
}

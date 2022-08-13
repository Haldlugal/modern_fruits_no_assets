namespace Component {

    export class HelpButton extends RG.Button {

        constructor(close: boolean = false) {
            super(close ? 'help_close' : 'help');

            this
                .remap('disabled', 4)
                .on('click', () => {
                    RG.GameSound.instance.play('btn_click');
                });
        }
    }
}

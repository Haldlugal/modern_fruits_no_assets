
namespace Component {
    import TextInput = PIXI.TextInput;

    export class GambleAmount extends PIXI.Container{

        private readonly input: TextInput;
        private static MARGIN_TOP = 15;

        constructor(width: number) {
            super();

            let offset = GambleAmount.MARGIN_TOP;
            const label = new Text('GAMBLE_POPUP_AMOUNT_TITLE', {fontSize: !RG.Helper.isMobile() ? 20 : 42});

            offset += label.height + GambleAmount.MARGIN_TOP;

            const btnDown = (new RG.Button('arrow_popup_left'))
                .remap('down', 2)
                .remap('disabled', 3)
                .on('click', () => this.emit('decrease_value'));
            const btnUp = (new RG.Button('arrow_popup_right'))
                .remap('down', 2)
                .remap('disabled', 3)
                .on('click', () => this.emit('increase_value'));

            this.input = new PIXI.TextInput({
                input: {
                    fontFamily: 'Roboto',
                    fontSize: !RG.Helper.isMobile() ? '18pt' : '36pt',
                    padding: '7px',
                    width: !RG.Helper.isMobile() ? String(width-60)+'px' : '400px',
                    color: '#fbe595',
                    textAlign: 'center'
                },
                box: {
                    default: {width:  String(width-60)+'px', fill: 0x24190b, rounded: 16, stroke: {color: 0xfbe595, width: 2}},
                    focused: {width:  String(width-60)+'px', fill: 0x24190b, rounded: 16, stroke: {color: 0xfbe595, width: 2}}
                }
            });
            btnDown.position.set(
                0,
                offset + this.input.y + (this.input.height - btnDown.height) / 2
            );

            this.input.position.set(
                btnDown.width + 10,
                offset
            );
            this.input.restrict = '0123456789.';
            this.input.text = String(0);

            btnUp.position.set(
                btnDown.width + this.input.width + 20,
                this. input.y + (this.input.height - btnUp.height) / 2
            );
            this.addChild(this.input);
            this.addChild(btnDown);
            this.addChild(btnUp);

            label.x = (this.width - label.width) / 2;

            this.input.on('input', (text: string) => {
                this.emit('input_value', text);
            });

            this.addChild(label);
        }

        setValue(value: number) {
            this.input.text = String(value);
        }

        getValue(): number {
            return Number(this.input.text);
        }
    }
}

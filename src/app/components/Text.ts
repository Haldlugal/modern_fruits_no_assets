namespace Component {

    export class Text extends RG.Text {

        public static DEFAULTS: any | PIXI.TextStyle = {
            fontFamily: 'Roboto',
            fontSize: 25,
            fill: '#fcffae',
            stroke: '#000',
            strokeThickness: 4,
            dropShadow: false,
            fontWeight: 'Bold'
        };

        constructor(rawText: string, style: any | PIXI.TextStyle = {}, translatable: boolean = true, toUppercase = false) {
            super(rawText, Object.assign({}, Text.DEFAULTS, style), translatable, toUppercase);
        }
    }
}

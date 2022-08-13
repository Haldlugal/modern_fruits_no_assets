namespace RG {

    export class Text extends PIXI.Text {

        private _translatable: boolean;
        public toUppercase: boolean;

        public static DEFAULTS: any | PIXI.TextStyle = {
            fontSize: 20,
            fill: '#fbe595',
            fontFamily: 'Roboto',
            fontWeight: 500
        };

        public set text(text: string) {
            super.text = this._translatable ? Translator.get(text) : text;
            if (this.toUppercase) {
                super.text = text.toUpperCase();
            }
            this.emit('change', super.text);
        }

        public set translatable(translatable: boolean) {
            this._translatable = translatable;
        }

        constructor(rawText: string, style: any | PIXI.TextStyle = {}, translatable: boolean = true, toUppercase = false) {
            let text = translatable ? Translator.get(rawText) : rawText;
            if (toUppercase) {
                text = text.toUpperCase();
            }
            super(text, Object.assign({}, Text.DEFAULTS, style));
            this._translatable = translatable;
            this.toUppercase = toUppercase;
        }

        public get text() {
            return super.text;
        }
    }
}

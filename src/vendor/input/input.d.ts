declare namespace PIXI {
    export class TextInput extends Container {
        substituteText : boolean;
        placeholder : string;
        placeholderColor : number;
        text : string;
        maxLength : number;
        restrict : RegExp | string;
        disabled : boolean;

        constructor(settings : {
            input: object,
            box: any
        })

        focus() : void
        select() : void
        blur() : void
        setInputStyle( key : string, value : string ) : void

    }
}

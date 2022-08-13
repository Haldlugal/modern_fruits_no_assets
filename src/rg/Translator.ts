namespace RG {

    export type TranslatorValuesType = { [key: string]: string; };

    export class Translator {

        static values: TranslatorValuesType = {};

        public static get(key: string): string {
            return this.values.hasOwnProperty(key) ? this.values[key] : key;
        }

        public static set(values: TranslatorValuesType): void {
            for (let key in values) {
                if (values.hasOwnProperty(key))
                    this.values[key] = values[key];
            }
        }
    }
}

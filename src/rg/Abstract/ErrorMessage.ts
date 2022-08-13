namespace RG.Abstract {

    type GeneralObject<T=unknown> = Record<string, T>

    export abstract class ErrorMessage extends PIXI.Container{

        public button: RG.Button;
        protected readonly message: string;
        protected readonly title: string;

        protected constructor(message: Error | string, title: string, iconName: string) {
            super();
            console.error('ErrorMessage', message);
            if (typeof message === 'string') {
                this.message = message;
            }
            else {
                this.message = this.parseError(message);
            }
            this.title = title;
            this.button = new RG.Button(iconName);
        }

        protected parseError(error: Error, defaultMessage?: string) {
            const f = (message?: unknown) => {
                if (message === 'Network Error') {
                    message = RG.Translator.get('PROBLEM_WITH_INTERNET_CONNECTION');
                }
                if (!message || typeof message !== 'string') {
                    message = defaultMessage || 'Please check your internet connection or try later';
                }
                return message as string;
            };
            const arrayValues = (mixed: unknown): string[] => {
                if (!mixed) {
                    return [];
                }
                if (typeof mixed === 'string') {
                    return [mixed];
                }
                if (typeof mixed !== 'object') {
                    return [];
                }
                if (!Array.isArray(mixed)) {
                    const object = mixed as GeneralObject<string>;
                    const values: string[] = [];
                    for (let key in object) {
                        values.push(object[key]);
                    }
                    return values;
                }
                return mixed as string[];
            };
            const hasKey = (mixed: unknown, key: string): boolean => {
                return Object.prototype.hasOwnProperty.call(mixed, key);
            };
            const parseResponse = (data: GeneralObject) => {
                if (hasKey(data, 'errors')) {
                    let errors = arrayValues(data.errors);
                    errors = errors.map(e => arrayValues(e).join('\n'));
                    return f(errors.join('\n'));
                }
                if (hasKey(data, 'error') && data.error && hasKey(data.error, 'description')) {
                    return f((data.error as GeneralObject).description);
                }
                if (hasKey(data, 'description')) {
                    return f(data.description);
                }
                if (hasKey(data, 'message')) {
                    return f(data.message);
                }
            };
            if (error) {
                if (typeof error === 'string') {
                    return f(error)
                }
                let message: string | undefined;
                if (typeof error === 'object') {
                    if (message = parseResponse((error as unknown) as GeneralObject)) { // general error
                        return message
                    }
                }
            }
            return f()
        }
    }
}

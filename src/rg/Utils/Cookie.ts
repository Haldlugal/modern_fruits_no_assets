namespace RG.Utils.Cookie {

    /**
     * Код цельнотянутый с https://learn.javascript.ru/cookie
     */
    export let prefix: string = '';

    /**
     * Возвращает куки с указанным name, или undefined, если ничего не найдено
     */
    export function get(name: string) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + (prefix + '_' + name).replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    /**
     * Устанавливает куки с указанным name и значением и опциями
     */
    export function set(name: string, value: string | number, options: { [key: string]: any } = {}) {

        options = {
            path: '/',
            // при необходимости добавьте другие значения по умолчанию
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(prefix + '_' + name) + "=" + encodeURIComponent(value);
        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }

    /**
     * Удаляет куки с указанным name
     */
    export function del(name: string) {
        set(prefix + '_' + name, "", {'max-age': -1});
    }
}

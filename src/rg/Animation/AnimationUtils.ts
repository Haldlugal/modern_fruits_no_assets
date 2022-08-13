namespace RG.Animation.Utils {
    /**
     * Итерирует по массиву в поиске нужного значения (остановки через функцию fn)
     * @param {Array<T>} arr
     * @param {(value: T, index: number) => (boolean | void)} fn
     * @param {boolean} isReverse итерация от последнего к первому?
     * @returns {number} возвращает индекс массива, на котором закончилась итерация (или первый/последний индекс)
     */
    export function iterateArrayWithReverse<T>(arr: Array<T>, fn: (value: T, index: number) => boolean | void, isReverse: boolean = false): number {
        const len = arr.length;
        let i = isReverse ? len - 1 : 0;
        while (isReverse ? i >= 0 : i < len) {
            const result = fn(arr[i], i);
            if (result === false) {
                break;
            }
            isReverse ? i-- : i++;
        }
        if (i >= len) {
            return len - 1;
        }
        if (i < 0) {
            return 0;
        }
        return i;
    }

    /**
     * Возвращает текущее время
     * @returns {number}
     */
    export function getCurrentTime(): number {
        return (typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now());
    }

    export abstract class ArrayManager<T, C extends (...args: any[]) => T> extends Array<T> {
        /**
         * Создаёт элемент в массиве менеджера
         * @param {Parameters<C extends (...args: any[]) => T>} args
         * @returns {T}
         */
        abstract createItem(...args: Parameters<C>): T;

        /**
         * Создаёт и добавляет элемент в конец в массиве менеджера
         * @param {Parameters<C extends (...args: any[]) => T>} args
         * @returns {T}
         */
        add(...args: Parameters<C>): T {
            const item = this.createItem(...args);
            this.push(item);
            return item;
        }

        /**
         * Создаёт и добавляет элемент в начало в массиве менеджера
         * @param {Parameters<C extends (...args: any[]) => T>} args
         * @returns {T}
         */
        prepend(...args: Parameters<C>): T {
            const item = this.createItem(...args);
            this.unshift(item);
            return item;
        }

        /**
         * Вставляет элемент на указанный индекс (перед текущим элементом на этом индексе) в массиве менеджера
         * @param {number} index
         * @param {Parameters<C extends (...args: any[]) => T>} args
         * @returns {T}
         */
        addOnIndex(index: number, ...args: Parameters<C>): T {
            const item = this.createItem(...args);
            this.splice(index, 0, item);
            return item;
        }

        /**
         * Заменяет элемент в массиве менеджера
         * @param {T} item
         * @param {Parameters<C extends (...args: any[]) => T>} args
         * @returns {false | T}
         */
        replace(item: T, ...args: Parameters<C>): T | false {
            const index = this.indexOf(item);
            return this.replaceByIndex(index, ...args);
        }

        /**
         * Заменяет элемент в массиве менеджера по индексу
         * @param {number} index
         * @param {Parameters<C extends (...args: any[]) => T>} args
         * @returns {false | T}
         */
        replaceByIndex(index: number, ...args: Parameters<C>): T | false {
            if (index < 0 || index >= this.length) {
                return false;
            }
            const newItem = this.createItem(...args);
            this.splice(index, 1, newItem);
            return newItem;
        }

        /**
         * Удаляет элемент в массиве менеджера
         * @param {T} item
         * @returns {this<T, C extends (...args: any[]) => T>}
         */
        remove(item: T) {
            const index = this.indexOf(item);
            if (index !== -1) {
                this.splice(index, 1);
            }
            return this;
        }

        /**
         * Очищает элементы в массиве менеджера
         * @returns {this<T, C extends (...args: any[]) => T>}
         */
        clear() {
            this.splice(0, this.length);
            return this;
        }
    }
}

/// <reference path="./AnimationUtils.ts" />

namespace RG.Animation {
    export class Manager extends Utils.ArrayManager<Animation<KeyframeProperties>, (item: Animation<KeyframeProperties>) => Animation<KeyframeProperties>> {
        createItem(item: Animation<KeyframeProperties>): Animation<KeyframeProperties> {
            return item
        }

        /**
         * Обновляет все анимации в менеджере
         * @param {number} time
         * @returns {boolean}
         */
        update(time?: number): boolean {
            if (!this.length) {
                return false;
            }

            time = time || Utils.getCurrentTime();

            for (let item of this) {
                if (!item.update(time)) {
                    this.remove(item)
                }
            }

            return true;
        }
    }

    export namespace Manager {
        export const shared = new Manager()
    }
}

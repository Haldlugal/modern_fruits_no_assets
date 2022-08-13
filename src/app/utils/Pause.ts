namespace Utils {

    type DelayerTimerConfig = {
        timer: number,
        resolver: () => void
    }

    export class Pause {

        private static timers: { [key: string]: DelayerTimerConfig } = {};

        /**
         * Приостановка выполнения на указанное кол-во ms
         */
        public static async delay(time: number, name: string = 'default') : Promise<void> {
            Pause.break(name);

            return new Promise(resolve => {
                Pause.timers[name] = {
                    timer: setTimeout(() => {
                        resolve();
                        delete Pause.timers[name]
                    }, time),
                    resolver: resolve
                }
            })
        }

        public static break(name: string = 'default') : void {
            const obj = Pause.timers[name];
            if (obj) {
                clearTimeout(obj.timer);
                obj.resolver();
                delete Pause.timers[name]
            }
        }
    }
}

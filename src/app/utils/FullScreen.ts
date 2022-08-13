namespace Utils {

    export class FullScreen {

        /**
         * Приостановка выполнения на указанное кол-во ms
         */
        public static open(element?: any): Promise<void> {
            if (!element)
                element = document.documentElement;

            if (element.requestFullscreen) {
                return element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { /* Firefox */
                return element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                return element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                return element.msRequestFullscreen();
            }
            return Promise.resolve();
        }

        public static close(): Promise<void> {
            const element: any = document;
            if (element.exitFullscreen) {
                return element.exitFullscreen();
            } else if (element.mozCancelFullScreen) { /* Firefox */
                return element.mozCancelFullScreen();
            } else if (element.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                return element.webkitExitFullscreen();
            } else if (element.msExitFullscreen) { /* IE/Edge */
                return element.msExitFullscreen();
            }
            return Promise.resolve();
        }
    }
}

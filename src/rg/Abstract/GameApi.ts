namespace RG.Abstract {

    export abstract class GameApi extends PIXI.utils.EventEmitter{

        protected axios: AxiosInstance;
        public token?: string;
        protected devMode: boolean;

        /**
         * Хост, где расположено php api (например https://some.host.com/games/more)
         * Может быть пустой строкой (тогда на том же хосте, где и игра)
         */
        protected readonly host: string;

        /**
         * API identifier текущей игры
         */
        protected readonly gid: string;

        /**
         * Player identifier текущей игры
         */
        protected pextid?: string;

        protected constructor(host: string, gid: string, token?: string, devMode = false) {
            super();
            this.host = host;
            this.gid = gid;
            this.token = token;
            this.axios = axios.create({ baseURL: this.host });
            this.devMode = devMode;
        }

        /**
         * Открытие игры, задача получить от сервера токен, с которым можно дальше делать запросы
         */
        public abstract open(): Promise<boolean>;

        protected abstract callApiMethod(method: string, data: any) : Promise<{ [key: string] : any; }>;

        /**
         * Инициализации игры, задача получить все необходимые данные о пользователе, балансе, настройки игры
         */
        public abstract init(): Promise<any>

        public makeid(length: number) {
            let result = '';
            const chars = '0123456789abcdef';
            const charLen = chars.length;
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * charLen));
            }
            return result;
        }

        public generatePextid(key: string) {
            let pextid = localStorage.getItem(key) as string;
            if (!pextid) {
                pextid = this.makeid(32);
                localStorage.setItem(key, pextid);
            }
            this.pextid = pextid;
            return this;
        }
    }
}

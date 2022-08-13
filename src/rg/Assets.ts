namespace RG {

    export class Assets {

        /**
         * Список всех ассетов, поделенных на группы
         */
        public _assets: Array<string[]> = [];

        /**
         * URL, откуда загружать список ассетов
         */
        private _assetsUrl: string;

        /**
         * Флажок - загружен ли список
         */
        private _fetched: boolean = false;

        /**
         * Лоадер, которым загружать ресурсы
         */
        private _loader: PIXI.Loader;

        constructor(url: string, loader?: PIXI.Loader) {
            this._assetsUrl = url;
            this._loader = loader || PIXI.Loader.shared;
        }

        /**
         * Загрузка списка всех ассетов
         */
        public fetch(): Promise<boolean> {
            this._fetched = false;
            return axios.create({}).get(this._assetsUrl)
                .then((a) => {
                    this._assets = a.data || [];
                    this._fetched = true;
                    return true;
                }).catch((e) => {
                    console.error('ERROR: can not load assets: ', e);
                    return false;
                })
        }

        public load(index: number): Promise<boolean> {
            if (!this._fetched) {
                return Promise.resolve(false);
            }
            return new Promise<boolean>((resolve) => {
                (this._assets[index] || []).forEach((path: string) => {
                    // имя ассета = имя файла без расширения
                    const name = path.replace(/.+\/([^\/]+)\.[^\.]+$/, '$1');
                    this._loader.add(name, path);
                });
                this._loader.load(() => {
                    resolve(true);
                })
            })
        }
    }
}

namespace RG {
    export class Helper {

        public static sleep (ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        public static getSprite (textureName: string): PIXI.Sprite {
            return new PIXI.Sprite(PIXI.Texture.from(textureName, {}, true))
        }

        public static setCenter(parent: PIXI.Container, child: PIXI.Container): void {
            this.setCenterX(parent, child);
            this.setCenterY(parent, child);
        }

        public static setCenterX (parent: PIXI.Container | any, child: PIXI.Container): void {
            child.position.x = (parent.width - child.width) / 2;
        }

        public static setCenterY (parent: PIXI.Container, child: PIXI.Container): void {
            child.position.y = (parent.height - child.height) / 2;
        }

        public static setAnchorCenter (parent: PIXI.Container, child: PIXI.Sprite): void {
            child.position.set(parent.width / 2, parent.height / 2);
            child.anchor.set(0.5);
        }

        public static highlight (parent: PIXI.Container, alpha = 0.5, color = 0xff0a11): void {
            const bg = new PIXI.Graphics();
            bg.lineStyle(1, color, 1).beginFill(color, alpha);
            bg.drawRect(0,0, parent.width, parent.height);
            parent.addChild(bg);
        }

        /**
         * Мобильное устройство?
         * @returns {boolean}
         */
        public static isMobile(): boolean {
            return PIXI.utils.isMobile.any;
        }

        /**
         * Преобразует исходный массив в массив чисел
         */
        public static mapNumberArray(input: any[]): number[] {
            return input.map((e: any) => Number(e));
        }

        /**
         * Возвращает случайное целое число между введёнными
         * @param min
         * @param max
         */
        public static randomInt (min: number = 0, max: number = 100) {
            return min + Math.round((max - min) * Math.random());
        }
    }
}

namespace Component {

    export class WinPoint extends PIXI.Container {

        private readonly normalTexture = PIXI.Texture.from('line_dot1');
        private readonly overTexture = PIXI.Texture.from('line_dot2');
        public winLine: Component.WinLine;

        constructor(stage: PIXI.Container, winLine: Component.WinLine, yLeft: number = 0, yRight = 0,  maxWidth: number) {
            super();
            this.winLine = winLine;
            const btnWidth = this.getWidthButton();
            const leftPosition = SceneHelper.LEFT_OFFSET + 23 - (RG.Helper.isMobile() ? 2 : 0);
            const rightPosition = maxWidth + SceneHelper.LEFT_OFFSET - btnWidth - 25 + (RG.Helper.isMobile() ? 3 : 0);
            stage.addChild(this);
            yRight += SceneHelper.MOBILE_OFFSET_TOP;
            yLeft += SceneHelper.MOBILE_OFFSET_TOP;

            // Добавляем левую кнопку
            this.makeButton(leftPosition, yLeft)
                .on('pointerover', this.onButtonOver, this)
                .on('pointerout', this.onButtonOut, this);

            // Добавляем правую кнопку
            this.makeButton(rightPosition, yRight)
                .on('pointerover', this.onButtonOver, this)
                .on('pointerout', this.onButtonOut, this);
        }

        /**
         * Создании кнопки в определенных координатах
         * @param x
         * @param y
         */
        makeButton(x: number, y: number) {
            const btn = new PIXI.Sprite(this.normalTexture);
            btn.position.set(x, y);
            btn.buttonMode = true;
            btn.interactive = true;
            if (RG.Helper.isMobile()) {
                btn.scale.set(SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x, SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y);
            }
            this.addChild(btn);
            return btn;
        }

        getWidthButton() {
            const btn = new PIXI.Sprite(this.normalTexture)
            return btn.width
        }

        /**
         * Событие при наведении мышкой над кнопкой (левой или правой)
         */
        onButtonOver() {
            this.winLine.show(); // линия
            (this.children[0] as PIXI.Sprite).texture = this.overTexture; // левая кнопка
            (this.children[1] as PIXI.Sprite).texture = this.overTexture; // правая кнопка
        }

        /**
         * Событие при убирании мышки с кнопки (левой или правой)
         */
        onButtonOut() {
            this.winLine.hide(); // линия
            (this.children[0] as PIXI.Sprite).texture = this.normalTexture; // левая кнопка
            (this.children[1] as PIXI.Sprite).texture = this.normalTexture; // правая кнопка
        }

        /**
         * Прилепить, принудительно показывать линию и подсвеченные кнопки
         * и не реагировать на наведениии на кнопки
         */
        pin(): this {
            (this.children[0] as PIXI.Sprite).interactive = false; // левая кнопка
            (this.children[1] as PIXI.Sprite).interactive = false; // правая кнопка
            this.onButtonOver();
            return this;
        }

        /**
         * Отлепить, убрать поведении заданное в pin() (вернуться к оыбчному) и скрыть линию
         */
        unpin(): this {
            this.alpha = 1;
            (this.children[0] as PIXI.Sprite).interactive = true; // левая кнопка
            (this.children[1] as PIXI.Sprite).interactive = true; // правая кнопка
            this.onButtonOut();
            return this;
        }

        getPositionY(): number {
            return this.children[0].position.y;
        }

        getLineHeight(): number {
            return this.winLine.height;
        }
    }
}

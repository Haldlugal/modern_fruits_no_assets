namespace Component {

    export class WinLine extends PIXI.Container {

        public number = 0;
        private HEIGHT_DIGIT = 12;
        // сдвиг для мобилки 5й линии
        private REVERSE_LINE_MOBILE_MARGIN_TOP = 80;

        constructor(stage: PIXI.Container, number: number, y: number = 0, maxWidth: number, isReverseLine: boolean = false) {
            super();
            const leftOffset = SlotPosition.OFFSET_X + 78 - (RG.Helper.isMobile() ? 37 : 0);
            this.zIndex = 1000;
            stage.addChild(this);
            y += SceneHelper.MOBILE_OFFSET_TOP + 20;
            // Добавляем линию
            this.makeLine(number, leftOffset, y, isReverseLine);
        }

        /**
         * Создание нумерованной линии в определенных координатах
         * @param number
         * @param x
         * @param y
         * @param isReverseLine
         */
        makeLine(number: number, x: number, y: number, isReverseLine: boolean) {
            const line = PIXI.Sprite.from('line_' + number);
            this.number = number;
            if (isReverseLine) {
                y = y - (!RG.Helper.isMobile()
                    ? line.height - 2*this.HEIGHT_DIGIT
                    : line.height - this.REVERSE_LINE_MOBILE_MARGIN_TOP);
            }
            else {
                y = y - this.HEIGHT_DIGIT;
            }

            if (!RG.Helper.isMobile()) {
                x -= 6;
            }

            line.position.set(x, y);
            line.visible = true;
            if (RG.Helper.isMobile()) {
                line.scale.set(SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x, SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y);
            }
            this.addChild(line);
            return line;
        }

        /**
         * Полностью скрыть компоненту (например при переходе в help)
         */
        hide(): this {
            this.visible = false;
            this.children[0].visible = false;
            return this;
        }

        /**
         * Отображать компоненту
         */
        show(): this {
            this.visible = true;
            this.children[0].visible = true;
            return this;
        }
    }

    export class YCoords {
        lineNumber: number;
        lineY: number;
        winPointsY: WinPointsYCoord;
        constructor(number: number, y: number, winPointsY: WinPointsYCoord) {
            this.lineNumber = number;
            this.lineY = y;
            this.winPointsY = winPointsY;
        }

    }

    export class WinPointsYCoord {
        left: number;
        right: number;
        constructor(left: number, right: number){
            this.left = left;
            this.right = right;
        }
    }
}

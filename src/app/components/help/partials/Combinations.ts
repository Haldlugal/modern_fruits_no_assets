namespace HelpSceneComponent {

    export class Combinations extends PIXI.Container {

        /**
         * Стиль, которым писать комбинации
         */
        private readonly textStyle: PIXI.TextStyle;

        private combinations: SymbolCombinations;

        private stake: number;

        private lineHeight: number;

        private numbersOffset: number;

        private numberSize: number;

        private textColor?: string;

        constructor(combinations: SymbolCombinations, stake: number, textSize?: number, numberSize?: number, lineHeight?: number, numberOffset?: number, textColor?: string) {
            super();

            // Стиль, которым писать выигрышние комбинации
            this.textStyle = new PIXI.TextStyle({
                fontFamily: 'Roboto',
                fontSize: textSize ? textSize : (!RG.Helper.isMobile() ? 30 : 24),
                fill: textColor ? textColor : '#333'
            });

            this.textColor = textColor;
            this.numberSize = numberSize ? numberSize : (!RG.Helper.isMobile() ? 30 : 30);
            this.lineHeight = lineHeight ? lineHeight : (!RG.Helper.isMobile() ? 32 : 32);
            this.numbersOffset = numberOffset ? numberOffset : !RG.Helper.isMobile() ? 52 : 62;
            this.combinations = combinations;
            this.stake = stake;

            this.rebuild();
        }

        public setCombinations(combinations: SymbolCombinations, rebuild: boolean = true): this {
            this.combinations = combinations;
            return (rebuild) ? this.rebuild() : this;
        }

        public setStake(stake: number, rebuild: boolean = true): this {
            this.stake = stake;
            return (rebuild) ? this.rebuild() : this;
        }

        /**
         * children[2]+ - Выигрышные комбинации
         */
        private rebuild(): this {

            // Удаляем ранее установленные комбинации
            if (this.children.length > 0) {
                this.removeChildren().forEach((child: PIXI.DisplayObject) => child.destroy());
            }

            // Отображаем новые комбинации
            this.combinations.keys.forEach((key: number, index: number) => {

                const y = this.lineHeight * index;

                // кол-во символов, которые необходимо собрать для этой комбинации
                const textToDraw = new RG.Text(key + 'x -', this.textStyle);
                textToDraw.position.x = 0;
                textToDraw.position.y = y;
                this.addChild(textToDraw);

                // размер выигрыша для этой комбинации (с учетом текущей ставки)
                const winning = new RG.Text('0', {
                    fontSize: this.numberSize,
                    fontWeight: 900,
                    fill: this.textColor ? this.textColor : '#333'
                });
                winning.position.set(this.numbersOffset, y);
                this.addChild(winning);
                winning.text = String(this.combinations.getValue(key, this.stake));
            });

            return this;
        }
    }
}

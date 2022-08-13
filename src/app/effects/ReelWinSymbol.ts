/// <reference path="../../rg/Abstract/Effect.ts"/>

namespace Effect {
    import Animation = RG.Animation;

    type ScaleProps = 'posX' | 'posY'| 'alpha';

    /**
     * Выигрышний символ на барабане
     */
    export class ReelWinSymbol extends RG.Abstract.Effect {
        public readonly container: PIXI.Container = new PIXI.Container();

        /**
         * К какому символу привязан выигрышный символ
         */
        private readonly symbol: ReelComponent.ReelSymbol;

        public static readonly MOBILE_SCALE = {
            x: 0.86,
            y: 0.87,
        };

        /**
         * @param parent
         * @param symbol Компонента символа, к которой привязан выигрышний символ
         * @param expanded
         */
        constructor(public readonly parent: PIXI.Container, symbol: ReelComponent.ReelSymbol, expanded?: number | boolean) {
            super();
            this.symbol = symbol;
            this.getIconSprite(expanded);
            this.setupContainer();
        }

        private getIconSprite(expanded?: number | boolean) {
            const texture = ReelComponent.ReelSymbol.texture(this.symbol.getSymbolId(), true);
            const sprite = new PIXI.Sprite(texture);
            this.container.addChild(sprite);
        }

        /**
         * Показать на позиции, где находится указанный символ
         */
        private setupContainer() {
            const parentPos = this.parent.getGlobalPosition();
            const symbolPos = this.symbol.getGlobalPosition();

            const position = {
                x: symbolPos.x + parentPos.x,
                y: symbolPos.y - parentPos.y
            };

            if (!this.container.parent) {
                this.parent.addChild(this.container);
            } else {
                this.container.setParent(this.parent);
            }

            this.container.x = position.x;
            this.container.y = position.y;

            return this;
        }

    }
}

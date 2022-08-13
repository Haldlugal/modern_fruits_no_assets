namespace HelpSceneComponent {

    export class CombinationComponent extends PIXI.Container {

        private readonly combinations: Combinations;

        public static readonly SYMBOL_WIDTH = 200;
        public static readonly SYMBOL_HEIGHT = 168;
        public static readonly COMBINATIONS_PADDING_TOP = 25;

        constructor(
            symbolIds: number[],
            combinations: SymbolCombinations,
            stake: number,
            imageWidth?: number,
            imageHeight?: number,
            vertical = false
        ) {
            super();
            const image = new PIXI.Sprite();
            for (let i = 0; i<symbolIds.length; i++) {
                image.texture = ReelComponent.ReelSymbol.texture(symbolIds[i]);
                this.addChild(image);
                image.width = imageWidth ? imageWidth : CombinationComponent.SYMBOL_WIDTH;
                image.height = imageHeight ? imageHeight : CombinationComponent.SYMBOL_HEIGHT;
                image.x = image.width * i;
            }

            this.combinations = new Combinations(combinations, stake);
            this.addChild(this.combinations);
            if (vertical) {
                RG.Helper.setCenterX(this, this.combinations);
                RG.Helper.setCenterX(this, image);
                this.combinations.position.y = (imageHeight ? imageHeight : CombinationComponent.SYMBOL_HEIGHT) + 5;
            } else {
                RG.Helper.setCenterY(this, this.combinations);
                this.combinations.position.x = (imageWidth ? imageWidth : CombinationComponent.SYMBOL_WIDTH) + 5;
            }

        }

        setStake(stake: number) {
            this.combinations.setStake(stake);
        }
    }
}

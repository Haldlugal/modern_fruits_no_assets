namespace HelpSceneComponent {

    export class Page1 extends PIXI.Sprite {

        /**
         * Components with symbols Sprites, combinations and stakes
         */
        protected helpCombinationComponents: CombinationComponent[] = [];

        public static readonly SYMBOL_PADDING = 10;
        private BLOCK_MARGIN = 35;
        private IMAGE_WIDTH = 180;
        private IMAGE_HEIGHT = 150;
        private FIRST_BLOCK_MARGIN_LEFT = 350;

        constructor(stake: number, symbolInfo: ReelSymbolInfo[]) {

            super(PIXI.Texture.from('help_slider_bg'));
            this.width = 1125;
            this.height = 628;

            const innerContainer = new PIXI.Container();

            const firstBlock = new CombinationComponent([2], symbolInfo[2].combinations, stake, this.IMAGE_WIDTH, this.IMAGE_HEIGHT); //cross and ankh
            innerContainer.addChild(firstBlock);
            this.helpCombinationComponents.push(firstBlock);

            const secondBlock = new CombinationComponent([3], symbolInfo[3].combinations, stake, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
            secondBlock.y = firstBlock.y + firstBlock.height + this.BLOCK_MARGIN;
            innerContainer.addChild(secondBlock);
            this.helpCombinationComponents.push(secondBlock);

            const thirdBlock = new CombinationComponent([7], symbolInfo[7].combinations, stake, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
            thirdBlock.y = secondBlock.y + secondBlock.height + this.BLOCK_MARGIN;
            innerContainer.addChild(thirdBlock);
            this.helpCombinationComponents.push(thirdBlock);

            const forthBlock = new CombinationComponent([1], symbolInfo[1].combinations, stake, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
            forthBlock.x = firstBlock.x + firstBlock.width + 3 * this.BLOCK_MARGIN;
            forthBlock.y = firstBlock.y;
            innerContainer.addChild(forthBlock);
            this.helpCombinationComponents.push(forthBlock);

            const fifthBlock = new CombinationComponent([4], symbolInfo[4].combinations, stake, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
            fifthBlock.x = forthBlock.x + forthBlock.width + 3 * this.BLOCK_MARGIN;
            fifthBlock.y = firstBlock.y;
            innerContainer.addChild(fifthBlock);
            this.helpCombinationComponents.push(fifthBlock);

            const sixthBlock = new CombinationComponent([5], symbolInfo[5].combinations, stake, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
            sixthBlock.x = fifthBlock.x;
            sixthBlock.y = fifthBlock.y + fifthBlock.height + this.BLOCK_MARGIN;
            innerContainer.addChild(sixthBlock);
            this.helpCombinationComponents.push(sixthBlock);

            const seventhBlock = new CombinationComponent([6], symbolInfo[6].combinations, stake, this.IMAGE_WIDTH, this.IMAGE_HEIGHT);
            seventhBlock.x = fifthBlock.x;
            seventhBlock.y = sixthBlock.y + sixthBlock.height + this.BLOCK_MARGIN;
            innerContainer.addChild(seventhBlock);
            this.helpCombinationComponents.push(seventhBlock);

            const eighthBlock = new CombinationComponent([0], symbolInfo[0].combinations, stake, this.IMAGE_WIDTH, this.IMAGE_HEIGHT, true);
            eighthBlock.x = forthBlock.x + forthBlock.width / 2 - eighthBlock.width / 2;
            eighthBlock.y = forthBlock.y + forthBlock.height + this.BLOCK_MARGIN;
            innerContainer.addChild(eighthBlock);
            this.helpCombinationComponents.push(eighthBlock);

            // текст в блоке в последней комбинацией
            const textStyle ={
                fontFamily: 'Roboto',
                fontSize: 24,
                fill: '#333',
                align: 'center',
                wordWrapWidth: forthBlock.width,
                wordWrap: true
            };

            const textBlock = new RG.Text('STAR_WINS_INFO', textStyle);
            innerContainer.addChild(textBlock).position.set(forthBlock.x + forthBlock.width / 2 - textBlock.width / 2, eighthBlock.y + eighthBlock.height + 25);

            this.addChild(innerContainer);
            RG.Helper.setCenter(this, innerContainer);
            innerContainer.position.x -= 15;
            // RG.Helper.highlight(innerContainer);
            // RG.Helper.highlight(this);
        }



        setStake(val: number): void {
            this.helpCombinationComponents.forEach((item) => {
                item.setStake(val);
            });
        }


    }
}

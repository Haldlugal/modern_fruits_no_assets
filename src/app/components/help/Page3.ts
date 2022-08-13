namespace HelpSceneComponent {

    export class Page3 extends PIXI.Sprite {

        imageExpanded: PIXI.Sprite;
        private BLOCK_MARGIN = 40;
        private TEXT_MARGIN = 25;
        private readonly SWAP_IMAGE_DURATION = 250;
        private readonly SWAP_IMAGE_DELAY = 2000;

        constructor() {
            super(PIXI.Texture.from('help_slider_bg'));

            const textStyle = new PIXI.TextStyle({
                fontSize: 28,
                fill: '#fbe595',
            });

            const leftBlock = new PIXI.Container();
            const label1 = new RG.Text('SPECIAL_EXPANDING_SYMBOL', textStyle);
            leftBlock.addChild(label1);
            const image = new PIXI.Sprite(PIXI.Texture.from('help_expand1'));
            image.y = label1.height + 30;
            this.imageExpanded = new PIXI.Sprite(PIXI.Texture.from('help_expand2'));
            this.imageExpanded.y = image.y;
            this.imageExpanded.alpha = 0;
            leftBlock.addChild(image);
            leftBlock.addChild(this.imageExpanded);
            leftBlock.x = this.BLOCK_MARGIN;
            this.addChild(leftBlock);
            RG.Helper.setCenterX(leftBlock, label1);
            RG.Helper.setCenterY(this, leftBlock);

            const wordWrapWidth = this.width - leftBlock.width - 4 * this.BLOCK_MARGIN;
            const textStyleRight = new PIXI.TextStyle({
                fontSize: 18,
                fill: '#fbe595',
                wordWrap: true,
                wordWrapWidth: wordWrapWidth
            });

            const instruction1 = new RG.Text('PAGE3_HELP_INSTRUCTION1', textStyleRight);
            const instruction2 = new RG.Text('PAGE3_HELP_INSTRUCTION2', textStyleRight);
            const instruction3 = new RG.Text('PAGE3_HELP_INSTRUCTION3', textStyleRight);
            const instruction4 = new RG.Text('PAGE3_HELP_INSTRUCTION4', textStyleRight);
            const instruction5 = new RG.Text('PAGE3_HELP_INSTRUCTION5', textStyleRight);
            const instruction6 = new RG.Text('PAGE3_HELP_INSTRUCTION6', textStyleRight);
            const label2 = new RG.Text('SPECIAL_EXPANDING_SYMBOL', textStyle);

            const rightBlock = new PIXI.Container();
            rightBlock.addChild(instruction1);
            rightBlock.addChild(instruction2);
            rightBlock.addChild(instruction3);
            rightBlock.addChild(instruction4);
            rightBlock.addChild(instruction5);
            rightBlock.addChild(instruction6);
            rightBlock.addChild(label2);
            instruction2.y = instruction1.height + this.TEXT_MARGIN;
            label2.y = instruction2.height + instruction2.y + this.TEXT_MARGIN * 2;
            instruction3.y = label2.height + label2.y + this.TEXT_MARGIN;
            instruction4.y = instruction3.height + instruction3.y + this.TEXT_MARGIN;
            instruction5.y = instruction4.height + instruction4.y + this.TEXT_MARGIN;
            instruction6.y = instruction5.height + instruction5.y + this.TEXT_MARGIN;

            this.addChild(rightBlock);
            rightBlock.x = leftBlock.width + this.BLOCK_MARGIN * 3;
            RG.Helper.setCenterY(this, rightBlock);

            this.imageSwap();
        }

        imageSwap() {
            const swapImageAnimation = new RG.Animation.Animation<RG.Animation.SimpleType>();
            swapImageAnimation
                .from({value: 0})
                .to({value: 1})
                .on(RG.Animation.Events.Update, (props: RG.Animation.SimpleType) => {
                    this.imageExpanded.alpha = props.value;
                })
                .duration(this.SWAP_IMAGE_DURATION)
                .endDelay(this.SWAP_IMAGE_DELAY)
                .direction(RG.Animation.Direction.Alternate)
                .iterations(Infinity);
            swapImageAnimation.play();

        }
    }
}

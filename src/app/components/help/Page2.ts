namespace HelpSceneComponent {

    export class Page2 extends PIXI.Sprite {

        constructor() {

            super(PIXI.Texture.from('help_slider_bg'));

            const innerContainer = new PIXI.Container();

            // картинки выигрышных линий
            innerContainer.addChild(PIXI.Sprite.from('help_line1')).position.set(308, 0);
            innerContainer.addChild(PIXI.Sprite.from('help_line2')).position.set(402, 160);
            innerContainer.addChild(PIXI.Sprite.from('help_line3')).position.set(496, 0);
            innerContainer.addChild(PIXI.Sprite.from('help_line4')).position.set(590, 160);
            innerContainer.addChild(PIXI.Sprite.from('help_line5')).position.set(684, 0);

            // текст под картинками
            const text = new RG.Text('LINE_INFO_TEXT', {
                fontSize: 30,
                fill: '#333',
                align: 'center',
                wordWrapWidth: 990
            });
            text.anchor.x = 0.5;
            innerContainer.addChild(text).position.set(this.width / 2, 310);
            this.addChild(innerContainer);
            RG.Helper.setCenterY(this, innerContainer);
            const rtpText = new RG.Text('RTP_TEXT', {
                fontSize: 14,
                fill: '#333',
                align: 'right',
                wordWrapWidth: 300,
                wordWrap: true
            });
            this.addChild(rtpText);
            if (RG.Helper.isMobile()) {
                rtpText.x = this.width - rtpText.width - 60;
            } else {
                rtpText.x = this.width - rtpText.width - 40;
            }
            rtpText.y = 40;
        }
    }
}

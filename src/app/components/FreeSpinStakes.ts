namespace Component {
    export class FreeSpinStakes extends PIXI.Container{
        private spinsNumber: Text;
        private bet: Text;
        private label1XWidth: number;
        private label2XWidth: number;
        private readonly LABEL_FONT_STYLE = {fontSize: !RG.Helper.isMobile() ? 18 : 35};
        private readonly TEXT_FONT_STYLE = {fontSize: !RG.Helper.isMobile() ? 35 : 40, fontWeight: 900};
        private readonly TEXT_MARGIN_LEFT = 5;
        private readonly LABEL_MARGIN_RIGHT = 5;

        constructor() {
            super();
            const isMobile = RG.Helper.isMobile();

            const label1 = new Text('FREE_SPINS_REST', this.LABEL_FONT_STYLE, true, true);
            label1.y = label1.y - (!isMobile ? 30 : -15);
            label1.x = !isMobile ? -label1.width / 2 : -label1.width / 2;
            this.label1XWidth = label1.x + label1.width + this.TEXT_MARGIN_LEFT;

            this.spinsNumber = new Text(String(0), this.TEXT_FONT_STYLE);
            this.spinsNumber.x = !isMobile ? -this.spinsNumber.width / 2 : this.label1XWidth;
            this.spinsNumber.y = label1.y - this.LABEL_MARGIN_RIGHT + (!isMobile ? label1.height : 0);
            this.addChild(label1);
            this.addChild(this.spinsNumber);

            const label2 = new Text('FREE_SPINS_BET', this.LABEL_FONT_STYLE, true, true);
            label2.x = !isMobile ? -label2.width / 2 : this.spinsNumber.x  + this.spinsNumber.width + 150;
            label2.y = !isMobile ? this.spinsNumber.y + this.spinsNumber.height : label1.y;
            this.label2XWidth = label2.x + label2.width + this.TEXT_MARGIN_LEFT;

            this.bet = new Text(String(0), this.TEXT_FONT_STYLE);
            this.bet.x = !isMobile ? -this.bet.width / 2 : this.label2XWidth;
            this.bet.y = !isMobile ? label2.y + label2.height - this.LABEL_MARGIN_RIGHT : this.spinsNumber.y;
            this.addChild(label2);
            this.addChild(this.bet);
        }

        setSpins(value: number) {
            this.spinsNumber.text = String(value);
            this.spinsNumber.x = !RG.Helper.isMobile() ? -this.spinsNumber.width / 2 : this.label1XWidth;
        }

        setBet(value: number) {
            this.bet.text = String(value);
            this.bet.x = !RG.Helper.isMobile() ? -this.bet.width / 2 : this.label2XWidth;
        }
    }
}

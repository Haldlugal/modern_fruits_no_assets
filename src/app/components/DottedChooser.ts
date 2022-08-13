namespace Component {

    export class DottedChooser extends PIXI.Container {

        private dots: Dot[] = [];
        private numbers: Text;
        private dotSelectedNumber: number = 0;
        private stake: number;
        private steps: number[];
        private containerWidth: number;

        constructor(title: string, steps: number[], stake: number, containerWidth: number) {
            super();
            const isMobile = RG.Helper.isMobile();

            let offset = 0;
            this.stake = stake;
            this.steps = steps;
            this.containerWidth = containerWidth;
            // --------------------------------------------------------------------------------
            // Заголовок
            // --------------------------------------------------------------------------------
            offset += 5;

            const titleText = new Text(title,{
                fontSize: !isMobile ? 20 : 42,
                fill: '#f6e58b',
                align: 'center'
            });
            this.addChild(titleText);
            titleText.y = offset;

            // --------------------------------------------------------------------------------
            // Циферки
            // --------------------------------------------------------------------------------

            this.numbers = new Text('0',
                {
                    fontSize: !isMobile ? 24 : 42,
                    fontWeight: 900
                });
            this.addChild(this.numbers);
            this.numbers.x = containerWidth - this.numbers.width - (!isMobile ? 58 : 710);

            // --------------------------------------------------------------------------------
            // Точки
            // --------------------------------------------------------------------------------
            offset += (titleText.height + 10);

            for(let i = 0; i < steps.length; i++){
                const dot = new Dot("radio").remapModeImage("over", 2);
                dot.scale.set(!isMobile ? 1 : 2);
                dot.on('click', () => {
                    this.redrawDots(i);
                    this.redrawNumbers(steps[i] * this.stake);
                    this.dotSelectedNumber = i;
                    this.emit("choice", i);
                });
                dot.on('pointerover', () => {
                    this.redrawDots(i);
                    this.redrawNumbers(steps[i] * this.stake);
                });
                dot.on('pointerout', () => {
                    this.redrawDots(this.dotSelectedNumber);
                    this.redrawNumbers(steps[this.dotSelectedNumber] * this.stake);
                });
                this.dots.push(dot);
                dot.position.set(i * (!isMobile ? 27 : 54), offset);
                this.addChild(dot);
            }
        }
        redrawDots(position: number) : void{
            let count = 0;
            if (position === 0) {
                this.dots[0].setMode("disabled");
                for (let i = 1; i < this.dots.length; i++) {
                    this.dots[i].setMode("unchecked");
                }
            } else {
                this.dots.forEach((dot) => {
                    if (count <= position) {
                        dot.setMode("checked");
                    } else {
                        dot.setMode("unchecked");
                    }
                    count ++;
                })
            }
        }

        redrawNumbers(value: number) {
            const isMobile = RG.Helper.isMobile();
            this.numbers.text = String(value);
            this.numbers.x = this.containerWidth - this.numbers.width - (!isMobile ? 58 : 710);
        }

        setStake(value: number) {
            this.stake = value;
            this.redrawNumbers(this.stake * this.steps[this.dotSelectedNumber]);
        }
    }
}

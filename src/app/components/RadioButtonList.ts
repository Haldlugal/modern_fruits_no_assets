namespace Component {

    export class RadioButtonList extends PIXI.Container {

        private radios: RadioNumber[] = [];

        constructor(title: string, spins: number[]) {
            super();
            const isMobile = RG.Helper.isMobile();

            let offset = 0;

            // --------------------------------------------------------------------------------
            // Заголовок
            // --------------------------------------------------------------------------------
            offset += 5;

            const titleText = new Text(title, {
                fontSize: !isMobile ? 20 : 42,
                fill: '#f6e58b',
                align: 'center'
            });
            this.addChild(titleText);
            titleText.position.y = offset;

            // --------------------------------------------------------------------------------
            // Радиокнопки
            // --------------------------------------------------------------------------------
            offset += (titleText.height + 5);

            const radioNumber = new RadioNumber('auto_spin_btn', isMobile);
            this.addChild(radioNumber);
            radioNumber.y = offset;

            let posX = radioNumber.x + radioNumber.width;

            this.radios.push(radioNumber);

            for (let i = 1; i < spins.length; i++) {
                const radio = new RadioNumber('auto_spin_btn', isMobile,  spins[i]);
                this.addChild(radio);
                radio.y = offset;
                radio.x = posX;
                posX += radio.width;
                this.radios.push(radio);
            }

            for (let i=0; i<this.radios.length; i++) {
                this.radios[i].on('click', ()=>{
                    this.redrawRadios(i);
                    this.emit('choice', i);
               });
            }
        }

        redrawRadios(position: number) : void{
            for (let i=0; i<this.radios.length; i++) {
                if (i === position) {
                    this.radios[i].setMode('checked');
                } else {
                    this.radios[i].setMode('unchecked');
                }
            }
        }
    }
}

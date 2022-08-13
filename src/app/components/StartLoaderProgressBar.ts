namespace Component {

    export class StartLoaderProgressBar extends PIXI.Sprite {

        private readonly label: Text;
        private readonly bar: PIXI.Sprite;

        constructor() {
            super(PIXI.Texture.from('loader_bar'));

            this.bar = PIXI.Sprite.from('loader_progress');
            this.addChild(this.bar).position.set(4, 4);

            this.label = new Text('', {fill: '#ffffff'}, false);
            this.label.position.set(this.width/2, this.height/2);
            this.label.anchor.set(0.5, 0.5);

            this.addChild(this.label);
        }

        setValue(percent: number): void {

            // Округляем проценты до целого
            percent = Math.floor(percent);

            // Выставляем ширину полосы прогресса
            this.bar.width = ((this.width - 2) * percent) / 100;

            // И подписываем кол-во прогресса текстом
            this.label.text = percent + '%';
        }
    }
}

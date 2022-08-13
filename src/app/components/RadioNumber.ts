namespace Component {

    export class RadioNumber extends RG.Abstract.ImageSprite {

        /**
         * Состоянии картинки используемой на кнопке в текущее время
         */
        private mode: | "checked" | "over" | "unchecked" = 'unchecked';

        /**
         * Предыдущее состояние кнопки (для того, чтобы знать, куда вернуться после убирания курсора с кнопки)
         */
        private previousMode: | "checked" | "over" | "unchecked" = 'unchecked';

        /**
         * Какие номера картинок использовать в разных состояних
         * Можно переопределить, используя функцию remapModeImage(...)
         *
         */
        private modeImages: { [mode: string]: number; } = {
            'unchecked': 2,
            'checked': 1,
            'over': 1
        };
        /**
         * @param name Имя иконки         *
         * @param value Флажок, у кнопки только одна картинка без цифр?
         */
        constructor(name: string, isMobile: boolean, value?: number) {
            super(name);
            // Наш контейнер это кнопка
            this.buttonMode = true;
            this.interactive = true;

            this.setMode('unchecked'); // Устанавливаем кнопке иконку с обычным состоянием

            const textStyle = {
                fontFamily: "Arial",
                fontSize: 22,
                fill: '#f6e58b',
                align: 'center'
            };

            const texture = value ?
                new PIXI.Text(String(value), new PIXI.TextStyle(textStyle)) :
                new PIXI.Sprite(PIXI.Texture.from('infinity'));

            texture.alpha = 0.5;
            if (isMobile) {
                texture.scale.set(2);
            }
            this.addChild(texture);
            texture.position.x = this.width / 2 - texture.width / 2;
            texture.position.y = this.height / 2 - texture.height / 2;

            this.setupEvents(); // Навешиваем события
        }

        /**
         * Назначение событий кнопки
         */
        private setupEvents(): this {
            this.on('pointerdown', () => {
                    this.switchMode();
                })
                .on('pointerover', () => {
                    this.previousMode = this.mode;
                    (this.mode === 'checked') || this.setMode('over');
                })
                .on('pointerout', () => {
                    this.setMode(this.previousMode);
                })
                .on('tap', (event: any) => {
                    this.emit('click', event)
                });
            return this;
        }

        switchMode() {
            if (this.mode !== 'checked') {
                this.previousMode = 'checked';
                this.setMode('checked');
            }
        }

        /**
         * Изменение номера используемой картинки для указанного состояния
         *
         * @param mode
         * @param number
         */
        public remapModeImage(mode: | "checked" | "over" | "unchecked", number: number): this {
            this.modeImages[mode] = number;
            return this;
        }


        protected _update_texture(textureName?: string): this {
            // ключ, по которому кешируются текстуры
            const assetName = this.icon + this.modeImages[this.mode];

            super._update_texture(assetName);


            // Управляем прозрачностью деток в контейнере
            if (this.mode === 'unchecked') {
                this.children.forEach((child)=>{
                    child.alpha = 0.5;
                })
            } else {
                this.children.forEach((child) => {
                    child.alpha = 1;
                })
            }

            return this;
        }


        /**
         * Изменение состояния кнопки
         * @param mode
         */
        setMode(mode: | "checked" | "over" | "unchecked"): this {
            this.mode = mode;
            return this._update_texture();
        }
    }
}

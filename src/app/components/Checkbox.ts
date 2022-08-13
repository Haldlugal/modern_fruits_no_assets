namespace Component {

    export class Checkbox extends RG.Abstract.ImageSprite {

        /**
         * Состоянии картинки используемой на кнопке в текущее время
         */
        public mode: | "checked" | "over" | "unchecked" | "disabled" = 'unchecked';

        /**
         * Предыдущее состояние кнопки (для того, чтобы знать, куда вернуться после убирания курсора с кнопки)
         */
        private previousMode: | "checked" | "over" | "unchecked" | "disabled"= 'unchecked';

        /**
         * Какие номера картинок использовать в разных состояних
         * Можно переопределить, используя функцию remapModeImage(...)
         *
         */
        private modeImages: { [mode: string]: number; } = {
            'unchecked': 2,
            'checked': 1,
            'over': 1,
            'disabled': 3
        };
        private isMobile: boolean;

        /**
         * @param name Имя иконки
         * @param title Заголовок
         * @param titlePosition Позиция
         * @param isMobile Это мобилка?
         */
        constructor(name: string, title: string, titlePosition: {x: number, y: number}, isMobile: boolean) {
            super(name);

            // Наш контейнер это кнопка(на самом деле, чекбокс)
            this.buttonMode = true;
            this.interactive = true;
            this.isMobile = isMobile;

            const titleText = new Text(title, {
                fontSize: 20,
                fill: '#f6e58b',
                align: 'center'
            });
            this.addChild(titleText);
            titleText.position.x = titlePosition.x;
            titleText.position.y = titlePosition.y;

            this.setMode('unchecked')          // Устанавливаем кнопке иконку с обычным состоянием
                .setupEvents();             // Навешиваем события
        }

        /**
         * Назначение событий кнопки
         */
        private setupEvents(): this {
            this.on('pointerdown', () => {
                    if (this.mode !== 'disabled') {
                        this.switchMode();
                    }
                })
                .on('pointerover', () => {

                })
                .on('pointerout', () => {

                })
                .on('tap', (event: any) => {
                    this.emit('click', event)
                })
                .on('click', ()=>{
                    if (this.mode === 'checked') {
                        this.emit('checked')
                    } else if (this.mode === 'unchecked') {
                        this.emit('unchecked');
                    }
                });
            return this;
        }

        /**
         * Изменение номера используемой картинки для указанного состояния
         *
         * @param mode
         * @param number
         */
        public remapModeImage(mode: | "checked" | "over" | "unchecked" | "disabled", number: number): this {
            this.modeImages[mode] = number;
            return this;
        }

        switchMode() {
            if (this.mode === 'checked') {
                this.setMode('unchecked');
            } else {
                this.setMode('checked');
            }
        }

        /**
         * Изменение состояния кнопки
         * @param mode
         */
        setMode(mode: | "checked" | "over" | "unchecked" | "disabled"): this {
            this.mode = mode;
            return this._update_texture();
        }

        protected _update_texture(): this {
            const textureName = this.icon + this.modeImages[this.mode];
            super._update_texture(textureName);
            if(RG.Helper.isMobile()) {
                this.scale.set(2);
            }
            return this;
        }
    }
}

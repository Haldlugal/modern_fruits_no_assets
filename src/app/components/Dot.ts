namespace Component {

    export class Dot extends RG.Abstract.ImageSprite {

        /**
         * Состоянии картинки используемой на кнопке в текущее время
         */
        private mode: | "checked" | "over" | "unchecked" | "disabled" = 'unchecked';

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
            'unchecked': 1,
            'checked': 2,
            'over': 3,
            'disabled': 4
        };

        /**
         * @param name Имя иконки
         */
        constructor(name: string) {
            super(name);

            // Наш контейнер это кнопка(на самом деле, точка)
            this.buttonMode = true;
            this.interactive = true;

            this.setMode('unchecked')          // Устанавливаем кнопке иконку с обычным состоянием
                .setupEvents();             // Навешиваем события
        }

        /**
         * Назначение событий кнопки
         */
        private setupEvents(): this {
            this.on('pointerdown', () => {
                    this.previousMode = 'checked';
                    this.setMode('checked');
                })
                .on('pointerover', () => {
                    this.previousMode = this.mode;
                    (this.mode === 'checked' || this.mode === 'disabled') || this.setMode('over');
                })
                .on('pointerout', () => {
                    this.setMode(this.previousMode);
                })
                .on('tap', (event: any) => {
                    this.emit('click', event)
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
            return super._update_texture(textureName);
        }
    }
}

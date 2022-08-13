/// <reference path="Abstract/ImageSprite.ts" />

namespace RG {

    type ButtonMode = | "normal" | "over" | "down" | "disabled"

    export class Button extends Abstract.ImageSprite {

        private readonly _btn_single: boolean;
        protected _btn_mode: ButtonMode;
        private _btn_modes: { [mode: string]: number; } = {
            'normal': 1,      // Иконка в обычном состоянии
            'over': 2,        // Проводим над иконкой мышей
            'down': 3,        // Кнопка нажата
            'disabled': 4     // Иконка для кнопки в disabled состоянии
        };

        private _label?: Text;

        public get label(): Text | undefined {
            return this._label;
        }

        public set label(label: Text | undefined) {
            if (this._label) {
                this.removeChild(this._label);
                this._label.destroy();
            }
            if (label) {
                label.position.set(this.width / 2, this.height / 2);
                label.anchor.set(0.5, 0.5);
                this.addChild(this._label = label);
            }
        }

        constructor(icon: string, single: boolean = false) {
            super(icon);

            this._btn_single = single;
            this._btn_mode = 'normal';

            this.buttonMode = true;
            this.interactive = true;

            this
                .on('added', () => {

                })
                .on('pointerdown', () => {
                    this._set_mode('down');
                })
                .on('pointerup', () => {
                    (this._btn_mode === 'disabled') || this._set_mode('over');
                })
                .on('pointerupoutside', () => {
                    (this._btn_mode === 'disabled') || this._set_mode('normal');
                })
                .on('pointerover', () => {
                    (this._btn_mode === 'down') || this._set_mode('over');
                })
                .on('pointerout', () => {
                    (this._btn_mode === 'down') || this._set_mode('normal');
                })
                .on('tap', (event: any) => {
                    // на мобилах клика нет, есть tap - его отправляем как click
                    this.emit('click', event)
                });
            this._set_mode('normal');
        }

        public remap(mode: ButtonMode, number: number): this {
            this._btn_modes[mode] = number;
            return this;
        }

        public mode(mode: ButtonMode): this {
            return this._set_mode(mode);
        }

        public disable(disabled: boolean = true): this {
            if (disabled)
                this._set_mode('disabled');
            else
                (this._btn_mode === 'over') || this._set_mode('normal');
            this.interactive = !disabled;
            this.emit('disabled', disabled);
            return this;
        }

        public static from(icon: string, single: boolean = false): Button {
            return new Button(icon, single);
        }

        private _set_mode(mode: ButtonMode): this {
            this._btn_mode = mode;
            return this._update_texture();
        }

        protected _update_texture(): this {
            const textureName = this._btn_single ? this._icon : this._icon + this._btn_modes[this._btn_mode];
            return super._update_texture(textureName);
        }

        public getMode(): ButtonMode {
            return this._btn_mode;
        }
    }
}

namespace RG.Abstract {

    export abstract class ImageSprite extends PIXI.Sprite {

        protected _icon: string;

        public get icon(): string {
            return this._icon;
        }

        public set icon(name: string) {
            this._icon = name;
            this._update_texture();
            this.emit('icon', name);
        }

        protected constructor(name: string) {
            super();
            this._icon = name;
        }

        protected _update_texture(textureName?: string): this {
            // Если иконка не установлена, то и нечего искать картинку..
            if (!this._icon && !textureName) {
                return this;
            }
            this.texture = PIXI.Texture.from(textureName ? textureName : this._icon, {}, true);
            return this;
        }
    }
}

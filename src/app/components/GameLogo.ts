namespace Component {

    export class GameLogo extends PIXI.Sprite {
        constructor() {
            super(PIXI.Texture.from('game_logo', {}, true));
        }
    }
}

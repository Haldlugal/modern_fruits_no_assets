namespace Component {

    export class SceneHelper {

        public static readonly MOBILE_OFFSET_TOP = !RG.Helper.isMobile() ? 0 : 0;
        public static readonly TOP_OFFSET = 95;
        public static readonly MOBILE_MAIN_CONTAINER_SCALE = {
            x: RG.Helper.isMobile() ? 0.95 : 0.88,
            y: RG.Helper.isMobile() ? 0.95 : 0.88,
        };
        public static readonly LEFT_OFFSET = RG.Helper.isMobile() ? 0 : 35;
        public static readonly ZINDEX = 2;

        public static setBackground (SpriteName: string, scene: BaseScene) {
            const backgroundSprite =  PIXI.Sprite.from(SpriteName);
            scene.addChild(backgroundSprite).position.set(SceneHelper.LEFT_OFFSET, SceneHelper.TOP_OFFSET + SceneHelper.MOBILE_OFFSET_TOP);

            if (!RG.Helper.isMobile()) {
                // сдвигаем вниз всю сцену
                scene.position.y += SlotsScene.MAIN_MARGIN_TOP;
            }

            return backgroundSprite
        }
    }
}

///<reference path="../components/help/MainContainer.ts"/>
///<reference path="./BaseScene.ts"/>

import MainContainer = HelpSceneComponent.Main;

class HelpScene extends BaseScene {
    helpMainContainer?: MainContainer;

    onLoad(delta: number, first: boolean) {
        super.onLoad(delta, first);
        if (first) {

            this.addChild(this.shared.logo);
            this.addChild(this.shared.soundManagerComponent);
            this.addChild(this.shared.helpButton);
            this.addChild(this.shared.balance);

            // добавляем зашаренный компонент ставок и начинаем слушать его изменения
            this.addChild(this.shared.stakes).on('change', this.helpMainContainer!.setStake, this.helpMainContainer!);
        }
        this.helpMainContainer!.setStake(this.shared.stakes.getValue());
    }

    onFinalize(delta: number, first: boolean) {
        super.onFinalize(delta, first);
        if (first) {
            // отключаем слушанье зашаренного компонента ставок
            this.shared.stakes.off('change', this.helpMainContainer!.setStake, this.helpMainContainer!);
        }
    }


    setup(): void {
        const background = PIXI.Sprite.from('slot_bg');
        if (RG.Helper.isMobile()) {
            background.scale.set(
                Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x,
                Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y
            );
        } else {
            // сдвигаем вниз всю сцену
            this.position.y += SlotsScene.MAIN_MARGIN_TOP;
        }

        this.addChild(background).position.set(
            Component.SceneHelper.LEFT_OFFSET,
            Component.SceneHelper.TOP_OFFSET + Component.SceneHelper.MOBILE_OFFSET_TOP
        );

        this.helpMainContainer = new MainContainer(this.game.settings.stake, this.game.settings.help.symbolsMap);
        this.helpMainContainer.position.set(
            Component.SceneHelper.LEFT_OFFSET,
            Component.SceneHelper.TOP_OFFSET + Component.SceneHelper.MOBILE_OFFSET_TOP
        );
        this.addChild(this.helpMainContainer);

        this.state = RG.Abstract.SceneState.LOAD;
    }
}

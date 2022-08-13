///<reference path="../help/partials/Combinations.ts"/>

namespace ReelComponent {

    import Combinations = HelpSceneComponent.Combinations;
    
    export class ReelSymbolHelp extends PIXI.Container {

        private combinations?: Combinations;

        private icon?: PIXI.Sprite;

        private background?: PIXI.Graphics;

        private BACKGROUND_WIDTH = RG.Helper.isMobile() ? 228 : 228;
        private BACKGROUND_HEIGHT = 188;

        /**
         * Стиль, которым писать комбинации
         */
        private readonly textStyle: PIXI.TextStyle;

        constructor() {
            super();

            this.zIndex = 500;

            // Стиль, которым писать выигрышние комбинации
            this.textStyle = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 20,
                fill: '#fbe595'
            });
            if (RG.Helper.isMobile()) {
                this.scale.set(Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x, Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y);
            }
        }

        /**
         * children[0] - Черный задний фон
         */
        private setBackground(symbol: ReelSymbol): this {
            if (!this.background) {
                this.background = new PIXI.Graphics();
                this.background.beginFill(0x000000, 0.7);
                this.background.drawRect(0, 0, this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);

                this.addChild(this.background);
            }

            return this;
        }


        /**
         * children[1] - Иконка символа
         */
        private setIcon(symbol: ReelSymbol): this {
            const texture = ReelSymbol.texture(symbol.getSymbolId());

            if (!this.icon) {
                this.icon = PIXI.Sprite.from(texture);

                this.icon.scale.x = 0.5;
                this.icon.scale.y = 0.5;
                this.icon.x = -this.icon.width / 2 + (RG.Helper.isMobile() ? 0 : 15);
                this.icon.y = -this.icon.height / 2;

                this.addChild(this.icon);
            } else {
                // Иначе - просто заменяем иконку
                this.icon.texture = texture;
            }

            return this;
        }

        /**
         * children[2]+ - Выигрышные комбинации
         */
        private setCombinations(combinations: SymbolCombinations, stake: number): this {

            if (!this.combinations) {
                this.combinations = new Combinations(
                    combinations,
                    stake,
                    !RG.Helper.isMobile() ? 30 : 24,
                    !RG.Helper.isMobile() ? 30 : 30,
                    !RG.Helper.isMobile() ? 32 : 32,
                    !RG.Helper.isMobile() ? 52 : 62,
            '#fbe595'
                    );
                this.addChild(this.combinations);
            } else {
                this.combinations.setCombinations(combinations, false).setStake(stake);
            }

            this.combinations.position.set(120 - this.combinations.width / 2, SlotPosition.HEIGHT / 2 - this.combinations.height / 2);

            return this;
        }

        /**
         * Показать на позиции, где находится указанный символ
         */
        private showInContainer(symbol: ReelSymbol, stage: PIXI.Container): this {

            const symbolPosition = symbol.getGlobalPosition();
            const position = {
                x: symbolPosition.x + stage.getGlobalPosition().x - (RG.Helper.isMobile() ? 3 : 0),
                y: symbolPosition.y - stage.getGlobalPosition().y
            };

            if (!this.parent) {
                // если в текущий момент не показывается, то прицепляем его к родителю в нужных координатах
                this.position.set(position.x, position.y);
                stage.addChild(this);
            } else {
                // если же уже показывается - то просто меняем координаты
                this.x = position.x;
                this.y = position.y;
            }
            return this;
        }

        /**
         * Показать помощь
         */
        show(symbol: ReelSymbol, stage: PIXI.Container, stake: number, combinations: SymbolCombinations) : this {
            console.log(symbol.width, symbol.height);
            return this
                .setBackground(symbol)
                .setIcon(symbol)
                .setCombinations(combinations, stake)
                .showInContainer(symbol, stage);
        }

        /**
         * Скрыть помощь
         */
        hide() : this {
            if (this.parent) {
                this.parent.removeChild(this);
            }
            return this;
        }
    }
}

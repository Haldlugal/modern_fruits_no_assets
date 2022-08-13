///<reference path="../../rg/Abstract/ErrorMessage.ts"/>

namespace Component {

    export class ErrorMessage extends RG.Abstract.ErrorMessage {

        public static WIDTH = 400;
        private static OFFSET_Y_STEP = 25;
        private readonly MOBILE_PADDING = 200;
        private static PADDING = 20;
        private readonly LEFT_OFFSET = 200;

        /**
         * @param stage PIXI Контейнер, куда встраивать текущую компоненту
         * @param x Позиция компонента в родительском контейнере
         * @param y Позиция компонента в родительском контейнере
         * @param title Заголовок
         * @param message Текст ошибки
         */
        constructor(stage: PIXI.Container, x: number, y: number, message: Error | string, title: string) {
            super(typeof message === 'string' ? RG.Translator.get(message) : message, RG.Translator.get(title), 'loader_error_bnt');

            this.zIndex = 30000;

            // --------------------------------------------------------------------------------
            // Сетапаем основной контейнер компоненты
            // --------------------------------------------------------------------------------
            if (RG.Helper.isMobile()) {
                this.position.set(0, -Game.mobilePadding);
            }
            else {
                this.position.set(x, y);
            }

            stage.addChild(this);
            this.sortableChildren = true;

            // --------------------------------------------------------------------------------
            // Слой для рамки создаем сразу (он должен быть позади)
            // --------------------------------------------------------------------------------
            const graphics = !RG.Helper.isMobile()
                ? PIXI.Sprite.from('modal_bg')
                : new PIXI.Graphics()
                    .lineStyle(0, 0xb7aa64, 0.75)
                    .beginFill(0x274400, 1)
                    .drawRoundedRect(0, 0, stage.width, stage.height, 16)
                    .endFill();
            this.addChild(graphics);
            // --------------------------------------------------------------------------------

            let offset = (RG.Helper.isMobile() ? this.MOBILE_PADDING : 0) + ErrorMessage.OFFSET_Y_STEP;

            const mainContainer = new PIXI.Container();
            mainContainer.addChild(new RG.Simplers.Spacer(RG.Helper.isMobile() ? 600 : 367, 1));

            // --------------------------------------------------------------------------------
            // Заголовок
            // --------------------------------------------------------------------------------

            offset += ErrorMessage.OFFSET_Y_STEP;

            const titleText = new Text(this.title, {
                fontSize: RG.Helper.isMobile() ? 80 : 40,
                wordWrap: true,
                wordWrapWidth: RG.Helper.isMobile() ? 450 : 360,
                align: 'center'});

            mainContainer.addChild(titleText);
            titleText.y = offset;
            RG.Helper.setCenterX(mainContainer, titleText);

            // --------------------------------------------------------------------------------
            // Текст ошибки
            // --------------------------------------------------------------------------------

            offset += titleText.height + ErrorMessage.OFFSET_Y_STEP;

            const errorText = new Text(this.message, {
                fontSize: RG.Helper.isMobile() ? 60 : 30,
                wordWrap: true,
                wordWrapWidth: RG.Helper.isMobile() ? 560 : 360,
                align: 'center'
            });

            mainContainer.addChild(errorText);
            errorText.y = offset;
            RG.Helper.setCenterX(mainContainer, errorText);

            // --------------------------------------------------------------------------------
            // Кнопка
            // --------------------------------------------------------------------------------

            offset += errorText.height + ErrorMessage.OFFSET_Y_STEP;

            mainContainer.addChild(this.button);
            this.button.zIndex = 10;
            const buttonText = new Text('OK');
            buttonText.position.set((this.button.width - buttonText.width) / 2, (this.button.height - buttonText.height) / 2);
            this.button.on('click', ()=>{
                this.emit('click');
            });
            this.button.addChild(buttonText);
            this.button.remap('down', 2);
            if (RG.Helper.isMobile()) {
                this.button.width = 600;
                this.button.height = 120;
            }
            RG.Helper.setCenterX(mainContainer, this.button);
            this.button.y = graphics.height - this.button.height - ErrorMessage.PADDING - (RG.Helper.isMobile() ? this.MOBILE_PADDING : 0);

            this.addChild(mainContainer);
            if (RG.Helper.isMobile()){
                RG.Helper.setCenterX(this, mainContainer);
            } else {
                mainContainer.x = this.width - mainContainer.width;
            }
        }

        setCenter(container: PIXI.Sprite | PIXI.Graphics, element: Text, y: number) {
            element.x = (container.width - element.width) / 2;
            element.y = y;
        }
    }
}

namespace HelpSceneComponent {

    export class Main extends PIXI.Container {

        /**
         * PIXI элемент, контейнер содержащий страницы помощи
         */
        public readonly helpContainer: PIXI.Container = new PIXI.Container();

        /**
         * Текущая страница помощи
         */
        private currentPage: number = 0;

        /**
         * Количество страниц помощи
         */
        private readonly pageAmount: number;

        /**
         * Компонента, кнопка - перейти на страницу назад
         */
        private backButton: RG.Button;

        /**
         * Компонента, кнопка - перейти на страницу вперед
         */
        private forwardButton: RG.Button;

        private helpBg: PIXI.Sprite;

        private pageContainer = new PIXI.Container();

        private static readonly LEFT_OFFSET = 110;
        private static readonly TOP_OFFSET = 15;
        private static readonly RIGHT_OFFSET = !RG.Helper.isMobile() ? 215 : 70;
        private static readonly TOP_OFFSET_WINGS = 46;
        // сдвиг частей хэлпа по х
        private static readonly MOBILE_PART_OFFSET_RIGHT = -50;

        constructor(stake: number, symbolInfo: ReelSymbolInfo[]) {
            super();

            const isMobile = RG.Helper.isMobile();
            this.helpBg = PIXI.Sprite.from('help_bg_new');

            this.helpBg.position.set(0, 0);
            this.addChild(this.helpBg);
            if (!RG.Helper.isMobile()) {

            }
            else {
                this.helpBg.scale.set(
                    Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x,
                    Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y
                );
            }

            // -------------------------------------------------------------------------------------

            this.pageAmount = 2;
            this.setParts(stake, symbolInfo);
            this.helpBg.addChild(this.helpContainer);

            const helpContainerMask = new PIXI.Graphics();
            helpContainerMask.beginFill(0xFF0000, 0.5);
            helpContainerMask.drawRect(
                Component.SceneHelper.LEFT_OFFSET + (RG.Helper.isMobile() ? 70 : Main.LEFT_OFFSET - 25),
                Component.SceneHelper.TOP_OFFSET + (RG.Helper.isMobile() ? -10 : 0),
                this.helpBg.width - Main.RIGHT_OFFSET - (RG.Helper.isMobile() ? 80 : -40),
                this.helpBg.height + (RG.Helper.isMobile() ? 80 : 50)
            );
            helpContainerMask.endFill();
            this.helpContainer.mask = helpContainerMask;

            this.helpContainer.position.set(Main.LEFT_OFFSET, Main.TOP_OFFSET);

            this.helpContainer.addChild(this.pageContainer);

            // -------------------------------------------------------------------------------------
            // Стрелки влево, вправо
            // -------------------------------------------------------------------------------------

            this.backButton = (new RG.Button('arrow_left'))
                .remap('over', 1)
                .remap('down', 2)
                .remap('disabled', 3)
                .on('click', () => {
                    this.jumpTo(this.currentPage - 1, true)
                });
            this.addChild(this.backButton).position.x = 20;
            this.backButton.scale.set(!isMobile ? 1 : 2);
            RG.Helper.setCenterY(this.helpBg, this.backButton);
            if (isMobile) {
               this.backButton.y -= this.backButton.height;
               this.backButton.x = this.helpBg.width + this.backButton.width + 20;
            }

            this.forwardButton = (new RG.Button('arrow_right'))
                .remap('over', 1)
                .remap('down', 2)
                .remap('disabled', 3)
                .on('click', () => {
                    this.jumpTo(this.currentPage + 1, true)
                });
            this.addChild(this.forwardButton).position.x = this.helpBg.width - 65;
            RG.Helper.setCenterY(this.helpBg, this.forwardButton);
            this.forwardButton.scale.set(!isMobile ? 1 : 2);
            if (isMobile) {
                this.forwardButton.y += this.forwardButton.height;
                this.forwardButton.x = this.helpBg.width + this.forwardButton.width + 20;
            }

            this.jumpTo(this.currentPage);
        }

        jumpTo(page: number, animate: boolean = false): this {
            const offset = !RG.Helper.isMobile() ? Main.RIGHT_OFFSET - 20: Main.MOBILE_PART_OFFSET_RIGHT;
            const starPosition = this.pageContainer.position.x;
            const endPosition = -page * (this.helpBg.width - offset);

            if (starPosition === endPosition) {
                animate = false;
            }

            if (!animate) {
                this.currentPage = page;
                this.pageContainer.position.x = endPosition;
                return this.updateButtonsState();
            }

            RG.GameSound.instance.play("btn_switch_click");

            if (this.currentPage < page) {
                // двигаемся вперед
                this.forwardButton.remap('disabled', 2).disable(true); // правая - вжата
                this.backButton.interactive = false;                                       // левая - не реагирует
            } else {
                // двигаемся назад
                this.backButton.remap('disabled', 2).disable(true); // левая - вжата
                this.forwardButton.interactive = false;                                 // правая - не реагирует
            }

            new RG.Animation.Container<'posX'>(this.pageContainer)
                .from({posX: this.pageContainer.position.x})
                .to({posX: endPosition})
                .duration(300)
                .playAndDestroy()
                .then(() => {
                    this.currentPage = page;
                    this.updateButtonsState();
                });
            RG.GameSound.instance.play("help_slide");
            return this;
        }

        /**
         * После изменения текущей страницы нужно кнопкам выставить соответствующие статусы
         * кого-то задизаблить, кого-то разинаблить...
         */
        private updateButtonsState(): this {
            this.backButton.remap('disabled', 3).disable(this.currentPage <= 0);
            this.forwardButton.remap('disabled', 3).disable(this.currentPage + 1 >= this.pageAmount);
            return this;
        }

        private setParts(stake: number, symbolInfo: ReelSymbolInfo[]): void {
            const offset = !RG.Helper.isMobile() ? Main.RIGHT_OFFSET : Main.MOBILE_PART_OFFSET_RIGHT;
            this.pageContainer.addChild(new Page1(stake, symbolInfo)).position.set(0, 0);
            // this.pageContainer.addChild(new Page3()).position.set(this.helpBg.width - offset, 0);
            this.pageContainer.addChild(new Page2()).position.set((this.helpBg.width - offset), 0);
        }

        setStake(val: number): void {
           this.pageContainer.children.forEach(item => {
               if (typeof (item as any).setStake === 'function') {
                   (item as Page1).setStake(val)
               }
           })
        }
    }
}

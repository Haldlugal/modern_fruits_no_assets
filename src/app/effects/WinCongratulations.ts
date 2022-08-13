/// <reference path="../../rg/Abstract/Effect.ts"/>

namespace Effect {
    import Animation = RG.Animation;
    import UnionType = RG.Animation.UnionType;

    export class WinCongratulations extends RG.Abstract.Effect {
        // контейнер, над которым производим эффект
        public readonly container: PIXI.Container = new PIXI.Container();

        public readonly contentContainer: PIXI.Graphics = new PIXI.Graphics();

        // анимация, которой выполняем эффект
        public readonly animation: Animation.Union = new Animation.Union();

        /**
         * Эффект изменения размеров картинки
         */
        private imageAnimation: Animation.Container<'scale'>;

        /**
         * Эффект изменения размеров картинки
         */
        private textAnimation: Animation.Container<'scale'>;

        /**
         * Компонента отображения числа
         */
        private numbers?: Component.Numbers;

        /**
         * PIXI элемент, большая картинка
         */
        private readonly imageSprite: PIXI.Sprite = new PIXI.Sprite();

        /**
         * PIXI элемент, вторая картинка с текстом (big win, super win, mega win)
         */
        private readonly textSprite: PIXI.Sprite = new PIXI.Sprite();

        private backgroundSprite?: PIXI.Sprite;

        /**
         * Как долго показывать анимацию появления большой картинки
         */
        private showTime: number = 1000;

        /**
         * Как долго показывать анимацию скрытия большой картинки
         */
        private hideTime: number = 200;

        /**
         * Время задержки между этими двумя анимациями
         */
        private pause: number = 3000;

        private offsetX: number = 0;

        private offsetY: number = 0;

        // для циферок
        private MARGIN_TOP_TEXT = 180;
        // для текста под иконкой
        private MARGIN_TOP_TEXT_SPRITE = 150;
        // если надо поднять контент повыше
        private OFFSET_BOTTOM = 50;


        constructor(public readonly parent: PIXI.Container, imageName: string, alpha: number = 1, showNumbers: boolean = true, contentWidth?: number, offsetX: number = 0, offsetY: number = 0) {
            super();

            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.setWinBackground(this.getDefaultWinBackground(alpha));
            this.setSpriteImageName(imageName);
            this.setupContainer(contentWidth);

            this.imageAnimation = new Animation.Container<'scale'>(this.imageSprite);
            this.textAnimation = new Animation.Container<'scale'>(this.textSprite);
            this.animation.animations.push(this.imageAnimation, this.textAnimation);
            this.setupAnimation();
            this.bindAutoHide();

            if (showNumbers) {
                this.setNumbers(this.getDefaultNumbers());
            }
        }

        setWinBackground(winBg: PIXI.Sprite) {
            if (this.backgroundSprite) {
                this.container.removeChild(this.backgroundSprite);
            }
            this.backgroundSprite = winBg;
            if (RG.Helper.isMobile()) {
                this.backgroundSprite.x -= 35;
                this.backgroundSprite.y -= 35;
            }
            this.container.addChild(this.backgroundSprite);
            return this;
        }

        setSpriteImageName(imageName: string) {
            this.imageSprite.texture = PIXI.Texture.from(imageName + '_1');
            this.textSprite.texture = PIXI.Texture.from(imageName + '_2');
            return this;
        }

        private setupContainer(contentWidth?: number) {
            this.container.zIndex = 9000;
            this.imageSprite.zIndex = 104;
            this.textSprite.zIndex = 103;

            this.contentContainer.zIndex = 101;

            this.contentContainer.addChild(this.imageSprite);
            this.contentContainer.addChild(this.textSprite);

            this.contentContainer.position.set(0,0);

            this.setContentWidth(contentWidth);

            this.container.addChild(this.contentContainer);
            this.parent.addChild(this.container);
            this.container.position.set(Component.SceneHelper.LEFT_OFFSET, 0);
            return this;
        }

        setContentWidth(contentWidth?: number) {
            this.contentContainer.clear();
            this.contentContainer.drawRect(0, 0, contentWidth || this.container.width, this.container.height);
            this.setupCenteredSprite(this.imageSprite)
                .setupCenteredSprite(this.textSprite);
            this.textSprite.y += this.MARGIN_TOP_TEXT_SPRITE;
            return this;
        }

        private setupCenteredSprite(sprite: PIXI.Sprite) {
            // И теперь устанавливаем ей центр
            sprite.x = (this.contentContainer.width - sprite.width) / 2;
            sprite.y = this.contentContainer.height / 2 - this.OFFSET_BOTTOM;
            // Уменьшили картинку в ноль. Она все равно будет из этого скейла появляться
            sprite.scale.x = 0;
            sprite.scale.y = 0;
            return this;
        }

        moveSprites(x: number, y: number) {
            this.textSprite.x += x;
            this.imageSprite.x += x;
            this.textSprite.y += y;
            this.imageSprite.y += y;
            return this;
        }

        getDefaultWinBackground(alpha: number = 1) {
            const winBg = PIXI.Sprite.from("win_bg");
            winBg.alpha = alpha;
            return winBg;
        }

        private setupAnimation() {
            this.imageAnimation
                .scaleAlign("center")
                .scaleVAlign("center");

            this.textAnimation
                .scaleAlign("center")
                .scaleVAlign("center");

            this.animation
                .setMainAnimation(this.imageAnimation)
                .type(UnionType.Simultaneous);

            this.setupAnimationImage();
            this.setupAnimationText();
            return this;
        }

        private getTotalTime() {
            return this.showTime + this.pause + this.hideTime;
        }

        private setupAnimationImage() {
            const total = this.getTotalTime();

            this.imageAnimation
                .delay(0)
                .easing(RG.Animation.Easing.Linear.None)
                .from({scale: 0}, {easing: RG.Animation.Easing.Elastic.Out})
                .intermediate(0, {scale: 1}, {
                    relativeTime: this.showTime
                })
                .intermediate(1, {scale: 1.1}, {
                    relativeTime: this.pause
                })
                .to({scale: 0})
                .duration(total)
                .defaultDuration(total);
            return this;
        }

        private setupAnimationText() {
            const total = this.getTotalTime();

            this.textAnimation
                .delay(0)
                .easing(RG.Animation.Easing.Linear.None)
                .from({scale: 2}, {easing: RG.Animation.Easing.Elastic.Out})
                .intermediate(0, {scale: 1}, {
                    relativeTime: this.showTime
                })
                .intermediate(1, {scale: 1.2}, {
                    relativeTime: this.pause
                })
                .on(RG.Animation.Events.Update, () => {
                    RG.Helper.setCenterX(this.contentContainer, this.textSprite);
                })
                .on(RG.Animation.Events.BeforeStart, () => {
                    RG.Helper.setCenterX(this.contentContainer, this.textSprite);
                })
                .to({scale: 0})
                .duration(total)
                .defaultDuration(total);
            return this;
        }

        setNumbers(numbers?: Component.Numbers) {
            if (this.numbers) {
                this.numbers.destroy();
                this.animation.animations.remove(this.numbers.effect);
                this.contentContainer.removeChild(this.numbers);
            }
            if (numbers) {
                this.numbers = numbers;
                this.numbers.zIndex = 102;
                // устанавливаем позицию цифр выйгрыша
                this.numbers.position.set(0, this.contentContainer.height/2 + this.MARGIN_TOP_TEXT);
                this.contentContainer.addChild(this.numbers);
                this.animation.animations.add(this.numbers.effect.duration(1000));
            }
            return this;
        }



        getDefaultNumbers() {
            return new Component.Numbers('numbers_big');
        }

        setNumberValues(winAmount: number, numberPlayTime?: number) {
            if (!this.numbers) {
                this.setNumbers(this.getDefaultNumbers());
            }
            this.numbers!.effect.to(winAmount);
            if (numberPlayTime) {
                this.numbers!.effect.duration(numberPlayTime);
            }
            return this;
        }

        setTimings(showTime?: number, hideTime?: number, pause?: number) {
            let anyDefined: boolean = false
            if (showTime !== undefined) {
                this.showTime = showTime;
                anyDefined = true;
            }
            if (hideTime !== undefined) {
                this.hideTime = hideTime;
                anyDefined = true;
            }
            if (pause !== undefined) {
                this.pause = pause;
                anyDefined = true;
            }
            if (anyDefined) {
                this.setupAnimationImage();
                this.setupAnimationText();
            }
            return this;
        }
    }
}

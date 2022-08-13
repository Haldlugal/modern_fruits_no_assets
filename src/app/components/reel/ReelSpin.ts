namespace ReelComponent {
    import Events = RG.Animation.Events;

    export type SpinValue = {
        value: number
    };

    export class ReelSpin extends RG.Animation.Union {

        private readonly preStartAnimation?: RG.Animation.Animation<SpinValue>;
        private readonly startAnimation: RG.Animation.Animation<SpinValue>;
        private readonly spinAnimation: RG.Animation.Animation<SpinValue>;
        private readonly endAnimation: RG.Animation.Animation<SpinValue>;
        private readonly postEndAnimation: RG.Animation.Animation<SpinValue>;

        private readonly symbols: number[];

        protected result?: ReelsMatrixRow;

        private container: PIXI.Container;

        private readonly containerHeight: Number;

        private blurFilter: PIXI.filters.BlurFilter = new PIXI.filters.BlurFilter();

        constructor (currentData: ReelsMatrixRow,
                     container: PIXI.Container,
                     spinDuration: number = 100,
                     startDuration: number = 200,
                     private endDuration: number = 300,
                     postEndDuration: number = 150,
                     withPreStart = true,
                     preStartDuration: number = 300
        ) {
            super();

            // Изначально - никаких блюров для символов на простыне
            this.blurFilter.blurX = 0;
            this.blurFilter.blurY = 0;

            this.container = container;
            this.container.filters = [this.blurFilter];

            // Всего иконок на одну больше, чем видно - последняя уходит вниз и сразу же перемещается наверх
            this.symbols = [Reel.getRandomSymbolId(), ...currentData];
            this.containerHeight = SlotPosition.HEIGHT * ReelConfig.ROWS;

            let sprites: PIXI.Sprite[] = [];

            // Нужен для того, чтобы поменять иконку только один раз за цикл
            let isOver: boolean[] = [];

            // Создаём массив иконок
            for (let i = 0; i < this.symbols.length; i++) {

                const sprite = new PIXI.Sprite(ReelSymbol.texture(this.symbols[i]));
                sprite.position.y = (i - 1) * SlotPosition.HEIGHT;
                if (RG.Helper.isMobile()) {
                    sprite.width = sprite.width - 3;
                }
                this.container.addChild(sprite);

                sprites.push(sprite);
                isOver.push(false);
            }

            // Функция обновления: обновляем двигаем сразу все иконки.
            // Последнюю перемещаем вверх и задаём ей случайную (или не очень) иконку.
            const updateFunction = (props: SpinValue, random = true) => {
                for (let i = 0; i < this.symbols.length; i++) {

                    const sprite = sprites[i];
                    sprite.position.y = SlotPosition.HEIGHT * (i - 1 + props.value);

                    if (sprite.position.y >= this.containerHeight) {
                        if (!isOver[i]) {
                            const texture = (random || (i === 0) || !this.result!.hasOwnProperty(i - 1)) ?
                                Reel.getRandomSymbolId() : this.result![i - 1];
                            sprite.texture = ReelSymbol.texture(texture);
                            isOver[i] = true;
                        }
                        sprite.position.y -= SlotPosition.HEIGHT * this.symbols.length;
                    }
                }
            };

            const clearOver = () => {
                for (let i = 0; i < isOver.length; i++) {
                    isOver[i] = false;
                }
            };

            if (withPreStart) {
                // Подпрыгивание перед началом
                this.preStartAnimation = new RG.Animation.Animation<SpinValue>();
                this.preStartAnimation
                    .easing(RG.Animation.Easing.Quadratic.In)
                    .from({value: 0})
                    .to({value: 2})
                    .duration(preStartDuration)
                    .on(Events.Update, (props: SpinValue) => {
                        for (let i = 0; i < this.symbols.length; i++) {
                            const sprite = sprites[i];
                            if (props.value <= 1) {
                                sprite.position.y = (i - 1) * SlotPosition.HEIGHT - 50 * props.value
                            } else {
                                sprite.position.y = (i - 1) * SlotPosition.HEIGHT - 50 + 30 * (props.value - 1)
                            }
                        }
                    })
                ;
                this.animations.push(this.preStartAnimation);
            }

            // Начальная анимацая - разгон, помимо основного апдейта ещё блёрим
            this.startAnimation = new RG.Animation.Animation<SpinValue>();
            this.startAnimation
                .from({value: 0})
                .to({value: this.symbols.length})
                .easing(RG.Animation.Easing.Linear.None)
                .duration(startDuration)
                .on(Events.Update,  (props: SpinValue) => {
                    this.blurFilter.blurY = 8 * props.value / this.symbols.length;
                    updateFunction(props);
                })
            ;

            this.animations.push(this.startAnimation);

            // Само вращение - пока не скажут стоп свеху
            this.spinAnimation = new RG.Animation.Animation<SpinValue>();
            this.spinAnimation
                .from({value: 0})
                .to({value: this.symbols.length})
                .duration(spinDuration)
                .on(Events.Start, () => {
                    this.emit('spin.start');
                })
                .on(Events.Update, updateFunction)
                .on(Events.Repeat, clearOver)
                .on(Events.Complete, clearOver)
                .iterations(Infinity);

            this.animations.push(this.spinAnimation);

            // Завершаем вращение - делаем ещё один круг и подставляем картинки, которые пришли в result
            // Параллельно разблёриваем
            this.endAnimation = new RG.Animation.Animation<SpinValue>();
            this.endAnimation
                .from({value: 0})
                .to({value: this.symbols.length})
                .easing(RG.Animation.Easing.Quadratic.Out)
                .duration(this.endDuration)
                .on(Events.Update, (props) => {
                    this.blurFilter.blurY = 8 - (8 * props.value / this.symbols.length);
                    updateFunction(props, false);
                }).on(Events.Complete, () => (this.blurFilter.blurY = 0))
            ;
            this.animations.push(this.endAnimation);

            // Посленяя - дергание вверх-вниз
            this.postEndAnimation = new RG.Animation.Animation<SpinValue>();
            this.postEndAnimation
                .from({value: 0})
                .to({value: 2})
                .easing(RG.Animation.Easing.Linear.None)
                .intermediate(0, {value: 1}, {
                    relativeTime: postEndDuration / 3
                })
                .defaultDuration(postEndDuration)
                .duration(postEndDuration)
                .on(Events.Update, (props: SpinValue) => {
                    for (let i = 0; i < this.symbols.length; i++) {
                        const sprite = sprites[i];
                        if (props.value <= 1) {
                            sprite.position.y = (i - 1) * SlotPosition.HEIGHT + 30 * props.value
                        } else {
                            sprite.position.y = (i - 1) * SlotPosition.HEIGHT + 30 - 30 * (props.value - 1)
                        }
                    }
                })
            ;
            this.animations.push(this.postEndAnimation);
        }

        setResult (data: ReelsMatrixRow): this {
            this.result = data;
            return this;
        }

        spinStop (): Boolean {
            if (!this.result) {
                return false;
            }
            this.emit(RG.Animation.Events.BeforeStop);
            this.forceFinishInfinite();
            return true;
        }

        spinStart () {
            return this.playAndDestroy();
        }

        setSpinDuration (duration: number) {
            this.spinAnimation.duration(duration)
        }

        highlight () {
            this.endAnimation
                .easing(function (k) {
                    let s = 1.2;
                    return --k * k * ((s + 1) * k + s) + 1;
                })
                .duration(this.endDuration * 8);
            this.skipAnimation(this.postEndAnimation);
        }
    }
}

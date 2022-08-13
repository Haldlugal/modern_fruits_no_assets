namespace ReelComponent {

    export class Reel extends PIXI.Container {

        private result: ReelsMatrixRow = [-1, -1, -1];

        private moveAnimation?: ReelSpin;

        public static StartSpinDuration = 150;

        public static EndSpinDuration = 200;

        public static PostEndSpinDuration = 150;

        public static BaseDurationBeforeResult = 700;

        public static DurationAfterStop = 200;
        public static withPreStartAnimation = true;
        public static preStartDuration = 150;
        public static SYMBOL_OFFSET_X = !RG.Helper.isMobile() ? 10 : 10;
        public static SYMBOL_OFFSET_Y = !RG.Helper.isMobile() ? 0 : -2;

        protected durationBeforeResult: number = Reel.BaseDurationBeforeResult;

        /**
         * Номера символов которые отображаются в ячейках в неподвижном состоянии
         * Это и дефолтные , это и результаты
         */
        private data: ReelsMatrixRow;

        /**
         * Номер барабана
         */
        public index: number;

        private readyToStop: boolean = false;

        private spinCurrentDuration = Logic.ReelResult.SPEED_NORMAL;

        /***
         * Общее количество известных символов (картинок)
         */
        static readonly knownSymbolAmount: number = 8;

        public readonly symbols: ReelSymbol[] = [];

        private spark?: Effect.Sparks;

        /**
         * Слой, который крутится
         */
        public spinner: PIXI.Container = new PIXI.Container();

        /**
         * Задний слой - слой с эффектами
         */
        public effectsLayer: PIXI.Container = new PIXI.Container();

        public frame: PIXI.Container = PIXI.Sprite.from('reel_win_frame');

        /**
         * Слой с символами
         */
        public symbolsLayer: PIXI.Container = new PIXI.Container();

        public static readonly MOBILE_SYMBOL_SCALE = {
          x: 0.985,
          y: 1,
        };

        /**
         * @param index Номер барабана
         * @param {number[]} defaultResult
         * @param expandedId
         */
        constructor(index: number, defaultResult: ReelsMatrixRow) {
            super();

            this.addChild(this.effectsLayer);
            this.addChild(this.symbolsLayer);
            this.addChild(this.spinner);
            this.addChild(this.frame);
            this.frame.visible = false;
            this.frame.x = -20;

            // this.spark = new Effect.Sparks(this.effectsLayer, 420, SlotPosition.WIDTH - 20, 3 * SlotPosition.HEIGHT - 11, 'fire_dot_symbol');
            // this.spark.duration(900);

            // Номер текущего барабана
            this.index = index;
            this.x = this.index * (SlotPosition.WIDTH + Reel.SYMBOL_OFFSET_X);
            this.y += Reel.SYMBOL_OFFSET_Y;

            this.data = defaultResult;

            this.symbols = [...Array(ReelConfig.ROWS)].map((c: any, pos: number) => {
                const symbol = new ReelSymbol(pos, this.data[pos]);

                if (RG.Helper.isMobile()) {
                    symbol.scale.set(Reel.MOBILE_SYMBOL_SCALE.x, Reel.MOBILE_SYMBOL_SCALE.y);
                }
                this.symbolsLayer.addChild(symbol);
                return symbol.on('pointerdown', () => {
                    // сообщаем родителю о нажатии на символ (и на какой символ)
                    this.emit('symbol.click', this.symbols[pos]);
                });
            });
        }

        public highlight(on: boolean = true): this {
            this.frame.visible = on;
            if (on) {
                if (this.moveAnimation) {
                    this.moveAnimation.highlight();
                }
                if (this.spark) {
                    this.spark.play();
                }
            } else {
                if (this.spark) {
                    this.spark.stop();
                }
            }
            return this;
        }

        /**
         * Получение одного произвольного номера символа-картинки
         */
        static getRandomSymbolId(): number {
            return Math.floor(Math.random() * Reel.knownSymbolAmount);
        }

        setResult(result: ReelsMatrixRow) {
            this.result = result;
            this.moveAnimation!.setResult(this.result);
            this.tryToStopSpin();
        }

        private tryToStopSpin() {
            if (!this.readyToStop || !this.moveAnimation!.spinStop()) {
                setTimeout(() => {
                    this.tryToStopSpin()
                }, 50);
            }
        }

        clearResult() {
            this.result = [-1, -1, -1];
            this.setDurationBeforeResult();
        }

        spinTheWheel(time: number): Promise<void> {
            return new Promise((resolve => {
                setTimeout(() => {
                    this.spinForResult(resolve)
                }, time)
            }));
        }

        async spinForResult(resolve: () => void) {

            this.readyToStop = false;

            this.spinner.removeChildren();

            this.moveAnimation = new ReelSpin(
                this.data,
                this.spinner,
                this.spinCurrentDuration,
                Reel.StartSpinDuration,
                Reel.EndSpinDuration,
                Reel.PostEndSpinDuration,
                Reel.withPreStartAnimation,
                Reel.preStartDuration
            );

            // скрываем символы
            this.symbolsLayer.visible = false;

            // показываем спиннер
            this.spinner.visible = true;

            this.moveAnimation
                .on(RG.Animation.Events.Complete, () => {
                    setTimeout(() => {
                        this.emit('spin.stop');
                    }, Reel.DurationAfterStop)
                })
                .on('spin.start', () => {
                    setTimeout(() => {
                        this.readyToStop = true;
                    }, this.durationBeforeResult)
                })
            ;

            await this.moveAnimation.spinStart();

            // помещаем его в нулевую позицию
            this.spinner.y = 0;

            this.data = this.result;

            // показываем снова обычные символы
            this.data.forEach((symbolId: number, pos: number) => {
                this.symbols[pos].setSymbolId(symbolId);
            });

            // показываем символы
            this.symbolsLayer.visible = true;

            // скрываем спиннер
            this.spinner.visible = false;

            this.readyToStop = false;

            resolve();
        }

        async animateSymbols(winSymbolsPositions: number[], lostSymbolsPositions: number[]) {
            const animations: Promise<boolean>[] = [];
            winSymbolsPositions.forEach((position)=>{
                let symbol = this.symbolsLayer.getChildAt(position) as ReelSymbol;
                animations.push(symbol.playWinEffect());
            });
            lostSymbolsPositions.forEach((position)=>{
                let symbol = this.symbolsLayer.getChildAt(position) as ReelSymbol;
                animations.push(symbol.playLoseEffect());
            });
            await Promise.all(animations);
        }

        async animateSymbolsShort(winSymbolsPositions: number[], lostSymbolsPositions: number[]) {
            const animations: Promise<boolean>[] = [];
            winSymbolsPositions.forEach((position)=>{
                let symbol = this.symbolsLayer.getChildAt(position) as ReelSymbol;
                symbol.resetToDefault();
            });
            lostSymbolsPositions.forEach((position)=>{
                let symbol = this.symbolsLayer.getChildAt(position) as ReelSymbol;
                animations.push(symbol.playLoseEffect());
            });
            await Promise.all(animations);
        }

        stopSymbolsAnimation() {
            this.symbols.forEach(symbol => {
                symbol.stopAnimations();
            })
        }

        resetSymbols() {
            this.stopSymbolsAnimation();
            this.symbols.forEach(symbol => {
                symbol.resetToDefault();
            })
        }

        fadeOut() {
            for (let row = 0; row < ReelConfig.ROWS; row++) {
                let symbol = this.symbolsLayer.getChildAt(row) as ReelSymbol;
                symbol.playLoseEffect();
            }
        }

        fadeIn() {
            for (let row = 0; row < ReelConfig.ROWS; row++) {
                let symbol = this.symbolsLayer.getChildAt(row) as PIXI.Sprite;
                symbol.alpha = 1
            }
        }

        changeSpeed(duration: number) {
            if (this.moveAnimation) {
                this.moveAnimation!.setSpinDuration(duration);
            } else {
                this.spinCurrentDuration = duration;
            }
        }

        setDurationBeforeResult (duration = Reel.BaseDurationBeforeResult) {
            this.durationBeforeResult = duration;
            return this;
        }

        public setData(data: ReelsMatrixRow) {
            this.data = data;
        }

    }
}

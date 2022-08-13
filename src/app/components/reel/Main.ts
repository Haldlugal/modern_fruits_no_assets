namespace ReelComponent {

    export class Main extends PIXI.Container {

        private reels: Reel[] = [];
        private isPlayingWonEffects = false;
        private winningPoints: Component.WinPoint[];
        public playRoundResult?: PlayRoundResult;

        private spinStartTime: number = 0;
        private winLineAmount: ReelsWinLineAmount;
        private logic?: Logic.ReelResult;
        private _stake: number;
        private readonly _symbolInfo: ReelSymbolInfo[];
        private help: ReelSymbolHelp;
        private helpTimer: number = 0;
        private specialModeOn = false;

        constructor(private readonly stage: PIXI.Container, matrix: ReelsMatrix, symbolInfo: ReelSymbolInfo[], stake: number, winningPoints: Component.WinPoint[]) {
            super();

            this._stake = stake;
            this._symbolInfo = symbolInfo;

            // Запоминаем набор линий, которые могут выигрывать
            this.winningPoints = winningPoints;

            this.help = new ReelSymbolHelp();

            // Создаем барабаны
            for (let i = 0; i < ReelConfig.COLS; i++) {

                const reel = new Reel(i, matrix.reel(i));
                reel.on('symbol.click', (symbol: ReelSymbol) => {

                    // информация о символе
                    const info = this._symbolInfo.find((info: ReelSymbolInfo) => {
                        return info.index === symbol.getSymbolId()
                    }) as ReelSymbolInfo;

                    if (info) {
                        clearTimeout(this.helpTimer);
                        this.help.zIndex = 1;
                        this.help.show(symbol, this.stage, this._stake, info.combinations);
                        this.helpTimer = setTimeout(() => this.help.hide(), 3000);
                    }
                })
                    .on('spin.stop', () => {
                        // в момент начала остановки очередного спина
                        // отправляем результаты в следующий барабан
                        this.emit('spin.stop', reel.index);
                        this.sendResultsToReel(reel.index + 1);
                    });
                this.reels.push(reel);
                this.addChild(reel);
            }

            // Определяем маску - видимую часть области
            const maskWidth = ReelConfig.COLS * (SlotPosition.WIDTH + Reel.SYMBOL_OFFSET_X);
            const maskHeight = ReelConfig.ROWS * SlotPosition.HEIGHT;

            const reelContainerMask = new PIXI.Graphics();
            reelContainerMask.beginFill(0xFF0000, 0.5);
            reelContainerMask.drawRect(0, 0, maskWidth, maskHeight);
            this.addChild(reelContainerMask);
            this.mask = reelContainerMask;

            // Добавляем контейнер в основную область
            this.position.set(SlotPosition.OFFSET_X, SlotPosition.OFFSET_Y);

            // Компонент, отображающий кол-во выигрыша линии
            this.winLineAmount = new ReelsWinLineAmount();

            this.stage.addChild(this, this.winLineAmount);
        }

        setResult(result: PlayRoundResult): this {
            this.playRoundResult = result;

            this.logic = new Logic.ReelResult(this.spinStartTime, result.playData.reelsMatrix);

            // планируем отправку результата в первый барабан
            this.sendResultsToReel(0);

            return this;
        }

        private applyReelLogic(reelLogic: Logic.ReelResultInfo): void {
            const spinningReel = this.reels[reelLogic.index];
            const previousReel = reelLogic.index > 0 ? this.reels[reelLogic.index - 1] : null;
            // подсветка символов, которые потенциально могут выиграть
            const highlightSymbols = (reelLogic.symbols !== undefined) ? reelLogic.symbols : [];
            //Логика для рыла, который покрутился на данный момент. Надо подсветить книги и затенить все остальное
            this.specialModeOn = reelLogic.highlight ? reelLogic.highlight : false;
            if (previousReel !== null) {
              previousReel.symbols.forEach((symbol: ReelSymbol) => {
                const on = highlightSymbols.indexOf(symbol.reelPosition) !== -1;
                symbol.alpha = (!this.specialModeOn || on) ? 1 : 0.1;
              });
            }

            if (this.specialModeOn) {
                this.fadeOutReel(reelLogic.index - 1, reelLogic.symbols!);
                for (let i = 0; i < reelLogic.index - 1; i++) {
                    const exceptions: number[] = [];
                    reelLogic.previousSymbols!.forEach(symbol => {
                        if (symbol.reelIndex === i) {
                            exceptions.push(symbol.symbolPos);
                        }
                    });
                    this.fadeOutReel(i, exceptions);
                }
            }

            if (reelLogic.delay) {
              spinningReel.setDurationBeforeResult(reelLogic.delay);
            }

            // подсветка барабана
            const highlightOn = !!reelLogic.highlight;
            // const delay = (highlightOn) ? 1200 : 1200;
            const delay = 0;

            Utils.Pause.delay(delay, spinningReel.index + '-reel')
                .then(() => {
                    this.reels.forEach(reel=>reel.highlight(false));
                    spinningReel.highlight(highlightOn);
                });

            // меняем скорость барабану
            if (reelLogic.speed !== undefined)
              spinningReel.changeSpeed(reelLogic.speed);

            // выставляем alpha по нашей логике
            if (reelLogic.alpha !== undefined) {
              spinningReel.alpha = reelLogic.alpha;
            }

            if (reelLogic.status !== undefined)
                this.emit('spin.win-wait', reelLogic.status, spinningReel.index);
        }

        private fadeOutReel(index: number, exceptions: number[]) {
            const reel = this.reels[index];
            for (let i = 0; i< reel.symbols.length; i++) {
              const on = exceptions.indexOf(i) !== -1;
              reel.symbols[i].alpha = on ? 1 : 0.1;
            }
        }

        //возвращает все символы барабанов в непрозрачное состояние.
        public fadeInReels(){
            this.reels.forEach((reel) => {
               reel.symbols.forEach((symbol) =>{
                   symbol.alpha = 1;
               });
            });
        }

        private sendResultsToReel(index: number) {

            if (!this.reels.hasOwnProperty(index)) {
                return;
            }

            // логика барабана
            const reelLogic = this.logic!.reel(index);

            // применяем логику
            this.applyReelLogic(reelLogic);

            // Ждем сконфигуренное время
            Utils.Pause.delay(reelLogic.delay || 0)
                .then(() => {
                    // и теперь отправляем результат в барабан
                    this.reels[index].setResult(reelLogic.result!);
                })
        }

        private showWonLine(wonLine: WonLine, infinite: boolean = false, delay: number = 0, withoutSum: boolean = false): Promise<boolean> {


            if (!this.isPlayingWonEffects) {
                return Promise.resolve(true);
            }

            const winningPoint = this.winningPoints.find((winningPoint: Component.WinPoint) => {
                return winningPoint.winLine.number === wonLine.lineIndex;
            });

            // Показываем линию
            winningPoint && winningPoint.pin();
            if (!withoutSum) {
                // Отображаем сумму выигрыша линии
                this.winLineAmount.show(wonLine.wonAmount, this);
            }

            const animations: Promise<void>[] = [];
            for (let t = 0; t < this.reels.length; t++) {
                let lostPositions = [];
                let symbolsWonPositions: number[] = [];
                for (let i = 0; i < ReelConfig.ROWS; i++) {
                    lostPositions.push(i);
                }

                const wonLineWonPositionsForRow = wonLine.coordinate.filter((coordinate) => {
                    return coordinate.x === t;
                }).map((coordinate) => {
                    return coordinate.y;
                });
                symbolsWonPositions = symbolsWonPositions.concat(wonLineWonPositionsForRow);

                symbolsWonPositions = [...new Set(symbolsWonPositions)];
                const symbolsLostPositions = lostPositions.filter( ( el ) => !symbolsWonPositions.includes( el ) );
                animations.push(this.reels[t].animateSymbolsShort(symbolsWonPositions, symbolsLostPositions));
            }

            return Promise.all(animations).then(async () => {
                await Utils.Pause.delay(1000);
                if (!infinite) {
                    // Скрываем сумму выигрыша линии
                    this.winLineAmount.hide();
                    // Убираем линию
                    winningPoint && winningPoint.unpin();
                }
                return true;
            });
        }

        async showWonLines(startIndex: number, delay: number = 0): Promise<boolean> {

            const wonLines = this.playRoundResult?.playData.wonLines || [];
            const wonLine = wonLines[startIndex] as WonLine;

            if (!wonLine || !this.isPlayingWonEffects) {
                return Promise.resolve(true);
            }

            await Utils.Pause.delay(delay);
            const multipleLines = wonLines.length > 1;
            await this.showWonLine(wonLine, !multipleLines);
            const nextIndex = (++startIndex >= wonLines.length) ? 0 : startIndex;
            return this.showWonLines(nextIndex, (multipleLines) ? 0 : 0);
        }

        async showWonLinesOnce(): Promise<void> {
            this.isPlayingWonEffects = true;

            const wonLines = this.playRoundResult!.playData.wonLines;

            if (wonLines.length > 0) {
                RG.GameSound.instance.play("line_win");
            }

            const wonAmount = this.getWonLinesResult();

            if (wonAmount > 0) {
                this.winLineAmount.show(wonAmount, this, true);
            }
            const winPoints = [];
            const animations: Promise<void>[] = [];
            for (let i = 0; i < wonLines.length; i++) {
                const winningPoint = this.winningPoints.find((winningPoint: Component.WinPoint) => {
                    return winningPoint.winLine.number === wonLines[i].lineIndex;
                });
                // Показываем линию
                winningPoint && winningPoint.pin();
                winPoints.push(winningPoint);
            }

            for (let t = 0; t < this.reels.length; t++) {
                let lostPositions = [];
                let symbolsWonPositions: number[] = [];
                for (let i = 0; i < ReelConfig.ROWS; i++) {
                    lostPositions.push(i);
                }

                wonLines.forEach((wonLine) => {
                    const wonLineWonPositionsForRow = wonLine.coordinate.filter((coordinate) => {
                        return coordinate.x === t;
                    }).map((coordinate) => {
                       return coordinate.y;
                    });
                    symbolsWonPositions = symbolsWonPositions.concat(wonLineWonPositionsForRow);
                });
                symbolsWonPositions = [...new Set(symbolsWonPositions)];
                const symbolsLostPositions = lostPositions.filter( ( el ) => !symbolsWonPositions.includes( el ) );
                animations.push(this.reels[t].animateSymbols(symbolsWonPositions, symbolsLostPositions));
            }

            await Promise.all(animations);
            await Utils.Pause.delay(500);
            this.isPlayingWonEffects = false;
            return Promise.resolve();
        }

        public async highlightSpecial(isInfinite: boolean = false) {
            const wonLines = this.playRoundResult!.playData.wonLines.filter((line) => {
                return line.lineDirection === "any";
            });
            const animations: Promise<boolean>[] = [];
            for (let i = 0; i < wonLines.length; i++) {
                wonLines[i].coordinate.forEach((pos: SlotPosition)=> {
                    // animations.push(this.reels[pos.x].animateWinSymbol(pos.y, isInfinite));
                });
            }
            await Promise.all(animations);
        }

        public getWonLinesResult(): number {
            const wonLines = this.playRoundResult!.playData.wonLines;
            let wonAmount = 0;
            wonLines.forEach((line) => {
                wonAmount += line.wonAmount;
            });
            return wonAmount;
        }

        public spin(callback: () => void): void {
            this.specialModeOn = false;

            // останавливаем все спец эффекты, которые сейчас показываются на компоненте
            this.reset();
            this.stopWonEffects();

            const promises: Promise<void>[] = [];
            Utils.Pause.delay(Reel.StartSpinDuration, 'spin').then(() => {
                RG.GameSound.instance.play("reel_spin");
            });

            let count = 1;

            this.spinStartTime = Date.now();
            this.reels.forEach((reel) => {
                reel.clearResult();
                promises.push(reel.spinTheWheel(100 * count).then(() => {
                    // проигрываем музыку
                    RG.GameSound.instance.play("reel_stop");
                }));
                count++;
            });

            Promise.all(promises).then(() => {
                PIXI.sound.stop("reel_spin");

                // очищаем возможные остатки показа рамок
                this.reels.forEach((reel: Reel) => {

                    reel.symbols.forEach((symbol: ReelSymbol) => {
                        symbol.setHighlight(false);
                        symbol.alpha = 1;
                    });
                    reel.highlight(false);
                });

                setTimeout(()=>{
                  callback();
                }, 250);
            });
        }

        reset() {
            this.hideWinLines();
            this.reels.forEach((reel: Reel) => reel.resetSymbols());
        }

        hideWinLines() {
            this.winLineAmount.hide();
            this.winningPoints.forEach((winPoint) => {
                winPoint.unpin();
            });
        }

        async playWonEffects(delay = 0) {
            if (delay) {
                await Utils.Pause.delay(delay);
            }
            this.isPlayingWonEffects = true;
            this.hideWinLines();
            this.showWonLines(0)
                .then(() => {
                    this.isPlayingWonEffects = false;
                    this.reels.forEach((reel: Reel) => reel.fadeIn());
                })
        }

        stopWonEffects() {
            this.help.hide();
            this.isPlayingWonEffects = false;
            this.reels.forEach((reel: Reel) => reel.stopSymbolsAnimation());
            Utils.Pause.break();
        }

        /**
         * Установка текущей ставки
         */
        public setStake(stake: number): this {
            this.help.hide();
            this._stake = stake;
            return this;
        }


        public forceSetSymbols(matrix: ReelsMatrix) {
            for (let i = 0; i < this.reels.length; i++) {
                const reelData = matrix.reel(i);
                for (let t = 0; t < this.reels[i].symbols.length; t++) {
                    this.reels[i].symbols[t].setId(reelData[t]);
                }
                this.reels[i].setData(reelData);
            }
        }
    }
}

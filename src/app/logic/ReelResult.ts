namespace Logic {

    import del = RG.Utils.Cookie.del;

    export enum WinWaitStatus {
        NONE,
        SUCCESS,
        FAIL
    }

    export type ReelResultInfo = {
        index: number,              // номер барабана
        delay?: number,             // время задержки перед отправкой данных в этот барабан
        speed?: number,             // с какой скоростью крутить барабан
        alpha?: number,             // прозрачность
        status?: WinWaitStatus,     // Состояние ожидания выигрыша
        result?: ReelsMatrixRow,     // результат этого барабана
        others?: ReelResultInfo[],   // инфа для других барабанов
        highlight?: boolean,         // Подсвечивать ли этот барабан
        symbols?: number[],       // Какие символы должны быть подсвечены на предыдущем барабане
        previousSymbols?: SymbolCoords[] // Позиции предыдущих подсвеченных символов
    }

    export type SymbolCoords = {
          symbolPos: number,
          reelIndex: number
    }

    export class ReelResult {

        public static SPEED_NORMAL = 200;

        public static SPEED_SLOW = 500;


        /**
         * Задержка, через какое время после начала остановки очередного барабана
         * можно запускать остановку следующего барабана
         *
         */
        private delayBetweenReels = 0;

        /**
         * Задержка, через какое время после начала остановки очередного барабана
         * можно отправлять запрос на остановку следующего барабана при ожидании биг вина
         */
        private delayWaitBigWin = 1000;

        /**
         * Время, в которое стартовала прокрутка спинов и для которой получены результаты
         */
        private readonly _spinStartTime: number;

        /**
         * Матрица результатов
         */
        private readonly _matrix: ReelsMatrix;

        /**
         * Количество барабанов, считается как кол-во элементов в первой строке матрице результатов
         */
        private readonly _reelAmount: number;

      /**
       * Особый символ для спецэффектов
       * @type {number}
       */
        private highlightSymbol: number = 9;

        /**
         * Символы на выигрышниых линиях
         */
        private readonly lines: [number, number, number, number, number][];

        private payLines = [
            ['1x0', '1x1', '1x2', '1x3', '1x4'],
            ['0x0', '0x1', '0x2', '0x3', '0x4'],
            ['2x0', '2x1', '2x2', '2x3', '2x4'],
            ['0x0', '1x1', '2x2', '1x3', '0x4'],
            ['2x0', '1x1', '0x2', '1x3', '2x4'],
        ];

        constructor(spinStartTime: number, matrix: ReelsMatrix) {
            this._spinStartTime = spinStartTime;
            this._matrix = matrix;
            const d = matrix.all();
            this._reelAmount = (d[0] || []).length;

            this.lines = [
                [d[1][0], d[1][1], d[1][2], d[1][3], d[1][4]],
                [d[0][0], d[0][1], d[0][2], d[0][3], d[0][4]],
                [d[2][0], d[2][1], d[2][2], d[2][3], d[2][4]],
                [d[0][0], d[1][1], d[2][2], d[1][3], d[0][4]],
                [d[2][0], d[1][1], d[0][2], d[1][3], d[2][4]],
            ];
        }

        /**
         * Получить информацию по указанному барабану
         *
         * @param index
         */
        public reel(index: number) : ReelResultInfo {

            let delay = this.delayBetweenReels;
            let waitBigWin = false;
            let status = WinWaitStatus.NONE;
            let highlights: string[] = [];

            if (index === 0) {
                // первый барабан - его просто показать не ранее чем через delayTime
                // прошло с начала прокрутки
                const spentTime = Date.now() - this._spinStartTime;
                delay = Math.max(ReelComponent.Reel.BaseDurationBeforeResult - spentTime, 0);
            }

            // Начиная с первого барабана смотрим на возможность особого выигрыша
            if (index > 0) {
                highlights = this.getHighlights(index);
                //Есди количество спецсимволов 2 или более, значит есть шанс особого выигрыша.
                waitBigWin = highlights.length > 1;
                delay = (waitBigWin) ? this.delayWaitBigWin : this.delayBetweenReels;

                if (waitBigWin) {
                    status = this.getHighlights(index + 1).length > 2
                        ? WinWaitStatus.SUCCESS
                        : WinWaitStatus.FAIL;
                }
            }

            return {
                index: index,
                delay: delay,
                speed: ReelResult.SPEED_NORMAL,
                status: status,
                alpha: 1,
                highlight: waitBigWin,
                result: this._matrix.reel(index),
                others: this.makeOthers(index, waitBigWin, highlights),
                previousSymbols: this.getPreviousSymbols(index, highlights),
                symbols: this.getSymbolsToEffect(index, highlights)
            }

        }

        private getPreviousSymbols(index: number, highlights: string[]) : SymbolCoords[] {
            const previousSymbols:SymbolCoords[] = [];
            highlights.forEach((symbol: string)=>{
                const symbolInfo  = this.keyInfo(symbol);
                if (symbolInfo.reelIndex < index - 1){
                    previousSymbols.push({
                      reelIndex: symbolInfo.reelIndex,
                      symbolPos: symbolInfo.symbolPos
                    });
                }
            });
            return previousSymbols;
        }

        private getSymbolsToEffect(index: number, highlights: string[]) : number[]{
          const symbolsToEffect:number[] = [];
          highlights.forEach((symbol: string)=>{
            const symbolInfo  = this.keyInfo(symbol);
            if (symbolInfo.reelIndex === index - 1){
              symbolsToEffect.push(symbolInfo.symbolPos);
            }
          });
          return symbolsToEffect;
        }

        /**
         * Получить набор данных для следующих барабанов, движущихся замедленно или нормально
         * и предыдущих - подсветить символы
         */
        private makeOthers(index: number, waitBigWin: boolean, highlights: string[]) : ReelResultInfo[] {
            let others = [];

            // предыдущие барабаны
            for (let i = 0; i < index; i++) {
                let symbols: number[] = [];

                highlights.forEach((key: string) => {
                    const k = this.keyInfo(key);
                    if (k.reelIndex == i)
                        symbols.push(k.symbolPos);
                });
                others.push({index: i, symbols: symbols });
            }

            // следующие барабаны
            for (let i = index + 1; i < this._reelAmount; i++) {
                others.push({
                    index: i,
                    alpha: (waitBigWin) ? 0.2 : 1
                });
            }
            return others;
        }

        private getHighlights(index: number) : string[] {

            let highlights: string[] = [];

            const matrix = this._matrix;

            let count = 0;

            for (let i = 0; i < index; i++) {
                const reel = matrix.reel(i);
                for (let t = 0; t < reel.length; t++) {
                    if(reel[t] === this.highlightSymbol) {
                      count++;
                      highlights.push(t+"x"+i);
                    }
                }
            }
            if (count >= 1) {
                return highlights;
            }
            return [];
        }

        private keyInfo (key: string) : { key: string, symbolPos: number, reelIndex: number } {
            const c = (key || '').split('x');

            return {
                key: key,
                symbolPos: Number(c[0]),
                reelIndex: Number(c[1])
            }
        }

        /**
         * Получить данные (результаты), на основе которых построена эта логика
         */
        public data() : ReelsMatrix {
            return this._matrix;
        }
    }
}

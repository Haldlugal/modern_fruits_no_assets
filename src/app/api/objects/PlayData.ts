class PlayData {
    public reelsMatrix: ReelsMatrix;
    public maxWonLine?: WonLine;
    public wonLines: WonLine[] = [];
    public expandSymbols: number[] = [0,0];
    public stake: number;


    constructor(apiData: any) {

        const matrixData = (apiData.hasOwnProperty('symbols_position_indexes'))
            ? apiData.symbols_position_indexes
            : [1, 1, 1];

        this.reelsMatrix = new ReelsMatrix(matrixData);

        if (apiData.hasOwnProperty('max_won_line') && apiData.max_won_line) {
            this.maxWonLine = new WonLine(apiData.max_won_line);
        }

        if (apiData.hasOwnProperty('won_lines') && apiData.won_lines.length) {
            apiData.won_lines.forEach((line: any) => {
                this.wonLines.push(new WonLine(line));
            })
        }

        if (apiData.hasOwnProperty('expand_symbol')) {
            this.expandSymbols = apiData.expand_symbol;
        }

        this.stake = apiData.hasOwnProperty('stake') ? apiData.stake : 1;
    }
}

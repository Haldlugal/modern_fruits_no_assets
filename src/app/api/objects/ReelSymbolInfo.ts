class ReelSymbolInfo {
    public index: number;
    public possibility: number;
    public combinations: SymbolCombinations;
    public winPositions: string[];
    public range: number[];
    public finalPossibility: number;

    constructor(index: number, apiData: any) {
        this.index = index;
        this.possibility = Number(apiData.possibility) || 0;
        this.combinations = new SymbolCombinations(apiData.combinations || {});
        this.winPositions = apiData.win_positions || [];
        this.range = RG.Helper.mapNumberArray(apiData.range) || [];
        this.finalPossibility = Number(apiData.final_possibility) || 0;
    }
}

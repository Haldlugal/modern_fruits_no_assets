class AutoPlayData {
    /**
     * Шаги для ограничений по проигрышам
     */
    public lossLimits: number[];
    /**
     * Шаги для ограничения по одиночному выигрышу
     */
    public singleWinLimits: number[];
    /**
     * Шаги для количества спинов
     */
    public spins: number[];

    constructor(apiData: any) {
        this.lossLimits = apiData.hasOwnProperty('loss_limits') ? RG.Helper.mapNumberArray(apiData.loss_limits.steps) : [];
        this.singleWinLimits = apiData.hasOwnProperty('single_win_limits') ? RG.Helper.mapNumberArray(apiData.single_win_limits.steps) : [];
        this.spins = apiData.hasOwnProperty('spins') ? RG.Helper.mapNumberArray(apiData.spins.steps) : [];
    }
}

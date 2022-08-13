class AutoPlaySettings {
    public lossLimitsValue: number;
    public singleWinLimitsValue: number;
    public spinsValue: number;
    public stopAtFreeSpin: boolean;

    constructor(lossLimitsValue: number,singleWinLimitsValue: number, spinsValue: number, stopAtFreeSpin: boolean) {
        this.lossLimitsValue = lossLimitsValue;
        this.singleWinLimitsValue = singleWinLimitsValue;
        this.spinsValue = spinsValue;
        this.stopAtFreeSpin = stopAtFreeSpin;
    }
}

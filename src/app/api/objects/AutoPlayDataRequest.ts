class AutoPlayDataRequest {

    /**
     * Шаги для ограничений по проигрышам
     */
    public lossLimits: number[];
    public lossLimitsValue: number;
    /**
     * Шаги для ограничения по одиночному выигрышу
     */
    public singleWinLimits: number[];
    public singleWinLimitsValue: number;
    /**
     * Шаги для количества спинов
     */
    public spins: number[];
    public spinsValue: number;

    constructor(autoPlayData: AutoPlayData, autoPlaySettings: AutoPlaySettings) {
        this.lossLimits = autoPlayData.lossLimits;
        this.lossLimitsValue = autoPlaySettings.lossLimitsValue;
        this.singleWinLimits = autoPlayData.singleWinLimits;
        this.singleWinLimitsValue = autoPlaySettings.singleWinLimitsValue;
        this.spins = autoPlayData.spins;
        this.spinsValue = autoPlaySettings.spinsValue;
    }

    getData(): { [key: string]: any; } {
        return {
            'auto_play_data': {
                'loss_limits': {
                    'steps': this.lossLimits,
                    'value': this.lossLimitsValue,
                    'temp_value': this.lossLimitsValue
                },
                'single_win_limits': {
                    'steps': this.singleWinLimits,
                    'value': this.singleWinLimitsValue,
                    'temp_value': this.singleWinLimitsValue
                },
                'spins': {
                    'steps': this.spins,
                    'value': this.spinsValue,
                    'temp_value': this.spinsValue
                }
            }
        };
    }

}

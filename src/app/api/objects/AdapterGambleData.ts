class AdapterGambleData {
    public maxWinAmount: number;
    public gambleMaxStake: number;

    constructor(apiData: any) {
        this.maxWinAmount = apiData.max_win_amount;
        this.gambleMaxStake = apiData.gamble_max_stake;
    }

}

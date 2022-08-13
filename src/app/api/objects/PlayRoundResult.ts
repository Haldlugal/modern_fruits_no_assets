class PlayRoundResult {
    public ok: boolean;
    public balance: number;
    public currency: string;
    public currency_symbol: string;
    public language: string;
    public round_id: number;
    public won_amount: number;
    public status: PlayRoundStatus;
    public status_label: string;
    public playData: PlayData;
    public stake: number;
    public gambleHistory: number[];
    public adapterGambleData: AdapterGambleData;
    public activeFreeSpin: FreeSpinData;
    public inGameFreeSpins: InGameFreeSpinData;

    public is_big_win: boolean = false;
    public is_mega_win: boolean = false;
    public is_super_win: boolean = false;

    constructor(data: any, stake?: number, specialWinStage?: SpecialWinStage) {
        this.ok = Boolean(data.ok || false);
        this.balance = data.hasOwnProperty('balance') ? Number(data.balance) : 0;
        this.currency = data.hasOwnProperty('currency') ? data.currency : '';
        this.currency_symbol = data.hasOwnProperty('currency_symbol') ? data.currency_symbol : '';
        this.language = data.hasOwnProperty('language') ? data.language : '';
        this.round_id = data.hasOwnProperty('round_id') ? Number(data.round_id) : 0;
        this.won_amount = data.hasOwnProperty('won_amount') ? Number(data.won_amount) : 0;
        this.status = data.hasOwnProperty('status') ? data.status : PlayRoundStatus.STARTED;
        this.status_label = data.hasOwnProperty('status_label') ? data.status_label : '';
        this.playData = new PlayData(data.hasOwnProperty('adapter_play_data') ? data.adapter_play_data : {});
        this.adapterGambleData = new AdapterGambleData(data.hasOwnProperty('adapter_gamble_data') && data.adapter_gamble_data !== null ? data.adapter_gamble_data : {max_win_amount: 0, gamble_max_stake: 0});
        this.stake = stake ? stake : 1;
        this.gambleHistory = data.hasOwnProperty('gamble_val_history') && data.gamble_val_history ? RG.Helper.mapNumberArray(data.gamble_val_history) : [];
        this.activeFreeSpin = new FreeSpinData(data.hasOwnProperty('active_free_spin') ? data.active_free_spin : {});
        this.inGameFreeSpins = new InGameFreeSpinData(data.hasOwnProperty('fs_mode_data') ? data.fs_mode_data : {});
        if (specialWinStage) {
            for (let quota in specialWinStage) {
                if (specialWinStage.hasOwnProperty(quota)) {
                    const acceptedAmount = Number(quota) * (stake ? stake : 1);
                    if (acceptedAmount <= this.won_amount) {
                        switch (specialWinStage[quota]) {
                            case 'big':
                                this.is_big_win = true;
                                break;
                            case 'mega':
                                this.is_mega_win = true;
                                break;
                            case 'super':
                                this.is_super_win = true;
                                break;
                        }
                    }
                }
            }
        }
    }
}

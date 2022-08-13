class PlayRoundRequest {
    stake: number;
    autoSpin: number;
    autoSpinNumber: number;
    autoLossLimit: number;
    autoWinLimit: number;
    autoSpinLimit: number;

    constructor(stake: number, autoSpin = 0, autoSpinNumber = 0, autoLossLimit = 0, autoWinLimit = 0, autoSpinLimit = 0) {
        this.stake = stake;
        this.autoSpin = autoSpin;
        this.autoSpinNumber = autoSpinNumber;
        this.autoLossLimit = autoLossLimit;
        this.autoWinLimit = autoWinLimit;
        this.autoSpinLimit = autoSpinLimit;
    }

    getData(): { [key: string]: any; } {
        return {
            stake: this.stake,
            auto_play: {
                f_auto_spin: this.autoSpin,
                step: this.autoSpinNumber,
                data: {
                    f_play_gamble: 1,
                    loss_limit: this.autoLossLimit,
                    single_win_limit: this.autoWinLimit,
                    spin_limit: this.autoSpinLimit
                }
            }
        };
    }
}

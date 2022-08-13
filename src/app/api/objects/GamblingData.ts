class GamblingData {
    public wonAmount: number;
    public stake: number;
    public history: number[];
    public balance: number;

    constructor(wonAmount: number, stake: number, history: number[], balance: number) {
        this.wonAmount = wonAmount;
        this.stake = stake;
        this.history = history;
        this.balance = balance;
    }
}

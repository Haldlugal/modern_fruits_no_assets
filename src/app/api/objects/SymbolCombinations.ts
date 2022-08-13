class SymbolCombinations {
    public keys: number[] = [];
    public multipliers: { [key: number]: number; } = {};

    /**
     * @param apiData Example: {'2': 1, '3': 4, '4': 10, '5': 40}
     */
    constructor(apiData: any) {
        for (let k in apiData) {
            if (apiData.hasOwnProperty(k)) {
                const key = Number(k);
                this.multipliers[key] = Number(apiData[key]);
                this.keys.push(key);
            }
        }
        this.keys.reverse();
    }

    getValue(key: number, stake: number = 1): number {
        return Math.round(this.multipliers[key] * stake * Math.pow(10, 3)) / Math.pow(10, 3);
    }
}

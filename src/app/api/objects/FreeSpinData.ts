class FreeSpinData {

    public id: number;
    public name: string;
    public bet: number;
    public spins: number;
    public restSpins: number;
    public wonAmount: number;
    public needAccept = false;
    public isTesting = false;

    constructor(apiData: any) {
        this.id = apiData.hasOwnProperty("id") ? apiData.id : 0;
        this.name =  apiData.hasOwnProperty("name") ? apiData.name : '';
        this.bet =  apiData.hasOwnProperty("bet") ? apiData.bet : 0;
        this.spins =  apiData.hasOwnProperty("spins") ? apiData.spins : 0;
        this.restSpins =  apiData.hasOwnProperty("rest_spins") ? apiData.rest_spins: 0;
        this.wonAmount =  apiData.hasOwnProperty("won_amount") ? apiData.won_amount: 0;
    }
}

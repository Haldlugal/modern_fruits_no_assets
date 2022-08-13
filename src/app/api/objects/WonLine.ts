class WonLine {
    // private data: any;
    public lineIndex: number;
    public lineDirection: string;
    public symbolIndex: number;
    public winQuota: number;
    public count: number;
    public wonAmount: number;
    public coordinate: SlotPosition[] = [];
    public wonCoordinate: SlotPosition;

    constructor(apiData: any) {
        this.lineIndex = apiData.hasOwnProperty('line_index') ? Number(apiData.line_index)+1 : -1;
        this.lineDirection = apiData.line_direction || '';
        this.symbolIndex = apiData.hasOwnProperty('symbol_index') ? Number(apiData.symbol_index) : -1;
        this.winQuota = Number(apiData.win_quota) || 1;
        this.count = Number(apiData.count) || 0;
        this.wonAmount = Number(apiData.won_amount) || 0;
        if (apiData.hasOwnProperty('coordinate') && apiData.coordinate.length) {
            apiData.coordinate.forEach((d: any) => this.coordinate.push(new SlotPosition(d)));
        }
        //TODO: Здесь костыль про выигрышные линии!
        if (isNaN(this.lineIndex) || this.lineIndex > 10) {
            this.wonCoordinate = new SlotPosition([1, 2]);
        } else {
            this.wonCoordinate = this.getWonCoordinateByLineIndex(this.lineIndex);
        }
    }

    getWonCoordinateByLineIndex(number: number) : SlotPosition {
        const coords = [ [1, 2], [0, 2], [2, 2], [2, 2], [0, 2], [1, 2], [1, 2], [1, 2], [0, 2], [0, 2], [0, 2] ];
        return new SlotPosition(coords[number]);
    }
}

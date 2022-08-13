class HelpData {
    public symbolsMap: ReelSymbolInfo[];

    constructor(apiData: any) {
        const map = (apiData.win_info && apiData.win_info.symbols_map) ? apiData.win_info.symbols_map : [];
        this.symbolsMap = map.map((info: any, key: number) => new ReelSymbolInfo(key, info));
    }
}

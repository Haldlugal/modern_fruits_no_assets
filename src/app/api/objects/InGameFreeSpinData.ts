class InGameFreeSpinData {
    status: number;
    currentStep: number;
    totalSteps: number;
    totalWin: number;
    startWin: number;
    expandedSymbols: number[];

    constructor(apiData: any) {
        this.status = apiData.hasOwnProperty("fs_status") ? apiData.fs_status : 0;
        this.currentStep = apiData.hasOwnProperty("fs_current_step") ? apiData.fs_current_step : 0;
        this.totalSteps = apiData.hasOwnProperty("fs_total_steps") ? apiData.fs_total_steps : 0;
        this.totalWin = apiData.hasOwnProperty("fs_total_win") ? apiData.fs_total_win : 0;
        this.startWin = apiData.hasOwnProperty("fs_start_win") ? apiData.fs_start_win : 0;
        this.expandedSymbols = apiData.hasOwnProperty("fs_expand_symbol")  && apiData.fs_expand_symbol.length > 0 ? apiData.fs_expand_symbol : [0,0];
    }
}

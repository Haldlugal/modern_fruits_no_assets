class GambleRoundResult {
  public ok: boolean;
  public balance: number;
  public currency: string;
  public currency_symbol: string;
  public language: string;
  public round_id: number;
  public won_amount: number;
  public status: PlayRoundStatus;
  public status_label: string;
  public gambleValue: number;
  public gambleHistory: number[];
  public winQuota: number;


  constructor(data: any) {
    this.ok = Boolean(data.ok || false);
    this.balance = data.hasOwnProperty('balance') ? Number(data.balance) : 0;
    this.currency = data.hasOwnProperty('currency') ? data.currency : '';
    this.currency_symbol = data.hasOwnProperty('currency_symbol') ? data.currency_symbol : '';
    this.language = data.hasOwnProperty('language') ? data.language : '';
    this.round_id = data.hasOwnProperty('round_id') ? Number(data.round_id) : 0;
    this.won_amount = data.hasOwnProperty('won_amount') ? Number(data.won_amount) : 0;
    this.status = data.hasOwnProperty('status') ? data.status : PlayRoundStatus.STARTED;
    this.status_label = data.hasOwnProperty('status_label') ? data.status_label : '';
    if (data.hasOwnProperty('adapter_gamble_data') && 
      data.adapter_gamble_data.hasOwnProperty('symbol_number') && 
      data.adapter_gamble_data.symbol_number) {      
        this.gambleValue = data.adapter_gamble_data.symbol_number;  
    } else {
      this.gambleValue = 0;
    }    
    this.gambleHistory = data.hasOwnProperty('gamble_val_history') ? RG.Helper.mapNumberArray(data.gamble_val_history) : [];
    if (data.hasOwnProperty('adapter_gamble_data') && 
      data.adapter_gamble_data.hasOwnProperty('win_quota')) {
        this.winQuota = Number(data.adapter_gamble_data.win_quota);
      } else {
        this.winQuota = 0;
      }
  }
}

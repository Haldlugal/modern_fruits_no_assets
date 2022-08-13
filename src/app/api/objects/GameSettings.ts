class GameSettings {
    /**
     * Текущий баланс пользователя
     */
    public balance: number;

    /**
     * Язык игры
     */
    public readonly language: string;

    /**
     * Данные по гэмблингу для восстановления сессии
     */
    public gamblingData: GamblingData;

    /**
     * Данные последнего раунда игры
     */
    public playData: PlayData;

    /**
     * Полные данные по последнему раунду
     */
    public playRoundResult: PlayRoundResult;

    /**
     * Данные для автоспинов
     */
    public autoPlayData: AutoPlayData;

    /**
     * Текущая ставка
     */
    public stake: number;

    /**
     * Ставка для гэмблинга
     */
    public gambleStake: number;

    /**
     * Инфа по фриспинам
     */
    public gambleFreeSpin: FreeSpinData;

    /**
     * Шаги ставки
     */
    public readonly stakeSteps: number[];

    /**
     * Help данные
     */
    public readonly help: HelpData;

    /**
     * Описание особых выигрышей (big, super, mega...)
     */
    public readonly specialWinStage: SpecialWinStage;

    /**
    * Название предыдущей сцены
    */
    public previousSceneName: string;

    /**
     * Айдишник раунда. Нужен для восстановления сессий после дисконнекта
     */
    public roundId: number;

    /**
     * Дебаг мод
     */
    public debugMode: string;

    /**
     * Текущий статус игры.
     */
    public statusLabel: string;

    /**
     * Статус для дебага фриспинов
     */
    public freeSpinDebugMode?: Utils.FreeSpinDebugMode;

    constructor(apiData: any) {

        this.balance = apiData.hasOwnProperty('balance') ? Number(apiData.balance) : 0;
        this.language = apiData.hasOwnProperty('language') ? apiData.language : '';
        this.playData = new PlayData(apiData.adapter_play_data || {});
        this.playRoundResult = new PlayRoundResult(apiData);
        this.roundId = apiData.roundId ? apiData.roundId : 0;
        this.statusLabel = apiData.status_label ? apiData.status_label : '';

        this.gamblingData = new GamblingData(
            apiData.hasOwnProperty('won_amount') ? apiData.won_amount : 0,
            apiData.hasOwnProperty('adapter_gamble_data') ? (apiData.adapter_gamble_data.hasOwnProperty('gamble_stake') ? apiData.adapter_gamble_data.gamble_stake : 0) : 0,
            apiData.hasOwnProperty('gamble_val_history') ? apiData.gamble_val_history : [],
            apiData.hasOwnProperty('balance') ? Number(apiData.balance) : 0
        );

        const stakeData = apiData.stake_data || {};
        this.stakeSteps = stakeData.hasOwnProperty('steps') ? RG.Helper.mapNumberArray(stakeData.steps) : [1, 5, 10, 50, 100];
        this.stake = stakeData.hasOwnProperty('default_stake') ? Number(stakeData.default_stake) : 1;
        this.gambleStake = this.stake;
        if (apiData.hasOwnProperty('active_free_spin_data')) {
            //TODO Здесь разобраться с тестовым данными
            this.gambleFreeSpin =  new FreeSpinData(apiData.active_free_spin_data);
        } else if (apiData.hasOwnProperty('active_free_spin')) {
            this.gambleFreeSpin =  new FreeSpinData(apiData.active_free_spin);
            this.gambleFreeSpin.needAccept = false;
            this.gambleFreeSpin.spins = apiData.active_free_spin.rest_spins;
        } else if (apiData.hasOwnProperty('free_spin_offer')) {
            this.gambleFreeSpin =  new FreeSpinData(apiData.free_spin_offer);
            this.gambleFreeSpin.needAccept = true;
        } else {
            this.gambleFreeSpin =  new FreeSpinData({});
            this.gambleFreeSpin.needAccept = false;
        }

        this.help = new HelpData(apiData.help || {});
        this.specialWinStage = apiData.special_win_stage || {};
        this.autoPlayData = new AutoPlayData(apiData.auto_play_data || {});

        this.previousSceneName = '';
        this.debugMode = apiData.hasOwnProperty('f_debug_mode') ? apiData.hasOwnProperty('f_debug_mode') : false;

        RG.Translator.set(apiData.translations || {});

    }
}

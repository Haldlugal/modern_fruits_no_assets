class SlotsScenePresenter {

    scene: SlotsScene;
    game: Game;

    //TODO: We need special sound manager here!
    reelsWinWaitStatus: Logic.WinWaitStatus = 0;
    delayWinEffect: boolean = false;
    specialSpinningSoundPlaying: boolean = false;

    //AutoSpins Data
    autoSpinSettings?: AutoPlaySettings;
    autoSpins = false;
    pauseAutoSpins = false;
    stopAutoSpins = false;
    lossSumm = 0;
    spinsCount = 0;
    //FreeSpins Data
    lastFreeSpin = false;
    freeSpinWon = 0;
    spinsCountDebug = 0;
    freeSpinDebug = false;


    constructor(scene: SlotsScene, game: Game) {
        this.scene = scene;
        this.game = game;
    }

    playSlots(request?: TestRoundRequest | PlayRoundRequest) : Promise<PlayRoundResult>  {
        //TODO Здесь бы тоже логику в отдельный слой вынести
        return new Promise((resolve) => {
            this.scene.beforePlayingSlots();
            // Последний результат игры - по умолчанию пустой
            let lastRoundResult = new PlayRoundResult({}, 0, {});
            RG.GameSound.instance.play("btn_spin_click");
            /*
            * В качестве коллбэка сюда прилетает функция которая должна выполниться после прокрутки всех колес на барабане
            * */
            this.scene.beginPlayingSlots(async () => {
                const wonAmount = lastRoundResult.won_amount;
                /** Если это фриспин, то нам надо поменять количество оставшихся спинов и, на всякий случай, уточнить ставку,
                 * а если это был последний фриспин, то нам надо еще и результаты фриспиннинга показать
                 */
                if (lastRoundResult.activeFreeSpin.id !== 0) {
                    if (lastRoundResult.activeFreeSpin.restSpins === 1 ) {
                        this.lastFreeSpin = true;
                    }
                    this.freeSpinWon += lastRoundResult.won_amount;
                    this.game.settings.gambleFreeSpin.restSpins = lastRoundResult.activeFreeSpin.restSpins;
                    this.game.settings.stake = lastRoundResult.activeFreeSpin.bet;
                    this.scene.renewFreeSpinsStakes(lastRoundResult.activeFreeSpin.restSpins);
                } else {
                    if (this.lastFreeSpin) {
                        this.lastFreeSpin = false;
                        this.scene.renewFreeSpinsStakes(lastRoundResult.activeFreeSpin.restSpins);
                        this.freeSpinWon += lastRoundResult.won_amount;
                        this.scene.showFreeSpinResults(this.freeSpinWon);
                        this.game.settings.stake = this.scene.restoreStake();
                        this.game.settings.gambleFreeSpin.id = 0;
                    }
                }
                const roundWon = wonAmount > 0;
                await this.scene.normalRoundResultEffectsBegin(roundWon);
                // для спец выигрышей запускаем спец эффекты

                if (lastRoundResult.is_mega_win) {
                    this.scene.playSpecialWinEffect('mega', wonAmount, this.autoSpins).then(() => {
                        resolve(lastRoundResult);
                    });
                } else
                if (lastRoundResult.is_super_win) {
                    this.scene.playSpecialWinEffect('super', wonAmount, this.autoSpins).then(() => {
                        resolve(lastRoundResult);
                    });
                } else if (lastRoundResult.is_big_win) {
                    this.scene.playSpecialWinEffect('big', wonAmount, this.autoSpins).then(() => {
                        resolve(lastRoundResult);
                    });
                } else
                    if (lastRoundResult.won_amount > 0) {
                    await this.scene.playBalanceEffect();
                    resolve(lastRoundResult);
                    if (!this.autoSpins) {
                        await this.scene.playWonEffect(this.delayWinEffect);
                    }
                } else {
                    this.scene.playLostEffects();
                    resolve(lastRoundResult);
                }
                if (!this.autoSpins) {
                    // Активируем кнопки и компоненты
                    this.scene.normalRoundEnded();
                }

                window.top.postMessage(JSON.stringify({event: 'round_finished'}), '*');
            });

            // предварительно баланс уменьшим на размер ставки,
            // после получения результата он будет откорректирован
            if (this.game.settings.gambleFreeSpin.id === 0) {
                const newBalance = this.game.settings.balance - this.game.settings.stake;
                if (newBalance >= 0) {
                    this.scene.setBalance(newBalance)
                }
            }
            // Запускаем раунд
            this.game.playRound(request ? request : new PlayRoundRequest(this.game.settings.stake))
                .then((result: PlayRoundResult) => {
                    this.scene.sendResultToReels(result);

                    lastRoundResult = result;
                    this.game.settings.playRoundResult = result;
                })
                .catch(e => {
                    if (e.hasOwnProperty('error')  && e.error.code === 10007) {
                        const result = new PlayRoundResult({
                            adapter_play_data: {
                                symbols_position_indexes: [
                                    [4, 3, 1, 2, 0],
                                    [1, 2, 3, 4, 5],
                                    [3, 5, 4, 1, 2]
                                ]
                            }
                        }, 0, []);
                        this.scene.sendResultToReels(result);
                        this.scene.errorMessage(e, 'NOTICE', true);
                    }
                });
        });
    }


    playAutoSpin(settings: AutoPlaySettings, freeSpinDebug: boolean = false) {
        this.spinsCount = settings.spinsValue;
        this.stopAutoSpins = false;
        if (freeSpinDebug) {
            //если это начало дебажного фриспина
            if (this.spinsCountDebug === 0) {
                this.scene.setupAutoSpinsForDebug(this.spinsCount);
            }
            this.freeSpinDebug = this.stopAutoSpins ? false : freeSpinDebug;
            this.spinsCountDebug++;
        }

        if (this.spinsCount === Infinity) {
            this.scene.setAutoSpinsToInfiniteMode();
        } else {
            this.scene.setAutoSpinsToNormalMode(this.spinsCount);
        }

        let request;

        if (this.freeSpinDebug && this.spinsCountDebug > 2) {
            request = new TestRoundRequest(this.game.settings.stake, 1, 200, 1);
        } else {
            request = new PlayRoundRequest(this.game.settings.stake,
                this.spinsCount,
                settings.lossLimitsValue,
                settings.singleWinLimitsValue,
                settings.spinsValue
            );
        }

        this.autoSpins = true;

        this.playSlots(request).then(async (result)=>{

            this.spinsCount--;
            settings.spinsValue--;
            this.lossSumm += result.stake - result.won_amount;

            //Условие суперигры
            if (result.inGameFreeSpins.status === 1) {
                this.pauseAutoSpins = true;
                this.autoSpinSettings = settings;
                this.spinsCountDebug = 0;
            }

            const limitedByWin = settings.singleWinLimitsValue ? result.won_amount >= settings.singleWinLimitsValue : false;
            const limitedByLoss = settings.lossLimitsValue ? this.lossSumm >= settings.lossLimitsValue : false;
            const limitedBySpins = this.spinsCount === 0;

            if (limitedByWin || limitedByLoss || limitedBySpins) {
                this.stopAutoSpins = true;
            }
            if (!this.stopAutoSpins && !this.pauseAutoSpins) {
                this.playAutoSpin(settings, this.freeSpinDebug);
            } else {
                this.autoSpins = false;
                this.scene.onAutoSpinsEnded();

            }
        })
    }

    checkAutoSpinsOnPause() {
        if (this.pauseAutoSpins) {
            this.pauseAutoSpins = false;
            if (!this.stopAutoSpins) {
                this.scene.enableAutoSpinStopButton();
                this.playAutoSpin(this.autoSpinSettings!);
            }
        }
    }

    checkForSymbolsPreset() {
        const matrix = this.game.settings.playRoundResult.playData.reelsMatrix;

        if (matrix.isValid()) {
            this.scene.forceSetSymbols(matrix);
        }
    }

    freeSpinsResultsOkClicked() {
        this.freeSpinWon = 0;
        this.scene.onFreeSpinsResultsOkClicked();
    }

    switchReelsWinWaitStatus(status: Logic.WinWaitStatus) {
        this.reelsWinWaitStatus = status;
    }
    playWinWaitSoundEffects() {
        switch (this.reelsWinWaitStatus) {
            case Logic.WinWaitStatus.NONE:
                break;

            case Logic.WinWaitStatus.SUCCESS:
            case Logic.WinWaitStatus.FAIL:
                if (!this.specialSpinningSoundPlaying) {
                    this.specialSpinningSoundPlaying = true;
                    RG.AmbientSound.instance.mute(1000);
                    RG.GameSound.instance.play('wait_win');
                }
                break;
        }
    }
    playWinWaitStopSoundEffect(reelNumber: number) {
        if (reelNumber === 4) {
            if (this.reelsWinWaitStatus === Logic.WinWaitStatus.SUCCESS) {
                PIXI.sound.stop('wait_win');
                // RG.GameSound.instance.play('wait_win_win');
            } else if (this.reelsWinWaitStatus === Logic.WinWaitStatus.FAIL) {
                if (this.specialSpinningSoundPlaying) {
                    this.delayWinEffect = true;
                    PIXI.sound.stop('wait_win');
                    RG.GameSound.instance.play('wait_win_false');
                    setTimeout(() => {
                        RG.AmbientSound.instance.restoreFromMute(1000)
                        this.delayWinEffect = false;
                    }, 2500);
                }
            }
            this.specialSpinningSoundPlaying = false;
        }
    }

    switchOffInitialFreeSpins() {
        this.game.settings.gambleFreeSpin.id = 0;
        this.scene.onFreeSpinsDecline();
    }

    acceptFreeSpins() {
        this.game.acceptFreeSpin(this.game.settings.gambleFreeSpin.id)
            .then(() => {
                this.game.settings.stake = this.game.settings.gambleFreeSpin.bet;
                this.scene.onFreeSpinsAccept();
            }).catch(()=>{
            this.game.settings.gambleFreeSpin.id = 0;
            this.scene.onFreeSpinsError();
        })
    }

    startAutoSpins(settings: AutoPlaySettings){
        this.game.startAutoSpin(new AutoPlayDataRequest(this.game.settings.autoPlayData, settings)).then(result=>{
            this.scene.onAutoSpinsStarted(settings);
            this.spinsCount = settings.spinsValue;
            this.lossSumm = 0;
            this.stopAutoSpins = false;
            RG.GameSound.instance.play("btn_spin_click");
        })
    }

    openAutoSpinsTable() {
        RG.GameSound.instance.play("btn_spin_click");
        this.scene.onAutoSpinsTableOpened();
    }

    stopAutoSpinsPlaying() {
        RG.GameSound.instance.play("btn_spin_click");
        this.stopAutoSpins = true;
        this.scene.onAutoSpinsStopped();
    }

}

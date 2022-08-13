///<reference path="../../rg/Abstract/GameApi.ts"/>
class GameApi extends RG.Abstract.GameApi {
    private isBusy = false;
    private singularMethods = ['playRound', 'playGamble', 'startGamble', 'playTestRound', 'startFreeSpin', 'acceptFreeSpin'];
    /**
     * Открытие игры, задача получить от сервера токен, с которым можно дальше делать запросы
     */
    open(): Promise<boolean> {
        const language =  new URLSearchParams(window.location.search).get('lang');
        let url = '/index.php?ac=game/open&gid=' + this.gid + '&__test_mode=1&lang=' + (language ? language : 'en');
        if (this.pextid) {
            url += '&pextid='+this.pextid
        }

        return new Promise((resolve, reject) => {
            this.axios.get(url)
                .then((r: AxiosResponse) => {
                    this.token = r.data.token;
                    this.token ? resolve() : reject();
                })
                .catch(reject);
        });
    }

    protected callApiMethod(method: string, data: any) : Promise<{ [key: string] : any; }> {
        if (this.token && !data.hasOwnProperty('token')) {
            data['token'] = this.token;
        }

        return new Promise<{ [key: string] : any; }>((resolve, reject) => {
            if (this.singularMethods.includes(method) && !this.isBusy) {
                this.isBusy = true;
                this.axios.post('/index.php?ac=game/game_api&method=' + method, data)
                    .then((r: AxiosResponse) => {
                        console.log('API: [' + method + ']: ', r.data);
                        this.isBusy = false;
                        r.data.ok ? resolve(r.data) : reject(r.data);
                    })
                    .catch((e) => {
                        this.isBusy = false;
                        reject(e);
                    });
            } else if (!this.singularMethods.includes(method)){
                this.axios.post('/index.php?ac=game/game_api&method=' + method, data)
                    .then((r: AxiosResponse) => {
                        console.log('API: [' + method + ']: ', r.data);
                        r.data.ok ? resolve(r.data) : reject(r.data);
                    })
                    .catch((e) => {
                        reject(e);
                    });
            } else {
                resolve();
            }
        });
    }

    /**
     * Инициализации игры, задача получить все необходимые данные о пользователе, балансе, настройки игры
     */
    init(): Promise<GameSettings> {
        const data = {
            '___screen': [screen.width, screen.height],
            '___window': [
                window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight
            ]
        };

        return this.callApiMethod('init_game', data)
            .then(data => {
                return new GameSettings(data);
            });
    }

    playRound (request: PlayRoundRequest | TestRoundRequest, specialWinStage: SpecialWinStage) : Promise<PlayRoundResult> {
        return this.callApiMethod('play_round', request.getData())
            .then(data => {
                return new PlayRoundResult(data, request.stake, specialWinStage);
            });
    }

    playTestRound(request: TestRoundRequest, specialWinStage: SpecialWinStage) : Promise<PlayRoundResult> {
        return this.callApiMethod('play_round', request.getData())
            .then(data => {
                return new PlayRoundResult(data, request.stake, specialWinStage);
            });
    }

    startAutoSpin(request: AutoPlayDataRequest) : Promise<AutoPlayResponse> {
        return this.callApiMethod('auto_play_data', request.getData())
            .then((data) => {
                return new AutoPlayResponse(data)
            });
    }

    acceptFreeSpin(id: number) : Promise<FreeSpinData> {
        return this.callApiMethod('accept_free_spin', {'id': id})
            .then((data) => {
                return new FreeSpinData(data.active_free_spin);
            });
    }

    startFreeSpin (request: PlayRoundRequest | TestRoundRequest,  specialWinStage: SpecialWinStage) : Promise<PlayRoundResult> {
        return this.callApiMethod('play_round', {...request.getData(), debug_data: {round_status:1}})
            .then(data => {
                return new PlayRoundResult(data, request.stake, specialWinStage);
            });
    }

    setExpandedSymbol(id: number, random: boolean): Promise<any> {
        return this.callApiMethod('set_expand', {index: id, random: random ? 1 : 0});
    }

    heartBeat(): Promise<any> {
        return this.callApiMethod('heartbeat', {});
    }

    restore(roundId: number, type: any, ...arg: any): Promise<any> {
        return this.callApiMethod('restore', {'round_id': roundId }).then((data) =>{
            return new type(data, ...arg)
        })
    }

}

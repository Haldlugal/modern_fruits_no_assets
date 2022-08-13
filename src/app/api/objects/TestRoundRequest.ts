class TestRoundRequest {
    stake: number;
    min_win_quota: number;
    max_win_quota: number;
    test_win_lines: number;
    status: number;

    constructor(stake: number, min_win_quota: number, max_win_quota: number, status = 2, test_win_lines = 0) {
        this.stake = stake;
        this.min_win_quota = min_win_quota;
        this.max_win_quota = max_win_quota;
        this.test_win_lines = test_win_lines;
        this.status = status;
    }

    getData(): { [key: string]: any; } {
        return {
            'stake': this.stake,
            'auto_play': {
                'step': 0,
                'data': {
                    'loss_limit': 0,
                    'single_win_limit': 0,
                    'spin_limit': 0
                }
            },
            'debug_data': {
                'min_win_quota': this.min_win_quota,
                'max_win_quota': this.max_win_quota,
                'test_win_lines': this.test_win_lines ? this.test_win_lines : 0,
                'round_status' : this.status
            }
        };
    }
}

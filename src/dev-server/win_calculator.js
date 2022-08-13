(function(exports){
    'use strict';

    const POSITION_LEFT = 'left';
    const POSITION_RIGHT = 'right';
    const POSITION_ANY = 'any';

    const winning_lines = [
        [ [1, 0], [1, 1], [1, 2], [1, 3], [1, 4] ],
        [ [0, 0], [0, 1], [0, 2], [0, 3], [0, 4] ],
        [ [2, 0], [2, 1], [2, 2], [2, 3], [2, 4] ],
        [ [0, 0], [1, 1], [2, 2], [1, 3], [0, 4] ],
        [ [2, 0], [1, 1], [0, 2], [1, 3], [2, 4] ],
    ];

    const calculator = function(stake, symbols_map, matrix) {

        this.stake = stake;
        this.symbols_map = symbols_map;
        this.matrix = matrix;

        this.won_amount = 0;
        this.status = 2;
        this.status_label = 'Lost';

        this.max_won_line = null;
        this.won_lines    = [];

        this._process_winning_line = function (line_number, line_item, f_right)
        {
            const length = line_item.length;

            let win_symbols_count = {};
            let prev_symbol       = -1;

            for (let i = 0; i < length; i++)
            {
                const k = (f_right) ? length - 1 - i : i;

                const symbol_index = this.matrix[ line_item[k][0] ][ line_item[k][1] ];
                const symbol_data  = this.symbols_map[ symbol_index ];

                if (symbol_data.win_positions.indexOf(POSITION_LEFT) === -1 && !f_right)
                    break;

                if (symbol_data.win_positions.indexOf(POSITION_RIGHT) === -1 && f_right)
                    break;

                if (prev_symbol < 0 || prev_symbol === symbol_index)
                {
                    if (!win_symbols_count.hasOwnProperty(symbol_index))
                    {

                        win_symbols_count[symbol_index] = {
                            'symbol_data': symbol_data,
                            'symbol_index': symbol_index,
                            'line_index': line_number,
                            'count': 0,
                            'coordinate': []
                        };
                    }
                    win_symbols_count[symbol_index]['count'] += 1;
                    win_symbols_count[symbol_index]['coordinate'].push(line_item[k]);
                }
                else
                {
                    break;
                }

                prev_symbol = symbol_index;
            }
            return win_symbols_count;
        };

        this._process_winning_any_line = function ()
        {
            let any_position_symbols = [];
            for (let symbol_index in this.symbols_map)
            {
                if (!this.symbols_map.hasOwnProperty(symbol_index))
                    continue;

                if (this.symbols_map[symbol_index].win_positions.indexOf(POSITION_ANY) !== -1)
                {
                    any_position_symbols.push(parseInt(symbol_index));
                }
            }

            let win_symbols_count = {};

            if (any_position_symbols.length)
            {
                this.matrix.forEach((line, row) => {

                    line.forEach ((symbol_index, col) => {

                        const symbol_data  = this.symbols_map[ symbol_index ];

                        if (any_position_symbols.indexOf(symbol_index) !== -1)
                        {
                            if (!win_symbols_count.hasOwnProperty(symbol_index))
                            {
                                win_symbols_count[symbol_index] = {
                                    'symbol_data': symbol_data,
                                    'symbol_index': symbol_index,
                                    'line_index': 'any',
                                    'count': 0,
                                    'coordinate': []
                                };
                            }

                            win_symbols_count[symbol_index]['count'] += 1;
                            win_symbols_count[symbol_index]['coordinate'].push([row, col]);
                        }
                    });
                });
            }

            return win_symbols_count;
        };

        this._define_win_lines = function()
        {
            let win_symbols_count_list = {};

            win_symbols_count_list[POSITION_LEFT] = [];
            win_symbols_count_list[POSITION_RIGHT] = [];
            win_symbols_count_list[POSITION_ANY] = [];

            winning_lines.forEach((item, k) => {
                win_symbols_count_list[POSITION_LEFT].push(this._process_winning_line(k, item, 0));
                win_symbols_count_list[POSITION_RIGHT].push(this._process_winning_line(k, item, 1));
            });

            win_symbols_count_list[POSITION_ANY].push(this._process_winning_any_line());

            let max = 0;

            for (let line_direction in win_symbols_count_list)
            {
                win_symbols_count_list[line_direction].forEach(line_process_item => {

                    for (let symbol_index in line_process_item)
                    {
                        if (!line_process_item.hasOwnProperty(symbol_index))
                            continue;

                        const data = line_process_item[symbol_index];

                        let _count = 0;

                        for (let _k = data['count']; _k > 0; _k--)
                        {
                            if (data['symbol_data']['combinations'].hasOwnProperty(_k))
                            {
                                _count = _k;
                                break;
                            }
                        }

                        if (_count)
                        {
                            const win_quota = data['symbol_data']['combinations'][_count];

                            const win_line = {
                                'line_index': data['line_index'],
                                'line_direction': line_direction,
                                'symbol_index': data['symbol_index'],
                                'win_quota': win_quota,
                                'count': _count,
                                'coordinate': data['coordinate'],
                            };

                            if (max < win_quota)
                            {
                                max               = win_quota;
                                this.max_won_line = win_line;
                            }

                            this.won_lines.push(win_line);
                        }
                    }
                });
            }
        };

        this.play = function () {

            this.won_amount = 0;
            this.status = 2;
            this.status_label = 'Lost';

            this.max_won_line = null;
            this.won_lines    = [];

            this._define_win_lines();

            if (this.won_lines.length) {
                this.won_lines.forEach(item => {
                    item['won_amount'] = this.stake * item['win_quota'];
                    this.won_amount += item['won_amount'];
                })
            }

            if (this.won_amount > 0) {
                this.status = 1;
                this.status_label = 'Won';
            }

            return this;
        }
    };

    exports.calculate = function(stake, symbols_map, matrix) {
        const c = new calculator(stake, symbols_map, matrix);
        return c.play();
    };

})(typeof exports === 'undefined'? this['playAdapter']={}: exports);

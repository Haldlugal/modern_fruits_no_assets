const express = require('express');
const bodyParser = require('body-parser');
const  app = express();
const  http = require('http').createServer(app);
const  io = require('socket.io')(http);
const calculator = require('./win_calculator');
const game_config = require('./game_config');
const gambling = require('./gambling');
const symbols_map = game_config.help.win_info.symbols_map;

let currentRound = 0;
let gambleHistory = [];

function randomSymbol() {
    const min = 0;
    const max = 7;
    return min + Math.round((max - min) * Math.random());
}

function getRandomMatrix () {
    return [
        [ randomSymbol(), randomSymbol(), randomSymbol(), randomSymbol(), randomSymbol() ],
        [ randomSymbol(), randomSymbol(), randomSymbol(), randomSymbol(), randomSymbol() ],
        [ randomSymbol(), randomSymbol(), randomSymbol(), randomSymbol(), randomSymbol() ],
    ];
}

let apiData = {
    'open': {
        'status': true
    },
    'playRound': {
        'type': 'random',
        'matrix': getRandomMatrix()
    },
    'gambleRound':{
        'type': 'random',
        'value': 3,
    },
    'init': game_config,        
    'free_spin_active': false
};

function getRoundResponse(roundResult) {
    return {
        "ok": 1,
        "balance": apiData.init.balance - roundResult.stake + roundResult.won_amount,
        "currency": "EUR",
        "currency_symbol": "\u20ac",
        "language": "en",
        "round_id": ++currentRound,
        "won_amount": roundResult.won_amount,
        "status": roundResult.status,
        "status_label": roundResult.status_label,
        "gamble_val_history": gambleHistory,
        "adapter_play_data": {
            "symbols_position_indexes": roundResult.matrix,
            "max_won_line": roundResult.max_won_line,
            "won_lines": roundResult.won_lines
        },
        "adapter_gamble_data": {
            "max_win_amount": roundResult.won_amount * 20,
            "gamble_max_stake": roundResult.won_amount
        },
        "auto_play_data": {
          "f_play_gamble": {
            "value": 1
          },         
          "loss_limits": {
            "steps": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            "value": 0
          },
          "single_win_limits": {
            "steps": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            "value": 0
          },
          "spins": {
            "steps": [0, 5, 10, 25, 50, 100],
            "value": 0
          }
        },
        "active_free_spin": {}
    };
}

function getGambleStart(startCredit) {
    return {
      "ok": 1,
      "balance": apiData.init.balance - startCredit,
      "currency": "EUR",
      "currency_symbol": "\u20ac",
      "language": "en",
      "round_id": ++currentRound,
      "won_amount": 0,
      "status": 5,
      "status_label": "Start gamble",
      "start_credit": startCredit
    }
}

function getGambleResponse(result) {
    return {
      "ok": 1,
      "balance": apiData.init.balance,
      "currency": "EUR",
      "currency_symbol": "\u20ac",
      "language": "en",
      "round_id": ++currentRound,
      "won_amount": result.won_amount,
      "status": result.won_amount > 0 ? 4 : 2,
      "status_label": result.won_amount > 0 ? 'Won' : 'Lost',
      "gamble_val_history": gambleHistory,
      "adapter_gamble_data": {
        "win_quota": result.win_quota ? result.win_quota : 0,
        "gamble_val": result.card_value ? result.card_value : 0,
        "card_info": {
          "gamble_suit_val": result.card_value ? result.card_value : 0 ,
        }
      }
    }
    

}

// -----------------------------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------------------------
// Игрушка
app.use(express.static(__dirname + '/../..'));
app.use(bodyParser.json());

// Фейковое апи
app.get('/index.php', function(req, res) {
    (apiData.open.status) ? res.json({ token: 'FAKE-TOKEN' }) : res.send('oops');
});

app.post('/index.php', function(req, res) {
    if (req.query && req.query.ac === 'game/game_api' && req.query.method) {
        console.log('method: ' + req.query.method);
        switch (req.query.method) {
            case 'init_game':
                const data = apiData.init.ok ? apiData.init : {'ok': 0};
                res.json(data);
                break;
            case 'play_round':
                if (apiData.playRound.type === 'fail') {
                    res.json({'ok': 0});
                } else {
                    const stake = req.body.hasOwnProperty('stake') ? req.body.stake : 1;
                    const matrix = apiData.playRound.type === 'random' ? getRandomMatrix() : apiData.playRound.matrix;
                    const roundResults = calculator.calculate(stake, symbols_map, matrix);                    
                    const response = getRoundResponse(roundResults);
                    console.log('free spin active', apiData.free_spin_active, game_config.active_free_spin_data);
                    if (apiData.free_spin_active) {
                        response.active_free_spin = {
                            "id": 1,
                            "rest_spins": --game_config.active_free_spin_data.rest_spins,
                            "bet": game_config.active_free_spin_data.bet
                        };
                        if (game_config.active_free_spin_data.rest_spins <= 1) {
                            apiData.free_spin_active = false;
                        }

                        if (game_config.active_free_spin_data.rest_spins === 0) {
                            response.active_free_spin = {
                                "id": 0,
                                "rest_spins": 0,
                                "bet": game_config.active_free_spin_data.bet
                            }
                        }
                    }
                    apiData.init.balance = response.balance;
                    apiData.init.won_amount = response.won_amount;
                    console.log('response', response);
                    console.log('   ' + response.status_label + ', balance: ' + apiData.init.balance);
                    res.json(response);
                }
                break;
            case 'start_gamble':
                  const startCredit = req.body.hasOwnProperty('start_credit') ? req.body.start_credit : 10;
                  console.log('start credit', apiData.init.won_amount);
                    apiData.init.won_amount = startCredit;
                  apiData.init.balance -= apiData.init.won_amount;
                  const response = getGambleStart(startCredit);
                  res.json(response);
                  break;
            case 'gamble_round':
              if (apiData.playRound.type === 'fail') {
                res.json({'ok': 0});
              } else if (req.body.val === 0) {
                  apiData.init.balance += apiData.init.won_amount;
                  const response = getGambleResponse({won_amount: 0 });
                  res.json(response);
              } else {
                const stake = apiData.init.won_amount;
                let result;
                if (apiData.gambleRound.type === 'custom') {
                    result = gambling.play(stake, req.body.val, apiData.gambleRound.value);
                } else {
                    result = gambling.play(stake, req.body.val);
                }
                
                gambleHistory.unshift(result.card_value);

                if (gambleHistory.length > 12) {
                  gambleHistory.pop();
                }

                apiData.init.won_amount = result.won_amount;
                const response = getGambleResponse(result);
                res.json(response);
              }
              break;
            case 'auto_play_data':
                res.json({'ok': 1});
                break;
            case 'accept_free_spin': 
                apiData.free_spin_active = true;
                res.json(
                    {
                        'ok': 1,
                        'active_free_spin' :game_config.active_free_spin_data                        
                    }                   
                );                
                break;
            case 'debug_free_spin':
                game_config.active_free_spin_data.rest_spins = 3;
                game_config.active_free_spin_data.bet = 0.01;
                game_config.active_free_spin_data.name = 'test';
                game_config.active_free_spin_data.spins = 3;
                game_config.active_free_spin_data.id = 1;
                res.json({
                    'ok': 1,
                    'f_debug_mode': true,
                    'free_spin_offer': {
                        'id': 1,
                        'name': "DEBUG_FREE_SPINS",
                        'bet': 0.01,
                        'spins': 3
                    }
                });
                break;
            case 'heartbeat':
                res.json({
                    'ok': 1,
                    'balance': apiData.init.balance
                });
                break;
            default:
                console.log(' **** UNEXPECTED');
                res.send('oops');
                break;
        }
    } else {
        res.send('oops');
    }
});


// Управлялка АПИ
app.use('/api', express.static(__dirname));

// Socket события
io.on('connection', function(socket){
    console.log('api user connected');
    socket.emit('settings', apiData);

    if (apiData.playRound.type === 'custom') {
        socket.emit('custom-result', getRoundResponse(calculator.calculate(1, symbols_map, apiData.playRound.matrix)));
    } else {
        socket.emit('clear-custom-result');
    }

    socket.on('disconnect', function(){
        console.log('api user disconnected');
    });

    socket.on('open-status', function(status) {
        console.log('open-status: ' + status);
        apiData.open.status = !!status;
        io.emit('settings', apiData);
    });
    socket.on('init_game-status', function(status) {
        console.log('init_game-status: ' + status);
        apiData.init.ok = status ? 1:0;
        io.emit('settings', apiData);
    });
    socket.on('play-random', function() {
        console.log('play-random');
        apiData.playRound.type = 'random';
        io.emit('settings', apiData);
        io.emit('clear-custom-result');
    });
    socket.on('play-fail', function() {
        console.log('play-fail');
        apiData.playRound.type = 'fail';
        io.emit('settings', apiData);
        io.emit('clear-custom-result');
    });
    socket.on('play-custom', function(matrix) {
        console.log('play-custom');
        apiData.playRound.type = 'custom';
        if (!matrix)
            matrix = apiData.playRound.matrix;
        console.log('  ', matrix.hasOwnProperty(0) ? matrix[0] : '');
        console.log('  ',matrix.hasOwnProperty(1) ? matrix[1] : '');
        console.log('  ',matrix.hasOwnProperty(2) ? matrix[2] : '');
        apiData.playRound.matrix = matrix;
        io.emit('settings', apiData);
        io.emit('custom-result', getRoundResponse(calculator.calculate(1, symbols_map, apiData.playRound.matrix)));
    });
    socket.on('gamble-random', function() {
        apiData.gambleRound.type = 'random';
        io.emit('settings', apiData);
    });
    socket.on('gamble-custom', function() {
        apiData.gambleRound.type = 'custom';
        io.emit('settings', apiData);
    });
    socket.on('change-gamble-value', function(value) {
        apiData.gambleRound.value = value;
    })
});

const PORT = 5001;
http.listen(PORT, function(){
    console.log('');
    console.log('Servings:');
    console.log('   - Game: http://localhost:' + PORT);
    console.log('   - API : http://localhost:' + PORT + '/api');
    console.log('');
});

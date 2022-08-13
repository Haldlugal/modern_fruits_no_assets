Vue.component('slot-selector', {
    props: ['value'],
    data: function () {
        return {
            symbols: [0, 1, 2, 3, 4, 5, 6, 7]
        }
    },
    template: '<div class="slot">' +
        '<select @change="$emit(\'input\', parseInt($event.target.value))">' +
        '<option v-for="symbol in symbols" :selected="symbol === value">{{ symbol }}</option>' +
        '</select>' +
        '<img :src="\'/assets/common/img/0\' + value + \'.png\'"/>' +
        '</div>',
})

Vue.component('gamble-selector', {
    props: ['value'],
    data: function () {
        return {
            gambleSymbols: [3, 4, 5, 6]
        }
    },
    template:
        '<div class="slot">' +
            '<select @change="$emit(\'input\', parseInt($event.target.value))">' +
            '   <option v-for="symbol in gambleSymbols" :selected="symbol === value">{{ symbol }}</option>' +
            '</select>' +
            '<img :src="\'/assets/common/img/gamble_item_\' + value + \'.png\'"/>' +
        '</div>',
})

const app = new Vue({
    el: '#app',
    data () {
        return {
            isConnected: false,
            socket: null,
            openSuccess: true,
            initSuccess: true,
            playRoundType: 'random',
            gamblingType: 'random',
            gamblingValue: 3,
            matrix: [
                [ 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 0 ],
            ],
            rows: [0, 1, 2],
            cols: [0, 1, 2, 3, 4],
            customResult: null,
            hl: []
        }
    },
    mounted () {
        this.socket = io();
        this.setupSocketEvents();
    },
    watch: {
        matrix () {
            if (this.isConnected && this.playRoundType === 'custom') {
                this.socket.emit('play-custom', this.matrix);
            }
        },
        gamblingValue() {
            if (this.isConnected && this.gamblingType === 'custom') {
                this.socket.emit('change-gamble-value', this.gamblingValue);
            }
        }
    },
    methods: {
        setupSocketEvents () {
            this.socket
                .on('connect', () => {
                    this.isConnected = true;
                }).on('disconnect', () => {
                    this.isConnected = false;
                }).on('settings', (settings) => {
                    if (settings.hasOwnProperty('open')) {
                        this.openSuccess = settings.open.status || false;
                    }
                    if (settings.hasOwnProperty('init')) {
                        this.initSuccess = !!settings.init.ok;
                    }
                    if (settings.hasOwnProperty('playRound')) {
                        this.playRoundType = settings.playRound.type;
                        if (this.playRoundType === 'custom') {
                            const matrix = settings.playRound.matrix;
                            for (let x = 0; x < matrix.length; x++) {
                                matrix[x].forEach((val, y) => {
                                    this.matrix[x][y] = val;
                                });
                            }
                        }
                    }
                    if (settings.hasOwnProperty('gambleRound')){
                        this.gamblingType = settings.gambleRound.type;
                    }
                }).on('custom-result', (results) => {
                    this.customResult = results;
                }).on('clear-custom-result', () => {
                    this.customResult = null;
                });
        },
        switchOpenStatus(newStatus) {
            if (this.isConnected) {
                this.socket.emit('open-status', !!newStatus);
            }
        },
        switchInitStatus(newStatus) {
            if (this.isConnected) {
                this.socket.emit('init_game-status', !!newStatus);
            }
        },
        switchPlayRoundType(newType) {
            if (this.isConnected) {
                this.socket.emit('play-' + newType);
            }
        },
        switchGamblingType(newType) {
            if (this.isConnected) {
                this.socket.emit('gamble-' + newType);
            }
        },
        highlight(coordinates) {
            this.hl = coordinates.map(c => {
                return c[0]+'x'+c[1];
            });
        },
        getTdClass (row, col) {
            const key = row +'x'+ col;
            return (this.hl.indexOf(key) !== -1) ? 'slot-td slot-td-hl' : 'slot-td';
        }
    }
});

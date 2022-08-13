(function(exports){
    'use strict';
    exports.play = function(stake, valueSelected, neededResult) {
        const value = neededResult ? neededResult : 3 + Math.floor(Math.random() * 4);
        console.log(value);
        let won_amount = 0;
        let win_quota = 0;
        if (valueSelected === value) {
            won_amount = stake * 4;
            win_quota = 4;
        } else if ((valueSelected === 1 && value <= 4) || (valueSelected === 2 && value >= 5)) {
            won_amount = stake * 2;
            win_quota = 2;
        } 
        return {
            won_amount: won_amount,
            win_quota: win_quota,
            card_value: value
        };
    };

})(typeof exports === 'undefined'? this['playAdapter']={}: exports);
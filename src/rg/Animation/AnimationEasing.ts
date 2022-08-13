/// <reference path="./Animation.ts" />

namespace RG.Animation.Easing {
    export type EasingFunction = (k: number) => number;

    export namespace Linear {
        export const None: EasingFunction = function (k) {
            return k;
        }
    }

    export namespace Quadratic {
        export const In: EasingFunction = function (k) {
            return k * k;
        };
        export const Out: EasingFunction = function (k) {
            return k * (2 - k);
        };
        export const ReverseOut: EasingFunction = function (k) {
            return 1 - Math.sqrt(1 - k);
        };
        export const InOut: EasingFunction = function (k) {
            if ((k *= 2) < 1) return 0.5 * k * k;
            return -0.5 * (--k * (k - 2) - 1);
        }
    }

    export namespace Cubic {
        export const In: EasingFunction = function (k) {
            return k * k * k;
        };
        export const Out: EasingFunction = function (k) {
            return --k * k * k + 1;
        };
        export const InOut: EasingFunction = function (k) {
            if ((k *= 2) < 1) return 0.5 * k * k * k;
            return 0.5 * ((k -= 2) * k * k + 2);
        }
    }

    export namespace Quartic {
        export const In: EasingFunction = function (k) {
            return k * k * k * k;
        };
        export const Out: EasingFunction = function (k) {
            return 1 - (--k * k * k * k);
        };
        export const InOut: EasingFunction = function (k) {
            if ((k *= 2) < 1) return 0.5 * k * k * k * k;
            return -0.5 * ((k -= 2) * k * k * k - 2);
        }
    }

    export namespace Quintic {
        export const In: EasingFunction = function (k) {
            return k * k * k * k * k;
        };
        export const Out: EasingFunction = function (k) {
            return --k * k * k * k * k + 1;
        };
        export const InOut: EasingFunction = function (k) {
            if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        }
    }

    export namespace Sinusoidal {
        export const In: EasingFunction = function (k) {
            return 1 - Math.cos(k * Math.PI / 2);
        };
        export const Out: EasingFunction = function (k) {
            return Math.sin(k * Math.PI / 2);
        };
        export const InOut: EasingFunction = function (k) {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        }
    }

    export namespace Exponential {
        export const In: EasingFunction = function (k) {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        };
        export const Out: EasingFunction = function (k) {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        };
        export const InOut: EasingFunction = function (k) {
            if (k === 0) return 0;
            if (k === 1) return 1;
            if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        }
    }

    export namespace Circular {
        export const In: EasingFunction = function (k) {
            return 1 - Math.sqrt(1 - k * k);
        };
        export const Out: EasingFunction = function (k) {
            return Math.sqrt(1 - (--k * k));
        };
        export const InOut: EasingFunction = function (k) {
            if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }
    }

    export namespace Elastic {
        export const In: EasingFunction = function (k) {
            let s, a = 0.1, p = 0.4;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            }
            else s = p * Math.asin(1 / a) / (2 * Math.PI);
            return -(a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
        };
        export const Out: EasingFunction = function (k) {
            let s, a = 0.1, p = 0.4;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            }
            else s = p * Math.asin(1 / a) / (2 * Math.PI);
            return (a * Math.pow(2, -10 * k) * Math.sin((k - s) * (2 * Math.PI) / p) + 1);
        };
        export const InOut: EasingFunction = function (k) {
            let s, a = 0.1, p = 0.4;
            if (k === 0) return 0;
            if (k === 1) return 1;
            if (!a || a < 1) {
                a = 1;
                s = p / 4;
            }
            else s = p * Math.asin(1 / a) / (2 * Math.PI);
            if ((k *= 2) < 1) return -0.5 * (a * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p));
            return a * Math.pow(2, -10 * (k -= 1)) * Math.sin((k - s) * (2 * Math.PI) / p) * 0.5 + 1;
        }
    }

    export namespace Back {
        export const In: EasingFunction = function (k) {
            let s = 1.70158;
            return k * k * ((s + 1) * k - s);
        };
        export const Out: EasingFunction = function (k) {
            let s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        };
        export const InOut: EasingFunction = function (k) {
            let s = 1.70158 * 1.525;
            if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    }

    export namespace Bounce {
        export const In: EasingFunction = function (k) {
            return 1 - Out(1 - k);
        };
        export const Out: EasingFunction = function (k) {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            } else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            } else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            } else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        };
        export const InOut: EasingFunction = function (k) {
            if (k < 0.5) return In(k * 2) * 0.5;
            return Out(k * 2 - 1) * 0.5 + 0.5;
        }
    }

    export namespace Other {
        export const Shake: EasingFunction = function (k) {
            if (k < 1 / 3) return 3 * k;
            if (k < 2 / 3) return -6 * k + 3;
            return 3 * k - 3;
        }
    }
}

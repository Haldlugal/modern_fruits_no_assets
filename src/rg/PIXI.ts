// namespace PIXI
// {
//     export interface Container {
//         _aligning: RG.Aligning;
//         aligning: RG.Aligning;
//         hasAligning: boolean;
//         justify(): this;
//     }
// }
//
// PIXI.Container.prototype.justify = function (): PIXI.Container {
//     if (this._aligning) {
//         this._aligning.justify();
//     }
//     return this;
// }
//
// Object.defineProperty(PIXI.Container.prototype, "aligning", {
//     get: function () {
//         if (!this._aligning) {
//             this._aligning = new RG.Aligning(this);
//             this.on('added', this._aligning.justify.bind(this._aligning));
//         }
//         return this._aligning;
//     }
// });
//
// Object.defineProperty(PIXI.Container.prototype, "hasAligning", {
//     get: function () {
//         return !!this._aligning;
//     }
// });

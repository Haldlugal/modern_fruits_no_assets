class SlotsSceneInteractiveElements {

    public background: PIXI.Sprite;
    public winningPoints: Component.WinPoint[] = [];
    public reels: ReelComponent.Main;
    public startButton: RG.Button;
    public initialFreeSpins:{initialFreeSpinsTable: Component.FreeSpin, initialFreeSpinsStakes:  Component.FreeSpinStakes, results: Component.FreeSpinResults};
    public autoSpins: {table: Component.AutoSpin, openButton: RG.Button, stopButton: RG.Button, spinsCount: PIXI.Text, infiniteSpins: PIXI.Sprite};

    constructor(
        background: PIXI.Sprite,
        winningPoints: Component.WinPoint[],
        reels: ReelComponent.Main,
        startButton: RG.Button,
        initialFreeSpinsComponent: {initialFreeSpinsTable: Component.FreeSpin, initialFreeSpinsStakes:  Component.FreeSpinStakes, results: Component.FreeSpinResults},
        autoSpins: {table: Component.AutoSpin, openButton: RG.Button, stopButton: RG.Button, spinsCount: PIXI.Text, infiniteSpins: PIXI.Sprite}
        )
    {
        this.background = background;
        this.winningPoints = winningPoints;
        this.reels = reels;
        this.startButton = startButton;
        this.initialFreeSpins= initialFreeSpinsComponent;
        this.autoSpins = autoSpins;
    }
}

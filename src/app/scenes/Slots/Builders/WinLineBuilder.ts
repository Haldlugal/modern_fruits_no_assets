class WinLineBuilder {
    background: PIXI.Sprite;
    scene: SlotsScene;

    constructor(scene: SlotsScene, background: PIXI.Sprite) {
        this.scene = scene;
        this.background = background;
    }

    build() : Component.WinPoint[]{
        const backgroundWidth = this.background.width;
        const winningPoints = [];

            const firstMargin = ReelComponent.ReelConfig.SYMBOL_SIZE.height / 3 ;
            const secondMargin = ReelComponent.ReelConfig.SYMBOL_SIZE.height / 2;
            const thirdMargin = ReelComponent.ReelConfig.SYMBOL_SIZE.height / 3;
            const firstYCoordInFirstRow = SlotPosition.OFFSET_Y  + 25 + firstMargin;
            const firstYCoordInSecondRow = SlotPosition.OFFSET_Y + ReelComponent.ReelConfig.SYMBOL_SIZE.height + (RG.Helper.isMobile() ? 0 : 25) ;
            const firstYCoordInThirdRow = SlotPosition.OFFSET_Y + ReelComponent.ReelConfig.SYMBOL_SIZE.height * 2 + (RG.Helper.isMobile() ? 0 : thirdMargin);
            const coords =
                [
                    new Component.YCoords(
                        4,
                        firstYCoordInFirstRow,
                        new Component.WinPointsYCoord(
                            firstYCoordInFirstRow,
                            firstYCoordInFirstRow
                        )),
                    new Component.YCoords(
                        2,
                        firstYCoordInFirstRow + firstMargin,
                        new Component.WinPointsYCoord(
                            firstYCoordInFirstRow + firstMargin,
                            firstYCoordInFirstRow + firstMargin,
                        )
                    ),
                    new Component.YCoords(
                        1,
                        firstYCoordInSecondRow + secondMargin,
                        new Component.WinPointsYCoord(
                            firstYCoordInSecondRow + secondMargin,
                            firstYCoordInSecondRow + secondMargin,
                        )
                    ),
                    new Component.YCoords(
                        3,
                        firstYCoordInThirdRow + thirdMargin,
                        new Component.WinPointsYCoord(
                            firstYCoordInThirdRow + thirdMargin,
                            firstYCoordInThirdRow  + thirdMargin,
                        )
                    ),
                    new Component.YCoords(
                        5,
                        firstYCoordInFirstRow + firstMargin - (RG.Helper.isMobile() ? 49 : 5),
                        new Component.WinPointsYCoord(
                            firstYCoordInThirdRow + 2 * thirdMargin,
                            firstYCoordInThirdRow + 2 * thirdMargin,
                        )
                    ),

                ];
            const winningLines = [];
            for (let i = 0; i< coords.length; i++) {
                winningLines.push(new Component.WinLine(this.scene, coords[i].lineNumber, coords[i].lineY, backgroundWidth));
                winningPoints.push(new Component.WinPoint(this.scene, winningLines[i], coords[i].winPointsY.left, coords[i].winPointsY.right, backgroundWidth));
            }

        return winningPoints;
    }
}

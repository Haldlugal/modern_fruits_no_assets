class SlotPosition {
    /**
     * Ширина одного барабана
     */
    public static WIDTH  = 228;

    /**
     * Высота одного барабана
     */
    public static HEIGHT = 188;

    /**
     * Отступ по X области барабанов внутри сцены
     */
    public static OFFSET_X = RG.Helper.isMobile() ? 0 : 5;

    /**
     * Отступ по Y области барабанов внутри сцены
     */
    public static OFFSET_Y = 61;


    public x: number;
    public y: number;

    constructor(apiData: any) {
        this.x = apiData.hasOwnProperty(1) ? apiData[1] : -1;
        this.y = apiData.hasOwnProperty(0) ? apiData[0] : -1;
    }

    /**
     * Координаты верхнего левого угла барабана внутри области барабанов
     */
    public coordinates() : { x: number, y: number } {
        return {
            x: this.x * SlotPosition.WIDTH,
            y: this.y * SlotPosition.HEIGHT
        }
    }

    /**
     * Глобальные координаты верхнего левого угла барабана (внутри контейнера сцены)
     */
    public globalCoordinates() : { x: number, y: number } {
        return {
            x: this.x * SlotPosition.WIDTH + SlotPosition.OFFSET_X,
            y: this.y * SlotPosition.HEIGHT + SlotPosition.OFFSET_Y
        }
    }
}

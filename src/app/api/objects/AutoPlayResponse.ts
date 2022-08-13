class AutoPlayResponse {
    public ok: boolean;

    constructor(data: any) {
        this.ok = Boolean(data.ok || false);
    }
}

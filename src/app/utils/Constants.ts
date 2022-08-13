namespace Utils {

    export enum FreeSpinStatus {
        FS_STATUS_NOT_PLAYING = 0,
        FS_STATUS_START       = 1,
        FS_STATUS_PLAYING     = 2,
        FS_STATUS_END         = 3,
    }

    export enum FreeSpinDebugMode {
        FS_STATUS_VICTORY = 0,
        FS_STATUS_LOST = 1,
        FS_STATUS_PLUS = 2,
        FS_STATUS_NORMAL = 3,
    }

    export enum DebugModeStatuses {
        DEBUG_WON_SYMBOL_ANY     = 1,
        DEBUG_WON_SYMBOL_NOT_ANY = 2,
        DEBUG_LOST               = 3
    }

}

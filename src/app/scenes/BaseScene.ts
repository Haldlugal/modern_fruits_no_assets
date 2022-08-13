///<reference path="../../rg/Abstract/Scene.ts"/>
///<reference path="../components/Locker.ts"/>
///<reference path="../components/ErrorMessage.ts"/>

import Locker = Component.Locker;
import ErrorMessage = Component.ErrorMessage;

abstract class BaseScene extends RG.Abstract.Scene {
    protected game: Game;
    private errorMsg?: ErrorMessage;

    constructor(game: Game) {
        super(game);
        this.game = game;
        this.y = !RG.Helper.isMobile() ? 50 : Game.mobilePadding;
    }

    // Получение зашаренных компонент
    public get shared(): SharedComponents {
        return this.game.sharedComponents;
    }

    lock(): this {
        Locker.lock(this, this.game.app.screen.width, this.game.app.screen.height);
        return this;
    }

    unlock(): this {
        Locker.unlock(this);
        return this;
    }

    errorMessage(message: Error | string, title: string = 'NOTICE', hideOnOk = false) {
        this.game.heartBeating = false;
        this.lock();
        this.errorMsg = new ErrorMessage(this, 0, 170, message, title);
        this.errorMsg.zIndex = 10001;
        RG.Helper.setCenterX(this.game.app.screen, this.errorMsg);
        if (!RG.Helper.isMobile()) {
            this.errorMsg.x -= 30;
        }
        this.errorMsg.on('click', () => {
            if (!hideOnOk) {
                if (window.top !== window) {
                    window.close();
                    const event = new Event("window_close_from_error_popup");
                    document.dispatchEvent(event);
                    window.top.postMessage(JSON.stringify({event: 'window_close'}), '*');
                }
                else {
                    location.reload();
                }
            } else {
                this.unlock();
                this.errorMsg!.destroy();
            }
        })
    }

    hideErrorMessage() {
        this.game.heartBeating = true;
        this.unlock();
        this.errorMsg!.destroy();
    }

    onResize() {

    }

    onProcess(delta: number, first: boolean) {

    }

    onCreate(delta: number, first: boolean) {

    }
}

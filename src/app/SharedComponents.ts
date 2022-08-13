class SharedComponents {

    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    // -----------------------------------------------------------------------------------------------------------------

    private _logo?: Component.GameLogo;

    public get logo() : Component.GameLogo {
        if (!this._logo) {
            this._logo = new Component.GameLogo();
            RG.Helper.setCenterX(this.game, this._logo);
            this._logo.x -= (Component.SceneHelper.LEFT_OFFSET - 6);
            this._logo.y = Component.SceneHelper.MOBILE_OFFSET_TOP;
            this._logo.zIndex = 1;
            if (RG.Helper.isMobile()) {
                this._logo.scale.set(Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.x, Component.SceneHelper.MOBILE_MAIN_CONTAINER_SCALE.y);
                /*Надо поставить лого по центру рылов, но мы про них не знаем, так что хардкодим*/
                this._logo.x = 644 - this._logo.width/2 - Component.SceneHelper.LEFT_OFFSET;
                this._logo.y += 5;
            } else {
                this._logo.y -= 5;
            }
        }

        return this._logo;
    }

    // -----------------------------------------------------------------------------------------------------------------

    private _soundManagerComponent?: Component.Sound.Manager;

    public get soundManagerComponent() : Component.Sound.Manager {
        if (!this._soundManagerComponent) {
            let sbPosX, sbPosY, sbScale;
            if (RG.Helper.isMobile()) {
                sbPosX = this.game.width - 240;
                sbPosY = 35 - Game.mobilePadding;
                sbScale = 1.5;
            } else {
                sbPosX = this.game.width - 243 - SlotPosition.OFFSET_X;
                sbPosY = 56;
                sbScale = 1;
            }
            this._soundManagerComponent = new Component.Sound.Manager(this.game.width, this.game.height, sbPosX, sbPosY, sbScale );
        }

        return this._soundManagerComponent;
    }

    // -----------------------------------------------------------------------------------------------------------------

    private _helpButton?: Component.HelpButton;

    public get helpButton() : Component.HelpButton {
        if (!this._helpButton) {
            this._helpButton = new Component.HelpButton();
            this._helpButton
                .on('click', () => {
                    (this.game.currentScene?.name === 'HelpScene')
                        ? this.game.back()
                        : this.game.switchTo('HelpScene');
                })
                .on('added', () => {
                    this._helpButton!.icon =
                        (this.game.currentScene?.name === 'HelpScene') ? 'help_close' : 'help'
                    ;
                });

            if (RG.Helper.isMobile()) {
                this._helpButton.x = 1430;
                this._helpButton.y = 35 - Game.mobilePadding;
                this._helpButton.scale.x = 1.5;
                this._helpButton.scale.y = 1.5;
            } else {
                this._helpButton.x = this.game.width - this._helpButton.width - 127 - SlotPosition.OFFSET_X;
                this._helpButton.y = 56;
            }
        }

        return this._helpButton;
    }

    private _balance?: Component.NumbersWithTitle;

    public get balance() : Component.NumbersWithTitle {
        if (!this._balance) {
            const isMobile = RG.Helper.isMobile();
            this._balance = new Component.NumbersWithTitle(!isMobile ? 'BALANCE' : '', 250);

            this._balance.x = 130 + SlotPosition.OFFSET_X - (isMobile ? 20 : 0);
            this._balance.y = !isMobile ? 775 : 730 - Game.mobilePadding/2 - 12;

            this._balance.setValue(this.game.settings.balance);
        }

        return this._balance;
    }

    // -----------------------------------------------------------------------------------------------------------------

    private _stakes?: Component.Stakes;

    private static readonly STAKE_POSITION_X = RG.Helper.isMobile() ? 800 : 1015;
    private static readonly STAKE_POSITION_Y = RG.Helper.isMobile() ? 725  - Game.mobilePadding/2 : 740;

    public get stakes() : Component.Stakes {
        if (!this._stakes) {
            this._stakes = new Component.Stakes(this.game.settings.stakeSteps);
            this._stakes.zIndex = 10;
            this._stakes
                .setValue(this.game.settings.stake)
                .on('change', (value: number) => {
                    this.game.settings.stake = value;
                });

            this._stakes.x = SharedComponents.STAKE_POSITION_X -  (RG.Helper.isMobile() ? Component.SceneHelper.LEFT_OFFSET : 0);
            this._stakes.y = SharedComponents.STAKE_POSITION_Y - (RG.Helper.isMobile() ? 22 : 0);
        }

        return this._stakes;
    }
}

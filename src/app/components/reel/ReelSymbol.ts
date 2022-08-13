namespace ReelComponent {

  import Direction = RG.Animation.Direction;

    export class ReelSymbol extends PIXI.Container implements Symbol{

    public readonly reelPosition: number;
    public sprite: PIXI.Sprite;
    public isAnimating: boolean = false;
    public readonly frame: PIXI.Sprite;
    private symbolId: number;

    private growAnimation: RG.Animation.Animation<RG.Animation.SimpleType>;
    private decreaseAnimation: RG.Animation.Animation<RG.Animation.SimpleType>;

    private readonly LOSE_DURATION = 250;
    private readonly WIN_DURATION = 500;

    constructor(pos: number, symbolId: number) {
        super();

        this.reelPosition = pos;
        this.symbolId = symbolId;

        this.frame = PIXI.Sprite.from('item_win_frame');
        this.frame.x -= 2;
        this.frame.visible = false;
        this.addChild(this.frame);

        this.sprite = new PIXI.Sprite(this.getTexture());
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(
          this.sprite.width / 2,
          this.sprite.height / 2
        );
        this.addChild(this.sprite);

        //TODO: символ сам себя располагает на барабане. Это плохо.
        this.y = this.reelPosition * SlotPosition.HEIGHT;

        this.interactive = true;
        this.buttonMode = true;
        this.cursor = "help";

        this.growAnimation = new RG.Animation.Animation<RG.Animation.SimpleType>();
        this.decreaseAnimation = new RG.Animation.Animation<RG.Animation.SimpleType>();
        this.setupSizeAnimations();

        this.on('symbol.shown', async () => {
            const blinkCheck = ReelConfig.BLINKING_SYMBOLS.find(id => this.symbolId === id);
            if (blinkCheck === 0 || blinkCheck) {
                  const blink = new Effect.BlinkStar(this, 97, 85);
                  blink.playAndDestroy()
            }
        });
        this.emit('symbol.shown');
    }


    public getSymbolId(): number {
      return this.symbolId;
    }

    public setSymbolId(symbolId: number) {
      this.symbolId = symbolId;
      (this.getChildAt(1) as PIXI.Sprite).texture = ReelSymbol.texture(symbolId);

      // если был удален у барабана - добавляем его назад к барабану
      if (!this.parent) {
        (this.parent as PIXI.Container).addChild(this);
      }
      this.emit('symbol.shown');
    }

    public setHighlight (on: boolean) : this {
      this.frame.visible = on;
      return this;
    }

    public setId(id: number) {
      this.symbolId = id;
      this.sprite.texture = ReelSymbol.texture(id);
    }

    private getTexture(): PIXI.Texture {
      return ReelSymbol.texture(this.symbolId);
    }

    private getWinTexture(): PIXI.Texture {
        return ReelSymbol.texture(this.symbolId, true);
    }

    private setupSizeAnimations() {
        this.growAnimation
            .from({value: this.scale.x})
            .to({value: 1.5})
            .direction(Direction.Alternate)
            .iterations(1)
            .on(RG.Animation.Events.Update, (props)=>{
                this.sprite.scale.set(props.value);
            });
        this.decreaseAnimation
            .from({value: this.scale.x})
            .to({value: 0.5})
            .on(RG.Animation.Events.Update, (props)=>{
                this.sprite.scale.set(props.value);
            })
    }

    public playLoseEffect(): Promise<boolean> {
        if (this.sprite.scale.x > 0.5) {
            this.alpha = 0.3;
            return this.decreaseAnimation.duration(this.LOSE_DURATION).play();
        } else return new Promise(resolve => resolve(true));
    }

    public playWinEffect(): Promise<boolean> {
        this.alpha = 1;
        this.sprite.texture = this.getWinTexture();
        this.growAnimation
            .on(RG.Animation.Events.Complete, ()=>{
                this.sprite.texture = this.getTexture();
            });
        return this.growAnimation.duration(this.WIN_DURATION).play();
    }

    public resetToDefault() {
        this.alpha = 1;
        this.sprite.texture = this.getTexture();
        this.sprite.scale.set(1);
    }

    public stopAnimations() {
        this.growAnimation.stop();
        this.decreaseAnimation.stop();
    }

    public playSpecialEffect(): Promise<boolean> {
        return new Promise((resolve)=>{
            resolve(true);
        })
    }

    public static texture(symbolId: number, isWon: Boolean = false): PIXI.Texture {
      const id = (symbolId >= 10 ? '' + symbolId : '0' + symbolId);
      return PIXI.Texture.from('' + id + (isWon ? '_win' : ''), {}, true);
    }
  }

  export interface Symbol {
      /**
       * Позиция символа на барабане
       */
      readonly reelPosition: number;
      sprite: PIXI.Sprite;

      setSymbolId(id: number): void
      getSymbolId(): number
      playWinEffect(): Promise<boolean>
      playLoseEffect(): Promise<boolean>
      playSpecialEffect(): Promise<boolean>
      resetToDefault(): void
  }
}

///<reference path="./Utils/Cookie.ts"/>
namespace RG {

    export class GameSound {

        public static readonly instance: GameSound = new GameSound();
        public readonly cookieName: string = 'GAME_SOUND';

        protected maxVolume: number = 1;
        public assets: string[] = [];
        public volume: number = 1;
        public savedVolume!: number;


        setup(maxVolume: number) {
            this.volume = this.getCookies() >= 0 ? this.getCookies() : 1;
            this.maxVolume = maxVolume;
            this.savedVolume = this.volume;
        }

        play(asset: string, loop = false) {
            this.assets.push(asset);
            try {
                PIXI.sound.play(asset, {
                    loop: loop,
                    volume: this.maxVolume,
                    complete: () => {
                        this.assets.splice(this.assets.indexOf(asset), 1);
                    }
                });
                PIXI.sound.volume(asset, this.volume);
            }
            catch (e) {
                console.error('Cannot play sound', asset);
                this.assets.splice(this.assets.indexOf(asset), 1);
            }
            return this;
        }

        setVolume(value: number) {
            this.setCookies(value);

            this.assets.forEach((asset: string) => {
                PIXI.sound.volume(asset, value);
            });
            return this;
        }

        async mute(time: number): Promise<boolean> {
            this.savedVolume = this.getVolume();
            const anim =  new RG.Animation.Animation<RG.Animation.SimpleType>();
            anim
                .from({value: this.getVolume()})
                .to({value: 0})
                .duration(time)
                .on(RG.Animation.Events.Update, (props: RG.Animation.SimpleType) => {
                    this.assets.forEach((asset: string) => {
                        PIXI.sound.volume(asset, props.value);
                    });
                });
            return anim.playAndDestroy();
        }

        restoreFromMute(time: number) {
            if (this.savedVolume !== 0) {
                const anim =  new RG.Animation.Animation<RG.Animation.SimpleType>();
                anim
                    .from({value: 0})
                    .to({value: this.savedVolume})
                    .duration(time)
                    .on(RG.Animation.Events.Update, (props: RG.Animation.SimpleType) => {
                        this.setVolume(props.value);
                    })
                    .on(RG.Animation.Events.Complete, (props: RG.Animation.SimpleType) => {
                        this.savedVolume = 0;
                    });
                return anim.playAndDestroy();
            }
        }

        getVolume() {
            return this.volume;
        }

        pause(): this {
            this.assets.forEach((asset: string) => PIXI.sound.pause(asset));
            return this;
        }

        resume(): this {
            this.assets.forEach((asset: string) => PIXI.sound.resume(asset));
            return this;
        }

        stopAll(): this {
            this.assets.forEach((asset: string) => PIXI.sound.stop(asset));
            return this;
        }

        stop(asset: string): this {
            try {
                PIXI.sound.stop(asset);
            }
            catch (e) {
                console.error('Cannot stop sound', asset);
                this.assets.splice(this.assets.indexOf(asset), 1);
            }
            return this;
        }

        setCookies (value: number) {
            this.volume = value;
            Utils.Cookie.set(this.cookieName, value);
        }

        getCookies () : number {
            return Number(Utils.Cookie.get(this.cookieName));
        }
    }

}

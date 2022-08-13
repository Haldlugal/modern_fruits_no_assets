///<reference path="GameSound.ts"/>

namespace RG {
    type GameSoundConfig = {
        asset: string, // название ассета без замыкающей цифры
        variants: number[], // существующие варианты с этим ассетом
        simultaneously: number[] // варианты, сколько одновременно файлов этого типа может проигрываться
    }

    export class AmbientSound extends RG.GameSound {

        public static readonly instance: AmbientSound = new AmbientSound();
        public readonly cookieName: string = 'AMBIENT_SOUND';

        private config?: GameSoundConfig[];

        public assets: string[] = [];
        public volume: number = 1;


        setConfig(config: GameSoundConfig[]) {
            this.config = config;
            return this;
        }

        playDefault(): this {
            let assets: string[] = [];
            this.config!.forEach((c: GameSoundConfig) => {
                this.shuffle(c.simultaneously);
                this.shuffle(c.variants);
                c.variants.slice(0, c.simultaneously[0]).forEach((variant: number) => assets.push(c.asset + variant))
            });
            this.stopAll().playAssets(assets).then(this.playDefault.bind(this));
            return this;
        }

        private playAssets(assets: string[]): Promise<void> {
            this.assets = [];
            const promises: Promise<void>[] = [];
            assets.forEach((asset: string) => {
                this.assets.push(asset);
                promises.push(this.playAsset(asset));
            });
            return Promise.all(promises).then(() => {
            });
        }

        private playAsset(asset: string): Promise<void> {
            return new Promise(resolve => {
                PIXI.sound.play(asset, {
                    start: 0,
                    // end: 4,
                    volume: this.maxVolume,
                    complete: () => {
                        resolve();
                    }
                });
                PIXI.sound.volume(asset, this.volume);
            })
        }

        shuffle(a: number[]): number[] {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
    }
}

///<reference path="../Abstract/Effect.ts"/>

namespace RG.Effect {

    import Animation = RG.Animation;
    import Events = RG.Animation.Events;

    interface ComponentType {
        getValue(): number;
        setValue(value: number): any;
    }

    /**
     * Эфеект изменения числа в NumberImageComponent компоненте
     */
    export class Numbers extends RG.Abstract.Effect {

        public static DEFAULT_DURATION = 500;

        public component: ComponentType;
        public readonly animation: Animation.Animation<RG.Animation.SimpleType> = new Animation.Animation();

        constructor(component: ComponentType) {
            super();

            this.component = component;
            this.setupAnimation();
        }

        setComponent(component: ComponentType) {
            this.component = component;
            return this;
        }

        setupAnimation() {
            this.animation
                .on(Events.BeforeStart, () => {
                    this.animation.from({value: this.component.getValue()});
                })
                .on(Events.Stop, () => {
                    const props = this.animation.getToProps();
                    if (!props) {
                        return;
                    }
                    this.component.setValue(+(props.value.toFixed(2)));
                })
                .on(Events.Update, (props: RG.Animation.SimpleType) => {
                    this.component.setValue(+(props.value.toFixed(2)));
                });

            this
                .to(0)
                .duration(Numbers.DEFAULT_DURATION);
        }

        to(value: number) {
            this.animation.to({value});
            return this;
        }
    }
}

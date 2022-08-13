/// <reference path="../../rg/Abstract/Effect.ts"/>

namespace Effect {
    import Animation = RG.Animation;
    import Events = RG.Animation.Events;

    type NumbersProps = {
        value: number;
    };

    interface ComponentType {
        setValue(value: number): this
        getValue(): number
        numbers: RG.Text
    }

    /**
     * Эфеект изменения числа в NumberImageComponent компоненте
     */
    export class TextNumber extends RG.Abstract.Effect {
        public component: ComponentType;
        public readonly animation: Animation.Animation<NumbersProps> = new Animation.Animation();

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
                    this.animation.from({value: Number(this.component.numbers.text)});
                })
                .on(Events.Stop, () => {
                    const props = this.animation.getToProps();
                    if (!props) {
                        return;
                    }
                    this.component.setValue(+(props.value.toFixed(2)));
                })
                .on(Events.Update, (props: NumbersProps) => {
                    this.component.setValue(+(props.value.toFixed(2)));
                });

            this
                .to(0)
                .duration(500);
        }

        to(value: number) {
            this.animation.to({value: value});
            return this;
        }
    }
}

import {Graphics} from 'pixi.js';
import {PixiComponent} from '@inlet/react-pixi';

const Line = PixiComponent('Line', {
    create: props => new Graphics(),
    applyProps: (instance, _, newProps) => {
        const {x1, y1, x2, y2, weight, color } = newProps;
        console.log(x1, y1, x2, y2)
        instance.clear();
        instance.lineStyle(weight, color)
        instance.moveTo(x1, y1)
        instance.lineTo(x2, y2);
    }
});

export default Line;
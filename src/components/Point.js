import {Sprite, withPixiApp} from '@inlet/react-pixi';
import React from 'react';
import circle from '../img/circle.svg';
import {throttle} from "underscore";
import {deletePoint, setPointPosition} from "../redux/actions";
import {connect} from 'react-redux';

class Point extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            currX: props.x,
            currY: props.y,
            lastX: props.x,
            lastY: props.y,
            size: props.size,
            app: props.app,
            isDrag: false,
            dragOffsetX: 0,
            dragOffsetY: 0,
            isHover: false,
        }

        props.app.renderer.view.addEventListener('contextmenu', e => e.preventDefault())
    }

    notifyPositionChange = throttle((id, newX, newY) => {
        this.props.setPointPosition(id, this.state.lastX, this.state.lastY, newX, newY);
        this.setState({
            lastX: newX, lastY: newY
        });
    }, 50);

    setPosition(x, y) {
        this.setState((state) => {
            const currX = x + state.dragOffsetX;
            const currY = y + state.dragOffsetY;

            return {
                currX, currY
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.currX !== prevState.currX || this.state.currY !== prevState.currY) {
            this.notifyPositionChange(this.state.id, this.state.currX, this.state.currY);
        }
    }

    setHover(isHover) {
        this.setState({
            isHover
        });
    }

    setDrag(isDrag, event) {
        let dragOffsetX = 0, dragOffsetY = 0;

        if (isDrag) {
            const {currX, currY} = this.state;
            const startPos = event.data.getLocalPosition(this.state.app.stage);
            dragOffsetX = currX - startPos.x;
            dragOffsetY = currY - startPos.y;
        }

        this.setState({
            isDrag,
            dragOffsetX,
            dragOffsetY
        });
    }

    render() {
        const {currX, currY, size, isHover, isDrag} = this.state;

        const tint = isDrag ? 0xFF0000 : isHover ? 0x00FF00 : 0x000000
        // const tint = 0xFF0000;
        return <Sprite image={circle} x={currX} y={currY} anchor={0.5} width={size} height={size}
                       buttonMode={true}
                       interactive={true}
                       tint={tint}
                       alpha={isDrag ? 0.75 : 1}
                       mouseover={e => this.setHover(true)}
                       mouseout={e => this.setHover(false)}
                       rightclick={e => this.props.deletePoint(this.state.id)}
                       mousedown={e => {
                           this.setDrag(true, e)
                           e.stopPropagation();
                       }}
                       mouseup={e => this.setDrag(false)}
                       mouseupoutside={e => this.setDrag(false)}
                       pointermove={e => {
                           if (isDrag) {
                               const pos = e.data.getLocalPosition(this.state.app.stage);
                               this.setPosition(pos.x, pos.y);
                           }
                       }}
                       click={e => e.stopPropagation()}/>;
    }
}

export default connect(
    null,
    {setPointPosition, deletePoint})
(withPixiApp(Point));

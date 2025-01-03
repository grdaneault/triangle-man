import {Sprite, withPixiApp} from '@inlet/react-pixi';
import React from 'react';
import circle from '../img/circle.svg';
import {throttle} from "underscore";
import {movePointAndUpdateTriangles, removePointAndUpdateTriangles, setPointPosition} from "../redux/actions";
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
            lastRetriangulation: 0
        }

        props.app.renderer.view.addEventListener('contextmenu', e => e.preventDefault())
    }

    notifyPositionChange = throttle((id, newX, newY) => {
        const now = (new Date()).getTime();

        if (now - this.state.lastRetriangulation > 1000) {
            this.props.movePointAndUpdateTriangles(id, this.state.lastX, this.state.lastY, newX, newY)
            this.setState({
                lastX: newX, lastY: newY,
                lastRetriangulation: now
            });
        } else {
            this.props.setPointPosition(id, this.state.lastX, this.state.lastY, newX, newY)
            this.setState({
                lastX: newX, lastY: newY,
            });
        }

    }, 25);

    retriangulate = throttle((id, oldX, oldY, newX, newY) => {
        this.props.movePointAndUpdateTriangles(id, oldX, oldY, newX, newY)
    }, 1000)

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
        // console.log(`Did point change? (${prevState.currX}, ${prevState.currY}) -> (${this.state.currX}, ${this.state.currY}) OR (${this.props.x}, ${this.props.y})`)
        if (this.state.currX !== prevState.currX || this.state.currY !== prevState.currY) {
            // console.log(`Point change STATE (${prevState.currX}, ${prevState.currY}) -> (${this.state.currX}, ${this.state.currY})`)
            this.notifyPositionChange(this.state.id, this.state.currX, this.state.currY);
        } else if (this.props.x !== undefined && this.props.y !== undefined
            && (this.props.x !== prevState.currX || this.props.y !== prevState.currY)) {
            // console.log(`Point change PROPS (${prevState.currX}, ${prevState.currY}) -> (${this.props.x}, ${this.props.y})`)
            this.setState({
                currX: this.props.x, currY: this.props.y,
                lastX: this.props.x, lastY: this.props.y
            });
            // this.notifyPositionChange(this.state.id, this.props.x, this.props.y);
        } else {
            // console.log(`No point change`)
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
            dragOffsetY,
            lastRetriangulation: (new Date()).getTime()
        });
    }

    render() {
        const {currX, currY, size, isHover, isDrag} = this.state;

        const tint = isDrag ? 0xFF0000 : isHover ? 0x00FF00 : 0x000000
        const realSize = isHover ? 1.5 * size : size;
        // const tint = 0xFF0000;
        return <Sprite image={circle} x={currX} y={currY} anchor={0.5} width={realSize} height={realSize}
                       buttonMode={true}
                       interactive={true}
                       tint={tint}
                       alpha={isDrag ? 0.75 : 1}
                       mouseover={e => this.setHover(true)}
                       mouseout={e => this.setHover(false)}
                       rightclick={e => this.props.removePointAndUpdateTriangles(this.state.id)}
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

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.points.find(p => p.id === ownProps.id),
    }
}

export default connect(
    mapStateToProps,
    {movePointAndUpdateTriangles, setPointPosition, removePointAndUpdateTriangles})
(withPixiApp(Point));

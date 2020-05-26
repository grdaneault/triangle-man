import React from "react";
import {Graphics, Stage, withPixiApp} from "@inlet/react-pixi";
import Point from "./Point";
import {connect, Provider} from "react-redux";
import store from "../redux/store";
import {addPoint, registerApp} from "../redux/actions";
import Triangle from "./Triangle";


class Wallpaper extends React.Component {

    render() {
        const triangles = this.props.triangles.map(triangle => <Triangle id={triangle.id} key={triangle.id}/>)
        let points = [];
        if (this.props.showPoints) {
            points = this.props.points.map((point) => <Point x={point.x}
                                                             y={point.y}
                                                             size={25}
                                                             key={point.id}
                                                             id={point.id} />)
        }

        const options = {
            antialias: true,
            resizeTo: window,
            resolution: parseFloat(this.props.resolution),
            backgroundColor: 0xFFFFFF,
            // Without this the toBlob just sees black
            preserveDrawingBuffer: true
        }
        return (
            <Stage options={options} onMount={this.props.registerApp}>
                <Provider store={store}>
                    <Graphics>
                        {triangles}
                        {this.props.showPoints && points}
                    </Graphics>
                </Provider>
            </Stage>)
    }
}

const mapStateToProps = (store) => {
    return {
        points: store.points,
        triangles: store.triangles,
    }
}

export default connect(mapStateToProps, {addPoint, registerApp})(withPixiApp(Wallpaper));
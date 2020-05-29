import React from "react";
import {Graphics, Stage, withPixiApp} from "@inlet/react-pixi";
import Point from "./Point";
import {connect, Provider} from "react-redux";
import store from "../redux/store";
import {addPoint, registerApp} from "../redux/actions";
import Triangle from "./Triangle";


function Wallpaper(props) {
    const triangles = props.triangles.map(triangle => <Triangle id={triangle.id} key={triangle.id}/>)

    let points = [];
    if (props.showPoints) {
        points = props.points.map((point) => <Point x={point.x}
                                                    y={point.y}
                                                    size={25}
                                                    key={point.id}
                                                    id={point.id}/>)
    }

    const options = {
        antialias: true,
        width: props.resolution.width,
        height: props.resolution.height,
        resolution: parseFloat(props.resolution),
        backgroundColor: 0xFFFFFF,
        // Without this the toBlob just sees black
        preserveDrawingBuffer: true
    }
    return (
        <Stage options={options} onMount={props.registerApp} >
            <Provider store={store}>
                <Graphics>
                    {triangles}
                    {props.showPoints && points}
                </Graphics>
            </Provider>
        </Stage>)
}

const mapStateToProps = (store) => {
    return {
        points: store.points,
        showPoints: store.pointSettings.visible,
        triangles: store.triangles,
        resolution: store.resolution
    }
}

export default connect(mapStateToProps, {addPoint, registerApp})(withPixiApp(Wallpaper));
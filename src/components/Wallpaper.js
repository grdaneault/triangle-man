import React from "react";
import {Graphics, Stage, withPixiApp} from "@inlet/react-pixi";
import Point from "./Point";
import {connect, Provider} from "react-redux";
import store from "../redux/store";
import {addPoint} from "../redux/actions";
import Triangle from "./Triangle";


class Wallpaper extends React.Component {
    constructor(props) {
        super(props);
        console.log("init wallpaper with ", props)
    }

    render() {
        const triangles = this.props.triangles.map(triangle => <Triangle id={triangle.id} key={triangle.id} />)
        let points = [];
        if (this.props.showPoints) {
            points = this.props.points.map((point) => <Point x={point.x} y={point.y} size={25} key={point.id}
                                                                   id={point.id}/>)
        }
        return (
            <Stage options={{antialias: true, resizeTo: window}} onClick={this.addPoint} onKeyDown={console.log} onKeyPress={console.log} onKeyDownCapture={console.log }>
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
        points: store.shapeData.points,
        triangles: store.shapeData.triangles,
    }
}

export default connect(mapStateToProps, {addPoint})(withPixiApp(Wallpaper));
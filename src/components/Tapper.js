import {Sprite} from "@inlet/react-pixi";
import {addPoint} from "../redux/actions";
import {connect} from "react-redux";
import React from "react";

const Tapper = (props) => {
    const addPoint = (event) => {
        console.log(event.clientX, event.screenX, event.clientY, event.screenY, event);
        props.addPoint(event.clientX, event.clientY)
    }

    return <Sprite x={0} y={0} width={props.width} height={props.height} click={addPoint} />
}

export default connect(null, {addPoint})(Tapper)
import React, {useState} from "react";
import {Graphics, Stage, withPixiApp} from "@inlet/react-pixi";
import Point from "./Point";
import {connect, Provider} from "react-redux";
import store from "../redux/store";
import {addPoint, registerApp} from "../redux/actions";
import Triangle from "./Triangle";
import useWindowSize from "../hooks/windowSize";
import MdExpand from "react-ionicons/lib/MdExpand";
import MdContract from "react-ionicons/lib/MdContract";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import Tooltip from "@material-ui/core/Tooltip";


function Wallpaper(props) {
    const [zoomFit, setZoomFit] = useState(false);

    const triangles = props.triangles.map(triangle => <Triangle id={triangle.id} key={triangle.id}/>)

    let points = [];
    if (props.showPoints) {
        points = props.points.map((point) => <Point x={point.x}
                                                    y={point.y}
                                                    size={25}
                                                    key={point.id}
                                                    id={point.id}/>)
    }

    const {width, height} = props.resolution;

    const options = {
        antialias: true,
        width,
        height,
        backgroundColor: 0xFFFFFF,
        // Without this the toBlob just sees black
        preserveDrawingBuffer: true
    }

    const windowSize = useWindowSize(false);
    const canvasStyle = {};
    if (windowSize.width / width * height > windowSize.height) {
        if (zoomFit) {
            canvasStyle.height = Math.min(height, windowSize.height);
        } else {
            canvasStyle.width = Math.min(width, windowSize.width);
        }
    } else {
        if (zoomFit) {
            canvasStyle.width = Math.min(width, windowSize.width);
        } else {
            canvasStyle.height = Math.min(height, windowSize.height);
        }
    }

    return (
        <Box className="WallpaperContainer">
            <Stage options={options}
                   onMount={props.registerApp}
                   style={canvasStyle}
                   key={width + "x" + height}
            >
                <Provider store={store}>
                    <Graphics>
                        {triangles}
                        {props.showPoints && points}
                    </Graphics>
                </Provider>
            </Stage>
            <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                <Tooltip placement={"left"} title={zoomFit ? "Fill Screen" : "Shrink to fit"} aria-label={zoomFit ? "fill screen" : "shrink to fit"} >
                    <Fab className={"ZoomToggle"} onClick={() => setZoomFit(!zoomFit)}>{zoomFit ? <MdExpand /> : <MdContract />}</Fab>
                </Tooltip>
            </Slide>
        </Box>)
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
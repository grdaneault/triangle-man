import React, {useState} from "react";
import {Graphics, Stage, withPixiApp} from "@inlet/react-pixi";
import Point from "./Point";
import {connect, Provider} from "react-redux";
import store from "../redux/store";
import {addPoint, registerApp} from "../redux/actions";
import Triangle from "./Triangle";
import useWindowSize from "../hooks/windowSize";
import { Expand, Contract } from "react-ionicons";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import Slide from "@mui/material/Slide";
import Tooltip from "@mui/material/Tooltip";
import useHover from "../hooks/hover";
import useTimeDelay from "../hooks/timeDelay";


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

    const [zoomBoxHoverRef, isZoomBoxHovered] = useHover();
    const [initialLoadHoldOpenExpired] = useTimeDelay(5000);

    return (
        <Box className="WallpaperContainer">
            <Stage options={options}
                   onMount={props.registerApp}
                   style={canvasStyle}
                   width={width}
                   height={height}
                   key={width + "x" + height}
            >
                <Provider store={store}>
                    <Graphics>
                        {triangles}
                        {props.showPoints && points}
                    </Graphics>
                </Provider>
            </Stage>
            <div className={"BottomRightSlideInArea"} ref={zoomBoxHoverRef}>
                <Slide direction="left" in={isZoomBoxHovered || !initialLoadHoldOpenExpired} mountOnEnter unmountOnExit>
                    <Tooltip placement={"left"} title={zoomFit ? "Fill Screen" : "Shrink to fit"} aria-label={zoomFit ? "fill screen" : "shrink to fit"} >
                        <Fab className={"ZoomToggle"} onClick={() => setZoomFit(!zoomFit)}>{zoomFit ? <Expand /> : <Contract />}</Fab>
                    </Tooltip>
                </Slide>
            </div>
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
import React, {useEffect} from 'react';
import './App.css';
import {addImageTheme, generateWallpaper, setTargetResolution} from "./redux/actions";
import {connect} from "react-redux";
import Wallpaper from "./components/Wallpaper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Controls from "./components/Controls";
import defaultImage from './img/sample9.jpg';
import {READY} from "./redux/reducers/renderState";

function App(props) {

    const {renderState, generateWallpaper, addImageTheme, setTargetResolution} = props;
    const screenWidth = window.screen.width * window.devicePixelRatio;
    const screenHeight = window.screen.height * window.devicePixelRatio;

    useEffect(() => {
        setTargetResolution(screenWidth, screenHeight);
        addImageTheme("default", defaultImage);
        generateWallpaper();
    }, [setTargetResolution, addImageTheme, generateWallpaper, screenWidth, screenHeight]);

    return (
        <div className={`App Shrink`}>
            <Backdrop className="Loading" open={renderState !== READY}>
                {/* disable Shrink Animation because the load of generating the wallpaper is too much*/}
                <CircularProgress color={"inherit"} size={180} disableShrink />
                <Typography>
                    {renderState}
                </Typography>
            </Backdrop>
            <Controls />
            <Wallpaper />
        </div>
    );
}

const mapStateToProps = (store) => {
    return {
        renderState: store.renderState
    }
}

export default connect(mapStateToProps, {generateWallpaper, addImageTheme, setTargetResolution})(App);

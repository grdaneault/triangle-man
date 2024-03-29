import React, {useEffect} from 'react';
import './App.css';
import {addImageTheme, generateWallpaper, setTargetResolution} from "./redux/actions";
import {connect} from "react-redux";
import Wallpaper from "./components/Wallpaper";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Controls from "./components/Controls";
import defaultImage from './img/sample9.jpg';
import {READY} from "./redux/reducers/renderState";

import { createTheme } from '@mui/material/styles';
import lightBlue from '@mui/material/colors/lightBlue';
import green from '@mui/material/colors/green';
import {ThemeProvider} from "@mui/styles";

const theme = createTheme({
    palette: {
        primary: green,
        secondary: lightBlue
    }
});

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
        <div className={"App"}>
            <ThemeProvider theme={theme}>
                <Backdrop className="Loading" open={renderState !== READY}>
                    {/* disable Shrink Animation because the load of generating the wallpaper is too much*/}
                    <CircularProgress color={"inherit"} size={180} disableShrink />
                    <Typography>
                        {renderState}
                    </Typography>
                </Backdrop>
                <Controls />
                <Wallpaper />
            </ThemeProvider>
        </div>
    );
}

const mapStateToProps = (store) => {
    return {
        renderState: store.renderState
    }
}

export default connect(mapStateToProps, {generateWallpaper, addImageTheme, setTargetResolution})(App);

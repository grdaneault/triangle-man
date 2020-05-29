import React, {useEffect, useState} from 'react';
import './App.css';
import {generateWallpaper} from "./redux/actions";
import {connect} from "react-redux";
import Wallpaper from "./components/Wallpaper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import useWindowSize from "./hooks/windowSize";
import Controls from "./components/Controls";

function App(props) {

    const {width, height} = useWindowSize();
    const [isExpanded, setExpanded] = useState(false);

    const {triangles, generateWallpaper} = props;
    // Empty dependency list to only generate the points on load/unload
    useEffect(() => generateWallpaper(), []);

    const isLoading = triangles.length === 0 || !triangles[0].fill

    const message = triangles.length === 0 ? 'Generating Triangles' : 'Generating Gradients'
    return (
        <div className={`App Shrink`}>
            <Backdrop className="Loading" open={isLoading}>
                {/* disable Shrink Animation because the load of generating the wallpaper is too much*/}
                <CircularProgress color={"inherit"} size={180} shrinkAnimation={false}/>
                <Typography>
                    {message}
                </Typography>
            </Backdrop>
            <Controls />
            <Wallpaper width={width} height={height} />
        </div>
    );
}

const mapStateToProps = (store) => {
    return {
        triangles: store.triangles
    }
}

export default connect(mapStateToProps, {generateWallpaper})(App);

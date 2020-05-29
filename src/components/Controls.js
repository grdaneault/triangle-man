import React from 'react';
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {connect} from "react-redux";
import {addPointsAndGenerateTriangles, applyImageTheme, generateWallpaper, reset} from "../redux/actions";
import {saveAs} from "file-saver";

function Controls({
                      pointSettings: {gridSize, pointChance, showPoints},
                      points,
                      triangles,
                      pixiApp,
                      currentTheme,
                      pointChange,
                      updateSettings,
                      generateWallpaper
                  }) {

    const download = () => {
        pixiApp.renderer.view.toBlob((blob) => {
            saveAs(blob, `wallpaper-${currentTheme}.png`)
        }, 'image/png');
    }

    return (
        <Box className="Controls">
            <p>Grid size: {gridSize}px</p>
            <p>Point chance: {pointChance * 100}%</p>
            <p>Number of points: {points.length}</p>
            <p>Number of triangles: {triangles.length}</p>
            <label>Show points: <input type="checkbox" name="showPoints" checked={showPoints}/></label>
            <p>
                <Button onClick={generateWallpaper}>Regenerate</Button>
                <Button onClick={download}>Download</Button>
            </p>
        </Box>
    )
}

const mapStateToProps = (store) => {
    return {
        points: store.points,
        triangles: store.triangles,
        pixiApp: store.pixiApp,
        pointSettings: store.pointSettings,
        currentTheme: store.currentTheme
    }
}

export default connect(mapStateToProps, {
    addPointsAndGenerateTriangles,
    reset,
    applyImageTheme,
    generateWallpaper
})(Controls);

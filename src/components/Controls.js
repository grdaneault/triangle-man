import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {connect} from "react-redux";
import {applyImageTheme, generateWallpaper, updateSettings} from "../redux/actions";
import {saveAs} from "file-saver";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import GetAppIcon from '@material-ui/icons/GetApp';
import RefreshIcon from '@material-ui/icons/Refresh';

function Controls({pointSettings, points, triangles, pixiApp, currentTheme, updateSettings, generateWallpaper}) {

    const [showPoints, setShowPointsState] = useState(pointSettings.visible);
    const download = () => {
        pixiApp.renderer.view.toBlob((blob) => {
            saveAs(blob, `wallpaper-${currentTheme}.png`)
        }, 'image/png');
    }

    const handleShowPointsChange = (event) => {
        updateSettings({visible: event.target.checked})
        setShowPointsState(event.target.checked);
    }

    return (
        <Box className="Controls">
            <FormGroup>
                <p>Grid size: {pointSettings.gridSize}px</p>
                <p>Point chance: {pointSettings.pointChance * 100}%</p>
                <p>Number of points: {points.length}</p>
                <p>Number of triangles: {triangles.length}</p>
                <FormControlLabel
                    control={<Switch checked={showPoints} onChange={handleShowPointsChange}/>}
                    label="Show points"
                />
                <p>
                    <Button onClick={generateWallpaper} startIcon={<RefreshIcon />} color="secondary">Regenerate</Button>
                    <Button onClick={download} startIcon={<GetAppIcon />} color="primary">Download</Button>
                </p>
            </FormGroup>
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
    applyImageTheme,
    updateSettings,
    generateWallpaper
})(Controls);

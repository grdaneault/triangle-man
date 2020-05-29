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
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import {debounce} from "underscore";

function Controls({pointSettings, points, triangles, pixiApp, currentTheme, updateSettings, generateWallpaper}) {

    const download = () => {
        pixiApp.renderer.view.toBlob((blob) => {
            saveAs(blob, `wallpaper-${currentTheme}.png`)
        }, 'image/png');
    }

    const handleShowPointsChange = (event) => {
        updateSettings({visible: event.target.checked})
    }

    const updateSettingsAndRedraw = debounce((newSettings) => {
        updateSettings(newSettings)
        generateWallpaper();
    }, 300);

    const [pointChance, setPointChance] = useState(pointSettings.pointChance);
    const handlePointChanceCommit = (_, value) => {
        setPointChance(value);
        updateSettingsAndRedraw({pointChance: value});
    }

    const [gridSize, setGridSize] = useState(pointSettings.gridSize);
    const handleGridSizeCommit = (_, value) => {
        setGridSize(value);
        updateSettingsAndRedraw({gridSize: value});
    }

    const pxLabel = (value) => `${value}px`
    const percentLabel = (value) => `${value}%`

    return (
        <Box className="Controls">
            <FormGroup>
                <Typography id="grid-size-slider" gutterBottom>
                    Grid Size
                </Typography>
                <Slider min={50}
                        max={1000}
                        step={25}
                        value={gridSize}
                        onChange={(_, value) => setGridSize(value)}
                        onChangeCommitted={handleGridSizeCommit}
                        getAriaValueText={pxLabel}
                        valueLabelDisplay="auto"
                        valueLabelFormat={pxLabel}
                        aria-labelledby="grid-size-slider"/>
                <Typography id="point-chance-slider" gutterBottom>
                    Point Chance
                </Typography>
                <Slider min={20}
                        max={100}
                        step={5}
                        value={pointChance}
                        onChange={(_, value) => setPointChance(value)}
                        onChangeCommitted={handlePointChanceCommit}
                        getAriaValueText={percentLabel}
                        valueLabelDisplay="auto"
                        valueLabelFormat={percentLabel}
                        aria-labelledby="point-chance-slider"/>
                <p>Number of points: {points.length}</p>
                <p>Number of triangles: {triangles.length}</p>
                <FormControlLabel
                    control={<Switch checked={pointSettings.visible} onChange={handleShowPointsChange}/>}
                    label="Show points"
                />
                <p>
                    <Button onClick={generateWallpaper} startIcon={<RefreshIcon/>} color="secondary">Regenerate</Button>
                    <Button onClick={download} startIcon={<GetAppIcon/>} color="primary">Download</Button>
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

import React, {useState} from 'react';
import Button from "@mui/material/Button";
import {connect} from "react-redux";
import {applyCurrentTheme, generateWallpaper, setTargetResolution, updateSettings} from "../redux/actions";
import {saveAs} from "file-saver";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import GetAppIcon from '@mui/icons-material/GetApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import {debounce} from "underscore";
import ImageThemeSource from "./ImageThemeSource";
import InputLabel from "@mui/material/InputLabel";
import ResolutionSelector from "./ResolutionSelector";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";

function Controls({pointSettings, points, triangles, pixiApp, currentTheme, updateSettings, generateWallpaper, applyCurrentTheme}) {

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

    const redraw = () => {
        generateWallpaper();
        applyCurrentTheme();
    };

    return (
        <Card className="Controls" elevation={3}>
            <CardActionArea>
                <CardMedia component={ImageThemeSource}/>
            </CardActionArea>
            <CardContent>
                <FormGroup>
                    <Box className={"FormControl"}>
                        <InputLabel id="resolution-select-label">Resolution</InputLabel>
                        <ResolutionSelector redraw={redraw}/>
                    </Box>
                    <Box className={"FormControl"}>
                        <InputLabel id="grid-size-slider">
                            Grid Size
                        </InputLabel>
                        <Slider min={25}
                                max={600}
                                step={25}
                                value={gridSize}
                                onChange={(_, value) => setGridSize(value)}
                                onChangeCommitted={handleGridSizeCommit}
                                getAriaValueText={pxLabel}
                                valueLabelDisplay="auto"
                                valueLabelFormat={pxLabel}
                                aria-labelledby="grid-size-slider"/>
                    </Box>
                    <Box className={"FormControl"}>
                        <InputLabel id="point-chance-slider">
                            Point Chance
                        </InputLabel>
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
                    </Box>
                    <Box className={"FormControl"}>
                        <Typography className="Details">Number of points: {points.length}</Typography>
                        <Typography className="Details">Number of triangles: {triangles.length}</Typography>
                    </Box>
                    <Box className={"FormControl"}>
                        <FormControlLabel
                            control={<Switch checked={pointSettings.visible} onChange={handleShowPointsChange}/>}
                            label="Show points"
                        />
                    </Box>
                </FormGroup>
            </CardContent>
            <CardActions>
                <Button onClick={redraw} startIcon={<RefreshIcon/>} color="secondary">Regenerate</Button>
                <Button onClick={download} startIcon={<GetAppIcon/>} color="primary">Download</Button>
            </CardActions>
        </Card>
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
    updateSettings,
    generateWallpaper,
    applyCurrentTheme,
    setTargetResolution
})(Controls);

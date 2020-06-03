import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {connect} from "react-redux";
import {
    applyCurrentTheme,
    generateWallpaper,
    setTargetResolution,
    updateSettings
} from "../redux/actions";
import {saveAs} from "file-saver";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import GetAppIcon from '@material-ui/icons/GetApp';
import RefreshIcon from '@material-ui/icons/Refresh';
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import {debounce} from "underscore";
import ImageThemeSource from "./ImageThemeSource";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

const KNOWN_RESOLUTIONS = [
    {
        ratio: "21:9", resolutions: [
            {width: 5120, height: 2160},
            {width: 3440, height: 1440},
            {width: 2560, height: 1080},
        ]
    },
    {
        ratio: "16:9", resolutions: [
            {width: 3840, height: 2160},
            {width: 2560, height: 1440},
            {width: 1920, height: 1080},
            {width: 1600, height: 900},
            {width: 1366, height: 768},
            {width: 1280, height: 720}]
    },
    {
        ratio: "16:10", resolutions: [
            {width: 2560, height: 1600},
            {width: 1920, height: 1200},
            {width: 1280, height: 800}]
    },
    {
        ratio: "4:3", resolutions: [
            {width: 1600, height: 1200},
            {width: 1024, height: 768}]
    }
];

const resolutionString = (width, height) => `${width}x${height}`;

function Controls({pointSettings, resolution, points, triangles, pixiApp, currentTheme, updateSettings, generateWallpaper, applyCurrentTheme, setTargetResolution}) {

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

    const resolutionOptions = KNOWN_RESOLUTIONS.map(({ratio, resolutions}, index) => {
        const options = resolutions.map(({width, height}) => {
            const xStr = resolutionString(width, height);
            return <option value={xStr} key={xStr}>{xStr}</option>;
        });

        return (<optgroup label={ratio} key={index}>
            {options}
        </optgroup>);
    });

return (
    <Box className="Controls">
        <FormGroup>
            <ImageThemeSource/>

            <Typography id="grid-size-slider" gutterBottom>
                Grid Size
            </Typography>
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
            <InputLabel id="resolution-select-label">Resolution</InputLabel>
            <Select native
                    labelId="resolution-select-label"
                    id="resolution-select"
                    value={resolution}
                    onChange={(event) => {
                        const [width, height] = event.target.value.split('x').map(val => parseInt(val, 10));
                        setTargetResolution(width, height);
                        redraw();
                    }}>
                {resolutionOptions}
            </Select>
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
                <Button onClick={redraw} startIcon={<RefreshIcon/>} color="secondary">Regenerate</Button>
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
        currentTheme: store.currentTheme,
        resolution: resolutionString(store.resolution.width, store.resolution.height)
    }
}

export default connect(mapStateToProps, {
    updateSettings,
    generateWallpaper,
    applyCurrentTheme,
    setTargetResolution
})(Controls);

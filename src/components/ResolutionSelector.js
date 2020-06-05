import React, {useEffect, useState} from 'react';
import Box from "@material-ui/core/Box";
import {connect} from "react-redux";
import Select from "@material-ui/core/Select";
import {setTargetResolution} from "../redux/actions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CheckIcon from '@material-ui/icons/Check';
import MenuItem from "@material-ui/core/MenuItem";
import ListSubheader from "@material-ui/core/ListSubheader";

const KNOWN_RESOLUTIONS = [
    {
        long: "21",
        short: "9",
        resolutions: [
            {width: 5120, height: 2160},
            {width: 3440, height: 1440},
            {width: 2560, height: 1080},
        ]
    },
    {
        long: "16",
        short: "9",
        resolutions: [
            {width: 3840, height: 2160},
            {width: 2560, height: 1440},
            {width: 1920, height: 1080},
            {width: 1600, height: 900},
            {width: 1366, height: 768},
            {width: 1280, height: 720}]
    },
    {
        long: "16",
        short: "10",
        resolutions: [
            {width: 2560, height: 1600},
            {width: 1920, height: 1200},
            {width: 1280, height: 800}]
    },
    {
        long: "4",
        short: "3",
        resolutions: [
            {width: 1600, height: 1200},
            {width: 1024, height: 768}]
    }
];

const resolutionString = (width, height) => `${width}x${height}`;

const resolutionOptions = KNOWN_RESOLUTIONS.map(({long, short, resolutions}, index) => {
    const options = resolutions.map(({width, height}) => {
        const xStr = resolutionString(width, height);
        return <MenuItem value={xStr} key={xStr}>{xStr}</MenuItem>;
    });
    options.unshift(<ListSubheader key={index}>{long}:{short}</ListSubheader>);
    return options
}).flat();
resolutionOptions.push(<MenuItem value="custom" key={"custom"}>Custom</MenuItem>)

function ResolutionSelector({redraw, resolution: {width, height}, setTargetResolution}) {

    const [customWidth, setCustomWidth] = useState(width);
    const [customHeight, setCustomHeight] = useState(height);
    const [isCustomResolution, setIsCustomResolution] = useState(!KNOWN_RESOLUTIONS.find(group => group.resolutions.find(res => res.width === width && res.height === height)));
    const customResolutionHasChanged = width !== customWidth || height !== customHeight;

    useEffect(() => {
        setIsCustomResolution(!KNOWN_RESOLUTIONS.find(group => group.resolutions.find(res => res.width === width && res.height === height)))
        setCustomWidth(width);
        setCustomHeight(height);
    }, [width, height]);

    const dimensionChangeHandler = (setter) => event => {
        const sanitized = event.target.value.replace(/\D/gi, '');
        const numeric = parseInt(sanitized, 10)
        setter(isNaN(numeric) ? '' : numeric);
    }

    return (
        <Box>
            <Grid item className="ControlFormItem" >
                <Select className="FullWidth"
                        labelId="resolution-select-label"
                        id="resolution-select"
                        value={isCustomResolution ? "custom" : resolutionString(width, height)}
                        onChange={(event) => {
                            if (event.target.value === "custom") {
                                setIsCustomResolution(true);
                            } else {
                                setIsCustomResolution(false);
                                const [width, height] = event.target.value.split('x').map(val => parseInt(val, 10));
                                setTargetResolution(width, height);
                                redraw();
                            }
                        }}>
                    {resolutionOptions}
                </Select>
            </Grid>
            {isCustomResolution && (
                <Grid container spacing={1} className="ControlFormItem" alignItems="center">
                    <Grid item xs={4}>
                        <TextField id="" label="Width" value={customWidth} onChange={dimensionChangeHandler(setCustomWidth)}/>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="" label="Height" value={customHeight} onChange={dimensionChangeHandler(setCustomHeight)}/>
                    </Grid>
                    <Grid item>
                        <Button startIcon={<CheckIcon/>} disabled={!customResolutionHasChanged} onClick={() => {
                            if (customResolutionHasChanged) {
                                setTargetResolution(customWidth, customHeight);
                                redraw();
                            }
                        }}>Apply</Button>
                    </Grid>
                </Grid>)}
        </Box>
    );
}

const mapStateToProps = (store) => ({
    resolution: store.resolution
})

export default connect(mapStateToProps, {setTargetResolution})(ResolutionSelector)
import React, {useCallback, useEffect, useState} from 'react';
import Box from "@material-ui/core/Box";
import {connect} from "react-redux";
import {addImageTheme, applyCurrentTheme, loadImageTheme, setTheme} from "../redux/actions";
import {useDropzone} from "react-dropzone";

function ImageThemeSource(props) {

    const {loadImageTheme, setTheme, applyCurrentTheme, addImageTheme} = props;

    const [newThemeName, setNewThemeName] = useState(props.currentTheme);
    const [imageSource, setImageSource] = useState(props.source);
    useEffect(() => {
        setImageSource(props.source);
        setNewThemeName(props.currentTheme);
    }, [props.source, props.currentTheme]);

    const imageLoaded = (event) => {
        const img = event.target;
        const canvas = document.createElement("canvas");
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        canvas.width = width;
        canvas.height = height
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const textureData = ctx.getImageData(0, 0, width, height).data;
        loadImageTheme(newThemeName, textureData, width, height)
        setTheme(newThemeName)
        applyCurrentTheme()
    }

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();
        const themeName = `img-${acceptedFiles[0].name}`;
        reader.onload = (event) => {
            setImageSource(event.target.result);
            setNewThemeName(themeName)
            addImageTheme(themeName, event.target.result)
        }
        reader.readAsDataURL(acceptedFiles[0]);

    }, [addImageTheme])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <Box {...getRootProps()} className={isDragActive ? 'ImageDrop Active' : 'ImageDrop Inactive'}>
            <input {...getInputProps()} />
            <img src={imageSource} onLoad={imageLoaded} alt="Source for wallpaper generation" className={"SourceImage"}/>
        </Box>
    );
}

const mapStateToProps = (store) => ({
    source: store.themes[store.currentTheme].source,
    themes: store.themes,
    currentTheme: store.currentTheme
})

export default connect(mapStateToProps, {addImageTheme, loadImageTheme, applyCurrentTheme, setTheme})(ImageThemeSource)
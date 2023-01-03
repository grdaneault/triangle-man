import React, {useCallback, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
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
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const textureData = ctx.getImageData(0, 0, width, height).data;
        loadImageTheme(newThemeName, textureData, width, height);
        setTheme(newThemeName);
        applyCurrentTheme();
    }

    // Drop zone for supplying a new image
    const handleNewImageFile = useCallback(acceptedFiles => {
        const reader = new FileReader();
        const themeName = `img-${acceptedFiles[0].name}`;
        reader.onload = (event) => {
            setImageSource(event.target.result);
            setNewThemeName(themeName);
            addImageTheme(themeName, event.target.result);
        }
        reader.readAsDataURL(acceptedFiles[0]);

    }, [addImageTheme]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: handleNewImageFile});

    // Global paste for supplying a new image
    useEffect(() => {
        const handlePaste = (event) => {
            const items = event.clipboardData.items;
            if (!items) {
                return;
            }
            for (let i = 0; i < items.length; i++) {
                const imageFile = items[i];
                if (imageFile.type.indexOf("image") !== -1) {
                    console.log("Found image file", imageFile)
                    handleNewImageFile([imageFile.getAsFile()]);
                }
            }
        }

        window.addEventListener("paste", handlePaste);

        return () => window.removeEventListener("paste", handlePaste);
    }, [handleNewImageFile]);

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
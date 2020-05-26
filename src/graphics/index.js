import DitheredLinearGradient from "./DitheredLinearGradientRGB";
import {Texture} from "pixi.js";
import chroma from "chroma-js";

export function loadImageTexture(filename) {
    return new Promise((resolve) => {
        console.log("Loading image texture for", filename)
        const texture = new Image();

        const renderImage = (img) => {
            console.log("image props", img.width, img.height, img);
            const canvas = document.createElement("canvas");
            const width = 1920;
            const height = 1080;
            canvas.width = width;
            canvas.height = height
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const textureData = ctx.getImageData(0, 0, width, height).data;
            resolve(textureData)
        }

        texture.onload = function () {
            renderImage(this);
        }

        texture.src = filename;
    });
}

export function createGradientTexture(from, to, size) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    let grd = new DitheredLinearGradient(0, 0, size, 0);
    grd.addColorStop(0, from);
    grd.addColorStop(1, to);
    grd.fillRect(ctx, 0, 0, size, size + 1);
    return Texture.from(c);
}

function calcBounds(points) {
    return points.reduce((acc, curr) => (
        {
            minX: Math.min(acc.minX, curr.x),
            maxX: Math.max(acc.maxX, curr.x),
            minY: Math.min(acc.minY, curr.y),
            maxY: Math.max(acc.maxY, curr.y)
        }), {
        minX: 0, maxX: 0, minY: 0, maxY: 0
    });
}

export function generateFillFunctionForImageTheme(theme, allPoints) {
    const bounds = calcBounds(allPoints);

    return (points) => {
        const center = [(points[0][0] + points[1][0] + points[2][0]) / 3, (points[0][1] + points[1][1] + points[2][1]) / 3];
        // points |     x                          |
        // img        |   x                        |
        const x = Math.round((center[0] - bounds.minX) / (bounds.maxX - bounds.minX) * theme.width);
        const y = Math.round((center[1] - bounds.minY) / (bounds.maxY - bounds.minY) * theme.height);

        // console.log(`Calculating fill for (${center[0]}, ${center[1]}) => (${x}, ${y})`)
        const index = (theme.width * y + x) * 4;
        const [r, g, b] = theme.data.slice(index, index + 4);
        const start = chroma(r, g, b)
        const end = start.darken(1);

        return createGradientTexture(start, end, 256)
    }
}
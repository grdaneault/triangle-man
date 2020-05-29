import {
    ADD_IMAGE_THEME,
    ADD_PALETTE_THEME,
    ADD_POINT,
    ADD_POINTS,
    COLOR_TRIANGLE,
    COLOR_TRIANGLES,
    DELETE_POINT,
    GENERATE_TRIANGLES,
    LOAD_IMAGE_THEME,
    REGISTER_APP,
    RESET,
    SET_POINT_POSITION,
    SET_TARGET_RESOLUTION,
    SET_THEME,
    UPDATE_POINT_SETTINGS,
    UPDATE_TRIANGLES
} from "./actionTypes";
import Triangulator from "../../Triangulator";
import {generateFillFunctionForImageTheme, loadImageTexture} from "../../graphics";
import sample from "../../img/sample1.jpg";

export const registerApp = (app) => ({
    type: REGISTER_APP,
    app
})

let currentPointId = 0;
export const reset = () => {
    currentPointId = 0;
    return {
        type: RESET
    }
}

export const addPoints = (points) => {
    points.forEach(point => {
        point.id = ++currentPointId
    });
    return {
        type: ADD_POINTS,
        points
    }
}

export const addPointsAndGenerateTriangles = (points) => (dispatch) => {
    dispatch(reset())
    dispatch(addPoints(points));
    dispatch(generateTriangles())
    const delaunayPoints = points.map((point) => [point.x, point.y])
    const triangulator = new Triangulator(delaunayPoints)
    const newTriangles = [];
    triangulator.forEachTriangle((index, triangle) => {
        newTriangles.push({
            id: index,
            ...triangle
        });
    })
    dispatch(updateTriangles(newTriangles))
}

export const addPoint = (x, y) => ({
    type: ADD_POINT,
    id: ++currentPointId,
    x, y
})

export const setPointPosition = (id, oldX, oldY, newX, newY, recalculateTriangles = false) => ({
    type: SET_POINT_POSITION,
    id, oldX, oldY, newX, newY, recalculateTriangles
})


export const deletePoint = (id) => ({
    type: DELETE_POINT,
    id
})

export const generateTriangles = () => ({
    type: GENERATE_TRIANGLES
})

export const updateTriangles = (triangles) => ({
    type: UPDATE_TRIANGLES,
    triangles
})

export const colorTriangle = (id, fill) => ({
    type: COLOR_TRIANGLE,
    id, fill
})

export const colorTriangles = (fills) => ({
    type: COLOR_TRIANGLES,
    fills
})

export const setTheme = (name) => ({
    type: SET_THEME,
    name
});

export const loadImageTheme = (themeName, file) => ({
    type: LOAD_IMAGE_THEME,
    themeName,
    file: file
})

export const addImageTheme = (name, data, width, height) => ({
    type: ADD_IMAGE_THEME,
    name, data, width, height
})

export const addPaletteTheme = (name, colors) => ({
    type: ADD_PALETTE_THEME,
    name, colors
})

export const applyImageTheme = (file) => (dispatch, getState) => {
    const themeName = `img-${file}`
    dispatch(loadImageTheme(themeName, file))
    dispatch(setTheme(themeName))

    loadImageTexture(file).then((data) => {
        const width = 1920;
        const height = 1080;
        dispatch(addImageTheme(themeName, data, width, height));

        const triangles = getState().triangles;
        const points = getState().points;
        const theme = getState().themes[themeName];

        const fillFunction = generateFillFunctionForImageTheme(theme, points);

        const fills = triangles.reduce((map, triangle) => {
            map[triangle.id] = fillFunction(triangle.points)
            return map;
        }, {});

        dispatch(colorTriangles(fills));
    })
}

export const updateSettings = (newSettings) => ({
    type: UPDATE_POINT_SETTINGS,
    newSettings
});

export const setTargetResolution = (width, height) => ({
    type: SET_TARGET_RESOLUTION,
    width, height
})

function randomInRange(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

export const generateWallpaper = () => (dispatch, getState) => {
    const {resolution, pointSettings} = getState();
    const {gridSize, pointChance} = pointSettings;

    const rows = Math.ceil(resolution.height / gridSize),
        cols = Math.ceil(resolution.width / gridSize);

    console.log("Generating wallpaper", rows, cols, resolution, pointSettings);

    const points = []

    for (let row = -2; row < rows + 2; row += 1) {
        for (let col = -2; col < cols + 2; col += 1) {
            if (Math.random() < pointChance) {
                const x = col * gridSize + randomInRange(0, gridSize),
                    y = row * gridSize + randomInRange(0, gridSize);
                points.push({x, y})
            }
        }
    }


    // points.push({x: offsetX, y: offsetY});
    // points.push({x: offsetX + (2 * triHeight), y: offsetY});
    // points.push({x: offsetX + triHeight, y: offsetY + triHeight});

    // const offsetX = 200;
    // const offsetY = 200;
    // const triHeight = 600;
    //
    // points.push({x: offsetX, y: offsetY});
    // points.push({x: offsetX + triHeight, y: offsetY + triHeight});
    // // points.push({x: offsetX + triHeight, y: offsetY});
    // points.push({x: offsetX, y: offsetY + triHeight});

    addPointsAndGenerateTriangles(points)(dispatch);
    applyImageTheme(sample)(dispatch, getState);
}

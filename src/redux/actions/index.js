import {
    ADD_POINT,
    ADD_POINTS,
    COLOR_TRIANGLE,
    DELETE_POINT,
    RESET_POINTS,
    SET_POINT_POSITION,
    UPDATE_TRIANGLE_AESTHETIC,
    REGISTER_APP
} from './actionTypes'

let currentPointId = 0;
export const setPointPosition = (id, oldX, oldY, newX, newY, recalculateTriangles = false) => ({
    type: SET_POINT_POSITION,
    id, oldX, oldY, newX, newY, recalculateTriangles
})

export const addPoint = (x, y) => ({
    type: ADD_POINT,
    id: ++currentPointId,
    x, y
})

export const addPoints = (points) => {
    points.forEach(point => {
        point.id = ++currentPointId
    });
    return {
        type: ADD_POINTS,
        points
    }
}

export const deletePoint = (id) => ({
    type: DELETE_POINT,
    id
})

export const resetPoints = () => ({
    type: RESET_POINTS
})

export const colorTriangle = (id, fill) => ({
    type: COLOR_TRIANGLE,
    id, fill
})

export const updateTriangleAesthetic = (imageData, inputWidth, inputHeight) => ({
    type: UPDATE_TRIANGLE_AESTHETIC,
    imageData,
    inputWidth,
    inputHeight
})

export const registerApp = (app) => ({
    type: REGISTER_APP,
    app
})
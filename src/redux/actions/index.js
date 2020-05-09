import {ADD_POINT, ADD_POINTS, DELETE_POINT, RESET_POINTS, SET_POINT_POSITION} from './actionTypes'
let currentPointId = 0;
export const setPointPosition = (id, oldX, oldY, newX, newY, recalculateTriangles=false) => ({
    type: SET_POINT_POSITION,
    id, oldX, oldY, newX, newY, recalculateTriangles
})

export const addPoint = (x, y) => ({
    type: ADD_POINT,
    id: ++currentPointId,
    x, y
})

export const addPoints = (points) =>  {
    points.forEach(point => {point.id = ++currentPointId});
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
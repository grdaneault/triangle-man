import {ADD_TRIANGLES, COLOR_TRIANGLE} from "./actionTypes";

let currentTriangleId = 0;

export const colorTriangle = (id, fill) => ({
    type: COLOR_TRIANGLE,
    id, fill
})

export const addTriangles = (triangles) => {
    triangles.forEach(point => {point.id = ++currentTriangleId});
    return {
        type: ADD_TRIANGLES,
        triangles
    }
}

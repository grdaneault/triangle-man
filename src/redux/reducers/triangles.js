import {COLOR_TRIANGLE, COLOR_TRIANGLES, RESET, SET_POINT_POSITION, UPDATE_TRIANGLES} from '../actions/actionTypes'
import {createTriangle} from "../../Triangulator";

function triangles(state = [], action) {
    switch (action.type) {
        case COLOR_TRIANGLE:
            return state.map((triangle) => {
                if (triangle.id === action.id) {
                    return Object.assign({}, triangle, {fill: action.fill});
                }
                return triangle;
            });
        case COLOR_TRIANGLES:
            return state.map((triangle) => {
                const fill = action.fills[triangle.id];
                console.assert(fill, 'Triangle missing a fill!', triangle, action.fills);
                return {...triangle, fill}
            })
        case SET_POINT_POSITION:
            // console.log("updating point in state", action);
            return state.map((triangle) => {
                const newPoints = [];
                if (triangle.points[0].x === action.oldX && triangle.points[0].y === action.oldY) {
                    newPoints.push({x: action.newX, y: action.newY});
                    newPoints.push(triangle.points[1]);
                    newPoints.push(triangle.points[2]);
                } else if (triangle.points[1].x === action.oldX && triangle.points[1].y === action.oldY) {
                    newPoints.push(triangle.points[0]);
                    newPoints.push({x: action.newX, y: action.newY});
                    newPoints.push(triangle.points[2]);
                } else if (triangle.points[2].x === action.oldX && triangle.points[2].y === action.oldY) {
                    newPoints.push(triangle.points[0]);
                    newPoints.push(triangle.points[1]);
                    newPoints.push({x: action.newX, y: action.newY});
                }

                if (newPoints.length === 3) {
                    return Object.assign({}, triangle, createTriangle(newPoints));
                } else {
                    return triangle
                }
            });
        case UPDATE_TRIANGLES:
            return action.triangles;
        case RESET:
            return [];
        default:
            return state;
    }
}


export default triangles


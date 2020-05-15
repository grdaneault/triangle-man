import {ADD_POINTS, COLOR_TRIANGLE, RESET_POINTS, SET_POINT_POSITION} from '../actions/actionTypes'
import Triangulator, {createTriangle} from "../../Triangulator";
import sample1 from '../../img/sample1.jpg'

function triangles(state = [], action, points) {
    switch (action.type) {
        case COLOR_TRIANGLE:
            return state.map((triangle) => {
                if (triangle.id === action.id) {
                    return Object.assign({}, triangle, {fill: action.fill});
                }
                return triangle;
            });
        case SET_POINT_POSITION:
            console.log("updating point in state", action);
            return state.map((triangle) => {
                const newPoints = [];
                if (triangle.points[0][0] === action.oldX && triangle.points[0][1] === action.oldY) {
                    newPoints.push([action.newX, action.newY]);
                    newPoints.push([...triangle.points[1]]);
                    newPoints.push([...triangle.points[2]]);
                } else if (triangle.points[1][0] === action.oldX && triangle.points[1][1] === action.oldY) {
                    newPoints.push([...triangle.points[0]]);
                    newPoints.push([action.newX, action.newY]);
                    newPoints.push([...triangle.points[2]]);
                } else if (triangle.points[2][0] === action.oldX && triangle.points[2][1] === action.oldY) {
                    newPoints.push([...triangle.points[0]]);
                    newPoints.push([...triangle.points[1]]);
                    newPoints.push([action.newX, action.newY]);
                }

                if (newPoints.length === 3) {
                    console.log(newPoints)
                    return Object.assign({}, triangle, createTriangle(newPoints));
                } else {
                    return triangle
                }
            });
        case ADD_POINTS:
            console.log("add points for triangle", typeof points, points)
            const delaunayPoints = points.map((point) => [point.x, point.y])
            const triangulator = new Triangulator(delaunayPoints, sample1, 1920, 1080)
            const newTriangles = [];
            triangulator.forEachTriangle((index, triangle) => {
                newTriangles.push({
                    id: index,
                    ...triangle
                })
            })
            console.log("generated triangles", newTriangles)
            console.log(typeof sample1, sample1)
            return newTriangles;

        case RESET_POINTS:
            console.log("Resetting points list");
            return [];
        default:
            return state;
    }
}

export default triangles


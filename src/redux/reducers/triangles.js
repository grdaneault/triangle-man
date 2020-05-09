import {ADD_POINTS, COLOR_TRIANGLE, RESET_POINTS, SET_POINT_POSITION} from '../actions/actionTypes'
import Triangulator from "../../Triangulator";


const colors = [0x414141, 0x6b7478, 0xcfd9ce, 0x7c8e51, 0x384d47];

/*

        0
       /|\
      c B a
     /  |  \
    2---b---1

 */

/**
 *
 * @param points
 */
const calculateSideLengths = (points) => {
    const a = distance(points[0], points[1])
    const b = distance(points[1], points[2])
    const c = distance(points[2], points[0])
    return [a, b, c]
}

const calculateSemiperimeter = (lengths) => {
    return lengths.reduce((a, b) => a + b, 0) / 2;
}

const calculateArea = (lengths) => {
    const s = calculateSemiperimeter(lengths);
    return Math.sqrt(s * (s - lengths[0]) * (s - lengths[1]) * (s - lengths[2]))
}

const calcualteAltitudes = (lengths) => {
    const area = calculateArea(lengths);
    return lengths.map(length => 2 * area / length)
}

const distance = (a, b) => {
    return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2));
}

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
                    const sides = calculateSideLengths(newPoints);
                    return Object.assign({}, triangle, {
                        points: newPoints,
                        sideLengths: sides,
                        altitudes: calcualteAltitudes(sides),
                    });
                } else {
                    return triangle
                }
            });
        case ADD_POINTS:
            console.log("add points for triangle", typeof points, points)
            const delaunayPoints = points.map((point) => [point.x, point.y])
            const triangulator = new Triangulator(delaunayPoints)
            const newTriangles = [];
            triangulator.forEachTriangle((index, points) => {
                const sides = calculateSideLengths(points);
                newTriangles.push({
                    id: index,
                    points: points,
                    fill: colors[index % colors.length],
                    sideLengths: sides,
                    altitudes: calcualteAltitudes(sides)
                })
            })
            console.log("generated triangles", newTriangles)
            return newTriangles;

        case RESET_POINTS:
            console.log("Resetting points list");
            return [];
        default:
            return state;
    }
}

export default triangles


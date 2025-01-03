import Delaunator from "delaunator";

class Triangulator {
    constructor(points) {
        this.points = points;
        this.delaunay = Delaunator.from(points, p => p.x, p => p.y);
    }

    edgesOfTriangle(t) {
        return [3 * t, 3 * t + 1, 3 * t + 2];
    }

    pointsOfTriangle(t) {
        return this.edgesOfTriangle(t)
            .map(e => this.delaunay.triangles[e]);
    }

    forEachTriangle(callback) {
        for (let t = 0; t < this.delaunay.triangles.length / 3; t++) {
            const points = this.pointsOfTriangle(t).map(p => this.points[p]);
            callback(t, {...createTriangle(points)});
        }
    }


}

export default Triangulator

export const greens = ["#1E5631", "#A4DE02", "#76BA1B", "#4C9A2A", "#ACDF87", "#68BB59"]


/**
 * @param lengths side lengths of the triangle
 */
const calculateSemiperimeter = (lengths) => {
    return lengths.reduce((a, b) => a + b, 0) / 2;
}
/**
 * Calculate the area of a triangle using the lengths of each side
 *
 * @param lengths array of the lengths of the sides of the triangle
 * @returns {number}
 */
const calculateArea = (lengths) => {
    const s = calculateSemiperimeter(lengths);
    return Math.sqrt(s * (s - lengths[0]) * (s - lengths[1]) * (s - lengths[2]))
}

/**
 * Calculate the distance between two points
 *
 * @param a {{x: number, y: number}} first point
 * @param b {{x: number, y: number}} second point {x, y}
 * @returns {number}
 */
const distance = (a, b) => {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * Calculate the lengths of each side of the triangle
 *
 * @param points {[{x: number, y: number}, {x: number, y: number}, {x: number, y: number}]}
 * @returns {[number, number, number]}
 */
const calculateSideLengths = (points) => {
    const a = distance(points[0], points[1])
    const b = distance(points[1], points[2])
    const c = distance(points[2], points[0])
    return [a, b, c]
}

/**
 * Calculate the altitudes of the triangle (heights as seen from each side)
 *
 * @param lengths
 * @returns {[number, number, number]}
 */
const calculateAltitudes = (lengths) => {
    const area = calculateArea(lengths);
    return lengths.map(length => 2 * area / length)
}

/**
 * Calculate the important properties of a triangle given its points
 *
 *       0
 *      /|\
 *     c B a
 *    /  |  \
 *   2---b---1
 *
 * @param points {[{x: number, y: number}, {x: number, y: number}, {x: number, y: number}]}
 * @returns {{altitudes: number[], sideLengths: number[], points: *}}
 */
export const createTriangle = (points) => {
    const sideLengths = calculateSideLengths(points);
    const altitudes = calculateAltitudes(sideLengths)

    return {
        points,
        sideLengths,
        altitudes
    }
}



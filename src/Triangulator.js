import Delaunator from "delaunator";
import React from "react";
import Triangle from "./components/Triangle";

class Triangulator
{
    constructor(points, colors) {
        this.points = points;
        this.delaunay = Delaunator.from(points);
        this.colors = colors;
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
            callback(t, this.pointsOfTriangle(t).map(p => this.points[p]));
        }
    }

    triangles() {
        const triangles = [];
        this.forEachTriangle((t, points) => {
            triangles.push(<Triangle points={points} fill={this.colors[t % this.colors.length]} key={`${points[0][0]}-${points[0][1]}--${points[1][0]}-${points[1][1]}--${points[2][0]}-${points[2][1]}`}/>);
        });
        return triangles;
    }
}

export default Triangulator
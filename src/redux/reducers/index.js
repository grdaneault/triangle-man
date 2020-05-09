import {combineReducers} from 'redux'
import points from "./points";
import triangles from "./triangles";

const shapeData = (state = {
    points: [],
    triangles: []
}, action) => {
    const p = points(state.points, action)
    const t = triangles(state.triangles, action, p)

    return  {
        points: p,
        triangles: t
    }
}

export default combineReducers({shapeData});
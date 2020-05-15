import {combineReducers} from 'redux'
import points from "./points";
import triangles from "./triangles";
import aesthetic from "./aesthetic";

const shapeData = (state = {
    points: [],
    triangles: []
}, action) => {
    const p = points(state.points, action)
    const t = triangles(state.triangles, action, p)
    const a = aesthetic(state.aesthetic, action, p);

    return  {
        points: p,
        triangles: t,
        aesthetic: a
    }
}

export default combineReducers({shapeData});
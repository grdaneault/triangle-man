import {ADD_POINT, RESET_POINTS, DELETE_POINT, SET_POINT_POSITION, ADD_POINTS} from '../actions/actionTypes'

function points(state = [], action) {
    switch (action.type) {
        case ADD_POINT:
            return [...state, {id: action.id, x: action.x, y: action.y}];
        case ADD_POINTS:
            return [...state, ...action.points];
        case DELETE_POINT:
            console.log("removing point from state", action);
            return state.filter((point) => {
                return point.id !== action.id;
            });
        case SET_POINT_POSITION:
            console.log(`updating point ${action.id}: (${action.oldX}, ${action.oldY}) -> (${action.newX}, ${action.newY})`);
            return state.map((point) => {
                if (point.id === action.id) {
                    return Object.assign({}, point, {x: action.newX, y:action.newY});
                }
                return point;
            });
        case RESET_POINTS:
            console.log("Resetting points list");
            return [];
        default:
            return state;
    }
}

export default points


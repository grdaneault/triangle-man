import {ADD_POINT, ADD_POINTS, DELETE_POINT, RESET, SET_POINT_POSITION} from '../actions/actionTypes'

function points(state = [], action) {
    switch (action.type) {
        case ADD_POINT:
            return [...state, {id: action.id, x: action.x, y: action.y}];
        case ADD_POINTS:
            return [...state, ...action.points];
        case DELETE_POINT:
            return state.filter((point) => {
                return point.id !== action.id;
            });
        case SET_POINT_POSITION:
            return state.map((point) => {
                if (point.id === action.id) {
                    return {...point, ...{x: action.newX, y: action.newY}};
                }
                return point;
            });
        case RESET:
            return [];
        default:
            return state;
    }
}

export default points


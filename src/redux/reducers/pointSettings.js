import {SET_TARGET_RESOLUTION, UPDATE_POINT_SETTINGS} from '../actions/actionTypes'

export default function pointSettings(state = {
    gridSize: 250,
    pointChance: 1,
    visible: false
}, action) {
    switch (action.type) {
        case UPDATE_POINT_SETTINGS:
            return {...state, ...action.newSettings}
        default:
            return state;
    }
}

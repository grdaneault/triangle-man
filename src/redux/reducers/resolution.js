import {SET_TARGET_RESOLUTION} from '../actions/actionTypes'

export default function resolution(state = {
    width: 3840,
    height: 2160
}, action) {
    switch (action.type) {
        case SET_TARGET_RESOLUTION:
            return {width: action.width, height: action.height}
        default:
            return state;
    }
}

import {SET_THEME} from '../actions/actionTypes'

function currentTheme(state = "default", action) {
    switch (action.type) {
        case SET_THEME:
            return action.name
        default:
            return state;
    }
}

export default currentTheme
import {REGISTER_APP} from '../actions/actionTypes'

function pixiApp(state = null, action) {
    switch (action.type) {
        case REGISTER_APP:
            return action.app;
        default:
            return state;
    }
}

export default pixiApp


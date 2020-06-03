import {COLOR_TRIANGLES, GENERATE_TRIANGLES, RESET, UPDATE_TRIANGLES} from '../actions/actionTypes'

export const READY = 'Done';

function renderState(state = RESET, action) {
    switch (action.type) {
        case RESET:
            return 'Generating Points';
        case GENERATE_TRIANGLES:
            return 'Generating Triangles';
        case UPDATE_TRIANGLES:
            return 'Generating Gradients'
        case COLOR_TRIANGLES:
            return READY;
        default:
            return state;
    }
}

export default renderState
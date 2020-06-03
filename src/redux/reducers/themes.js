import {ADD_IMAGE_THEME, ADD_PALETTE_THEME, LOAD_IMAGE_THEME} from '../actions/actionTypes'


function themes(state = {
    default: {
        type: 'palette',
        data: ['#AFDF00', '#FFFFFF']
    }
}, action) {
    switch (action.type) {
        case ADD_PALETTE_THEME:
            return {
                ...state, ...{
                    [action.name]: {
                        type: 'palette',
                        colors: action.colors
                    }
                }
            }
        case LOAD_IMAGE_THEME:
            return {
                ...state, ...{
                    [action.name]: {
                        ...state[action.name],
                        data: action.data,
                        width: action.width,
                        height: action.height,
                    }
                }
            }
        case ADD_IMAGE_THEME:
            return {
                ...state, ...{
                    [action.name]: {
                        type: 'image',
                        data: action.data,
                        width: action.width,
                        height: action.height,
                        source: action.source
                    }
                }
            }
        default:
            return state;
    }
}

export default themes

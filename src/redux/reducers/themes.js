import {ADD_IMAGE_THEME, ADD_PALETTE_THEME} from '../actions/actionTypes'


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
        case ADD_IMAGE_THEME:
            return {
                ...state, ...{
                    [action.name]: {
                        type: 'image',
                        data: action.data,
                        width: action.width,
                        height: action.height
                    }
                }
            }
        default:
            return state;
    }
}

const calcBounds = (points) => {
    return points.reduce((acc, curr) => (
        {
            minX: Math.min(acc.minX, curr.x),
            maxX: Math.max(acc.maxX, curr.x),
            minY: Math.min(acc.minY, curr.y),
            maxY: Math.max(acc.maxY, curr.y)
        }), {
        minX: 0, maxX: 0, minY: 0, maxY: 0
    });
}

export default themes

import {ADD_POINTS, UPDATE_TRIANGLE_AESTHETIC} from '../actions/actionTypes'

function aesthetic(state = {
    data: [],
    overrides: [],
    sourceDimensions: {
        width: 0,
        height: 0
    },
    pointDimensions: {
        minX: 0, maxX: 0,
        minY: 0, maxY: 0
    }
}, action, points) {
    switch (action.type) {
        case UPDATE_TRIANGLE_AESTHETIC:
            console.log("Update aesthetic", action, points)
            return {
                data: action.imageData,
                overrides: [],
                sourceDimensions: {
                    width: action.inputWidth,
                    height: action.inputHeight
                },
                pointDimensions: calcBounds(points)
            };

        case ADD_POINTS:
            return {
                data: [...state.data],
                overrides: [],
                sourceDimensions: {...state.sourceDimensions},
                pointDimensions: calcBounds(points)
            };
        default:
            return state;
    }
}

const calcBounds = (points) => {
    console.log("Calcing bounds of ", points)
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

export default aesthetic

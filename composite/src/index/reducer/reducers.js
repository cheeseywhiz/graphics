import {
    types, defaultMatrix, operationNames, defaultGeometry, shapeNames,
} from '../actions.js';

export function matrix(state = defaultMatrix, {type, matrix}) {
    switch (type) {
        case types.SET_MATRIX:
            return {...state, ...matrix};
        case types.UPDATE_OPERATION:
        case types.STACK_PUSH:
        case types.RESET_MATRIX:
            return defaultMatrix;
        default:
            return state;
    }
}

export function operation(state = operationNames.DEFAULT, {type, operationName}) {
    switch (type) {
        case types.UPDATE_OPERATION:
            return operationName;
        default:
            return state;
    }
}

export function geometry(state = defaultGeometry, {type, value}) {
    switch (type) {
        case types.TOGGLE_GEOMETRY:
            return {...state, [value]: !state[value]};
        default:
            return state;
    }
}

export function shape(state = shapeNames.NONE, {type, shapeName}) {
    switch (type) {
        case types.UPDATE_SHAPE:
            return shapeName;
        default:
            return state;
    }
}

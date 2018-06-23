import {types, operationNames, shapeNames, } from '../actions.js';

const defaultMatrix = {
    xi: 1, yi: 0, ox: 0,
    xj: 0, yj: 1, oy: 0,
    number: '',
};

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

const defaultGeometry = {
    globals: false,
    locals: false,
    frames: true,
    intermediateHelpers: false,
}

export function geometry(state = defaultGeometry, {type, value}) {
    switch (type) {
        case types.TOGGLE_GEOMETRY:
            return {...state, [value]: !state[value]};
        default:
            return state;
    }
}

export function shape(state = shapeNames.DEFAULT, {type, shapeName}) {
    switch (type) {
        case types.UPDATE_SHAPE:
            return shapeName;
        default:
            return state;
    }
}

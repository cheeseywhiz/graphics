import {combineReducers, } from 'redux';
import * as actions from './actions.js';
import * as InputMatrices from './components/input-matrices.js';

function number(state = '', action) {
    switch (action.type) {
        case actions.types.UPDATE_NUMBER:
            return action.number;
        default:
            return state;
    }
}

const identityMatrix = {
    xi: 1, yi: 0, ox: 0,
    xj: 0, yj: 1, oy: 0,
}

function matrix(state = identityMatrix, action) {
    switch (action.type) {
        case actions.types.UPDATE_MATRIX: {
            const newState = {...state};
            newState[action.key] = action.value;
            return newState;
        };
        case actions.types.SET_MATRIX:
            return action.matrix;
        default:
            return state;
    }
}

function value(state = '0', action) {
    switch (action.type) {
        case actions.types.UPDATE_VALUE:
            return action.value;
        default:
            return state;
    }
}

function type(state = InputMatrices.DefaultMatrix, action) {
    switch (action.type) {
        case actions.types.UPDATE_VALUE:
            return {
                '0': InputMatrices.DefaultMatrix,
                '1': InputMatrices.RotationMatrix,
                '2': InputMatrices.ScaleMatrix,
                '3': InputMatrices.TranslationMatrix,
                '4': InputMatrices.ManualMatrix,
            }[action.value];
        default:
            return state;
    }
}

const reducer = combineReducers({number, matrix, value, type, });
export default reducer;

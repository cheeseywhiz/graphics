import {combineReducers, } from 'redux';
import * as actions from './actions.js';

function number(state = 0, action) {
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
        }
        default:
            return state;
    }
}

const reducer = combineReducers({number, matrix, });
export default reducer;

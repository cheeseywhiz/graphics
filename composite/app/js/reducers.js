import {combineReducers, } from 'redux';
import * as THREE from 'three';
import * as actions from './actions.js';
import * as InputMatrices from './components/input-matrices.js';

function number(state = '', action) {
    switch (action.type) {
        case actions.types.UPDATE_NUMBER:
            return action.number;
        case actions.types.RESET_MATRIX:
        case actions.types.UPDATE_VALUE:
            return '';
        default:
            return state;
    }
}

function setFrame(newState) {
    newState.frame = new THREE.Matrix4().set(
        newState.xi || 1, newState.yi || 0, 0, newState.ox || 0,
        newState.xj || 0, newState.yj || 1, 0, newState.oy || 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    );
    return newState;
}

const identityMatrix = {
    xi: 1, yi: 0, ox: 0,
    xj: 0, yj: 1, oy: 0,
}

const matrixState = {
    ...identityMatrix,
    frame: new THREE.Matrix4().identity(),
}

function matrix(state = matrixState, action) {
    switch (action.type) {
        case actions.types.SET_MATRIX:
            return setFrame({...state, ...action.matrix});
        case actions.types.RESET_MATRIX:
        case actions.types.UPDATE_VALUE:
            return setFrame({...state, ...identityMatrix});
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

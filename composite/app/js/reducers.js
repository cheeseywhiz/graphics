import * as THREE from 'three';
import * as actions from './actions.js';
import * as InputMatrices from './components/input-matrices.js';

const defaultState = {
    matrix: {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
        number: '',
    },
    frame: new THREE.Matrix4().identity(),
    value: '0',
    type: InputMatrices.DefaultMatrix,
    stack: [],
};

function stackPush(state) {
    const stack = [...state.stack];
    stack.push(state);
    return resetMatrix({...state, stack});
}

function stackPop(state) {
    const stack = state.stack;
    const length = stack.length;

    if (length) {
        return stack[length - 1];
    } else {
        return state;
    }
}

function stackClear(newState) {
    const {stack} = defaultState;
    return Object.assign(newState, {stack});
}

function resetMatrix(newState) {
    const {matrix, frame} = defaultState;
    return Object.assign(newState, {matrix, frame});
}

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case actions.types.UPDATE_VALUE: {
            const value = action.value;
            const type = {
                '0': InputMatrices.DefaultMatrix,
                '1': InputMatrices.RotationMatrix,
                '2': InputMatrices.ScaleMatrix,
                '3': InputMatrices.TranslationMatrix,
                '4': InputMatrices.ManualMatrix,
            }[value];
            return resetMatrix({...state, value, type});
        };
        case actions.types.SET_MATRIX: {
            const matrix = {...state.matrix, ...action.matrix};
            const frame = new THREE.Matrix4().set(
                matrix.xi || 1, matrix.yi || 0, 0, matrix.ox || 0,
                matrix.xj || 0, matrix.yj || 1, 0, matrix.oy || 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            );
            return {...state, frame, matrix};
        };
        case actions.types.STACK_PUSH:
            return stackPush(state);
        case actions.types.STACK_POP:
            return stackPop(state);
        case actions.types.STACK_CLEAR:
            return stackClear({...state});
        case actions.types.RESET_MATRIX:
            return resetMatrix({...state});
        default:
            return state;
    }
}

import * as THREE from 'three';
import * as actions from './actions.js';
import * as InputMatrices from './components/input-matrices.js';

const identityFrame = new THREE.Matrix4().identity();
const defaultState = {
    matrix: {
        xi: 1, yi: 0, ox: 0,
        xj: 0, yj: 1, oy: 0,
        number: '',
    },
    frame: identityFrame,
    value: '0',
    type: InputMatrices.DefaultMatrix,
    intermediates: [identityFrame],
    stack: [],
};

function updateIntermediates(newState) {
    const intermediates = [...newState.intermediates];
    const updateIndex = newState.stack.length + 1;
    const lastFrame = intermediates[updateIndex - 1];

    if (identityFrame.equals(newState.frame)) {
        if (intermediates[updateIndex]) {
            intermediates.pop();
        }
    } else {
        intermediates[updateIndex] = new THREE.Matrix4().multiplyMatrices(newState.frame, lastFrame);
    }

    return Object.assign(newState, {intermediates});
}

function stackPush(state) {
    if (identityFrame.equals(state.frame)) return state;
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
    const {stack, intermediates} = defaultState;
    return Object.assign(newState, {stack, intermediates});
}

function resetMatrix(newState) {
    const {matrix, frame} = defaultState;
    Object.assign(newState, {matrix, frame});
    return updateIntermediates(newState);
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
            return updateIntermediates({...state, frame, matrix});
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

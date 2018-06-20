import * as THREE from 'three';
import {createSelector, } from 'reselect';

const identityFrame = new THREE.Matrix4().identity();

const selectMatrix = (state) => state.stack.matrix;
const selectOperation = (state) => state.stack.operation;
const selectOrder = (state) => state.order;
const selectShape = (state) => state.shape;

export function matrixToFrame({xi, yi, ox, xj, yj, oy}) {
    return new THREE.Matrix4().set(
        xi || 1, yi || 0, 0, ox || 0,
        xj || 0, yj || 1, 0, oy || 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    );
}

const selectFrame = createSelector(selectMatrix, matrixToFrame);
const selectStack = createSelector(
    (state) => state.stack.stack,
    (stack) => (
        stack.filter(({matrix}) => (
            !identityFrame.equals(matrixToFrame(matrix))
        ))
    ),
);
const selectStackFrames = createSelector(
    selectStack, selectFrame,
    (stack, frame) => {
        const stackFrames = stack.map(({matrix}) => matrixToFrame(matrix));
        if (!identityFrame.equals(frame)) stackFrames.push(frame);
        return stackFrames;
    },
);
const selectGlobals = createSelector(
    selectStackFrames,
    (stackFrames) => {
        const reducer = (globals, currentValue) => {
            const newLength = globals.push(currentValue.clone());
            globals[newLength - 1].multiply(globals[newLength - 2]);
            return globals;
        };

        return stackFrames.reduce(reducer, [identityFrame]);
    },
);
const selectLocals = createSelector(
    selectStackFrames,
    (stackFrames) => {
        const reducer = (locals, currentValue) => {
            const newLength = locals.push(identityFrame.clone());
            locals[newLength - 1].multiplyMatrices(locals[newLength - 2], currentValue);
            return locals;
        }

        return stackFrames
            .reverse()
            .reduce(reducer, [identityFrame]);
    },
);
export function doSubscriptions(state) {
    const subscriptions = [...state.subscriptions.values()];
    subscriptions.forEach((selector) => selector(state));
}

const selectors = {
    matrix: selectMatrix,
    operation: selectOperation,
    order: selectOrder,
    shape: selectShape,
    stack: selectStack,
    frame: selectFrame,
    stackFrames: selectStackFrames,
    globals: selectGlobals,
    locals: selectLocals,
};
export default selectors;

export function selectAll(state) {
    const derived = {};
    Object.entries(selectors).forEach(([name, selector]) => {
        derived[name] = selector(state);
    });
    return derived;
}

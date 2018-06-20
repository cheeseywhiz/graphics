import * as THREE from 'three';
import {createSelector, } from 'reselect';

const identityFrame = new THREE.Matrix4().identity();

const selectMatrix = (state) => state.matrix;
const selectOperation = (state) => state.operation;
const selectOrder = (state) => state.order;

const selectFrame = createSelector(
    selectMatrix,
    (matrix) => (
        new THREE.Matrix4().set(
            matrix.xi || 1, matrix.yi || 0, 0, matrix.ox || 0,
            matrix.xj || 0, matrix.yj || 1, 0, matrix.oy || 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        )
    ),
);
const selectStack = createSelector(
    (state) => state.stack,
    (stack) => (
        stack.filter((state) => (
            !identityFrame.equals(selectFrame(state))
        ))
    ),
);
const selectStackFrames = createSelector(
    selectStack, selectFrame,
    (stack, frame) => {
        const stackFrames = stack.map(selectFrame);
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

import {createSelector, } from 'reselect';
import {entryOrders, } from '../../common/actions.js';
import Frame, {identityFrame, } from './Frame.js';

const selectMatrix = (state) => state.matrix;
const selectOperation = (state) => state.operation;
const selectGeometry = (state) => state.geometry;
const selectShape = (state) => state.shape;
const selectEntryOrder = (state) => state.entryOrder;

const selectNumber = createSelector(
    selectMatrix,
    (matrix) => matrix.number
);

const selectShapeSelection = createSelector(
    selectShape,
    (shape) => shape.selection
);

const selectShapeFname = createSelector(
    selectShape,
    (shape) => shape.fname
);

const selectFrame = createSelector(
    selectMatrix,
    ({xi, yi, ox, xj, yj, oy}) => new Frame().set(
        xi || 1, yi || 0, 0, ox || 0,
        xj || 0, yj || 1, 0, oy || 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
    )
);

// Only the stack field
const selectShortStack = createSelector(
    (state) => state.stack,
    (stack) => stack.filter((state) => (
        !selectFrame(state).isIdentity()
    ))
);

// The stack and the input matrix
const selectFullStack = createSelector(
    selectShortStack, selectMatrix, selectOperation, selectFrame,
    selectEntryOrder,
    (shortStack, matrix, operation, frame, entryOrder) => {
        const fullStack = [...shortStack];
        const newEntry = {matrix, operation, stack: shortStack};
        if (!frame.isIdentity()) fullStack.push(newEntry);
        if (entryOrder !== entryOrders.GLOBAL) fullStack.reverse();
        return fullStack;
    }
);

const selectGlobals = createSelector(
    selectFullStack,
    (fullStack) => {
        const reducer = (globals, currentValue) => {
            const newLength = globals.push(currentValue.clone());
            globals[newLength - 1].multiply(globals[newLength - 2]);
            return globals;
        };
        return fullStack
            .map(selectFrame)
            .reduce(reducer, [identityFrame]);
    }
);

const selectLocals = createSelector(
    selectFullStack,
    (fullStack) => {
        const reducer = (locals, currentValue) => {
            const newLength = locals.push(identityFrame.clone());
            locals[newLength - 1].multiplyMatrices(locals[newLength - 2], currentValue);
            return locals;
        };
        return fullStack
            .map(selectFrame)
            .reduceRight(reducer, [identityFrame]);
    }
);

const selectors = {
    matrix: selectMatrix,
    number: selectNumber,
    operation: selectOperation,
    geometry: selectGeometry,
    shape: selectShape,
    shapeSelection: selectShapeSelection,
    shapeFname: selectShapeFname,
    entryOrder: selectEntryOrder,
    frame: selectFrame,
    shortStack: selectShortStack,
    fullStack: selectFullStack,
    globals: selectGlobals,
    locals: selectLocals,
};

export default selectors;

export function logIntermediates(store) {
    const getIntermediates = createSelector(
        selectGeometry, selectGlobals, selectLocals,
        (geometry, globals, locals) => {
            const ret = {};
            if (geometry.globals) ret.globals = globals;
            if (geometry.locals) ret.locals = locals;
            return ret;
        }
    );
    return () => {
        Object.entries(getIntermediates(store.getState()))
            .forEach(([name, intermediates]) => {
                console.log(name);
                console.table(intermediates.map((frame) => frame.elements));
            });
    };
}

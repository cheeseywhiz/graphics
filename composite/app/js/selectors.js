import {createSelector, } from 'reselect';
import * as InputMatrices from './components/input-matrices.js';

const types = {
    '0': InputMatrices.DefaultMatrix,
    '1': InputMatrices.RotationMatrix,
    '2': InputMatrices.ScaleMatrix,
    '3': InputMatrices.TranslationMatrix,
    '4': InputMatrices.ManualMatrix,
};

const selectValue = (state) => state.value;
const selectMatrix = (state) => state.matrix;
const selectOrder = (state) => state.order;
const selectStack = (state) => state.stack;

const selectType = createSelector(selectValue, (value) => types[value]);

const selectors = {
    value: selectValue,
    matrix: selectMatrix,
    order: selectOrder,
    stack: selectStack,
    type: selectType,
};
export default selectors;

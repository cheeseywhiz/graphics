import {types, shapeNames, } from '../common/actions.js';

export const selection = (state = shapeNames.NONE, {type, selection}) => {
    switch (type) {
        case types.shape.UPDATE_SELECTION:
            return selection;
        default:
            return state;
    }
};

export const fname = (state = null, {type, fname}) => {
    switch (type) {
        case types.shape.UPDATE_FNAME:
            return fname;
        default:
            return state;
    }
};

export const data = (state = null, {type, data}) => {
    switch (type) {
        case types.shape.UPDATE_DATA:
            return data;
        default:
            return state;
    }
};

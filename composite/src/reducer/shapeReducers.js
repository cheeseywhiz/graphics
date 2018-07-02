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
        case types.shape.UPDATE_FILE:
            return fname;
        default:
            return state;
    }
};

export const data = (state = null, {type, data}) => {
    switch (type) {
        case types.shape.UPDATE_DATA:
        case types.shape.UPDATE_FILE:
            return data;
        default:
            return state;
    }
};

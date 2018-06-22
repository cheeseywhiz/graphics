import zip from '../common/zip.js';

const dictSlice = (dict) => (keys) => {
    const newDict = {};
    keys.forEach((key) => {
        newDict[key] = dict[key];
    });
    return newDict;
};

export default function mergeReducers(...reducers) {
    const defaults = reducers
        .map((reducer) => reducer(undefined, {type: undefined}));
    const defaultState = Object.assign({}, ...defaults);
    // Track which fields are controlled by each reducer, so that
    // Each reducer operates only on its own slice
    const fields = defaults.map(Object.keys);
    return (state = defaultState, action) => Object.assign(
        {},
        ...zip(reducers, fields.map(dictSlice(state)))
            .map(([reducer, stateSlice]) => reducer(stateSlice, action)),
    );
}

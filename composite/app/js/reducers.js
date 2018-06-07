import {combineReducers, } from 'redux';
import * as actions from './actions.js';

function number(state = 0, action) {
    switch (action.type) {
        case actions.types.UPDATE_NUMBER:
            return action.number;
        default:
            return state;
    }
}

const reducer = combineReducers({number});
export default reducer;

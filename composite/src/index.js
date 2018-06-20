import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, } from 'react-redux';
import {createStore, } from 'redux';
import * as reducers from './reducers.js';
import combineReducers from './combineReducers';
import {doSubscriptions, selectAll, } from './selectors.js';
import App from './index/App.js';

function main() {
    const store = createStore(
        combineReducers(reducers),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    store.subscribe(() => {
        console.log('store subscription');
        console.table(selectAll(store.getState()));
    });
    store.subscribe(() => doSubscriptions(store.getState()));
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app')
    );
}

main();

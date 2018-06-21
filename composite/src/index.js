import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, } from 'react-redux';
import {createStore, combineReducers, } from 'redux';
import * as reducers from './reducers.js';
import {doSubscriptions, selectAll, } from './selectors.js';
import App from './index/App.js';
import style from './composite.css';

function main() {
    console.table(style);
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

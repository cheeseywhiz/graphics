import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, } from 'react-redux';
import {createStore, combineReducers, } from 'redux';
import reducer from './reducer.js';
import {selectAll, } from './selectors.js';
import App from './index/App.js';

function main() {
    const store = createStore(
        reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    store.subscribe(() => {
        console.log('store subscription');
        console.table(selectAll(store.getState()));
    });
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app')
    );
}

main();

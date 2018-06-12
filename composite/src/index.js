import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, } from 'react-redux';
import {createStore, } from 'redux';
import * as reducers from './reducers.js';
import combineReducers from './combineReducers';
import {doSubscriptions, } from './selectors.js';
import App from './index/App.js';
import Graph from './index/Graph.js';

function main() {
    const store = createStore(combineReducers(reducers));
    store.subscribe(() => {
        console.log('store subscription');
        console.log(store.getState());
    });
    store.subscribe(() => doSubscriptions(store.getState()));
    ReactDOM.render(
        <div>
            <Provider store={store}>
                <App />
            </Provider>
            <div id='canvas-container'>
                <Graph store={store} />
            </div>
        </div>,
        document.getElementById('app')
    );
}

main();

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, } from 'react-redux';
import {createStore, } from 'redux';
import reducer from './reducers.js';
import selectors, {doSubscriptions, } from './selectors.js';
import App from './index/app.js';

function main() {
    const store = createStore(reducer);
    store.subscribe(() => doSubscriptions(store.getState()));
    selectors.subscribe(
        selectors.type,
        (type) => {
            console.log('selector subscription');
            console.log(type);
        },
    );
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app')
    );
}

main();

import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import {Provider, } from 'react-redux';
import {createStore, } from 'redux';
import reducer from './reducers.js';
import App from './components/app.js';

function main() {
    const identityFrame = new THREE.Matrix4().identity();
    const store = createStore(reducer);
    store.subscribe(function () {
        const reducer = function (intermediates, currentValue) {
            const last = intermediates.push(identityFrame.clone()) - 1;
            intermediates[last].multiplyMatrices(intermediates[last - 1], currentValue);
            return intermediates;
        };

        const state = store.getState();
        let stack = state.stack;

        if (identityFrame.equals(state.frame)) {
            stack = stack.slice(0);
        } else {
            stack = stack.concat([state]);
        }

        const intermediates = stack
            .map((state) => state.frame)
            .reverse()
            .reduce(reducer, [identityFrame]);

        // assert last elements equal
        console.log('global');
        console.table(state.intermediates.map((frame) => frame.elements));
        console.log('local');
        console.table(intermediates.map((frame) => frame.elements));
    });
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('app')
    );
}

main();

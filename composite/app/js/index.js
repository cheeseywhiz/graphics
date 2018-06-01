import React from 'react';
import ReactDOM from 'react-dom';

function addButton(id, tag, message, container) {
    document.getElementById(id).addEventListener('click', function (ev) {
        ReactDOM.render(
            React.createElement(tag, null, message),
            container
        );
    });
}


function main() {
    const message = 'Hello World!';
    const container = document.getElementById('container');
    addButton('XL', 'h1', message, container);
    addButton('L', 'h2', message, container);
    addButton('M', 'h3', message, container);
    addButton('S', 'h4', message, container);
    addButton('XS', 'h5', message, container);
    addButton('XXS', 'h6', message, container);
}

main();

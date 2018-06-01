import React from 'react';
import ReactDOM from 'react-dom';

class DefaultMatrix extends React.Component {
    render() {
        return <div>
            <table class="matrix">
                <tr>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </table>
        </div>
    }
}

class ScaleMatrix extends React.Component {
    render() {
        return <div>
            <table class="matrix">
                <tr>
                    <td><input type="number" id="input-xi" value="1"/></td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td><input type="number" id="input-yj" value="1"/></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </table>
        </div>
    }
}

class RotationMatrix extends React.Component {
    render() {
        return <div>
            <input type="number" id="rotation-angle" placeholder="angle" />
            <table class="matrix">
                <tr>
                    <td><input type="number" id="input-xi" value="1" disabled /></td>
                    <td><input type="number" id="input-yi" value="0" disabled /></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><input type="number" id="input-xj" value="0" disabled /></td>
                    <td><input type="number" id="input-yj" value="1" disabled /></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </table>
        </div>
    }
}

class TranslationMatrix extends React.Component {
    render() {
        return <div>
            <table class="matrix">
                <tr>
                    <td>1</td>
                    <td>0</td>
                    <td><input type="number" id="input-ox" value="0" /></td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>1</td>
                    <td><input type="number" id="input-oy" value="0" /></td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </table>
        </div>
    }
}

class ManualMatrix extends React.Component {
    render() {
        return <div>
            <table class="matrix">
                <tr>
                    <td><input type="number" id="input-xi" value="1" /></td>
                    <td><input type="number" id="input-yi" value="0" /></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td><input type="number" id="input-xj" value="0" /></td>
                    <td><input type="number" id="input-yj" value="1" /></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </table>
        </div>
    }
}

function renderMatrix(selector, matrix) {
    switch (selector.selectedIndex) {
        case 1:
            ReactDOM.render(<ScaleMatrix />, matrix);
            break;
        case 2:
            ReactDOM.render(<RotationMatrix />, matrix);
            break;
        case 3:
            ReactDOM.render(<TranslationMatrix />, matrix);
            break;
        case 4:
            ReactDOM.render(<ManualMatrix />, matrix);
            break;
        default:
            ReactDOM.render(<DefaultMatrix />, matrix);
            break;
    }
}

function main() {
    const selector = document.getElementById('operation');
    const matrix = document.getElementById('input-matrix');
    selector.addEventListener('change', (ev) => renderMatrix(selector, matrix));
    renderMatrix(selector, matrix);
}

main();

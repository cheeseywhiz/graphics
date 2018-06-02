import React from 'react';
import ReactDOM from 'react-dom';

export class DefaultMatrix extends React.Component {
    render() {
        return <table className="matrix">
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
    }
}

export class ScaleMatrix extends React.Component {
    render() {
        return <table className="matrix">
            <tr>
                <td><input type="number" id="input-xi" value="1" /></td>
                <td>0</td>
                <td>0</td>
            </tr>
            <tr>
                <td>0</td>
                <td><input type="number" id="input-yj" value="1" /></td>
                <td>0</td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </table>
    }
}

export class RotationMatrix extends React.Component {
    render() {
        return <div>
            <input type="number" id="rotation-angle" placeholder="angle" />
            <table className="matrix">
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

export class TranslationMatrix extends React.Component {
    render() {
        return <table className="matrix">
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
    }
}

export class ManualMatrix extends React.Component {
    render() {
        return <table className="matrix">
            <tr>
                <td><input type="number" id="input-xi" value="1" /></td>
                <td><input type="number" id="input-yi" value="0" /></td>
                <td><input type="number" id="input-ox" value="0" /></td>
            </tr>
            <tr>
                <td><input type="number" id="input-xj" value="0" /></td>
                <td><input type="number" id="input-yj" value="1" /></td>
                <td><input type="number" id="input-oy" value="0" /></td>
            </tr>
            <tr>
                <td>0</td>
                <td>0</td>
                <td>1</td>
            </tr>
        </table>
    }
}

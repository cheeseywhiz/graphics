import React from 'react';
import ReactDOM from 'react-dom';
import {DefaultMatrix, ScaleMatrix, RotationMatrix, TranslationMatrix, ManualMatrix, } from './input-matrices.js';

class OperationSelector extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return <select value={this.props.value} onChange={this.onChange}>
            <option value='0' disabled>Operation Type</option>
            <option value='1'>Scale</option>
            <option value='2'>Rotation</option>
            <option value='3'>Translation</option>
            <option value='4'>Manual</option>
        </select>
    }

    onChange(event) {
        this.props.onValueChange(event.target.value);
    }
}

OperationSelector.defaultProps = {
    value: '0',
    onValueChange: (value) => null,
};

class InputMatrix extends React.Component {
    constructor(props) {
        super(props);
        this.matrices = {
            '0': <DefaultMatrix />,
            '1': <ScaleMatrix />,
            '2': <RotationMatrix />,
            '3': <TranslationMatrix />,
            '4': <ManualMatrix />,
        };
    }

    render() {
        return this.matrices[this.props.value];
    }
}

InputMatrix.defaultProps = {value: '0'};

class InputMatrixGroup extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.state = {value: '0'};
    }

    onValueChange(value) {
        this.setState({value: value})
    }

    render() {
        return <div>
            <OperationSelector value={this.state.value} onValueChange={this.onValueChange} />
            <InputMatrix value={this.state.value} />
        </div>
    }
}

class App extends React.Component {
    render() {
        return <InputMatrixGroup />
    }
}

function main() {
    ReactDOM.render(<App />, document.getElementById('app'));
}

main();

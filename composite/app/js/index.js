import React from 'react';
import ReactDOM from 'react-dom';
import {
    DefaultMatrix, ScaleMatrix, RotationMatrix, TranslationMatrix, ManualMatrix, identityMatrix,
} from './input-matrices.js';
import dictUpdate from './dict-update.js';

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
            '0': DefaultMatrix,
            '1': ScaleMatrix,
            '2': RotationMatrix,
            '3': TranslationMatrix,
            '4': ManualMatrix,
        };
    }

    render() {
        const matrixProps = {
            onMatrixChange: this.props.onMatrixChange,
            onAngleChange: this.props.onAngleChange,
            matrix: this.props.matrix,
            angle: this.props.angle,
        };
        return React.createElement(this.matrices[this.props.value], matrixProps);
    }
}

InputMatrix.defaultProps = {
    value: '0',
    onMatrixChange: (value, key) => null,
    onAngleChange: (angle) => null,
    matrix: identityMatrix(),
    angle: '',
};

class InputMatrixGroup extends React.Component {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.onMatrixChange = this.onMatrixChange.bind(this);
        this.onAngleChange = this.onAngleChange.bind(this);
        this.state = dictUpdate(this.defaultMatrixState(), {value: '0'});
    }

    defaultMatrixState() {
        return {
            matrix: identityMatrix(),
            angle: 0,
        };
    }

    resetMatrixState() {
        this.setState(this.defaultMatrixState());
    }

    onValueChange(value) {
        this.setState({value: value});
        this.resetMatrixState();
    }

    onMatrixChange(value, key) {
        const matrix = this.state.matrix;
        matrix[key] = value;
        this.setState({matrix: matrix});
    }

    onAngleChange(angle_degrees) {
        const angle_radians = angle_degrees * Math.PI / 180;
        const sin = Math.sin(angle_radians);
        const cos = Math.cos(angle_radians);
        this.setState({
            matrix: {
                xi: cos, yi: -sin, ox: this.state.matrix.ox,
                xj: sin, yj: cos, oy: this.state.matrix.oy,
            },
            angle: angle_degrees,
        });
    }

    render() {
        return <div>
            <OperationSelector value={this.state.value} onValueChange={this.onValueChange} />
            <InputMatrix
                value={this.state.value}
                matrix={this.state.matrix}
                angle={this.state.angle}
                onMatrixChange={this.onMatrixChange}
                onAngleChange={this.onAngleChange} />
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

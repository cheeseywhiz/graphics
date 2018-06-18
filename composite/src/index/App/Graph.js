import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import actions from '../../actions.js';
import selectors from '../../selectors.js';
import BaseGraph from './Graph/BaseGraph.js';
import SquareBuffer from './Graph/SquareBuffer.js';

class GraphBase extends BaseGraph {
    constructor(props) {
        super(props);
        this.props.dispatch(actions.selectorSubscribe(
            selectors.intermediates, this.onIntermediatesChange.bind(this),
        ));
    }

    onIntermediatesChange(intermediates) {
        console.log('selector subscription');
        console.log(intermediates);
        this.scene.clear();
        intermediates
            .map(SquareBuffer)
            .forEach((buffer) => {
                this.scene.addGeometry(buffer);
            });
    }
}

const Graph = connect()(GraphBase);
export default Graph;

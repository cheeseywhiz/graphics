import PropTypes from 'prop-types';
import actions from '../actions.js';
import selectors from '../selectors.js';
import BaseGraph from './Graph/BaseGraph.js';
import SquareBuffer from './Graph/SquareBuffer.js';

export default class Graph extends BaseGraph {
    constructor(props) {
        super(props);
        props.store.dispatch(actions.selectorSubscribe(
            selectors.intermediates, this.onIntermediatesChange.bind(this),
        ));
    }

    onIntermediatesChange(intermediates) {
        console.log('selector subscription');
        console.log(intermediates);
        this.scene.clear();
        intermediates.map(SquareBuffer).forEach((buffer) => {
            this.scene.addGeometry(buffer);
        });
    }
}

Graph.propTypes = {store: PropTypes.object.isRequired};

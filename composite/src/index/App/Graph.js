import PropTypes from 'prop-types';
import {connect, } from 'react-redux';
import actions from '../../actions.js';
import selectors from '../../selectors.js';
import BaseGraph from './Graph/BaseGraph.js';
import SquareBuffer from './Graph/SquareBuffer.js';

@connect()
export default class Graph extends BaseGraph {
    constructor(props) {
        super(props);
        this.props.dispatch(actions.selectorSubscribe(
            selectors.globals, selectors.locals,
            this.onIntermediatesChange.bind(this),
        ));
    }

    addIntermediates(intermediates, color) {
        intermediates
            .map(SquareBuffer)
            .forEach((buffer) => {
                this.scene.addGeometry(buffer, color);
            });
    }

    onIntermediatesChange(globals, locals) {
        console.log('selector subscription');
        console.table({globals, locals});
        this.scene.clear();
        this.addIntermediates(locals.slice(0, 1), 0x000000);
        this.addIntermediates(locals.slice(1, -1), 0x0000ff);
        this.addIntermediates(globals.slice(1, -1), 0xff0000);
        this.addIntermediates(globals.slice(-1), 0xffffff);
    }
}

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
            selectors.globals, selectors.locals, selectors.order,
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

    onIntermediatesChange(globals, locals, order) {
        console.log('selector subscription');
        console.table({globals, locals});
        const first = globals.slice(0, 1);
        const last = globals.slice(-1);
        this.scene.clear();
        this.addIntermediates(first, 0x000000);
        if (order.locals) this.addIntermediates(locals.slice(1, -1), 0x0000ff);
        if (order.globals) this.addIntermediates(globals.slice(1, -1), 0xff0000);
        this.addIntermediates(last, 0xffffff);
    }
}

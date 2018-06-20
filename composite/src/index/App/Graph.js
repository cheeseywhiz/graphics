import {connect, } from 'react-redux';
import actions from '../../actions.js';
import selectors from '../../selectors.js';
import BaseGraph from './Graph/BaseGraph.js';

@connect()
export default class Graph extends BaseGraph {
    constructor(props) {
        super(props);
        this.props.dispatch(actions.selectorSubscribe(
            selectors.globals, selectors.locals, selectors.order, selectors.shape,
            this.reDrawScene.bind(this),
        ));
    }

    addIntermediates(intermediates, color, shape) {
        intermediates
            .forEach((frame) => {
                this.scene.addFrame(frame, color, shape);
            });
    }

    reDrawScene(globals, locals, order, shape) {
        console.log('selector subscription');
        console.table({globals, locals});
        const first = globals.slice(0, 1);
        const last = globals.slice(-1);
        this.scene.clear();
        this.addIntermediates(first, 0x000000, shape);
        if (order.locals) this.addIntermediates(locals.slice(1, -1), 0x0000ff, shape);
        if (order.globals) this.addIntermediates(globals.slice(1, -1), 0xff0000, shape);
        if (globals.length > 1) this.addIntermediates(last, 0xffffff, shape);
    }
}

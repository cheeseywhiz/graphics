import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import BaseGraph from './Graph/BaseGraph.js';

const mapStateToProps = (state) => ({
    globals: selectors.globals(state),
    locals: selectors.locals(state),
    order: selectors.order(state),
    shape: selectors.shape(state),
});

@connect(mapStateToProps)
export default class Graph extends BaseGraph {
    addIntermediates(intermediates, color, shape) {
        intermediates
            .forEach((frame) => {
                this.scene.addFrame(frame, color, shape);
            });
    }

    render() {
        const {globals, locals, order, shape} = this.props;

        const first = globals.slice(0, 1);
        const last = globals.slice(-1);
        this.scene.clear();
        this.addIntermediates(first, 0x000000, shape);
        if (order.locals) this.addIntermediates(locals.slice(1, -1), 0x0000ff, shape);
        if (order.globals) this.addIntermediates(globals.slice(1, -1), 0xff0000, shape);
        if (globals.length > 1) this.addIntermediates(last, 0xffffff, shape);

        return super.render();
    }
}

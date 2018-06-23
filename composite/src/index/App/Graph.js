import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import BaseGraph from './Graph/BaseGraph.js';

const mapStateToProps = (state) => ({
    globals: selectors.globals(state),
    locals: selectors.locals(state),
    geometry: selectors.geometry(state),
    shape: selectors.shape(state),
});

@connect(mapStateToProps)
export default class Graph extends BaseGraph {
    addIntermediates(intermediates, color) {
        const {shape, geometry} = this.props;
        intermediates
            .forEach((frame) => {
                this.scene.addFrame(frame, color, shape, geometry.frames);
            });
    }

    render() {
        const {globals, locals, geometry} = this.props;

        const first = globals.slice(0, 1);
        const last = globals.slice(-1);
        this.scene.clear();
        this.addIntermediates(first, 0x000000);
        if (geometry.locals) this.addIntermediates(locals.slice(1, -1), 0x0000ff);
        if (geometry.globals) this.addIntermediates(globals.slice(1, -1), 0xff0000);
        if (globals.length > 1) this.addIntermediates(last, 0xffffff);

        return super.render();
    }
}

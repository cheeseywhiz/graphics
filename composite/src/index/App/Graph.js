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
    addFrames(intermediates, color) {
        const {shape, geometry} = this.props;
        intermediates
            .forEach((frame) => {
                this.scene.addFrame(frame, color, shape, geometry.frames);
            });
    }

    frames() {
        const {globals, locals, geometry} = this.props;
        const first = globals.slice(0, 1);
        const last = globals.slice(-1);
        this.addFrames(first, 0x000000);
        if (geometry.locals) this.addFrames(locals.slice(1, -1), 0x0000ff);
        if (geometry.globals) this.addFrames(globals.slice(1, -1), 0xff0000);
        if (globals.length > 1) this.addFrames(last, 0xffffff);
    }

    addIntermediateHelpers() {}

    intermediateHelpers() {
        const {globals, locals, geometry} = this.props;

        if (geometry.intermediateHelpers) {
            if (geometry.globals && globals.length > 1) {
                this.addIntermediateHelpers(globals);
            } else if (geometry.locals && locals.length > 1) {
                this.addIntermediateHelpers(locals);
            }
        }
    }

    render() {
        this.scene.clear();
        this.frames();
        this.intermediateHelpers();
        return super.render();
    }
}

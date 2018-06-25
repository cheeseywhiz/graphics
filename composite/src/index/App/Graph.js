import {connect, } from 'react-redux';
import selectors from './common/selectors.js';
import BaseGraph from './Graph/BaseGraph.js';
import {colors, } from './Graph/Scene.js';

const mapStateToProps = (state) => ({
    globals: selectors.globals(state),
    locals: selectors.locals(state),
    geometry: selectors.geometry(state),
    shape: selectors.shape(state),
    fullStack: selectors.fullStack(state),
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
        this.addFrames(first, colors.first);
        if (geometry.locals) this.addFrames(locals.slice(1, -1), colors.locals);
        if (geometry.globals) this.addFrames(globals.slice(1, -1), colors.globals);
        if (globals.length > 1) this.addFrames(last, colors.last);
    }

    intermediateHelpers() {
        const {geometry, globals, locals, fullStack} = this.props;

        if (geometry.intermediateHelpers) {
            if (geometry.globals && globals.length > 1) {
                this.scene.addGlobalHelpers(globals, [...fullStack]);
            }

            if (geometry.locals && locals.length > 1) {
                this.scene.addLocalHelpers(locals, [...fullStack].reverse());
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

import {connect, } from 'react-redux';
import selectors from '../../selectors.js';
import BaseGraph from './Graph/BaseGraph.js';

// [a, b, c, d] => [[a, b], [b, c], [c, d]]
function consecutivePairs(array) {
    return array
        .slice(0, -1)
        .map((item, index) => [item, array[index + 1]]);
}

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
        this.addFrames(first, 0x000000);
        if (geometry.locals) this.addFrames(locals.slice(1, -1), 0x0000ff);
        if (geometry.globals) this.addFrames(globals.slice(1, -1), 0xff0000);
        if (globals.length > 1) this.addFrames(last, 0xffffff);
    }

    addHelpers(intermediates, stack, helpersAdder) {
        const operations = stack.map(selectors.operation);
        const changes = consecutivePairs(intermediates);
        helpersAdder(operations, changes);
    }

    intermediateHelpers() {
        const {geometry, globals, locals, fullStack} = this.props;

        if (geometry.intermediateHelpers) {
            if (geometry.globals && globals.length > 1) {
                this.addHelpers(
                    globals,
                    [...fullStack],
                    this.scene.addGlobalHelpers,
                );
            }

            if (geometry.locals && locals.length > 1) {
                this.addHelpers(
                    locals,
                    [...fullStack].reverse(),
                    this.scene.addLocalHelpers,
                );
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

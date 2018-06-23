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

    addIntermediateHelpers(stack, intermediates) {
        const operations = stack.map(selectors.operation);
        const numbers = stack.map(selectors.number);
        const frames = stack.map(selectors.frame);
        const changes = consecutivePairs(intermediates)
            .map(([initial, final]) => ({initial, final}));
        this.scene.addIntermediateHelpers(operations, numbers, frames, changes);
    }

    addGlobalHelpers() {
        console.log('addGlobalHelpers');
        const {globals, fullStack} = this.props;
        const stack = [...fullStack];
        this.addIntermediateHelpers(stack, globals);
    }

    addLocalHelpers() {
        console.log('addLocalHelpers');
        const {locals, fullStack} = this.props;
        const stack = [...fullStack].reverse();
        this.addIntermediateHelpers(stack, locals);
    }

    intermediateHelpers() {
        const {globals, locals, geometry} = this.props;

        if (geometry.intermediateHelpers) {
            if (geometry.globals && globals.length > 1) {
                this.addGlobalHelpers();
            }

            if (geometry.locals && locals.length > 1) {
                this.addLocalHelpers();
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

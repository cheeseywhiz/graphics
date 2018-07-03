import {connect, } from 'react-redux';
import selectors from '../common/selectors/selectors.js';
import BaseGraph from './BaseGraph/BaseGraph.js';
import GraphObjects, {colors, } from './GraphObjects.js';

const mapStateToProps = (state) => ({
    globals: selectors.globals(state),
    locals: selectors.locals(state),
    geometry: selectors.geometry(state),
    fullStack: selectors.fullStack(state),
    shapeGeometry: selectors.shapeGeometry(state),
});

@connect(mapStateToProps)
export default class Graph extends BaseGraph {
    addFrames(intermediates, color) {
        const {shapeGeometry, geometry} = this.props;
        return intermediates.map((frame) => (
            GraphObjects.frame(frame, color, shapeGeometry, geometry.frames)
        ));
    }

    frames() {
        const ret = [];
        const {globals, locals, geometry} = this.props;
        const first = globals.slice(0, 1);
        const last = globals.slice(-1);
        ret.push(this.addFrames(first, colors.first));
        if (geometry.locals) ret.push(this.addFrames(locals.slice(1, -1), colors.locals));
        if (geometry.globals) ret.push(this.addFrames(globals.slice(1, -1), colors.globals));
        if (globals.length > 1) ret.push(this.addFrames(last, colors.last));
        return ret;
    }

    intermediateHelpers() {
        const ret = [];
        const {geometry, globals, locals, fullStack} = this.props;

        if (geometry.intermediateHelpers) {
            if (geometry.globals && globals.length > 1) {
                ret.push(GraphObjects.globalHelpers(globals, [...fullStack]));
            }

            if (geometry.locals && locals.length > 1) {
                ret.push(GraphObjects.localHelpers(locals, [...fullStack].reverse()));
            }
        }

        return ret;
    }

    render() {
        this.scene.clear();
        this.scene.addAll([
            GraphObjects.axes(),
            this.frames(),
            this.intermediateHelpers(),
        ]);
        return super.render();
    }
}

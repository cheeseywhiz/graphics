import React from 'react';
import PropTypes from 'prop-types';
import actions from '../actions.js';
import selectors from '../selectors.js';
import BaseGraph from './Graph/BaseGraph.js';

export default class Graph extends BaseGraph {
    constructor(props) {
        super(props);
        props.store.dispatch(actions.selectorSubscribe(
            selectors.type,
            (type) => this.onTypeChange(type),
        ));
    }

    onTypeChange(type) {
        console.log('selector subscription');
        console.log(type);
    }

    componentDidMount() {
        super.componentDidMount();
        this.handleResize();
        this.render();
    }
}

Graph.propTypes = {store: PropTypes.object.isRequired};

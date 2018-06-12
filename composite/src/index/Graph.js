import React from 'react';
import PropTypes from 'prop-types';
import actions from '../actions.js';
import selectors from '../selectors.js';

export default class Graph extends React.Component {
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

    render() {
        return <div></div>
    }
}

Graph.propTypes = {store: PropTypes.object.isRequired};

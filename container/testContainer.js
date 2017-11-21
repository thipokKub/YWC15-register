import React from 'react';
import withStyle from '../hoc/withStyle';
import autoBind from '../hoc/autoBind';
import withInternalState from '../hoc/withInternalState';
import wrappedContainer from '../hoc/wrappedContainer';
import stylesheet from './style/testContainer.scss';

export default wrappedContainer((props) => {
    return (
        <div
            className="test-container"
            onClick={() => {
                props.testMessage("Helloo");
            }}
        >
            Store string: {props.test.String}<br />
            Internal State string: {props.state.test > 2 ? -1 * props.state.test : props.state.test}
        </div>
    )
}, {
    onErrorJSX: (props) => {
        return <div onClick={() => props.testMessage("Hi")}>Hello, this is error message</div>
    },
    stylesheets: [stylesheet]
});
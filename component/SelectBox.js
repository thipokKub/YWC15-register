import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _ from 'lodash';

const SelectBoxStyle = styled.div`
select {
    /* styling */
    background-color: white;
    border: thin solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: inline-block;
    font: inherit;
    line-height: 1.5em;
    box-sizing: border-box;
    padding: 0.2em 3.5em 0.1em 1em;
    width: 100%;
    
    /* reset */
    
    margin: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
    
    background-image:
        linear-gradient(45deg, transparent 50%, gray 50%),
        linear-gradient(135deg, gray 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
    background-position:
        calc(100% - 20px) calc(1em - 3px),
        calc(100% - 15px) calc(1em - 3px),
        calc(100% - 2.5em) 0.15em;
    background-size:
        5px 5px,
        5px 5px,
        1px 1.5em;
    background-repeat: no-repeat;

    &:focus {
        background-image:
            linear-gradient(45deg, #3190FF 50%, transparent 50%),
            linear-gradient(135deg, transparent 50%, #3190FF 50%),
            linear-gradient(to right, #ccc, #ccc);
        background-position:
            calc(100% - 15px) calc(1em - 3px),
            calc(100% - 20px) calc(1em - 3px),
            calc(100% - 2.5em) 0.15em;
        background-size:
            5px 5px,
            5px 5px,
            1px 1.5em;
        background-repeat: no-repeat;
        border-color: #3190FF;
        color: #3190FF;
        outline: 0;
    }
    
    &:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
    }
}
`;

const SelectBox = (props) => {
    return (
        <SelectBoxStyle>
            <select
                value={props.Value}
                onChange={props.OnChange}
                onClick={props.onChange}
                ref={props.Ref}
            >
                {
                    _.get(props, 'Options', []).map((text, index) => {
                        return (
                            <option value={text} key={index}>{text}</option>
                        );
                    })
                }
            </select>
        </SelectBoxStyle>
    );
}

SelectBox.PropTypes = {
    Value: PropTypes.any,
    OnChange: PropTypes.func,
    Ref: PropTypes.func,
    Options: PropTypes.arrayOf(PropTypes.string)
}

export default SelectBox;
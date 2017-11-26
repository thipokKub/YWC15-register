import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CheckboxStyle = styled.label`
display: inline-block;
width: 100%;
background: #fff;
padding: 10px 0px;
border-top: 1px solid #BBB;
display: flex;
align-items: center;
&:last-child {
    border-bottom: 1px solid #BBB;
}
> input {
    display: none;
}
span {
    flex: 1;
}
i {
    display: inline-block;
    float: right;
    padding: 2px;
    min-width: 40px;
    max-width: 40px;
    height: 20px;
    border-radius: 13px;
    vertical-align: middle;
    align-self: flex-end;
    transition: .25s .09s;
    position: relative;
    background: #d8d9db;
    box-sizing: initial;
    &:after {
        content: " ";
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        left: 2px;
        transition: .25s;
    }
}
> input:checked + i {
    background: #4bd865;
}
> input:checked + i:after {
    transform: translateX(20px);
}
&:hover {
    cursor: pointer;
}
`;

const Checkbox = (props) => {
    return (
        <CheckboxStyle>
            <span>{props.Label}</span>
            <input
                type="checkbox"
                onChange={props.OnChange}
                onClick={props.OnChange}
                defaultChecked={props.DefaultChecked}
            />
            <i></i>
        </CheckboxStyle>
    )
}

Checkbox.PropTypes = {
    OnChange: PropTypes.func,
    DefaultChecked: PropTypes.bool,
    Label: PropTypes.string
}

export default Checkbox;
import React from 'react';
import styled from 'styled-components';

export default styled.button`
    &:hover {
        box-shadow: 0 6px 15px 0 rgba(0,0,0,0.2), 0 6px 30px 0 rgba(0,0,0,0.19);
    }

    &:active {
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2), 0 2px 10px 0 rgba(0,0,0,0.19);
    }

    &.yellow {
        background-color: #FFE92E;
        color: #000;
    }
    &.red {
        background-color: #EF2B2A;
        color: #FFF;
    }
    &.purple {
        background-color: #88049F;
        color: #FFF;
    }
    &.blue {
        background: #1E80F0;
        color: #FFF;
    }
    &.green {
        background-color: #40A23F;
        color: #FFF;
    }
    &.indigo {
        background-color: #313AA5;
        color: #FFF;
    }
    &.teal {
        background-color: #118575;
        color: #FFF;
    }
    
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 1em;
    user-select: none;
    border: none;
    display: inline-block;
    outline: 0;
    padding: 8px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
    -webkit-appearance: button;
    text-transform: none;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);
    background-color: ${props => props.bgColor ? props.bgColor : 'inherit'};
    color: ${props => props.fontColor ? props.fontColor : 'inherit'};
`;
import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import autoBind from '../hoc/autoBind';
import { objectToArray, forChildren, onSetState } from '../function/general';
import PropTypes from 'prop-types';

const TableStyle = styled.div`
box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);
padding: 10px;
transform: translateZ(0);
-webkit-overflow-scrolling: touch;
z-index: 10;
position: relative;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

.topic {
    width: 100%;
    padding: 20px;
    margin-top: -20px;
    margin-bottom: 10px;
    font-size: 1.5em;
    color: #FFF;
}

.top-design {
    background-color: #E5E114;
    color: #000;
}

.top-programming {
    background-color: #22AD71;
}

.top-content {
    background-color: #1662E1;
}

.top-marketing {
    background-color: #C90018;
}

table {
    table-layout: fixed;
    text-align: center
    margin: 0px;
    width: 100%;
    border-collapse: collapse;
    box-sizing: border-box;
    text-align: center;
    
    th {
        height: 2.5em;
        font-size: 1.2em;
    }

    thead {
        th {
            position: relative;

            &:hover {
                background-color: #E0E0E0 !important;
            }

            &:active {
                background-color: #BBB !important;
            }

            &.active-top > div {
                display: block;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 5px;
                background: #000;
            }

            &.active-bottom > div {
                display: block;
                position: absolute;
                bottom: 0px;
                left: 0px;
                width: 100%;
                height: 5px;
                background: #000;
            }
        }
    }

    tbody {
        font-size: 1.1em;
    }
    
    tbody tr:nth-child(even) {
        background-color: #F1F1F1;
    }

    tbody tr:hover {
        background-color: #E0E0E0 !important;
    }

    tbody tr:active {
        background-color: #BBB !important;
    }
}

@media all and (max-width: 480px) {
    padding: 0px !important;
}

`;

const HeaderMap = {
    'First Name': 'firstName',
    'Last Name': 'lastName',
    'Major': 'major',
    'Code': 'interviewRef'
};

const HeaderOrder = ['Code', 'First Name', 'Last Name', 'Major'];

const mapWord = {
    'design': 'Web Design',
    'programming': 'Web Programming',
    'marketing': 'Web Marketing',
    'content': 'Web Content'
}

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 0,
            sortBy: {
                field: '',
                direction: 1
            }
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onClickHeader(cIndex) {
        let activeIndex = -1;
        let direction = 1;
        const array = this._TopTable.children[0].children[0];
        forChildren(array, (node, index) => {
            if(node.className.indexOf("active") !== -1) {
                activeIndex = index;
                if(index === cIndex) {
                    if (node.classList.contains('active-top')) {
                        node.classList.remove('active-top');
                        node.classList.add('active-bottom');
                        direction = -1;
                    }
                    else {
                        node.classList.remove('active-bottom');
                        node.classList.add('active-top');
                        direction = 1;
                    }
                } else {
                    node.classList.remove('active-top');
                    node.classList.remove('active-bottom');
                }
            }
        })
        if (activeIndex !== cIndex) {
            this._TopTable.children[0].children[0].children[cIndex].classList.add('active-top');
            direction = 1;
        }

        onSetState(this, 'sortBy', {
            field: HeaderOrder[cIndex],
            direction: direction
        });
    }

    render() {
        const Data = _.get(this.props, 'map.YWC.result.isLoaded', false) ? objectToArray(this.props.map.YWC.result) : [];
        let isFiltered = false;
        let isFuzzyFiltered = false;
        Data.forEach((item) => {
            isFiltered = isFiltered || item.isFiltered;
            isFuzzyFiltered = isFuzzyFiltered || item.isFuzzyFiltered;
        });
        let data = [];
        if (this.props.page.Index.searchTerm.length === 0 && !isFiltered && !isFuzzyFiltered) {
            data = Data;
        } else if(isFiltered) {
            data = Data.filter((item) => item.isFiltered);
        } else {
            data = Data.filter((item) => item.isFuzzyFiltered);
        }

        if(this.state.sortBy.field !== '') {
            data.sort((a, b) => {
                if(this.state.sortBy.direction === 1) {
                    if(a[HeaderMap[this.state.sortBy.field]] < b[HeaderMap[this.state.sortBy.field]]) return -1;
                    if(a[HeaderMap[this.state.sortBy.field]] > b[HeaderMap[this.state.sortBy.field]]) return 1;
                    return 0;
                } else {
                    if (a[HeaderMap[this.state.sortBy.field]] < b[HeaderMap[this.state.sortBy.field]]) return 1;
                    if (a[HeaderMap[this.state.sortBy.field]] > b[HeaderMap[this.state.sortBy.field]]) return -1;
                    return 0;
                }
            })
        }
        const pageMax = this.props.page.Index.pageMax;
        const maxPage = Math.ceil((data.length / pageMax));
        const activePage = this.state.activePage < maxPage ? this.state.activePage : 0;
        const forcedSearch = this.props.page.Index.forcedSearch;

        return (
            <TableStyle className="w-box">
                <div
                    className={(forcedSearch !== "all") ? `topic top-${forcedSearch}` : ""}
                >
                    {forcedSearch !== "all" ? mapWord[forcedSearch] : ""}
                </div>
                <table
                    style={{
                        marginBottom: '10px',
                        position: 'sticky',
                        top: '0px'
                    }}
                    ref={(node) => this._TopTable = node}
                >
                    <thead>
                        <tr className="w-box">
                            {
                                HeaderOrder.map((header, index) => {
                                    return (<th onClick={() => this.onClickHeader.bind(this)(index)} key={index}>{header}<div /></th>);
                                })
                            }
                        </tr>
                    </thead>
                </table>
                <table
                    style={{
                        width: '99%'
                    }}
                    ref={(node) => this._BottomTable = node}
                >
                    <tbody className="w-box">
                        {
                            (data.slice(activePage * pageMax, (activePage + 1) * pageMax).map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {
                                            HeaderOrder.map((header, ind) => {
                                                if (header === "Major") return (<td key={`body-${ind}`}>{mapWord[item[HeaderMap[header]]]}</td>);
                                                return (<td key={`body-${ind}`}>{item[HeaderMap[header]]}</td>);
                                            })
                                        }
                                    </tr>
                                );
                            }))
                        }
                    </tbody>
                </table>
                <section
                    className="page-control"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <button
                        style={{
                            display: `${activePage > (0) ? 'initial' : 'none'}`
                        }}
                        onClick={() => {
                            onSetState(this, 'activePage', Math.max(activePage - 1, 0));
                        }}
                        className="directional"
                    >
                        <i className="fa fa-angle-left" />
                    </button>
                    <span>{activePage + 1} of {maxPage}</span>
                    <button 
                        style={{
                            display: `${activePage < (maxPage - 1) ? 'initial': 'none'}`
                        }}
                        className="directional"
                        onClick={() => {
                            onSetState(this, 'activePage', Math.min(activePage + 1, maxPage - 1));
                        }}
                    >
                        <i className="fa fa-angle-right" />
                    </button>
                </section>
            </TableStyle>
        );
    }
}

export default autoBind(Table);
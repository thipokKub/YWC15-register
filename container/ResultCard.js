import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import autoBind from '../hoc/autoBind';
import ProfileCard from '../component/ProfileCard';

const ResultCardStyle = styled.section`
    z-index: 8;
    padding: 0px;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);
    overflow-y: scroll;
    overflow-x: hidden;
    transform: translateZ(0);
    -webkit-overflow-scrolling: touch;
    position: relative;
    background-color: #FFF;

    .message-box {
        background-color: rgba(255, 255, 255, 1);
        padding: 20px;
        margin: 0px;
        width: 100%;
    }
`;

const mapWord = {
    'design': 'Web Design',
    'programming': 'Web Programming',
    'marketing': 'Web Marketing',
    'content': 'Web Content',
    'all': 'All'
}

class ResultCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0
        }
        this.onSetPage = this.onSetPage.bind(this);
    }

    onSetPage(nextPageIndex) {
        this.setState({
            activeIndex: nextPageIndex
        })
    }

    render() {
        const props = this.props;

        const Index = props.page.Index;
        const result = _.get(props, 'map.YWC.result', {})
        const filtered = Object.keys(result).filter((key) => !(key === "error" || key === "isError" || key === "isLoaded") && result[key].isFiltered).map((key) => result[key]);
        const isForcedSearch = Index.forcedSearch.length > 0;

        const maxPage = Math.ceil(filtered.length / (props.page.Index.pageMax > 0 ? props.page.Index.pageMax : 1));
        const activeIndex = this.state.activeIndex < maxPage ? this.state.activeIndex : 0;
        const startRange = activeIndex * props.page.Index.pageMax;
        const endRange = (activeIndex + 1) * props.page.Index.pageMax;

        if (!Index.isSearched) {
            return (
                <ResultCardStyle className="flex-center">
                    <p className="message-box">Please enter name in the box above</p>
                </ResultCardStyle>
            );
        }
        if (isForcedSearch || filtered.length > 0) {
            let messageBox;
            if (isForcedSearch) {
                messageBox = (
                    <div className="message-box">
                        <p>You selected {`'${mapWord[Index.forcedSearch]}'`} option. We found {filtered.length} entries.</p>
                    </div>
                );
            }
            else if (filtered.length === 1) {
                messageBox = (
                    <div className="message-box">
                        <p>Congrat! You are selected!</p>
                        <p>Here are your information</p>
                    </div>
                );
            } else if (filtered.length > 1) {
                messageBox = (
                    <p className="message-box">We found {filtered.length} index in your search query. Please select below option</p>
                );
            }
            return (
                <ResultCardStyle className="flex-center flex-wrap">
                    {messageBox}
                    <div className="flex-center flex-wrap">
                        {
                            filtered.slice(startRange, endRange).map((info, index) => {
                                return (
                                    <ProfileCard
                                        {...info}
                                        key={index}
                                    />
                                )
                            })
                        }
                    </div>
                    <div
                        className="text-center flex-center"
                        style={{
                            flex: '1'
                        }}
                    >
                        <button
                            onClick={() => this.onSetPage(Math.max(this.state.activeIndex - 1, 0))}
                            style={{
                                display: `${this.state.activeIndex > (0) ? 'initial' : 'none'}`
                            }}
                            className="directional"
                        >
                            <i className="fa fa-angle-left" />
                        </button>
                        {activeIndex + 1} of {maxPage}
                        <button
                            onClick={() => this.onSetPage(Math.min(this.state.activeIndex + 1, maxPage - 1))}
                            className="directional"
                            style={{
                                display: `${this.state.activeIndex < (maxPage - 1) ? 'initial' : 'none'}`
                            }}
                        >
                            <i className="fa fa-angle-right" />
                        </button>
                    </div>
                </ResultCardStyle>
            );
        }

        const fuzzyFiltered = Object.keys(result)
            .filter((key) => !(key === "error" || key === "isError" || key === "isLoaded") && result[key].isFuzzyFiltered)
            .map((key) => result[key])
            .sort((a, b) => a.fuzzyScore < b.fuzzyScore ? -1 : a.fuzzyScore === b.fuzzyScore ? 0 : 1);

        return (
            <ResultCardStyle className="flex-center flex-wrap">
                <div className="message-box">
                    <p>Sorry, we did not found you in our database. Either you {`weren't`} selected or you typed wrong.
                For the second case, please selected the searched item below. We found {fuzzyFiltered.length} close match(es).</p>
                </div>
                <div className="flex-center flex-wrap">
                    {
                        fuzzyFiltered.slice(startRange, endRange).map((info, key) => {
                            return (
                                <ProfileCard
                                    {...info}
                                    key={key}
                                />
                            )
                        })
                    }
                </div>
                <div
                    className="text-center flex-center"
                    style={{
                        flex: '1'
                    }}
                >
                    <button
                        onClick={() => this.onSetPage(Math.max(this.state.activeIndex - 1, 0))}
                        style={{
                            display: `${this.state.activeIndex > (0) ? 'initial' : 'none'}`
                        }}
                        className="directional"
                    >
                        <i className="fa fa-angle-left" />
                    </button>
                    {activeIndex + 1} of {maxPage}
                    <button
                        onClick={() => this.onSetPage(Math.min(this.state.activeIndex + 1, maxPage - 1))}
                        className="directional"
                        style={{
                            display: `${this.state.activeIndex < (maxPage - 1) ? 'initial' : 'none'}`
                        }}
                    >
                        <i className="fa fa-angle-right" />
                    </button>
                </div>
            </ResultCardStyle>
        );
    }
}

export default autoBind(ResultCard);
import React from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import autoBind from '../hoc/autoBind';
import ProfileCard from '../component/ProfileCard';

const ResultCardStyle = styled.section`
    z-index: 8;
    max-width: calc(65vw);
    width: calc(60vw);
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);
    max-height: 80%;
    overflow-y: scroll;
    overflow-x: hidden;
    transform: translateZ(0);
    -webkit-overflow-scrolling: touch;
    position: relative;

    .message-box {
        background-color: rgba(255, 255, 255, 1);
        padding: 20px;
        width: 90%;
    }

    * {
        margin: 5px 0px;
    }
`;

const mapWord = {
    'design': 'Web Design',
    'programming': 'Web Programming',
    'marketing': 'Web Marketing',
    'content': 'Web Content',
    'all': 'All'
}

const ResultCard = (props) => {
    const Index = props.page.Index;
    const result = _.get(props, 'map.YWC.result', {})
    const filtered = Object.keys(result).filter((key) => !(key === "error" || key === "isError" || key === "isLoaded") && result[key].isFiltered).map((key) => result[key]);
    const isForcedSearch = Index.forcedSearch.length > 0;

    if(!Index.isSearched) {
        return (
            <ResultCardStyle className="flex-center">
                <p className="message-box">Please enter name in the box above</p>
            </ResultCardStyle>
        );
    }
    if(isForcedSearch) {
        return (
            <ResultCardStyle className="flex-center flex-wrap">
                <div className="message-box">
                    <p>You selected {`'${mapWord[Index.forcedSearch]}'`} option. We found {filtered.length} entries.</p>
                </div>
                <div className="flex-center flex-wrap">
                    {
                        filtered.map((info, index) => {
                            return (
                                <ProfileCard
                                    {...info}
                                    key={index}
                                />
                            )
                        })
                    }
                </div>
            </ResultCardStyle>
        );
    }
    if(filtered.length === 1) {
        return (
            <ResultCardStyle className="flex-center flex-wrap">
                <div className="message-box">
                    <p>Congrat! You are selected!</p>
                    <p>Here are your information</p>
                </div>
                <div className="flex-center flex-wrap">
                    {
                        filtered.map((info, index) => {
                            return (
                                <ProfileCard
                                    {...info}
                                    key={index}
                                />
                            )
                        })
                    }
                </div>
            </ResultCardStyle>
        );
    } else if(filtered.length > 1) {
        return (
            <ResultCardStyle className="flex-center flex-wrap">
                <p className="message-box">We found {filtered.length} index in your search query. Please select below option</p>
                <div className="flex-center flex-wrap">
                    {
                        filtered.map((info, index) => {
                            return (
                                <ProfileCard
                                    {...info}
                                    key={index}
                                />
                            )
                        })
                    }
                </div>
            </ResultCardStyle>
        );
    }

    const fuzzyFiltered = Object.keys(result)
        .filter((key) => !(key === "error" || key === "isError" || key === "isLoaded") && result[key].isFuzzyFiltered)
        .map((key) => result[key])
        .sort((a, b) => a.fuzzyScore < b.fuzzyScore ? -1 : a.fuzzyScore === b.fuzzyScore ? 0 : 1);
    
    if(fuzzyFiltered.length > 0) {

    }
    return (
        <ResultCardStyle className="flex-center flex-wrap">
            <div className="message-box">
                <p>Sorry, we did not found you in our database. Either you {`weren't`} selected or you typed wrong.
                For the second case, please selected the searched item below. We found {fuzzyFiltered.length} close match(es).</p>
            </div>
            <div className="flex-center flex-wrap">
                {
                    fuzzyFiltered.map((info, key) => {
                        return (
                            <ProfileCard
                                {...info}
                                key={key}
                            />
                        )
                    })
                }
            </div>
        </ResultCardStyle>
    );
    
}

export default autoBind(ResultCard);
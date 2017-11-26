import React, { Component } from 'react';
import autoBind from '../hoc/autoBind';
import styled from 'styled-components';
import { searchBoxTimeDelay, searchBoxTimeDelayRandomRatio } from '../constraint/variables';
import { randomRatio, objectToArray, scrollIt } from '../function/general';
import Fuse from 'fuse.js';
import _ from 'lodash';

const fuseConfig = {
    location: 0,
    distance: 200,
    threshold: 0.6,
    maxPatternLength: 50,
    caseSensitive: false,
    minMatchCharLength: 1,
    findAllMatches: true,
    includeScore: true,
    id: "id",
    keys: [
        "firstName",
        "lastName",
        "major"
    ]
}

const SearchBoxStyle = styled.form`
    display: flex;
    input {
        border: 1px solid rgba(0,0,0,0.1);
        font-size: 1.2em;
        box-sizing: border-box;
        padding: 10px 15px;
        min-width: 0px;
        width: 100%;
        -webkit-appearance: none;
        border-radius: 0px;
    }
    button[type="submit"] {
        box-shadow: none;
        border-radius: 0px;
        border: 0;
        background-color: #3A66FF;
        color: white;
        font-size: 1.5em;
        padding: 0px 15px;

        &:hover {
            filter: brightness(1.2);
        }

        &:active {
            filter: brightness(0.9);
        }
    }
`

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.onSearch = this.onSearch.bind(this);
        this.onSearchDebounce = _.debounce(this.onSearch.bind(this), 500);
    }

    onSearch(keyword, isClear) {
        keyword = keyword.toUpperCase();
        if(typeof keyword === "string") {
            const keywords = keyword.replace(/-/g, ' ').split(' ').filter((text) => text.length > 0);
            const YWC = this.props.map.YWC.result;
            if(YWC.isLoaded) {
                let isFoundExactMatch = false;
                let new_search = Object.keys(YWC).filter((key) => {
                    return !(key === "error" || key === "isError" || key === "isLoaded")
                }).reduce((new_state, key) => {
                    const isFiltered = Object.keys(YWC[key]).filter((name) => name !== "major").reduce((result, name) => {
                        if(!result) {
                            return keywords.reduce((res, keyword) => {
                                if(!res && typeof YWC[key][name] === "string") return YWC[key][name].indexOf(keyword) !== -1;
                                return res;
                            }, false);
                        }
                        return true;
                    }, false);
                    
                    isFoundExactMatch = isFoundExactMatch || isFiltered;

                    new_state[key] = {
                        ...YWC[key],
                        isFiltered: isFiltered,
                        isFuzzyFiltered: false,
                        fuzzyScore: 1
                    }
                    return new_state;
                }, {});
                if(!isFoundExactMatch) {
                    const fuse = new Fuse(objectToArray(YWC).map((item, indx) => {
                        item.id = indx;
                        return item;
                    }), fuseConfig);
                    const searchResult = keywords.reduce((array, word) => {
                        array = array.concat(fuse.search(word));
                        return array;
                    }, []);
                    searchResult.forEach((item) => {
                        new_search[item.item].isFuzzyFiltered = true;
                        new_search[item.item].fuzzyScore = item.score;
                    });
                }
                this.props.updateFieldPageStore('Index', 'isActive', true);
                setTimeout(() => {
                    this.props.updateMapId('YWC', 'result', new_search);
                    this.props.updateFieldPageStore('Index', 'isActive', false);
                    this.props.updateFieldPageStore('Index', 'forcedSearch', '');
                    this.props.updateFieldPageStore('Index', 'searchTerm', keywords);
                    if(!_.get(this.props, 'page.Index.isSearched', true)) this.props.updateFieldPageStore('Index', 'isSearched', true);
                }, randomRatio(searchBoxTimeDelay, searchBoxTimeDelayRandomRatio));
            }
        }
        if(isClear) this._text.value = '';
    }

    render() {
        const props = this.props;
        return (
            <SearchBoxStyle onSubmit={(e) => {
                e.preventDefault();
                this.onSearch.bind(this)(this._text.value, true);
                return false;
            }}>
                <input
                    type="text"
                    placeholder={props.placeholder ? props.placeholder : ''}
                    ref={(input) => this._text = input}
                    onChange={(e) => this.onSearchDebounce(e.target.value)}
                />
                <button type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
            </SearchBoxStyle> 
        );
    }
}

export default autoBind(SearchBox);

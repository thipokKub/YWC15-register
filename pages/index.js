import React, { Component } from 'react';
import pageConnect from '../hoc/pageConnect';
import stylesheet from './style/parallax.scss';
import SearchBox from '../container/SearchBox';
import ResultCard from '../container/ResultCard';
import Button from '../component/Button';
import { searchBoxTimeDelay, searchBoxTimeDelayRandomRatio } from '../constraint/variables';
import { objectToArray, onSetState, forChildren, getCoords, scrollIt, randomRatio } from '../function/general';
import axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';

const scrollFactor = 0.7;

function isMobile() {
    return 'ontouchstart' in document.documentElement;
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
        this.onUpdateDimension = this.onUpdateDimension.bind(this);
        this.onClickIndicator = this.onClickIndicator.bind(this);
        this.onFilterClick = this.onFilterClick.bind(this);
        this.state = {
            top: 0,
            parallaxPageCount: 0,
            parallaxRef: [],
            activeIndex: 0
        }
    }

    onClickIndicator(toIndex) {
        let cIndex = 0;
        forChildren(this._page, (node, index) => {
            if(node.className.indexOf('parallax-wrapper') !== -1) {
                if(cIndex === toIndex) {
                    scrollIt(node, 300, 'easeOutQuad');
                }
                cIndex++;
            }
        });
    }

    onScroll(e) {
        const top = window.scrollY;
        const screenHeight = window.innerHeight;
        let ind = 0;
        this.state.parallaxRef.forEach((item, index) => {
            if(item.top <= top + scrollFactor*screenHeight/2) ind = index
        })
        onSetState(this, 'top', top);
        onSetState(this, 'activeIndex', ind);
    }

    onUpdateDimension() {
        let parallaxPageRef = [];
        forChildren(this._page, (node, index) => {
            if(node.className.indexOf('parallax-wrapper') !== -1) {
                parallaxPageRef.push(getCoords(node))
            }
        });
        onSetState(this, 'parallaxRef', parallaxPageRef);
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onUpdateDimension);
    }

    componentDidMount() {
        this._isMounted = true;
        document.addEventListener('scroll', this.onScroll);
        window.addEventListener('resize', this.onUpdateDimension);
        let count = 0;
        let parallaxPageRef = [];
        forChildren(this._page, (node, index) => {
            if(node.className.indexOf('parallax-wrapper') !== -1) {
                count++;
                parallaxPageRef.push(getCoords(node))
            }
        });
        onSetState(this, 'parallaxPageCount', count);
        onSetState(this, 'parallaxRef', parallaxPageRef);

        //Fixed position fixed on mobile
        $.fn.mobileFix = function (options) {
            let $parent = $(this);

            $(document)
            .on('focus', options.inputElements, function(e) {
                $parent.addClass(options.addClass);
            })
            .on('blur', options.inputElements, function(e) {
                $parent.removeClass(options.addClass);

                // Fix for some scenarios where you need to start scrolling
                setTimeout(function() {
                    $(document).scrollTop($(document).scrollTop())
                }, 1);
            });

            return this; // Allowing chaining
        };

        // Only on touch devices
        if (isMobile()) {
            $("body").mobileFix({ // Pass parent to apply to
                inputElements: "input,textarea,select", // Pass activation child elements
                addClass: "fixfixed" // Pass class name
            });
        }
    }

    onFilterClick(field) {
        const YWC = this.props.map.YWC.result;
        if(YWC.isLoaded) {
            this.props.updateFieldPageStore('Index', 'isActive', true);
            const new_state = objectToArray(YWC).reduce((obj, item, key) => {
                obj[key] = {
                    ...item,
                    isFiltered: (field === "all") || item.major === field
                }
                return obj;
            }, {});
            setTimeout(() => {
                this.props.updateMapId('YWC', 'result', new_state);
                this.props.updateFieldPageStore('Index', 'isActive', false);
                this.props.updateFieldPageStore('Index', 'forcedSearch', field);
                this.props.updateFieldPageStore('Index', 'searchTerm', []);
                if(!_.get(this.props, 'page.Index.isSearched', true)) this.props.updateFieldPageStore('Index', 'isSearched', true);
                scrollIt($('.parallax-wrapper')[2], 300, 'easeOutQuad');
            }, randomRatio(searchBoxTimeDelay, searchBoxTimeDelayRandomRatio));
        }
    }

    componentWillMount() {
        this.props.requestMapId('YWC', 'result', () => {
            return axios.get('https://ywc15.ywc.in.th/api/interview').then((data) => {
                return Object.keys(data.data).reduce((obj, key) => {
                    obj[key] = {
                        ...data.data[key],
                        isFiltered: false,
                        isFuzzyFiltered: false,
                        fuzzyScore: 1,
                        id: key
                    }
                    return obj;
                }, {});
            })
        })
        
        this.props.initPageStore('Index', {
            isActive: false,
            isSearched: false,
            searchTerm: [],
            forcedSearch: ''
        });
    }

    render() {
        const props = this.props;
        return (
            <section className="parallax-page" ref={(page) => this._page = page}>
                <ul className="bullet-indicator" ref={(node) => this._indicator = node}>
                    {Array.from(Array(this.state.parallaxPageCount)).map((a, ind) => {
                        return <li key={ind} onClick={() => this.onClickIndicator(ind)} className={`bullet-page ${this.state.activeIndex === ind ? 'active': ''}`} />
                    })}
                </ul>
                <div className="parallax-wrapper height2">
                    <div className="content-wrapper">
                        <div
                            className="fixed-background"
                            style={(this._isMounted && isMobile()) ? {
                                'backgroundImage': `url('static/videos/bg5.png')`
                            } : {}}
                        >
                            {
                                (!this._isMounted || !(this._isMounted && isMobile())) && (
                                    <video loop muted autoPlay className="fullscreen-bg-video" poster="static/videos/bg5.png">
                                        <source src='static/videos/bg5.mp4' type="video/mp4" />
                                    </video>
                                )
                            }
                        </div>
                        <div className="foreground flex-center">
                            <img src="static/images/logo.png" className="logo" />
                        </div>
                    </div>
                </div>
                <div className="parallax-wrapper">
                    <div className="content-wrapper">
                        <div className="fixed-background bg2" />
                        <div className="overlay-background" />
                        <div className="foreground flex-center">
                            <div className="control-zone">
                                <div className="name-search-box w-box">
                                    <SearchBox
                                        placeholder="Type name e.g. John Smith"
                                        toNode={this._isMounted && $('.parallax-wrapper')[2]}
                                    />
                                    </div>
                                <div className="w-box">
                                    <Button
                                        className="indigo"
                                        onClick={() => this.onFilterClick("all")}
                                    >View All</Button>
                                    <Button
                                        bgColor='#20B884'
                                        fontColor='#FFF'
                                        onClick={() => this.onFilterClick("programming")}
                                    >Programming</Button>
                                    <Button
                                        bgColor='#D6001E'
                                        fontColor='#FFF'
                                        onClick={() => this.onFilterClick("marketing")}
                                    >Marketing</Button>
                                    <Button
                                        bgColor='#EAE413'
                                        fontColor='#000'
                                        onClick={() => this.onFilterClick("design")}
                                    >Design</Button>
                                    <Button
                                        bgColor='#177AE7'
                                        fontColor='#FFF'
                                        onClick={() => this.onFilterClick("content")}
                                    >Content</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`connector diff ${_.get(this.props, 'page.Index.isActive', false) ? 'active' : ''}`}>
                        <div className="knob top" />
                        <div className="knob bottom" />
                    </div>
                </div>
                <div className="parallax-wrapper height2">
                    <div className="content-wrapper">
                        <div
                            className="fixed-background"
                            style={(this._isMounted && isMobile()) ? {
                                'backgroundImage': `url('static/videos/bg2.png')`
                            } : {}}
                        >
                            {
                                (!this._isMounted || !(this._isMounted && isMobile())) && (
                                    <video loop muted autoPlay className="fullscreen-bg-video" poster="static/videos/bg2.png">
                                        <source src='static/videos/bg2.mp4' type="video/mp4" />
                                    </video>
                                )
                            }
                        </div>
                        <div className="foreground flex-center">
                            <ResultCard isFound={true} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default pageConnect(Index, {
    title: 'Index',
    stylesheets: [stylesheet],
})

// import Link from 'next/link';
// import Router from 'next/router'
// const handleClickIndex = () => {
//     setTimeout(() => {
//         Router.push({
//             pathname: '/about'
//         });
//     }, 500);
// }
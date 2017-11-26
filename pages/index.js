import React, { Component } from 'react';
import pageConnect from '../hoc/pageConnect';
import stylesheet from './style/parallax.scss';
import SearchBox from '../container/SearchBox';
import ResultCard from '../container/ResultCard';
import Table from '../container/Table';
import Button from '../component/Button';
import CheckBox from '../component/Checkbox';
import SelectBox from '../component/SelectBox';
import ParallaxWrapper from '../component/ParallaxWrapper';
import { searchBoxTimeDelay, searchBoxTimeDelayRandomRatio } from '../constraint/variables';
import { objectToArray, onSetState, forChildren, getCoords, scrollIt, randomRatio } from '../function/general';
import axios from 'axios';
import _ from 'lodash';
import $ from 'jquery';

const scrollFactor = 0.9;

function isMobile() {
    return 'ontouchstart' in document.documentElement;
}

class Index extends Component {
    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
        this.onClickIndicator = this.onClickIndicator.bind(this);
        this.onFilterClick = this.onFilterClick.bind(this);
        this.state = {
            top: 0,
            pageRef: [],
            activeIndex: 0,
            enableCardView: false
        }
    }

    onClickIndicator(toIndex) {
        scrollIt(this.state.pageRef[toIndex], 300, 'easeOutQuad');
    }

    onScroll(e) {
        const top = window.scrollY;
        const screenHeight = window.innerHeight;
        let ind = 0;
        this.state.pageRef.forEach((node, index) => {
            const item  = getCoords(node);
            if(item.top <= top + scrollFactor * screenHeight / 2) ind = index
        });
        onSetState(this, 'top', top);
        onSetState(this, 'activeIndex', ind);
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.removeEventListener('scroll', this.onScroll);
    }

    componentDidMount() {
        this._isMounted = true;
        document.addEventListener('scroll', this.onScroll);
        let pageRef = [];
        forChildren(this._page, (node, index) => {
            if(node.className.indexOf('indicator-page') !== -1) {
                pageRef.push(node)
            }
        });
        onSetState(this, 'pageRef', pageRef);

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
            forcedSearch: '',
            pageMax: 10
        });
    }

    onChangePageMax(value) {
        this.props.updateFieldPageStore('Index', 'pageMax', parseInt(value));
    }

    render() {
        const props = this.props;
        return (
            <section className="parallax-page" ref={(page) => this._page = page}>
                <ul className="bullet-indicator" ref={(node) => this._indicator = node}>
                    {Array.from(Array(this.state.pageRef.length)).map((a, ind) => {
                        return <li key={ind} onClick={() => this.onClickIndicator(ind)} className={`bullet-page ${this.state.activeIndex === ind ? 'active': ''}`} />
                    })}
                </ul>
                <ParallaxWrapper
                    Type="Video"
                    Src="static/videos/bg5.mp4"
                    VideoPoster="static/videos/bg5.png"
                    Height="calc(10/16*100vw)"
                    Width="100vw"
                    ForegroundClass="flex-center"
                    BreakPoint={[{
                        maxWidth: '480px',
                        Width: '100vw',
                        Height: '100vw'
                    }]}
                    ParallaxClass="indicator-page"
                >
                    <img src="static/images/logo.png" className="logo" />
                </ParallaxWrapper>
                <section
                    className="flex-center indicator-page result diag-blue"
                >   
                    <h1
                        style={{
                            display: 'none'
                        }}
                    >Result</h1>
                    <div className="control-zone">
                        <div className="name-search-box w-box top">
                            <SearchBox
                                placeholder="Type name e.g. John Smith"
                                toNode={this._isMounted && $('.indicator-page')[2]}
                            />
                        </div>
                        <div className="flex bottom">
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
                                <CheckBox
                                    OnChange={(e) => {
                                        onSetState(this, 'enableCardView', e.target.checked)
                                    }}
                                    DefaultChecked={this.state.enableCardView}
                                    Label="Enable Card View"
                                />
                                <SelectBox
                                    OnChange={(e) => this.onChangePageMax.bind(this)(e.target.value)}
                                    Options={[10, 20, 30]}
                                />
                            </div>
                            <div>
                                {
                                    (this.state.enableCardView && <ResultCard isFound={true} />)
                                }
                                {
                                    (!this.state.enableCardView && <Table />)
                                }
                            </div>
                        </div>
                    </div>
                </section>
                <ParallaxWrapper
                    Type="Image"
                    Src="static/images/bg4.jpg"
                    Height="calc(7/16*100vw)"
                    Width="100vw"
                    ParallaxClass="indicator-page"
                    BreakPoint={[
                    {
                        maxWidth: '340px',
                        Width: '100vw',
                        Height: 'calc(32/16*100vw)'
                    },
                    {
                        minWidth: '341px',
                        maxWidth: '480px',
                        Width: '100vw',
                        Height: 'calc(14/16*100vw)'
                    }, {
                       minWidth: '481px',
                       maxWidth: '760px',
                       Width: '100vw',
                       Height: 'calc(9/16*100vw)' 
                    }]}
                >
                    <div className={`hover-reveal full-size location ${this.state.activeIndex === 2 ? 'active' : ''}`}>
                        <img src="static/images/location.png" />
                        <div>
                            <h1>Location</h1>
                            <span>
                                การสัมภาษณ์จะจัดขึ้นในวันที่ 26 พฤศจิกายน 2560 ณ อาคาร ซี.พี.ทาวเวอร์ 1 (สีลม) <br />
ซึ่งจะแบ่งออกเป็น 2 รอบ คือ รอบช่วงเช้าตั้งแต่เวลา 9.00 น. ถึง 12.00 น. <br />และ รอบช่วงบ่ายตั้งแต่เวลา 13.00 น. ถึง 18.00 น.
                            </span>
                        </div>
                    </div>
                </ParallaxWrapper>
                <section
                    className="indicator-page flex-center diag-blue"
                >   
                    <div className="note">
                        <div className="inner-margin">
                            <div className="w-box">
                                <h2 className="no-margin">สิ่งที่ต้องเตรียมมาในวันสัมภาษณ์</h2>
                                <ol className="no-margin">
                                    <li>บัตรประชาชนสำหรับการแลกบัตรเข้าอาคาร ซี.พี.ทาวเวอร์ 1 (สีลม) และ บัตรนักศึกษาสำหรับการลงทะเบียนสัมภาษณ์ กรุณาแต่งกายด้วยชุดนักศึกษา</li>
                                    <li>การบ้านและสิ่งที่กรรมการสาขากำหนดไว้ กรุณาอ่านรายละเอียดการบ้านและสิ่งที่กรรมการให้เตรียมมาให้ครบถ้วน หากสาขาใดต้องใช้โน้ตบุ๊ค ควรชาร์ตแบตเตอรี่และเตรียมอินเทอร์เน็ตส่วนตัวมาให้พร้อม เนื่องจากสถานที่ไม่มีบริการอินเทอร์เน็ตให้ใช้</li>
                                    <li>Portfolio สามารถนำมาประกอบการสัมภาษณ์ได้ สำหรับน้อง ๆ สาขาดีไซน์จะต้องนำ Portfolio มาด้วยทุกคน</li>
                                </ol>
                            </div>
                            <div className="w-box">
                                <h2 className="no-margin">สอบถามเพิ่มเติมติดต่อ</h2>
                                <ul className="no-margin">
                                    <li><b>พี่เบ๊บ:</b> 064-174-7080</li>
                                    <li><b>พี่ฟง:</b> 092-458-7067</li>
                                    <li><b>พี่เบนซ์</b>: 085-666-7571</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        );
    }
}

export default pageConnect(Index, {
    title: 'Announcement',
    stylesheets: [stylesheet],
    icon: 'static/images/logo-icon.png'
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
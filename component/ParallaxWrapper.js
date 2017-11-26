import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getCoords } from '../function/general';

const Types = ["Image", "Video"];
const scale_factor = 1;

function isMobile() {
    if(document) return 'ontouchstart' in document.documentElement;
    return false;
}

const ParallaxStyled = styled.section`
width: ${props => props.Width};
height: ${props => props.Height};
position: relative;
display: block;
margin: auto;

.content-wrapper {
    position: absolute;
    clip: rect(0, ${props => props.Width}, ${props => props.Height}, 0);
}

.fixed-background {
    transform: translate3d(0, 0, 0);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: ${props => props.OnMobileInput ? 'absolute' : 'fixed'};
    top: 0px;

    width: ${props => props.Width};
    height: 100vh;
    z-index: 1;

    video {
        min-width: ${props => props.Width}; 
        min-height: 100vh;
        width: auto; 
        height: auto;
        z-index: 1;
    }
}

.foreground {
    position: absolute;
    width: ${props => props.Width};
    height: ${props => props.Height};
    z-index: 8;
    box-sizing: border-box;
}

${props => (props.BreakPoint || []).map((bp) => {
    let str = '@media all';
    if(bp.minWidth) str += ` and (min-width: ${bp.minWidth})`;
    if(bp.maxWidth) str += ` and (max-width: ${bp.maxWidth})`;
    str += `{
        height: ${bp.Height};
        width: ${bp.Width};

        .content-wrapper {
            clip: rect(0, ${bp.Width}, ${bp.Height}, 0);
        }

        .fixed-background {
            width: ${bp.Width};
        }

        .foreground {
            height: ${bp.Height};
            width: ${bp.Width};
        }
    }
    `
    return str;
})}

`;

class ParallaxWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: false,
            translateY: 0
        }
        // this.onScroll = this.onScroll.bind(this);
    }

    // onScroll(e) {
    //     if(this.props.Type === "Image") {
    //         const top = window.scrollY;
    //         const screenHeight = window.innerHeight;
    //         const dimension = getCoords(this._parallax);
    //         const isVisible = (top + screenHeight >= dimension.top) && (top <= (dimension.top + dimension.fullHeight))
    //         const percent = Math.min(Math.max(top + screenHeight - dimension.top, 0) / (screenHeight > 0 ? screenHeight : 1), 1);
    //         const percentage = Math.min(Math.max(top + screenHeight - dimension.top - percent*dimension.fullHeight, 0) / (screenHeight > 0 ? screenHeight : 1), 1);
    //         if(isVisible) {
    //             this.setState({
    //                 translateY: Math.round(percentage * (scale_factor - 1) * dimension.fullHeight)
    //             })
    //         }
    //     }
    // }

    componentDidMount() {
        this.setState({
            isMobile: isMobile()
        })
        // document.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        // document.removeEventListener('scroll', this.onScroll);
    }

    render() {
        const props = this.props;
        if(Types.indexOf(props.Type) === -1) return (<div>Invalid Type assigned</div>);
        const isImage = Types.indexOf(props.Type) === 0;
        const fixedBackground = (isImage) ? (
            <div
                className="fixed-background" style={{
                    backgroundImage: `url('${props.Src}')`,
                    transform: `scale(${scale_factor})`
                }}
            />) : (
                <div className="fixed-background"
                    style={this.state.isMobile ? {
                        backgroundImage: `url('${props.VideoPoster}')`
                    } : {}}
                >
                    {
                        (!this.state.isMobile && (
                            <video loop muted autoPlay poster={props.VideoPoster}>
                                <source src={props.Src} type="video/mp4" />
                            </video>
                        ))
                    }
                </div>
            );
        return (
            <ParallaxStyled
                Height={props.Height}
                Width={props.Width}
                BreakPoint={props.BreakPoint}
                OnMobileInput={props.OnMobileInput}
                className={`${props.ParallaxClass} parallax-wrapper`}
            >
                <div className="content-wrapper">
                    {fixedBackground}
                    <div
                        className={`foreground ${props.ForegroundClass ? props.ForegroundClass : ''}`}
                        ref={(node) => this._parallax = node}
                    >
                        {props.children}
                    </div>
                </div>
            </ParallaxStyled>
        );
    }
}

ParallaxWrapper.defaultProps = {
    WithOverlayBg: false,
    OnMobileInput: false
}

ParallaxWrapper.PropTypes = {
    Type: PropTypes.string.isRequired,
    Src: PropTypes.string.isRequired,
    VideoPoster: PropTypes.string,
    Height: PropTypes.string.isRequired,
    Width: PropTypes.string.isRequired,
    WithOverlayBg: PropTypes.bool.isRequired,
    OnMobileInput: PropTypes.bool.isRequired,
    BreakPoint: PropTypes.arrayOf(PropTypes.shape({
        minWidth: PropTypes.string,
        maxWidth: PropTypes.string,
        Height: PropTypes.string.isRequired,
        Width: PropTypes.string.isRequired
    })),
    ForegroundClass: PropTypes.string,
    ParallaxClass: PropTypes.string
}

export default ParallaxWrapper;
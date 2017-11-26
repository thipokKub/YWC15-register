import React, { Component } from 'react';
import styled from 'styled-components';
import { random, onSetState } from '../function/general';
import OutsideClick from './OutsideClick';

const color = {
    "programming": "#58A692",
    "content": "#144DC9",
    "design": "#202D53",
    "marketing": "#5D000F"
}

const CardFlip = styled.div`
    perspective: 1000px;

    .flipper.active {
        transform: rotateY(180deg);
    }

    margin: 20px !important;

    .flipper {
        transition: 0.6s;
        transform-style: preserve-3d;

        position: relative;
        width: 260px;
        height: 306px;
    }

    .front, .back {
        backface-visibility: hidden;
        margin: 0px !important;
        position: absolute;
        top: 0;
        left: 0;
    }

    .front {
        z-index: 20;
        transform: rotateY(0deg);
    }

    .back {
        z-index: 18;
        transform: rotateY(180deg)
    }
`;

const ProfileCardStyle = styled.div`
    margin: 0px !important;
    display: inline-flex;
    position: relative;
    width: 260px;
    height: 306px;
    box-sizing: border-box;
    flex-direction: column;
    align-items: center;
    background-color: #FFF;
    padding: 0px;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.2), 0 4px 20px 0 rgba(0,0,0,0.19);

    &:hover {
        box-shadow: 0 6px 15px 0 rgba(0,0,0,0.2), 0 6px 30px 0 rgba(0,0,0,0.19);
    }

    &:active {
        box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2), 0 2px 10px 0 rgba(0,0,0,0.19);
    }

    div.profileImg {
        margin: 0px !important;
        height: 150px;
        min-height: 150px;
        max-height: 150px;
        width: 100%;
        box-sizing: border-box;
        background-color: ${props => props.color};
        padding-top: 20px;

        div.img {
            height: 150px;
            min-height: 150px;
            max-height: 150px;
            width: 150px;
            min-width: 150px;
            max-width: 150px;
            background-repeat: no-repeat;
            background-size: contain;
            background-image: url('${props => props.src}');
        }

        div.positioning {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    div.content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        margin-top: 15px;
        padding: 20px;
    }

    div.code {
        height: 100%;
        width: 100%;
        margin: 0px !important;

        span {
            display: block;
            position: absolute;
            height: 50%;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            margin: 0px !important;
            padding: 20px;
        }

        span:first-child {
            background-color: ${props => props.color};
            top: 0;
            align-items: flex-end;
            font-size: 1.5em;
        }

        span:last-child {
            bottom: 0;
        }
    }
`;

const mapWord = {
    'design': 'Web Design',
    'programming': 'Web Programming',
    'marketing': 'Web Marketing',
    'content': 'Web Content'
}

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        }
        this.onClick = this.onClick.bind(this);
        this.onResetState = this.onResetState.bind(this);
    }

    onClick() {
        onSetState(this, 'isActive', !this.state.isActive);
    }

    onResetState() {
        onSetState(this, 'isActive', false);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const props = this.props;
        const Src = (() => {
            switch(props.major) {
                case "programming":
                    return "static/images/major/programming.png"
                case "marketing":
                    return "static/images/major/marketing.png"
                case "design":
                    return "static/images/major/design.png"
                case "content":
                    return "static/images/major/content.png"
            }
        })();
        return (
            <CardFlip>
                <OutsideClick
                    onClickOutside={this.onResetState}
                >
                    <div className={`flipper ${this.state.isActive ? 'active' : ''}`} onClick={this.onClick}>
                        <div className="front">
                            <ProfileCardStyle
                                src={Src}
                                color={color[props.major]}
                            >
                                <div className="profileImg">
                                    <div className="positioning">
                                        <div className="img" />
                                    </div>
                                </div>
                                <div className="content text-center">
                                    <p>{props.firstName} {props.lastName}</p>
                                    <p>{mapWord[props.major]}</p>
                                </div>
                            </ProfileCardStyle>
                        </div>
                        <div className="back">
                            <ProfileCardStyle
                                className="flex-center"
                                color={color[props.major]}
                            >
                                <div className="code">
                                    <span
                                        style={{
                                            color: '#FFF'
                                        }}
                                    >Interview code</span>
                                    <span>{props.interviewRef}</span>
                                </div>
                            </ProfileCardStyle>
                        </div>
                    </div>
                </OutsideClick>
            </CardFlip>
        );
    }
}

export default ProfileCard;
import React, { Component } from 'react';
import Head from 'next/head';
import _ from 'lodash';

function TypeFunc(obj) {
    return typeof obj === "function";
}

export default function (ComposedComponent, params) {

    const stylesheets = _.get(params, 'stylesheets');

    class wrappedComponent extends Component {
        
        constructor(props) {
            super(props);
            this.state = {
                hasError: false
            }
            this.onSetState = this.onSetState.bind(this);
        }

        componentDidMount() {
            this._isMounted = true;
        }

        componentWillUnmount() {
            this._isMounted = false;
        }

        onSetState(name, value) {
            if (this._isMounted) {
                this.setState((prevState) => {
                    let new_state = { ...prevState };
                    new_state[name] = value;
                    return {
                        ...new_state
                    }
                })
            }
        }

        componentDidCatch(error, info) {
            this.onSetState('hasError', true);
            if (params && typeof params.onError === "function") params.onError(error, info);
        }

        render() {
            const alternative = _.get(params, 'onErrorJSX', () => <span>{`Sorry, something went wrong :-(`}</span>);
            if (this.state.hasError) {
                return alternative(this.props);
            }

            if (stylesheets !== null && typeof stylesheets !== "undefined" && stylesheets.constructor === Array) {
                let isValidate = stylesheets.reduce((bool, txt) => {
                    if (bool) return bool && typeof txt === "string";
                    return bool;
                }, true);
                if (isValidate) {
                    return (
                        <div>
                            <Head>
                                {
                                    stylesheets.map((txt, index) => {
                                        return (<style key={index} dangerouslySetInnerHTML={{ __html: txt }} />);
                                    })
                                }
                            </Head>
                            <ComposedComponent
                                {...this.props}
                                onSetState={this.onSetState}
                                state={this.state}
                            >
                                {this.props.children}
                            </ComposedComponent>
                        </div>
                    );
                }
            }

            return (
                <ComposedComponent
                    {...this.props}
                    onSetState={this.onSetState}
                    state={this.state}
                >
                    {this.props.children}
                </ComposedComponent>
            );
        }
    }

    return wrappedComponent;
}
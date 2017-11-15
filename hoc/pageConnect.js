import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withRedux from 'next-redux-wrapper'
import initStore from '../redux/store';
import rootActions from '../redux/actions/index';

import Router from 'next/router'
import NProgress from 'nprogress'
import Head from 'next/head';
import _ from 'lodash';

Router.onRouteChangeStart = (url) => {
    NProgress.start()
}
Router.onRouteChangeComplete = () => setTimeout(() => {
    NProgress.done()
}, 200);
Router.onRouteChangeError = () => setTimeout(() => {
    NProgress.done()
}, 200);

export default function (ComposedComponent, options) {
    class connecting extends Component {
        render() {
            const stylesheets = _.get(options, 'stylesheets', []);
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
                            <ComposedComponent {...this.props}>
                                {this.props.children}
                            </ComposedComponent>
                        </div>
                    );
                }
            }
            return (
                <ComposedComponent {...this.props}>
                    {this.props.children}
                </ComposedComponent>
            );
        }
    };
    function mapStateToProps(state) {
        return { ...state };
    }
    function mapDispatchToProps(dispatch) {
        return bindActionCreators({ ...rootActions }, dispatch);
    }
    return withRedux(initStore, mapStateToProps, mapDispatchToProps)(connecting);
}

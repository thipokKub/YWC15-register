import Document, { Head, Main, NextScript } from 'next/document'
// import flush from 'styled-jsx/server'
import stylesheet from '../constraint/variables.scss';
import defaultStyle from './style/default.scss';
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
    static getInitialProps({ renderPage }) {
        // const { html, head, errorHtml, chunks } = renderPage()
        // const styles = flush()
        // return { html, head, errorHtml, chunks, styles }
        const sheet = new ServerStyleSheet()
        const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
        const styleTags = sheet.getStyleElement()
        return { ...page, styleTags }
    }

    render() {
        return (
            <html>
                <Head>
                    <title>My page</title>
                    <link rel='stylesheet' type='text/css' href='/static/resources/nprogress.css' />
                    <link rel='stylesheet' type='text/css' href='/static/resources/font-awesome-4.7.0/css/font-awesome.min.css' />
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, minimum-scale=1.0, target-densitydpi=device-dpi" />
                    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
                    <style dangerouslySetInnerHTML={{ __html: defaultStyle }} />
                    <script dangerouslySetInnerHTML={{__html: `
//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};
                    `}} />
                    {this.props.styleTags}
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}
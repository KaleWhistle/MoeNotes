/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 16/3/18
 * Description: Entry.
 */

'use strict';

import { parse } from './parser';
import React from 'react';
import ReactDom from 'react-dom';
import { debounce } from 'lodash';
import AceEditor from './editor';

import 'brace/ext/searchbox';
import 'brace/mode/markdown';
import './theme/styles/magic-book';

import './theme/styles/sky.css';
import './theme/styles/highlight.css';
import './theme/styles/katex.css';

class Content extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            markdown: "",
            html : ""
        };
    }

    parsePage(value){
        this.setState({
            markdown: value,
            html: parse(value)
        });
    }

    onChange(value){
        debounce(this.parsePage.bind(this), 10)(value);
    }

    onScroll(percent){
        var domNode = React.findDOMNode(this.refs.preview);
        domNode.scrollTop = percent * domNode.scrollHeight;
    }

    render(){
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.styles = {
            content: {
                background: "red",
                left: 20,
                width: width - 200,
                height: height * 0.8
            },
            src: {
                background: "rgba(200,200,200, 0.6)"
            },
            dist: {
                background: "rgba(255,255,255, 0.6)"
            },
            text: {
                background: "none"
            }
        };
        return (
            <div style={this.styles.content}>
                <div
                    className="page"
                    style={this.styles.src}
                >
                    <AceEditor
                        className="page-text"
                        style={this.styles.text}
                        name="src"
                        value={this.state.markdown}
                        fontSize={14}
                        onChange={this.onChange.bind(this)}
                        onChangeScrollTop={this.onScroll.bind(this)}
                        mode="markdown"
                        theme="magic-book"
                        showGutter={false}
                        showPrintMargin={false}
                        wrapEnabled={true}
                        editorProps={{$blockScrolling: true}}
                    />
                </div>
                <div
                    className="page"
                    style={this.styles.dist}
                >
                    <div
                        ref="preview"
                        className="page-text"
                        style={this.styles.text}
                        dangerouslySetInnerHTML={{__html: this.state.html}}
                    >
                    </div>
                </div>
            </div>
        );
    }
}

export default Content;
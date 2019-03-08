import React, { Component } from 'react';
import { requireNativeComponent, NativeModules, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { AEMultiWebViewManager } = NativeModules;

export default class MultiWebView extends Component {
  static propTypes = WebView.propTypes;

  constructor(props) {
    super(props);
    this.webviewRefs = [React.createRef()];
    this.state = {
      webviews: [
        this.generateWebView(0, null),
      ],
    };
  }

  onCreateWebView = ({ nativeEvent: { lockIdentifier } }) => {
    const { webviews } = this.state;
    const newWebView = this.generateWebView(webviews.length, lockIdentifier);
    this.webviewRefs = [...this.webviewRefs, React.createRef()];
    this.setState({
      webviews: [
        ...webviews,
        newWebView,
      ]
    });
  }

  generateWebView = (key, premadeWebViewIdentifier) => {
    return (
      <WebView
        {...this.props}
        ref={this.webviewRefs[key]}
        key={key}
        nativeConfig={{
          component: AEMultiWebView,
          viewManager: AEMultiWebViewManager,
          props: {
            premadeWebViewIdentifier,
            onCreateWebView: this.onCreateWebView,
          },
        }}
      />
    );
  }

  render() {
    const { webviews } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {
          webviews.map((webview) => {
            return webview;
          })
        }
      </View>
    );
  }
}

const AEMultiWebView = requireNativeComponent(
  'AEMultiWebView',
  MultiWebView,
  WebView.extraNativeComponentConfig
);

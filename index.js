import React, { Component } from 'react';
import {
  requireNativeComponent,
  NativeModules,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { TabBar, TabBarIndicator, TabView } from 'react-native-tab-view';

const { AEMultiWebViewManager } = NativeModules;

export default class MultiWebView extends Component {
  static propTypes = WebView.propTypes;

  constructor(props) {
    super(props);
    this.webviewRefs = [React.createRef()];
    this.state = {
      index: 0,
      routes: [
        { key: 0, title: 'Tab 0' },
      ],
      webviews: [
        this.generateWebView(0, null),
      ],
    };
  }

  findNewKey = () => {
    return this.state.routes.reduce((a, b) => { key: Math.max(a.key, b.key) }).key + 1;
  }

  onCreateWebView = ({ nativeEvent: { lockIdentifier } }) => {
    const { routes, webviews } = this.state;
    const newIndex = this.state.webviews.length;
    this.webviewRefs = [...this.webviewRefs, React.createRef()];
    const newWebView = this.generateWebView(newIndex, lockIdentifier);
    this.setState({
      index: newIndex,
      routes: [
        ...routes,
        { key: newIndex, title: `Tab ${newIndex}` },
      ],
      webviews: [
        ...webviews,
        newWebView,
      ],
    });
  }

  generateWebView = (key, premadeWebViewIdentifier) => {
    const jsx = (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          {...this.props}
          ref={this.webviewRefs[key]}
          key={key}
          style={{ flex: 1 }}
          nativeConfig={{
            component: AEMultiWebView,
            viewManager: AEMultiWebViewManager,
            props: {
              premadeWebViewIdentifier,
              onCreateWebView: this.onCreateWebView,
            },
          }}
        />
      </SafeAreaView>
    );
    return { index: key, jsx };
  }

  onClose = () => {
    const { index, routes, webviews } = this.state;
    if (routes.length === 1) {
      return;
    }

    let newRoutes = [...routes];
    newRoutes.splice(index, 1);
    // newRoutes = newRoutes.map((route, index) => {
    //   return { key: index, title: route.title };
    // });

    const newWebviews = [...webviews];
    newWebviews.splice(index, 1);

    const newWebviewRefs = [...this.webviewRefs];
    newWebviewRefs.splice(index, 1);

    // TODO: last index?
    let newIndex = newRoutes[0].key;

    this.setState({
      index: newIndex,
      routes: newRoutes,
      webviews: newWebviews,
    }, () => {
      this.webviewRefs = newWebviewRefs;
    });
  }

  onBack = () => {
    this.webviewRefs[this.state.index].current.goBack();
  }

  onForward = () => {
    this.webviewRefs[this.state.index].current.goForward();
  }

  renderTabs = (props) => {
    return (
      <SafeAreaView style={{ backgroundColor: '#3179cd' }}>
        <View style={{ height: 40, alignItems: 'center', flexDirection: 'row' }}>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <TouchableOpacity onPress={this.onClose}>
              <Text style={{ color: '#fff', paddingLeft: 10, paddingRight: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableOpacity onPress={this.onBack}>
              <Text style={{ color: '#fff', paddingLeft: 10, paddingRight: 10 }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onForward}>
              <Text style={{ color: '#fff', paddingLeft: 10, paddingRight: 10 }}>Forward</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TabBar
          scrollEnabled
          style={{ backgroundColor: '#3179cd' }}
          {...props}
        />
      </SafeAreaView>
    );
  }

  render() {
    const { webviews } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TabView
          style={{ backgroundColor: '#fff' }}
          tabBarPosition='bottom'
          swipeEnabled={false}
          navigationState={this.state}
          onIndexChange={index => this.setState({ index })}
          renderScene={({ route, jumpTo }) => {
            return webviews.find(({ index }) => index === route.key).jsx;
          }}
          renderTabBar={this.renderTabs}
        />
      </View>
    );
  }
}

const AEMultiWebView = requireNativeComponent(
  'AEMultiWebView',
  MultiWebView,
  WebView.extraNativeComponentConfig
);

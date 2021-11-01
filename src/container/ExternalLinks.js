/** 
* Webkul Software. 
* 
* @category Webkul 
* @package Webkul_Mobikul_React_WooCommerce
* @author Webkul
* @copyright Copyright (c) 2010-2018 WebkulSoftware Private Limited (https://webkul.com) 
* @license https://store.webkul.com/license.html 
* 
*/
import React from "react";
import {SafeAreaView} from 'react-native'
import { SCREEN_WIDTH, } from "../utility/UtilityConstant";
import ThemeConstant from "../app_constant/ThemeConstant";
import CustomActionbar from "./CustomActionbar";

import MyWebView from "../component/MyWebView";
import { strings } from "../localize_constant/I18";

export default class ExternalLinks extends React.Component {
    state ={
        url : "",
        title : ""
    }
  WebView = null;

    componentDidMount(){
      console.log("componentDidMountUrl->>>>", this.props.navigation.getParam("url", ""));      
      
        this.setState({
            url : this.props.navigation.getParam("url", ""),
            title : this.props.navigation.getParam("title", "")
        })
    }

    _onNavigationStateChange({url}){
      console.log("_onNavigationStateChange", url == this.state.url);
      
      if ( url == "about:blank" || url == this.state.url) {
         this.WebView.stopLoading();
         return true;
      }else{
        return false;
      }

    }
    _onBackPress = () => {
        this.props.navigation.pop();
      };
  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          title={this.state.title}
          backwordTitle={strings("BACK")}
          backwordImage={"close-cross"}
          _onBackPress={this._onBackPress.bind(this)}
        />
        <MyWebView
        ref = {(webView=> this.WebView = webView)}
          source={{ uri: this.state.url }}
          automaticallyAdjustContentInsets={true}
          // onShouldStartLoadWithRequest={this._onNavigationStateChange.bind(this)}
          // onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          scalesPageToFit={true}
          width={SCREEN_WIDTH}
          startInLoadingState={true}
          scrollEnabled={true}
          height={20}
          isFull = {true}
          style={{
            padding: ThemeConstant.MARGIN_NORMAL ,
            height: 20,
            elevation: -1,
          }}
        />
      </SafeAreaView>
    );
  }
}

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
import React from 'react';
import {
    View,
} from 'react-native';
import CustomActionbar from './CustomActionbar';
import StringConstant from '../app_constant/StringConstant';
import ThemeConstant from '../app_constant/ThemeConstant';
import {
    isStringEmpty,
    width,
} from '../utility/UtilityConstant';
import AutoHeightWebView from '../component/AutoHeightWebview';
import ViewStyle from '../app_constant/ViewStyle';
import { strings, localeObject } from '../localize_constant/I18';

export default class ProductDescription extends React.Component {
    state = {
        description: '<p> No description Found. </p>',
        showmore: false,
    };

    componentDidMount() {
        let des = this.props.navigation.getParam(
            'description',
            '<p>No description Found.</p>',
        );
        if (!isStringEmpty(des)) {
            if(localeObject.isRTL){
                des = "<html dir=\"rtl\" lang=\"\"><body>" + des + "</body></html>";
            }
            this.setState({
                description: des,
            });
        }
    }
    _onBackPress = () => {
        this.props.navigation.pop();
    };
    render() {
        return (
            <View
                style={ViewStyle.mainContainer}>
                <CustomActionbar
                    title={strings("PRODUCT_DESCRIPTION")}
                    backwordTitle={strings("BACK")}
                    backwordImage={'close-cross'}
                    _onBackPress={this._onBackPress.bind(this)}
                />
                <AutoHeightWebView
                    // default width is the width of screen
                    // if there are some text selection issues on iOS, the width should be reduced more than 15 and the marginTop should be added more than 35
                    style={{
                        width: width - (2 * ThemeConstant.MARGIN_GENERIC),
                        margin: ThemeConstant.MARGIN_GENERIC,
                    }}
                    customScript={`document.body.style.background = 'white';`}
                    // add custom CSS to the page's <head>
                    customStyle={`
      * {
        font-family: 'Times New Roman';
      }
      p {
        font-size: 14px;
      }
    `}
                    // either height or width updated will trigger this
                    onSizeUpdated={size => {
                        console.log(size.height);
                    }}
                    /*
              use local or remote files
              to add local files:
              add baseUrl/files... to android/app/src/assets/ on android
              add baseUrl/files... to project root on iOS
              */
                    files={[
                        {
                            href: 'cssfileaddress',
                            type: 'text/css',
                            rel: 'stylesheet',
                        },
                    ]}
                    // baseUrl now contained by source
                    // 'web/' by default on iOS
                    // 'file:///android_asset/web/' by default on Android
                    // or uri
                    source={{ html: this.state.description }}
                    // disables zoom on ios (true by default)
                    zoomable={false}
                /*
          other react-native-webview props
          */
                />
            </View>
        );
    }
}

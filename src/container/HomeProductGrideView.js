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
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { CustomImage } from "./CustomImage";
import { isStringEmpty } from "../utility/UtilityConstant";
import CustomIcon2 from "./CustomIcon2";
import { localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import ProductContext from "../context/ProductContext";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class HomeProductGridView extends React.PureComponent {
  static contextType = ProductContext;

  _OnPressOut = () => {
    // this.props.onPressOut(this.props.productData);
    this.context.onPressProduct(this.props.productData)
  };
  onPressWishList = () => {
    this.props.onPressWishlist(this.props.productData);
  }
  render() {
    let product = this.props.productData;
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <TouchableOpacity activeOpacity={1} onPress={this._OnPressOut.bind(this)} style={[styles.product_container]}>
        <CustomImage
          image={product.banner_image}
          imagestyle={styles.imagestyle}
          onPress={this._OnPressOut.bind(this)}
          dominantColor={product.dominantColor}
        />
        <View style={styles.productInfoTheme}>
          <View style={[{ flexDirection: "row", alignItems: "center", alignSelf:"stretch" }, globleViewStyle]} >
            <Text style={[styles.secondaryTextTheme]} numberOfLines={2}>
              {product.price}
            </Text>
            {!isStringEmpty(product.regular_price) ?
              <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                {product.regular_price}
              </Text>
              : null}
          </View>

          <Text
            style={[styles.firstTextTheme, globalTextStyle]}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {product.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    flexDirection: "column",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    padding: ThemeConstant.MARGIN_TINNY,
    width: (SCREEN_WIDTH / 2) - (2 * ThemeConstant.MARGIN_TINNY),
    borderWidth: 0.3,
    borderColor: ThemeConstant.LINE_COLOR_2,
    // borderRadius: 5,
    alignItems: "stretch",
    justifyContent: "flex-start",
    alignContent: 'center',
    alignSelf: "stretch",
  },
  imagestyle: {
    alignSelf: "center",
    width: (SCREEN_WIDTH / 2) - (4 * ThemeConstant.MARGIN_TINNY), /// Total Margin count half minus
    height: (SCREEN_WIDTH / 2) - (4 * ThemeConstant.MARGIN_TINNY),
  },
  productInfoTheme: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    padding: ThemeConstant.MARGIN_TINNY,
    width: (SCREEN_WIDTH / 2) - (4 * ThemeConstant.MARGIN_TINNY),
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: '300',
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    width: (SCREEN_WIDTH / 2) - (7.5 * ThemeConstant.MARGIN_TINNY),
  },
  secondaryTextTheme: {
    // alignSelf: "stretch",
    // textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: 'bold',
  },
  regularPriceTextTheme: {
    textDecorationLine: "line-through",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
  }
});

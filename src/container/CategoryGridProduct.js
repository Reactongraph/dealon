import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { CustomImage } from "./CustomImage";
import RatingView from "../component/RatingView";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject } from "../localize_constant/I18";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class CategoryGridProduct extends React.Component {
  _onPressProduct = () => {
    this.props.onPress(this.props.productData);
  };
  shouldComponentUpdate(newProps, newState) {
    return false;
  }
  onPressWishlist=()=>{
    this.props.onPressWishlist(this.props.productData);
  }
  render() {
    let product = this.props.productData;
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this._onPressProduct.bind(this)}
        style={styles.product_container}>
        <View>
          <CustomImage
            image={product.image}
            imagestyle={styles.imagestyle}
            onPress={this._onPressProduct.bind(this)}
            dominantColor={product.dominantColor}
          />
          <View style={[styles.productInfoTheme, {alignItems: localeObject.isRTL ? "flex-end": "flex-start"}]}>
            <View style={[{ flexDirection: "row", alignItems: "center" }, globleViewStyle]}>
              <Text style={styles.secondaryTextTheme} numberOfLines={2}>
                {product.price}
              </Text>
              <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                {product.regular_price}
              </Text>
            </View>

            <Text style={[styles.firstTextTheme, globalTextStyle]} numberOfLines={2}>
              {product.title}
            </Text>

            <RatingView
                ratingValue={product.average_rating}
                iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
              />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    width: SCREEN_WIDTH / 2,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "column",
    borderWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR,
    padding: ThemeConstant.MARGIN_TINNY,
  },
  imagestyle: {
    alignSelf: "center",
    // width: SCREEN_WIDTH / 2.1,
    // height: SCREEN_WIDTH / 3
    width: SCREEN_WIDTH / 2 - (2 * ThemeConstant.MARGIN_TINNY),
    height: SCREEN_WIDTH / 2 - 2 * ThemeConstant.MARGIN_TINNY
  },
  productInfoTheme: {
    flex: 6,
    alignSelf: "stretch",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: ThemeConstant.MARGIN_GENERIC,
    paddingBottom: ThemeConstant.MARGIN_GENERIC,
    width: SCREEN_WIDTH / 2 - (2 * ThemeConstant.MARGIN_TINNY)
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: "400",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginTop: ThemeConstant.MARGIN_TINNY,
    marginBottom: ThemeConstant.MARGIN_TINNY,
  },
  secondaryTextTheme: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  regularPriceTextTheme: {
    textDecorationLine: "line-through",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_TINNY_TEXT_SIZE,
    marginHorizontal: ThemeConstant.MARGIN_TINNY,
  },
  buttonStyle: {
    width: 120,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    marginTop: ThemeConstant.MARGIN_TINNY,
    alignSelf: "baseline"
  },
  buttonTextStyle: {
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    borderRadius: 4
  }
});

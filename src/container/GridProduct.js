import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import ThemeConstant from "../app_constant/ThemeConstant";

import { CustomImage } from "./CustomImage";
import RatingView from "../component/RatingView";
import TextStyle from "../app_constant/TextStyle";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class GridProduct extends React.PureComponent {
  _onPressProduct = () => {
    this.props.onPress(this.props.productData);
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    let product = this.props.productData;
    return (
      <View style={styles.product_container}>
        <View>
          <CustomImage
            image={product.image}
            imagestyle={styles.imagestyle}
            onPress={this._onPressProduct.bind(this)}
            dominantColor={product.dominantColor}
          />
          <View
            style={[
              styles.productInfoTheme,
              {
                justifyContent: localeObject.isRTL ? "flex-end" : "flex-end",
                alignItems: localeObject.isRTL ? "flex-end" : "flex-end"
              }
            ]}
          >
            <Text
              style={[styles.firstTextTheme, globalTextStyle]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {product.name}
            </Text>
            <View
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: ThemeConstant.MARGIN_GENERIC
                },
                globleViewStyle
              ]}
            >
              <Text style={styles.secondaryTextTheme} numberOfLines={2}>
                {product.price}
              </Text>
              <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                {product.regular_price}
              </Text>
            </View>

            <RatingView
              ratingValue={product.average_rating}
              iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
            />

            <Button
              title={
                product.product_type == "simple"
                  ? strings("ADD_TO_CART")
                  : strings("VIEW_PRODUCT")
              }
              titleStyle={styles.buttonTextStyle}
              buttonStyle={styles.buttonStyle}
              onPress={() => this.props.onPressAddToCart(product)}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "column",
    borderWidth: 1,
    borderRadius: 4,
    margin: ThemeConstant.MARGIN_TINNY,
    borderColor: ThemeConstant.LINE_COLOR,
    padding: ThemeConstant.MARGIN_TINNY
  },
  imagestyle: {
    alignSelf: "center",
    width: SCREEN_WIDTH / 2.7,
    height: SCREEN_WIDTH / 2.7
  },
  productInfoTheme: {
    alignSelf: "stretch",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: ThemeConstant.MARGIN_GENERIC,
    width: SCREEN_WIDTH / 2.7
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE
  },
  secondaryTextTheme: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE
  },
  regularPriceTextTheme: {
    flex: 1,
    textDecorationLine: "line-through",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_TINNY_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_TINNY
  },
  buttonStyle: {
    width: 120,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    alignSelf: "baseline"
  },
  buttonTextStyle: {
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    borderRadius: 4
  }
});

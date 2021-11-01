import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { CustomImage } from "./CustomImage";
import RatingView from "../component/RatingView";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject } from "../localize_constant/I18";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class CategoryListProduct extends React.Component {
  _onPressProduct = () => {
    this.props.onPress(this.props.productData);
  };
  onPressWishlist = () => {
    this.props.onPressWishlist(this.props.productData);
  };
  shouldComponentUpdate(newProps, newState){
    return false;  
  }
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    let product = this.props.productData;
    return (
      <TouchableOpacity
      activeOpacity = {1}
        onPress={this._onPressProduct.bind(this)}
        style={[styles.product_container, globleViewStyle]}
      >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <CustomImage
          image={product.image}
          imagestyle={styles.imagestyle}
          onPress={this._onPressProduct.bind(this)}
          dominantColor = {product.dominantColor}
        />
        </View>
        <View style={[styles.productInfoTheme, {alignItems:localeObject.isRTL ? "flex-end" : "flex-start"}]}>
          
        <View style={[{flexDirection:'row', alignItems:"center"}, globleViewStyle]} >
          <Text style={styles.secondaryTextTheme} numberOfLines={2}>
            {product.price}
          </Text>
          <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
            {product.regular_price}
          </Text>
        </View>

          <Text
            style={[styles.firstTextTheme, globalTextStyle]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {product.title}
          </Text>
          <RatingView
            ratingValue={product.average_rating}
            iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
          />
        </View>
      
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderColor: ThemeConstant.LINE_COLOR,
    padding: ThemeConstant.MARGIN_TINNY
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3
  },
  productInfoTheme: {
    alignSelf: "stretch",
    // justifyContent: "center",
    justifyContent:"flex-start",
    alignItems:"flex-start",
    paddingLeft:ThemeConstant.MARGIN_GENERIC,
    paddingTop:ThemeConstant.MARGIN_TINNY,
    paddingBottom:ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_TINNY,
    width: (SCREEN_WIDTH - (SCREEN_WIDTH / 3)) - (2 * ThemeConstant.MARGIN_TINNY),
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: "400",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color:ThemeConstant.DEFAULT_TEXT_COLOR,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
  },
  secondaryTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: "600",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color:ThemeConstant.DEFAULT_TEXT_COLOR
  },
  regularPriceTextTheme: {
    textDecorationLine: "line-through",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginHorizontal : ThemeConstant.MARGIN_TINNY,
  }
});

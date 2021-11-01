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
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject } from "../localize_constant/I18";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class ItemOrderProductReview extends React.PureComponent {

  onPressProduct = () => {
      if(this.props.onPressProduct){
        this.props.onPressProduct(this.props.productData);
      }
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    let productData = this.props.productData ? this.props.productData : {};
    return (
      <View style={[styles.product_container, globleViewStyle]}>
        <CustomImage
          image={productData.image}
          imagestyle={styles.imagestyle}
          onPress={this.onPressProduct.bind(this)}
          dominantColor = {productData.dominantColor}
        />
        <TouchableOpacity
          style={styles.productInfoTheme}
          activeOpacity ={1}
        >
          <Text style={[styles.firstTextTheme, globalTextStyle]} numberOfLines={2}>
            {productData.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 0.5,
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
    justifyContent:"center",
    alignItems:"flex-start",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_TINNY,
    width: SCREEN_WIDTH - SCREEN_WIDTH / 3 - 2 * ThemeConstant.MARGIN_TINNY
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: "400",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginBottom: ThemeConstant.MARGIN_GENERIC
  },
  secondaryTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginTop:ThemeConstant.MARGIN_GENERIC
  },
  secondaryTextHeadingTheme: {
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold"
  }
});

import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { CustomImage } from "../CustomImage";
import RatingView from "../../component/RatingView";
import { localeObject, strings } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class SellerListItem extends React.PureComponent {
  onPressSeller = () => {
    this.props.onPressSeller(this.props.sellerData);
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    let seller = this.props.sellerData ? this.props.sellerData : {};
    return (
      <View style={[styles.product_container, globleViewStyle]}>
        <CustomImage
          image={seller.logo}
          imagestyle={styles.imagestyle}
          onPress={this.onPressSeller.bind(this)}
          dominantColor = {seller.dominantColor}
        />
        <TouchableOpacity
        activeOpacity = {1}
          style={styles.productInfoTheme}
        //   onPress={this.onPressSeller.bind(this)}
        >
          <Text style={[styles.firstTextTheme, globalTextStyle]} numberOfLines={2}>
            {seller.name}
          </Text>
          <RatingView
            ratingValue={seller.average_rating.average}
            iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
          />
          <Text style={[styles.secondaryTextTheme, globalTextStyle]} numberOfLines={1}>
             {strings("SELLER_TOTAL_PRODUCTS") }
            <Text style={styles.secondaryTextHeadingTheme}>
              {seller.product_count}
            </Text>
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
    justifyContent:"flex-start",
    alignItems:"flex-start",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    paddingHorizontal: ThemeConstant.MARGIN_TINNY,
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

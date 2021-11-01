import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { CustomImage } from "../CustomImage";
import StringConstant from "../../app_constant/StringConstant";
import { Button } from "react-native-elements";
import CustomIcon2 from "../CustomIcon2";
import { localeObject, strings } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class SellerOrderProduct extends React.PureComponent {
  _onPressViewProduct = () => {
    this.props._onPressViewProducts(this.props.productData);
  };
  onPressWriteReview = () => {
    this.props.onPressWriteReview(this.props.productData);
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    let product = this.props.productData;
    return (
      <View style={[styles.product_container, globleViewStyle]}>
        <CustomImage
          image={product.product_image}
          imagestyle={styles.imagestyle}
          onPress={this._onPressViewProduct.bind(this)}
        />
        <View style={[styles.productInfoTheme, {alignItems:localeObject.isRTL?"flex-end":"flex-start"}]}>
          <Text
            style={[styles.firstTextTheme, globalTextStyle]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {product.name}
          </Text>
          <View style={[styles.viewRowStyle, globleViewStyle]}>
            <Text style={styles.secondaryGrayTextTheme}>
              {strings("QTY_")}
            </Text>
            <Text style={[styles.secondaryTextTheme, {textAlign:localeObject.isRTL?"right":"left"}]} numberOfLines={1}>
              {product.quantity}
            </Text>
          </View>
          <View style={[styles.viewRowStyle, globleViewStyle]}>
            <Text style={styles.secondaryGrayTextTheme}>
              {strings("SUBTOTAL") }
            </Text>
            <Text>:</Text>
            <Text style={[styles.secondaryTextTheme, {textAlign:localeObject.isRTL?"right":"left"}]} numberOfLines={1}>
              {product.total}
            </Text>
          </View>

          {this.props.isReviewButtonVisible ? (
            <Button
              title={strings("WRITE_REVIEWS")}
              icon={
                <CustomIcon2
                  name="post-edit"
                  size={ThemeConstant.DEFAULT_ICON_SIZE_Normal}
                  color={ThemeConstant.ACCENT_BUTTON_TEXT_COLOR}
                />
              }
              titleStyle={{
                color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
                fontWeight: "500",
                fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                textAlignVertical:"center"
              }}
              buttonStyle={{ marginTop:ThemeConstant.MARGIN_NORMAL, alignSelf:"flex-start", backgroundColor:ThemeConstant.ACCENT_COLOR, paddingLeft:ThemeConstant.MARGIN_GENERIC, paddingRight:ThemeConstant.MARGIN_GENERIC, paddingTop:ThemeConstant.MARGIN_TINNY, paddingBottom:ThemeConstant.MARGIN_TINNY}}
              onPress={this.onPressWriteReview.bind(this)}
            />
          ) : null}

          {/* <FlatList
            data={product.variation}
            renderItem={({ item }) => {
              return (
                <View style={styles.variationContainer}>
                  <Text style={styles.variationTitleStyle}>{item.title}</Text>
                  <Text style={styles.variationValueStyle}>{item.option}</Text>
                </View>
              );
            }}
            keyExtractor={item => item.name}
          /> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderColor: ThemeConstant.LINE_COLOR,
    marginBottom: ThemeConstant.MARGIN_TINNY
  },
  imagestyle: {
    width: SCREEN_WIDTH / 3.7,
    height: SCREEN_WIDTH / 3.7
  },
  productInfoTheme: {
    flex: 1,
    alignItems: "stretch",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    marginHorizontal: ThemeConstant.MARGIN_GENERIC
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR
  },
  viewRowStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: ThemeConstant.MARGIN_GENERIC
  },
  secondaryTextTheme: {
    flex: 2,
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginHorizontal:ThemeConstant.MARGIN_TINNY
  },
  secondaryGrayTextTheme: {
    textAlign: "left",
    flex: 1,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  variationContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 0.5,
    width: "100%"
  },
  variationTitleStyle: {
    backgroundColor: ThemeConstant.INPUT_TEXT_BACKGROUND_COLOR,
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    padding: ThemeConstant.MARGIN_TINNY,
    width: "40%"
  },
  variationValueStyle: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    padding: ThemeConstant.MARGIN_TINNY,
    borderColor: ThemeConstant.LINE_COLOR
    // width : "60%",
  }
});

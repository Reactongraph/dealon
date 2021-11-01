import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { CustomImage } from "../CustomImage";
import CustomIcon2 from "../CustomIcon2";
import { localeObject } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class SellerProductView extends React.PureComponent {
  _onPressViewProduct = () => {
    this.props.onPressViewProduct(this.props.productData);
  };
  render() {
    let product = this.props.productData;
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <TouchableOpacity
      activeOpacity = {1}
        touchableHighlightStyle={{
          backfaceVisibility: "hidden"
        }}
        onPress={this._onPressViewProduct.bind(this)}
        style={[styles.product_container, globleViewStyle]}
      >
        <CustomImage
          image={product.image}
          imagestyle={styles.imagestyle}
          onPress={this._onPressViewProduct.bind(this)}
          dominantColor = {product.dominantColor}
        />
        <View style={[styles.productInfoTheme, {alignItems:localeObject.isRTL ? "flex-end" : "flex-start"}]}>
          <Text style={styles.firstTextTheme} numberOfLines={2}>
            {product.title}
          </Text>
          <Text
            style={
              product.stock == "instock"
                ? styles.inStockStyle
                : styles.outOfStockStyle
            }
            numberOfLines={1}
          >
            {product.stock}
          </Text>
          <Text style={styles.secondaryTextTheme} numberOfLines={1}>
            {product.status}
          </Text>
          <Text style={styles.secondaryTextTheme} numberOfLines={1}>
            {product.price}
          </Text>
          <Text style={{ textDecorationLine: "line-through" }}>
            {product.regular_price}
          </Text>
        </View>
        <View style = {{justifyContent:"flex-start" , alignItems:"center" }} >
          <TouchableOpacity style={styles.buttonstyle} onPress = {()=>{this.props.onPressEdit(product)}} >
            <CustomIcon2 name="edit-pencil" color = {ThemeConstant.ACCENT_COLOR} size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonstyle} onPress = {()=>{this.props.onPressDelete(product)}} >
            <CustomIcon2 name="delete" color={ThemeConstant.ACCENT_COLOR} size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor : ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR,
    padding: ThemeConstant.MARGIN_TINNY
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3
  },
  productInfoTheme: {
    flex:1, 
    alignItems: "flex-start",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    marginHorizontal: ThemeConstant.MARGIN_GENERIC
  },
  firstTextTheme: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE
  },
  inStockStyle: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: "green"
  },
  outOfStockStyle: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: "red"
  },
  secondaryTextTheme: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  buttonstyle :{
      padding:ThemeConstant.MARGIN_GENERIC,
    //   paddingBottom: ThemeConstant.MARGIN_GENERIC ,    
      borderColor:ThemeConstant.ACCENT_COLOR,
      borderWidth:0.5,
      borderRadius: 10,
      margin: ThemeConstant.MARGIN_TINNY,
      width:40,
      height:40
  }
});

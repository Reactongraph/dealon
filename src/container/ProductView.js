import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { CustomImage } from "./CustomImage";
import CardView from "react-native-cardview";
import { isStringEmpty } from "../utility/UtilityConstant";
import CustomIcon2 from "./CustomIcon2";
import { localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import ProductContext from "../context/ProductContext";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class ProductView extends React.PureComponent {
 static contextType = ProductContext;
  _OnPressOut = () => {
    // this.props.onPressOut(this.props.productData);
    this.context.onPressProduct(this.props.productData)
  };
  
  render() {
    let product = this.props.productData;
    if(isStringEmpty(product.banner_image)){
      product.banner_image = product.image;
    }
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    const {onPressProduct} =this.context; //this._OnPressOut.bind(this)
  
    return (
      <CardView
        cardElevation={6}
        cardMaxElevation={8}
        cornerRadius={2}
        style={styles.product_container}
      >
      <TouchableOpacity activeOpacity={1}  onPress={this._OnPressOut.bind(this)} >
        <CustomImage
          image={product.banner_image}
          imagestyle={styles.imagestyle}
          onPress={this._OnPressOut.bind(this)}
          dominantColor={product.dominantColor}
        />
        <View style={[styles.productInfoTheme]}>
        <View style={[{flexDirection:'row', alignItems:"center"}, globleViewStyle]} >
          <Text style={styles.secondaryTextTheme} numberOfLines={2}>
            {product.price + "  "}
            <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
            { product.regular_price}
          </Text>
          </Text>
          
        </View>
          <Text
            style={[styles.firstTextTheme, globalTextStyle]}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {this.props.isCategory ? product.title : product.name}
          </Text>
        </View>
        </TouchableOpacity>
      </CardView>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    flexWrap: "wrap",
    flexDirection: "column",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    margin: ThemeConstant.MARGIN_TINNY,
    padding:ThemeConstant.MARGIN_TINNY,
    width: SCREEN_WIDTH / 2.7 + (ThemeConstant.MARGIN_TINNY * 2) ,
  },
  imagestyle: {
    alignSelf: "center",
    width: SCREEN_WIDTH / 2.7,
    height: SCREEN_WIDTH / 2.7
  },
  productInfoTheme: {
    flex:1,
    alignItems: "stretch",
    alignSelf: "stretch",
    justifyContent: 'flex-start',
    padding: ThemeConstant.MARGIN_GENERIC,
    width: SCREEN_WIDTH / 2.7,
  },
  firstTextTheme: {
    textAlign: "left",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
  },
  secondaryTextTheme: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  regularPriceTextTheme: {
    textDecorationLine: "line-through",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    paddingHorizontal: ThemeConstant.MARGIN_TINNY,
  }
});

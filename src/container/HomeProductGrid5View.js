import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { CustomImage } from "./CustomImage";
import ThemeConstant from "../app_constant/ThemeConstant";
import { SCREEN_WIDTH, isStringEmpty } from "../utility/UtilityConstant";

export class HomeProductGrid5View extends React.Component {

    _OnPressOut = (productData) => {
        this.props.onPressOut(productData);
      };

  render() {
      let product = this.props.product;
    return (
      <View style={{flexDirection:"row", margin:ThemeConstant.MARGIN_GENERIC,}} >
        <View style = {{ width: SCREEN_WIDTH / 1.6 - (2*ThemeConstant.MARGIN_GENERIC), justifyContent:"space-between", alignItems:"stretch" }} >
          <TouchableOpacity activeOpacity={1}  onPress={this._OnPressOut.bind(this, product[0])} style={styles.product_container1}>
            <CustomImage
              image={product[0].banner_image}
              imagestyle={styles.imagestyle1}
              onPress={this._OnPressOut.bind(this, product[0])}
              dominantColor={product[0].dominantColor}
            />
            <View style={styles.productInfoTheme}>
              <Text style={styles.secondaryTextTheme} numberOfLines={2}>
                {product[0].price}
              </Text>
              {!isStringEmpty(product[0].regular_price) ? 
              <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                {product[0].regular_price}
              </Text>
              : null}
              <Text
                style={styles.firstTextTheme}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {product[0].name}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1}  onPress={this._OnPressOut.bind(this, product[1])} style={styles.product_container1}>
            <CustomImage
              image={product[1].banner_image}
              imagestyle={styles.imagestyle1}
              onPress={this._OnPressOut.bind(this, product[1])}
              dominantColor={product[1].dominantColor}
            />
            <View style={styles.productInfoTheme}>
              <Text style={styles.secondaryTextTheme} numberOfLines={2}>
                {product[1].price}
              </Text>
              {!isStringEmpty(product[1].regular_price) ? 
              <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                {product[1].regular_price}
              </Text>
              : null}
              <Text
                style={styles.firstTextTheme}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {product[1].name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style = {{ width: SCREEN_WIDTH - (SCREEN_WIDTH / 1.6), justifyContent:"space-between", alignItems:"stretch" }}  >
        <TouchableOpacity activeOpacity={1}   onPress={this._OnPressOut.bind(this, product[2])} style={styles.product_container2}>
            <CustomImage
              image={product[2].banner_image}
              imagestyle={styles.imagestyle2}
              onPress={this._OnPressOut.bind(this,  product[2])}
              dominantColor={product[2].dominantColor}
            />
            <View style={styles.productInfoTheme}>
              <Text style={styles.secondaryTextTheme} numberOfLines={2}>
                {product[2].price}
              </Text>
              {!isStringEmpty(product[2].regular_price) ? 
              <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                {product[2].regular_price}
              </Text>
              : null}
              <Text
                style={styles.firstTextTheme}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {product[2].name}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1}   onPress={this._OnPressOut.bind(this, product[3])} style={styles.product_container2}>
            <CustomImage
              image={product[3].banner_image}
              imagestyle={styles.imagestyle2}
              onPress={this._OnPressOut.bind(this,  product[3])}
              dominantColor={product[3].dominantColor}
            />
            <View style={styles.productInfoTheme}>
              <Text style={styles.secondaryTextTheme} numberOfLines={2}>
                {product[3].price}
              </Text>
              {!isStringEmpty(product[3].regular_price) ? 
              <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                {product[3].regular_price}
              </Text>
              : null}
              <Text
                style={styles.firstTextTheme}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {product[3].name}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={1}   onPress={this._OnPressOut.bind(this, product[4])} style={styles.product_container2}>
            <CustomImage
              image={product[4].banner_image}
              imagestyle={styles.imagestyle2}
              onPress={this._OnPressOut.bind(this,  product[4])}
              dominantColor={product[4].dominantColor}
            />
            <View style={styles.productInfoTheme}>
              <Text style={styles.secondaryTextTheme} numberOfLines={2}>
                {product[4].price}
              </Text>
              {!isStringEmpty(product[4].regular_price) ? 
              <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                {product[4].regular_price}
              </Text>
              : null}
              <Text
                style={styles.firstTextTheme}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {product[4].name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  product_container1: {
    flex:1,
    flexDirection: "column",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    padding: ThemeConstant.MARGIN_TINNY,
    paddingBottom:ThemeConstant.MARGIN_GENERIC ,
    borderWidth: 0.25,
    borderColor: ThemeConstant.LINE_COLOR_2,
    // alignItems: "center",
    justifyContent:"flex-start" ,
    alignContent: "center",
    alignSelf: "stretch",
  },
  product_container2: {
    flex:1,
    flexDirection: "column",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    padding: ThemeConstant.MARGIN_TINNY,
    paddingBottom:ThemeConstant.MARGIN_GENERIC ,
    borderWidth: 0.25,
    borderColor: ThemeConstant.LINE_COLOR_2,
    // alignItems: "center",
    justifyContent:"space-between",
    alignContent: "center",
    alignSelf: "stretch",
  },
  imagestyle1: {
    width: SCREEN_WIDTH / 1.6- 6 * ThemeConstant.MARGIN_TINNY, /// Total Margin count half minus
    height: SCREEN_WIDTH / 1.6 - 6 * ThemeConstant.MARGIN_TINNY
  },
  imagestyle2: {
    width: SCREEN_WIDTH - SCREEN_WIDTH / 1.6 - 2 * ThemeConstant.MARGIN_TINNY, /// Total Margin count half minus
    height: SCREEN_WIDTH - SCREEN_WIDTH / 1.6 - 2 * ThemeConstant.MARGIN_TINNY
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: "300",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
  },
  secondaryTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "bold",
  },
  regularPriceTextTheme: {
    textDecorationLine: "line-through",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
  }
});

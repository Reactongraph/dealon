import React from "react";
import { Text, View, StyleSheet } from "react-native";

import ThemeConstant from "../app_constant/ThemeConstant";
import { strings, localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class PriceDetail extends React.Component {
    state = {
        cartData :{}
    }
 componentDidMount(){
     this.setState({
         cartData : this.props.cartData,
     })           
 }
 
 componentWillUpdate(nextProps){
     if (nextProps.cartData != this.props.cartData){
         this.setState({
             cartData : nextProps.cartData,
         })
     }
 };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View style={styles.viewContainer}>
        <Text style={[styles.headingTitle, globalTextStyle]}>{strings("PRICE_DETAIL")}</Text>
        <View style={[styles.subtotalTextViewStyle, globleViewStyle]}>
          <Text style={styles.priceTextHeadingStyle}>
            {strings("SUBTOTAL")}
          </Text>
          <Text style={styles.priceTextstyle}>
            {this.state.cartData.subtotal_ex_tax}
          </Text>
        </View>
        <View style={[styles.subtotalTextViewStyle, globleViewStyle]}>
          <Text style={styles.priceTextHeadingStyle}>
            {strings("SHIPPING")}
          </Text>
          <Text style={styles.priceTextstyle}>
            {this.state.cartData.shipping_total}
          </Text>
        </View>
        <View style={[styles.subtotalTextViewStyle, globleViewStyle]}>
          <Text style={styles.priceTextHeadingStyle}>{strings("TAX")}</Text>
          <Text style={styles.priceTextstyle}>
            {this.state.cartData.tax_total}
          </Text>
        </View>
        <View style={[styles.subtotalTextViewStyle, globleViewStyle]}>
          <Text style={styles.priceTextHeadingStyle}>
            {strings("DISCOUNT")}
          </Text>
          <Text style={styles.priceTextstyle}>
            {this.state.cartData.discount_cart}
          </Text>
        </View>
        <View style={[styles.subtotalTextViewStyle, globleViewStyle]}>
          <Text style={styles.orderTotalHeadingStyle}>
            {strings("ORDER_TOTAL")}
          </Text>
          <Text style={styles.orderTotalTextStyle}>
            {this.state.cartData.total}
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewContainer: {
    // padding: ThemeConstant.MARGIN_NORMAL,
    backgroundColor:ThemeConstant.BACKGROUND_COLOR,
    marginTop:ThemeConstant.MARGIN_NORMAL
  },
  headingTitle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "bold",
    padding: ThemeConstant.MARGIN_NORMAL,
    marginBottom:ThemeConstant.MARGIN_TINNY ,
    borderBottomWidth: 0.5,
    borderColor:ThemeConstant.LINE_COLOR_2
  },
  subtotalTextViewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingLeft: ThemeConstant.MARGIN_NORMAL,
    paddingRight:  ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_TINNY,
    marginTop: ThemeConstant.MARGIN_TINNY
  },
  priceTextstyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "400",

  },
  priceTextHeadingStyle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "400"
  },
  orderTotalHeadingStyle: {
    // color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginBottom: ThemeConstant.MARGIN_GENERIC,
  },
  orderTotalTextStyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginBottom: ThemeConstant.MARGIN_GENERIC,
  },
});

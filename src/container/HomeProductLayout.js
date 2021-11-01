/** 
* Webkul Software. 
* 
* @category Webkul 
* @package Webkul_Mobikul_React_WooCommerce
* @author Webkul
* @copyright Copyright (c) 2010-2018 WebkulSoftware Private Limited (https://webkul.com) 
* @license https://store.webkul.com/license.html 
* 
*/
import React from "react";
import { FlatList, View } from "react-native";
import ProductView from "./ProductView";
import HomeProductGridView from "./HomeProductGrideView";
import ThemeConstant from "../app_constant/ThemeConstant";
import { HomeProductGrid5View } from "./HomeProductGrid5View";
import { localeObject } from "../localize_constant/I18";

export default class HomeProductLayout extends React.Component {
  state = {
    data: []
  };
  componentDidMount() {}
  // shouldComponentUpdate(newProps, newState) {
  //   if (newProps.updateFlatList || newProps.data != this.props.data) {
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    if (this.props.randomNum == 3 && this.props.data.length > 4) {
      return (
        <HomeProductGrid5View product={this.props.data} onPressOut={this.props.onPressOut} />
      );
    } else {
      return (
        <View style={{
          paddingLeft:
            this.props.randomNum == 1 ? 0 :  ThemeConstant.MARGIN_GENERIC,
          paddingRight:
            this.props.randomNum == 1 ? 0 :  ThemeConstant.MARGIN_GENERIC
        }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={this.props.data}
          key={this.props.randomNum == 1 ? 1 : 2}
          numColumns={this.props.randomNum == 1 ? 1 : 2}
          horizontal={this.props.randomNum == 1}
          inverted = {localeObject.isRTL && this.props.randomNum == 1 }
          renderItem={item => {
            return this.props.randomNum > 1 ? (
              <HomeProductGridView
                productData={item.item}
                // onPressOut={this.props.onPressOut}
              />
            ) : (
              <ProductView
                productData={item.item}
                // onPressOut={this.props.onPressOut}
              />
            );
          }}
          keyExtractor={item => {
            return item.id + "";
          }}
        />
        </View>
      );
    }
  }
}

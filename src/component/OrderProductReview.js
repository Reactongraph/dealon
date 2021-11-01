import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, FlatList, StyleSheet } from "react-native";
import CustomActionbar from "../container/CustomActionbar";

import ItemOrderProductReview from "../container/ItemOrderProductReview";
import ThemeConstant from "../app_constant/ThemeConstant";
import { strings } from "../localize_constant/I18";

export default class OrderProductReview extends React.Component {
    state={
        products:[]
    }
  componentDidMount() {
    this.setState({
      products: this.props.navigation.getParam("products", [])
    });
  }

  onPressProductReview = productData => {
    console.log("Review", productData);
    if (this.screenProps) {
      this.setState({
        isModelVisible: false
      });
      this.screenProps.navigate("WriteProductReview", {
        productId: productData.productId,
        productImage: productData.image,
        dominantColor: productData.dominantColor,
        productName: productData.name
      });
    } else {
      this.setState({
        isModelVisible: false
      });
      this.props.navigation.navigate("WriteProductReview", {
        productId: productData.productId,
        productImage: productData.image,
        dominantColor: productData.dominantColor,
        productName: productData.name
      });
    }
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          backgroundColor: ThemeConstant.BACKGROUND_COLOR
        }}
      >
        <CustomActionbar
          title={strings("CHOOSE_A_PRODUCT_TO_REVIEW")}
          backwordTitle={strings("ACCOUNT_TITLE")}
          _onBackPress={this._onBackPress.bind(this)}
          backwordImage = "close-cross"
        />
        <FlatList
          data={this.state.products}
          renderItem={({ item }) => {
            return (
              <ItemOrderProductReview
                productData={{
                  image: item.image,
                  dominantColor: item.dominantColor,
                  productId: item.id,
                  name: item.title
                }}
                onPressProduct={this.onPressProductReview.bind(this)}
              />
            );
          }}
          keyExtractor ={(item)=> item.id +""}
        />
      </View>
    );
  }
}

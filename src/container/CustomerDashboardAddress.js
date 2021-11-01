import React from "react";
import { View, Text, TouchableOpacity,StyleSheet, ScrollView } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";

import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import CustomIcon2 from "./CustomIcon2";
import { localeObject, strings } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class CustomerDashboardAddress extends React.Component {
  state = {
    billingAddress: "",
    shippingAddress: ""
  };

  componentDidMount() {
    this.setState({
      billingAddress: this.props.billingAddress,
      shippingAddress: this.props.shippingAddress
    });
  }
  componentWillUpdate(newProps, newState) {
    if (
      this.props.billingAddress != newProps.billingAddress ||
      this.props.shippingAddress != newProps.shippingAddress
    ) {
      this.setState({
        billingAddress: newProps.billingAddress,
        shippingAddress: newProps.shippingAddress
      });
    }
  }

  getAddressText(address) {
    let textAddress = "";
  }
  
  _onPressUpdateAddress = () => {
    this.props.navigation.navigate("UpdateAddress");
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR_1 }}
      >
        <View style={styles.viewContainer}>
          <Text style={[styles.headingTitle, globalTextStyle]}>
            {strings("BILLING_ADDRESS")}
          </Text>
          <TouchableOpacity
            style={[styles.eachAddessStyle, globleViewStyle]}
            activeOpacity={1}
            onPress={this._onPressUpdateAddress.bind(this)}
          >
            <Text style={[styles.textStyle, globalTextStyle]}>{this.state.billingAddress}</Text>

            <CustomIcon2
              name={ localeObject.isRTL ? "arrow-left" : "arrow-right"}
              size={ThemeConstant.DEFAULT_ICON_SIZE}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.viewContainer}>
          <Text style={[styles.headingTitle, globalTextStyle]}>
            {strings("SHIPPING_ADDRESS")}
          </Text>
          <TouchableOpacity
            style={[styles.eachAddessStyle, globleViewStyle]}
            activeOpacity={1}
            onPress={this._onPressUpdateAddress.bind(this)}
          >
            <Text style={[styles.textStyle, globalTextStyle]}>{this.state.shippingAddress}</Text>

            <CustomIcon2
              name={ localeObject.isRTL ? "arrow-left" : "arrow-right"}
              size={ThemeConstant.DEFAULT_ICON_SIZE}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: "stretch" ,
    paddingTop: ThemeConstant.MARGIN_NORMAL,
    paddingBottom: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
  },
  headingTitle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    padding: ThemeConstant.MARGIN_NORMAL,
    borderBottomWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2
  },
  textStyle: {
    paddingLeft: ThemeConstant.MARGIN_NORMAL,
    textAlignVertical: "center",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "400"
  },
  eachAddessStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeConstant.MARGIN_NORMAL,
  }
});

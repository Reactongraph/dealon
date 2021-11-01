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
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import CustomIcon2 from "./CustomIcon2";
import PropTypes from "prop-types";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject } from "../localize_constant/I18";

export default class CustomActionbar extends React.Component {
  state = {
    backwordTitle: "",
    cartCount: 0
  };
  componentDidMount() {
    this.setState({
      backwordTitle: this.props.backwordTitle,
      cartCount:
        typeof this.props.cartCount === "string"
          ? parseInt(this.props.cartCount)
          : 0
    });
  }

  componentWillUpdate(newProps) {
    if (
      this.props.backwordTitle !== newProps.backwordTitle ||
      this.props.cartCount != newProps.cartCount
    ) {
      let cartCount = newProps.cartCount
        ? newProps.cartCount === "string"
          ? parseInt(newProps.cartCount)
          : newProps.cartCount
        : typeof this.props.cartCount === "string"
        ? parseInt(this.props.cartCount)
        : 0;
      this.setState({
        backwordTitle: newProps.backwordTitle
          ? newProps.backwordTitle
          : this.props.backwordTitle,
        cartCount: cartCount
      });
    }
  }

  onPressNotification = () => {
    if (this.props.onPressNotification) {
      this.props.onPressNotification();
    } else if (this.props.navigation) {
      // this.props.navigation.navigate("CustomerDashboard");
      this.props.navigation.navigate("NotificationPage");
    }
  };
  onPressSearch = () => {
    if (this.props.onPressSearch) {
      this.props.onPressSearch();
    } else if (this.props.navigation) {
      this.props.navigation.navigate("SearchProductPage");
    }
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={[
          styles.contanerStyle,
          { borderBottomWidth: this.props.borderBottomWidth }, globleViewStyle
        ]}
      >
        {this.state.backwordTitle ? (
          <TouchableOpacity
            style={[styles.backwordViewStyle, {paddingRight:localeObject.isRTL ? 0 : ThemeConstant.PADDING_ACTION_BAR, paddingLeft:localeObject.isRTL ? ThemeConstant.PADDING_ACTION_BAR : 0, }]}
            onPress={this.props._onBackPress}
            activeOpacity={1}
          >
            <CustomIcon2
              name={
                this.props.backwordImage ? this.props.backwordImage : localeObject.isRTL ? "forward" : "back"
              }
              size={28}
              color={ThemeConstant.ACTION_BAR_ICON_COLOR}
            />
            {/* <Text style={styles.backwordTextStyle}>
              {this.state.backwordTitle}
            </Text> */}
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 0.5 }} />
        )}
        <View style = {styles.titleTextWrapperViewStyle}>
        <Text
          style={[styles.titleTextStyle, globalTextStyle]}
          ellipsizeMode="tail"
          allowFontScaling={false}
          numberOfLines={2}
        >
          {this.props.title}
        </Text>
        </View>
        {/* {this.props.logo ? (
          <FastImage
            source={require("../../resources/images/logo.png")}
            style={[styles.logoImageStyle]}
            resizeMode={"contain"}
          />
        ) : (
          <Text
            style={styles.titleTextStyle}
            ellipsizeMode="tail"
            allowFontScaling={false}
            numberOfLines={2}
          >
            {this.props.title}
          </Text>
        )} */}
        {this.props.iconName ? (
          <View style={[styles.forwordIconViewStyle, globleViewStyle]}>
            {/* check to remove search icon when cart is not available */}
            {this.props.iconName == "cart" ? (
              <TouchableOpacity
                style={styles.forwordIconEachViewStyle}
                onPress={this.onPressSearch.bind(this)}
              >
                <CustomIcon2
                  name={"search"}
                  size={28}
                  color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                />
              </TouchableOpacity>
            ) : null}
            {this.props.iconName == "cart" ? (
              <TouchableOpacity
                style={styles.forwordIconEachViewStyle}
                onPress={this.onPressNotification.bind(this)}
              >
                {this.state.notificationCount &&
                this.state.notificationCount != 0 ? (
                  <View style={styles.badgeViewStyle}>
                    <CustomIcon2
                      name={"baseline-notification"}
                      size={25}
                      color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                    />
                    <Text style={styles.forwordBadgeStyle}>
                      {this.state.cartCount < 100
                        ? this.state.cartCount
                        : "99+"}
                    </Text>
                  </View>
                ) : (
                  <CustomIcon2
                    name={"baseline-notification"}
                    size={25}
                    color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                  />
                )}
              </TouchableOpacity>
            ) : null}
            {this.props.iconName == "cart" ? (
              <TouchableOpacity
                style={styles.forwordIconEachViewStyle}
                onPress={this.props._onForwordPress}
              >
                {this.state.cartCount && this.state.cartCount != 0 ? (
                  <View style={styles.badgeViewStyle}>
                    <CustomIcon2
                      name={this.props.iconName}
                      size={28}
                      color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                    />
                    <Text style={styles.forwordBadgeStyle}>
                      {this.state.cartCount < 100
                        ? this.state.cartCount
                        : "99+"}
                    </Text>
                  </View>
                ) : (
                  <CustomIcon2
                    name={this.props.iconName}
                    size={28}
                    color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                  />
                )}
              </TouchableOpacity>
            ) : null}
            {this.props.iconName != "cart" ? (
              <TouchableOpacity
                style={styles.forwordIconEachViewStyle}
                onPress={this.props._onForwordPress}
              >
                <CustomIcon2
                  name={this.props.iconName}
                  size={24}
                  color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.forwordTitleViewStyle}
            onPress={
              this.props._onForwordPress ? this.props._onForwordPress : null
            }
            activeOpacity={1}
          >
            <Text
              style={styles.forwordTitleStyle}
              onPress={
                this.props._onForwordPress ? this.props._onForwordPress : null
              }
            >
              {this.props.forwordTitle ? this.props.forwordTitle : ""}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

CustomActionbar.propTypes = {
  borderBottomWidth: PropTypes.number
};
CustomActionbar.defaultProps = {
  borderBottomWidth: 1
};
const styles = StyleSheet.create({
  contanerStyle: {
    height: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "space-between",
    alignItems: "stretch",
    backgroundColor: ThemeConstant.PRIMARY_COLOR,
    // borderBottomWidth: 1,
    borderBottomColor: ThemeConstant.LINE_COLOR,
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_GENERIC
  },
  titleTextStyle: {
    // alignSelf: "stretch",
    textAlignVertical: "center",
    fontWeight: "800",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: ThemeConstant.ACTION_BAR_TEXT_COLOR,
    // flex: 3
  },
  titleTextWrapperViewStyle: {
    alignSelf: "stretch",
    justifyContent:"center",
    flex: 3
  },
  backwordViewStyle: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: ThemeConstant.MARGIN_LARGE
  },
  forwordTitleViewStyle: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: ThemeConstant.MARGIN_GENERIC
  },
  forwordTitleStyle: {
    fontWeight: "600",
    color: ThemeConstant.ACCENT_COLOR
  },
  forwordIconEachViewStyle: {
    // flex: 1,
    alignSelf: "stretch",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
    flexDirection: "row",
    paddingRight: ThemeConstant.MARGIN_TINNY,
    paddingLeft: ThemeConstant.MARGIN_GENERIC
  },
  forwordIconViewStyle: {
    flex: 2,
    alignSelf: "stretch",
    justifyContent: "flex-end",
    alignItems: "stretch",
    flexDirection: "row"
  },
  forwordBadgeStyle: {
    position: "absolute",
    right: -6,
    top: -4,
    borderRadius: 4,
    borderColor: ThemeConstant.LINE_COLOR_1,
    color: ThemeConstant.LINE_COLOR_1,
    borderWidth: 1,
    height: 18,
    width: 18,
    backgroundColor: "white",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 10
  },
  badgeViewStyle: { position: "relative" },

  ////// NOT IN USE /////

  logoImageStyle: {
    alignSelf: "center",
    top: Platform.OS === "android" ? 0 : 5,
    color: ThemeConstant.ACTION_BAR_TEXT_COLOR,
    flex: 2,
    width: 103,
    height: 50
  },

  backwordTextStyle: {
    flexDirection: "row",
    alignSelf: "center",
    textAlign: "center",
    top: Platform.OS === "android" ? 0 : 4,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    alignItems: "center",
    color: ThemeConstant.ACTION_BAR_TEXT_COLOR
  }
});

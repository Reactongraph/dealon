import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { ScrollView, FlatList } from "react-native";
import SellerOrderProduct from "../container/seller/SellerOrderProduct";
import Loading from "../container/LoadingComponent";

import CustomActionbar from "../container/CustomActionbar";
import ViewStyle from "../app_constant/ViewStyle";
import ProgressDialog from "../container/ProgressDialog";
import CustomIcon2 from "../container/CustomIcon2";
import { setCartCount } from "../app_constant/AppSharedPref";
import { showSuccessToast, showErrorToast } from "../utility/Helper";
import { isStringEmpty } from "../utility/UtilityConstant";
import { strings, localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class CustomerOrderDetails extends React.Component {
  page = 1;
  screenProps = {};
  state = {
    isLoading: true,
    orderDetail: {},
    billing_address: "",
    shipping_address: "",
    shipping: {},
    paymentMethod: {},
    email: "",
    phone: "",
    isProgress:false
  };

  componentDidMount() {
    let { navigation, screenProps } = this.props;
    this.screenProps = screenProps;
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      if (userID) {
        console.log("OrderID", this.props.navigation.getParam("orderId"));
        let url =
          AppConstant.BASE_URL +
          "user/order/" +
          this.props.navigation.getParam("orderId");

        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (response && response.success) {
            response = response.order;

            this.setState({
              isLoading: false,
              orderDetail: response,
              billing_address: this._getBillingAddress(
                response.billing_address
              ),
              shipping_address: this._getShippingAddress(
                response.shipping_address
              ),
              shipping: response.shipping_lines && response.shipping_lines.length > 0
                ? response.shipping_lines[0]
                : {},
              paymentMethod: response.payment_details
                ? response.payment_details
                : {},
              email: response.billing_address
                ? response.billing_address.email
                : "",
              phone: response.billing_address
                ? response.billing_address.phone
                : ""
            });
          } else {
            this.setState({
              isLoading: false
            });
            alert(response.message);
          }
        });
      }
    });
  }
  _onPressViewProducts = product => {
    console.log(product);
    if (this.screenProps && this.screenProps.navigate) {
      this.screenProps.navigate("ProductPage", {
        productId: product.product_id,
        productName: product.name,
        productImage : product.product_image
      });
    } else {
      this.props.navigation.navigate("ProductPage", {
        productId: product.product_id,
        productName: product.name,
        productImage : product.product_image
      });
    }
  };

  onPressWriteReview = productData => {
    if (this.screenProps && this.screenProps.navigate) {
      this.screenProps.navigate("WriteProductReview", {
        productId: productData.product_id,
        productImage: productData.product_image,
        dominantColor: productData.dominantColor,
        productName: productData.name
      });
    } else {
      this.props.navigation.navigate("WriteProductReview", {
        productId: productData.product_id,
        productImage: productData.product_image,
        dominantColor: productData.dominantColor,
        productName: productData.name
      });
    }
  };

  _onPressReOrder = orderId => {
    this.setState({
      isProgress: true
    });
    let url = AppConstant.BASE_URL + "user/reorder";
    let body = JSON.stringify({
      order_id: orderId
    });
    fetchDataFromAPI(url, "POST", body, null).then(response => {
      this.setState({
        isProgress: false
      });
      if (response && response.success) {
        setCartCount(response.count);
        showSuccessToast(response.message);
        if (this.screenProps && this.screenProps.navigate) {
          this.screenProps.navigate("CartPage");
        } else {
          this.props.navigation.navigate("CartPage");
        }
      } else {
        showErrorToast(response.message);
      }
    });
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  _getShippingAddress = address => {
    if (address) {
      return (
        address.first_name +
        " " +
        address.last_name +
        "\n" +
        address.address_1 +
        "\n" +
        address.address_2 +
        "\n" +
        address.city +
        ", " +
        address.state +
        "\n" +
        address.country +
        ", " +
        address.postcode
      );
    } else {
      return "";
    }
  };
  _getBillingAddress = address => {
    if (address) {
      return (
        address.first_name +
        " " +
        address.last_name +
        "\n" +
        address.address_1 +
        "\n" +
        address.address_2 +
        "\n" +
        address.city +
        ", " +
        address.state +
        "\n" +
        address.country +
        ", " +
        address.postcode
      );
    } else {
      return "";
    }
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={ViewStyle.mainContainer}
      >
        <CustomActionbar
          _onBackPress={this._onBackPress}
          backwordTitle={strings("BACK")}
          title={strings("ORDER_DETAIL")}
          borderBottomWidth={0}
        />

        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View style={{ flex: 1 }}>
            <Text
              style={[
                {
                  padding: ThemeConstant.MARGIN_NORMAL,
                  paddingBottom: ThemeConstant.MARGIN_EXTRA_LARGE,
                  fontWeight: "normal",
                  borderColor: ThemeConstant.LINE_COLOR_2,
                  borderWidth: 0.8,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  fontSize: ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE,
                  color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
                },
                globalTextStyle
              ]}
            >
              {strings("ORDER_ID") + this.state.orderDetail.id}
            </Text>
            <ScrollView>
              <View
                style={{ backgroundColor: ThemeConstant.BACKGROUND_COLOR_1 }}
              >
                <View
                  style={[{
                    flexDirection: "row",
                    padding: ThemeConstant.MARGIN_NORMAL,
                    justifyContent: "space-between",
                    backgroundColor: ThemeConstant.BACKGROUND_COLOR
                  }, globleViewStyle]}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-between",
                      alignItems: localeObject.isRTL ? "flex-end" : "flex-start"
                    }}
                  >
                    <Text style={[styles.priceDetailTitle]}>
                      {strings("ORDER_CREATED_ON")}
                    </Text>
                    <Text style={styles.headingTitle2}>
                      {this.state.orderDetail.created_at}
                    </Text>
                  </View>
                  <Text
                    style={[
                      ViewStyle.statusView,
                      {
                        backgroundColor: this.state.orderDetail.status_bg,
                        alignSelf: "flex-end"
                      }
                    ]}
                  >
                    {this.state.orderDetail.status}
                  </Text>
                </View>
                <View style={styles.contentstyle}>
                  <Text style={[styles.headingTitle, globalTextStyle]}>
                    {this.state.orderDetail.line_items.length}{" "}
                    {strings("ITEM_ORDERED")}
                  </Text>
                  <FlatList
                    style={{
                      marginTop: ThemeConstant.MARGIN_GENERIC,
                      backgroundColor: ThemeConstant.BACKGROUND_COLOR
                    }}
                    data={this.state.orderDetail.line_items}
                    renderItem={item => {
                      return (
                        <SellerOrderProduct
                          productData={item.item}
                          _onPressViewProducts={this._onPressViewProducts.bind(
                            this
                          )}
                          onPressWriteReview={this.onPressWriteReview.bind(
                            this
                          )}
                          isReviewButtonVisible={true}
                        />
                      );
                    }}
                    keyExtractor={item => {
                      return item.name + "";
                    }}
                  />
                </View>

                <View style={styles.contentstyle}>
                  <Text style={[styles.headingTitle, globalTextStyle]}>
                    {strings("PRICE_DETAIL")}
                  </Text>
                  <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.priceDetailTitle}>
                      {strings("SUBTOTAL")}
                    </Text>
                    <Text style={styles.priceDetailValue}>
                      {this.state.orderDetail.subtotal}
                    </Text>
                  </View>
                  <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.priceDetailTitle}>
                      {strings("SHIPPING_COST")}
                    </Text>
                    <Text style={styles.priceDetailValue}>
                      {this.state.orderDetail.total_shipping}
                    </Text>
                  </View>
                  <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.priceDetailTitle}>
                      {strings("TAX")}
                    </Text>
                    <Text style={styles.priceDetailValue}>
                      {this.state.orderDetail.total_tax}
                    </Text>
                  </View>
                  <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.priceDetailTitle}>
                      {strings("DISCOUNT")}
                    </Text>
                    <Text style={styles.priceDetailValue}>
                      {this.state.orderDetail.total_discount}
                    </Text>
                  </View>
                  <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.headingTitleLarge}>
                      {strings("ORDER_TOTAL")}
                    </Text>
                    <Text
                      style={[
                        styles.headingTitleLarge,
                        { color: ThemeConstant.DEFAULT_TEXT_COLOR }
                      ]}
                    >
                      {this.state.orderDetail.total}
                    </Text>
                  </View>
                  {this.state.orderDetail.coupon_lines &&
                  this.state.orderDetail.coupon_lines.length > 0 ? (
                    <View style={styles.couponViewStyle}>
                      <Text style={styles.priceDetailTitle}>
                        {strings("APPLIED_COUPON")}
                      </Text>
                      <FlatList
                        data={this.state.orderDetail.coupon_lines}
                        renderItem={({ item }) => {
                          return (
                            <View style={styles.couponContainer}>
                              <Text style={styles.couponCodeTextStyle}>
                                {item.code}
                              </Text>
                              <Text style={styles.couponCodeTextStyle}>
                                {item.amount}
                              </Text>
                            </View>
                          );
                        }}
                        keyExtractor={item => item.code + ""}
                      />
                    </View>
                  ) : null}

                  {this.state.orderDetail.tax_lines &&
                  this.state.orderDetail.tax_lines.length > 0 ? (
                    <View style={styles.couponViewStyle}>
                      <Text style={styles.headingTitle}>
                        {strings("APPLIED_TAX")}
                      </Text>
                      <FlatList
                        data={this.state.orderDetail.tax_lines}
                        renderItem={({ item }) => {
                          return (
                            <View style={styles.couponContainer}>
                              <Text style={styles.couponCodeTextStyle}>
                                {item.title}
                              </Text>
                              <Text style={styles.couponCodeTextStyle}>
                                {item.total}
                              </Text>
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index + ""}
                      />
                    </View>
                  ) : null}
                </View>

                <View style={styles.contentstyle}>
                  <Text style={styles.headingTitle}>
                    {strings("SHIPPING_AND_PAYMENT_INFORMATION")}
                  </Text>
                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("CUSTOMER_DETAIL")}
                  </Text>
                  <Text style={globalTextStyle}>
                    {strings("EMAIL")} : {this.state.email}
                  </Text>
                  <Text style={[styles.normalTextStyle, globalTextStyle]}>
                    <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                      {strings("TELEPHONE_")}
                    </Text>{" "}
                    {this.state.phone}
                  </Text>
                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("SHIPPING_ADDRESS")}
                  </Text>
                  <Text style={[styles.normalTextStyle, globalTextStyle]}>
                    {this.state.shipping_address}
                  </Text>
                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("BILLING_ADDRESS")}
                  </Text>
                  <Text style={[styles.normalTextStyle, globalTextStyle]}>
                    {this.state.billing_address}
                  </Text>
                {this.state.shipping && this.state.shipping.method_title &&
                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("SHIPPING_METHOD_TITLE")}
                  </Text> }
                  {this.state.shipping && this.state.shipping.method_title &&
                  <Text style={[styles.normalTextStyle, globalTextStyle]}>
                    {this.state.shipping.method_title}(
                    {this.state.shipping.total})
                    </Text> }
                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("PAYMENT_METHOD_TITLE")}
                  </Text>
                  <Text style={[styles.normalTextStyle, globalTextStyle]}>
                    {this.state.paymentMethod.method_title}
                  </Text>
                </View>
                {!isStringEmpty(this.state.orderDetail.status) && this.state.orderDetail.status == 'completed' &&
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={this._onPressReOrder.bind(
                    this,
                    this.state.orderDetail.id
                  )}
                  style={[styles.buttonStyle]}
                >
                  <CustomIcon2
                    name="repeat"
                    size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                    color={ThemeConstant.DEFAULT_ICON_COLOR}
                  />
                  <Text style={styles.buttonTextStyle}>
                    {strings("REORDER")}
                  </Text>
                </TouchableOpacity>
                }
              </View>
            </ScrollView>
            <ProgressDialog
              visible={this.state.isProgress}
              pleaseWaitVisible={false}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentstyle: {
    flex: 1,
    padding: ThemeConstant.MARGIN_NORMAL,
    alignItems: "stretch",
    marginTop: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
  },
  couponViewStyle: {
    marginBottom: ThemeConstant.MARGIN_TINNY,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    borderTopColor: ThemeConstant.LINE_COLOR,
    borderTopWidth: 1
  },
  couponContainer: {
    flexDirection: "row",
    marginBottom: ThemeConstant.MARGIN_TINNY,
    marginTop: ThemeConstant.MARGIN_TINNY
  },
  couponCodeTextStyle: {
    alignSelf: "center",
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE
  },
  headingTitleOrder: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginTop: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "600",
    paddingBottom: ThemeConstant.MARGIN_NORMAL,
    paddingTop: ThemeConstant.MARGIN_NORMAL,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    borderBottomWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2
  },
  headingTitleLarge: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "600",
    paddingBottom: ThemeConstant.MARGIN_NORMAL,
    paddingTop: ThemeConstant.MARGIN_NORMAL,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  priceDetailTitle: {
    fontWeight: "200",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "normal",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  priceDetailValue: {
    fontWeight: "200",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "normal"
  },
  normalTextStyle: {
    fontWeight: "200",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "normal"
  },
  viewRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    paddingTop: ThemeConstant.MARGIN_GENERIC
  },
  headingTitle2: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "200"
  },
  buttonStyle: {
    flex: 1,
    flexDirection: "row",
    padding: ThemeConstant.MARGIN_NORMAL,
    alignItems: "center",
    justifyContent: "center",
    marginTop: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
  },
  buttonTextStyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "400",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginLeft:ThemeConstant.MARGIN_GENERIC
  }
});
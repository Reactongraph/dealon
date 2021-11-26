import React from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { SafeAreaView, NavigationActions } from "react-navigation";
import ThemeConstant from "../app_constant/ThemeConstant";
import CustomActionbar from "../container/CustomActionbar";

import { ScrollView, FlatList } from "react-native";
import ItemCheckoutProduct from "../container/ItemCheckoutProduct";
import PriceDetail from "../container/PriceDetail";
import ProgressDialog from "../container/ProgressDialog";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import Loading from "../container/LoadingComponent";
import { showErrorToast } from "../utility/Helper";
import { setCartCount } from "../app_constant/AppSharedPref";
import { localeObject, strings } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import firebase from "react-native-firebase";
import AnalylticsConstant from "../app_constant/AnalylticsConstant";
import stripe from "tipsi-stripe";

export default class CheckoutReviews extends React.Component {
  isLogin = "false";
  userId = "";
  state = {
    billingAddress: "",
    shippingAddress: "",
    shippingMethod: {},
    products: [],
    paymentMethod: {},
    cartData: {},
    isLoading: true,
    isProgress: false,
  };

  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then((islogedIn) => {
      this.isLogin = islogedIn;
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then((userId) => {
        this.userId = userId;
      });
    });

    let reviewData = this.props.navigation.getParam("reviewData", this.state);
    this.setState({
      billingAddress: reviewData.billing_address,
      shippingAddress: reviewData.shipping_address,
      products: reviewData.cart ? reviewData.cart : [],
      shippingMethod: reviewData.shipping_method
        ? reviewData.shipping_method
        : {},
      paymentMethod: reviewData.payment_method ? reviewData.payment_method : {},
      cartData: reviewData,
      isLoading: false,
    });
  }

  _onPressProceed = () => {
    this.setState({
      isProgress: true,
    });
    let url = AppConstant.BASE_URL + "checkout/order";
    let body = JSON.stringify({
      order: {
        customer_id: this.isLogin && this.isLogin === "true" ? this.userId : "",
        guest_id: !this.isLogin || this.isLogin !== "true" ? this.userId : "",
        note: "order",
      },
    });
    let analyticsObject = {};
    analyticsObject[AnalylticsConstant.ID] = this.userId;
    firebase
      .analytics()
      .logEvent(AnalylticsConstant.ECOMMERCE_PURCHACE, analyticsObject);
    fetchDataFromAPI(url, "POST", body, null).then((response) => {
      this.setState({
        isProgress: false,
      });

      if (response.success) {
        setCartCount("0");
        if (response.is_stripe) {
          stripe.setOptions({
            // publishableKey: STRIPE_PUBLISHABLE_KEY,
            publishableKey: response.publishable_key,
          });
          this._launchStripeSDK(response.order_id);
          this.setState({
            isProgress: false,
          });
        } else {
          this.props.navigation.navigate("OrderPlaceMessagePage", {
            OrderId: response.order_id,
          });
        }
      } else {
        if (response.isCartEmpty == true) {
          setCartCount("0");
          this.props.navigation.navigate(
            "HomePage",
            {},
            NavigationActions.navigate({ routeName: "HomePageNavigation" })
          );
        }
        showErrorToast(response.message);
      }
    });
  };

  _launchStripeSDK = async (order_id) => {
    try {
      let token = await stripe.paymentRequestWithCardForm({
        managedAccountCurrency: "usd",
        requiredBillingAddressFields: "zip",
      });
      console.log("Token==>", token);
      this.setState({
        isProgress: true,
      });
      // return
      let url = AppConstant.BASE_URL + "stripe/payment/process";
      let body = {
        payment_id: token.id,
        order_id: order_id,
      };
      fetchDataFromAPI(url, "POST", JSON.stringify(body), null).then(
        (response) => {
          let paymentAPI = response.success
            ? "stripe/payment/success"
            : "stripe/payment/cancel";
          paymentAPI = AppConstant.BASE_URL + paymentAPI;
          let paymentBody = { order_id: order_id };
          fetchDataFromAPI(
            paymentAPI,
            "POST",
            JSON.stringify(paymentBody),
            null
          ).then((paymentResponse) => {
            this.setState({
              isProgress: false,
            });
            if (paymentResponse.success) {
              this.props.navigation.navigate("OrderPlaceMessagePage", {
                OrderId: order_id,
                order_message: response.success
                  ? StringConstant.OORDER_PLACE_SUBTITLE
                  : "",
                order_title: response.userCancel
                  ? StringConstant.USER_CANCEL_PAYMENT_MSG
                  : "",
              });
            }
          });
        }
      );
    } catch (error) {
      console.log("CheckoutReviews=>>>", error);
    }
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <SafeAreaView
        style={{
          backgroundColor: ThemeConstant.BACKGROUND_COLOR,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <CustomActionbar
          title={strings("CHECKOUT_REVIEW_TITLE")}
          backwordTitle={strings("PAYMENT")}
          _onBackPress={this._onBackPress.bind(this)}
        />

        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View
            style={{
              alignSelf: "stretch",
              flex: 1,
              backgroundColor: ThemeConstant.BACKGROUND_COLOR_1,
            }}
          >
            <View style={styles.container}>
              <ScrollView>
                <View style={styles.viewContainer}>
                  <Text style={styles.headingTitle}>
                    {strings("BILLING_ADDRESS")}
                  </Text>
                  <Text style={[styles.normalText, globalTextStyle]}>
                    {this.state.billingAddress}
                  </Text>
                </View>
                <View style={styles.viewContainer}>
                  <Text style={styles.headingTitle}>
                    {strings("SHIPPING_INFO")}
                  </Text>
                  <Text style={styles.headingTitle2}>
                    {strings("SHIPPING_ADDRESS")}
                  </Text>
                  <Text style={[styles.normalText, globalTextStyle]}>
                    {this.state.shippingAddress}
                  </Text>
                  <Text style={styles.headingTitle2}>
                    {strings("SHIPPING_METHOD_TITLE")}
                  </Text>
                  <Text style={[styles.normalText, globalTextStyle]}>
                    {this.state.shippingMethod.method_title}
                  </Text>
                  <Text style={styles.headingTitle2}>
                    {strings("DISPATCHED_IN")}
                  </Text>
                  <Text style={[styles.normalText, globalTextStyle]}>
                    {this.state.shippingMethod.method_title}
                  </Text>
                </View>

                <View style={styles.viewContainer}>
                  <Text style={styles.headingTitle}>
                    {strings("PAYMENT_METHOD_TITLE")}
                  </Text>
                  <Text style={[styles.normalText, globalTextStyle]}>
                    {this.state.paymentMethod.title}
                  </Text>
                </View>

                <View style={styles.viewContainer}>
                  <Text style={styles.headingTitle}>
                    {this.state.products.length} {strings("ITEMS")}
                  </Text>
                  <FlatList
                    data={this.state.products}
                    renderItem={(item) => {
                      return <ItemCheckoutProduct productData={item.item} />;
                    }}
                    keyExtractor={(item, index) => index + ""}
                  />
                </View>

                <PriceDetail cartData={this.state.cartData} />
              </ScrollView>
            </View>
            <KeyboardAvoidingView
              style={[styles.buttonHeadingView, globleViewStyle]}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{strings("AMMOUNT_TO_BE_PAID")}</Text>
                <Text style={styles.orderTotalTextStyle2}>
                  {this.state.cartData.total}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.accentColorButtonViewStyle}
                onPress={this._onPressProceed.bind(this)}
              >
                <Text
                  style={styles.accentColorButtonStyle}
                  onPress={this._onPressProceed.bind(this)}
                >
                  {strings("MAKE_PAYMENT")}
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        )}
        <ProgressDialog visible={this.state.isProgress} />
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 12,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR_1,
  },
  normalText: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginBottom: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    paddingLeft: ThemeConstant.MARGIN_NORMAL,
    paddingRight: ThemeConstant.MARGIN_NORMAL,
  },
  viewContainer: {
    paddingBottom: ThemeConstant.MARGIN_LARGE,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
  },
  buttonTextStyle: {
    color: ThemeConstant.ACCENT_COLOR,
  },
  headingTitle2: {
    // fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    // fontWeight: "bold",
    // margin: ThemeConstant.MARGIN_GENERIC
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "bold",
    padding: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
  },
  headingTitle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "bold",
    padding: ThemeConstant.MARGIN_NORMAL,
    borderBottomWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2,
  },
  accentColorButtonViewStyle: {
    flex: 1,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  accentColorButtonStyle: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
  },
  orderTotalTextStyle2: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginBottom: ThemeConstant.MARGIN_GENERIC,
  },
  buttonHeadingView: {
    // flex: 1,
    height: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    padding: ThemeConstant.MARGIN_GENERIC,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
  },
});

import React from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { NavigationActions } from "react-navigation";
import CustomActionbar from "../container/CustomActionbar";
import CartProduct from "../container/CartProduct";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
import { SCREEN_WIDTH, isStringEmpty, _getconnection } from "../utility/UtilityConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import ProgressDialog from "../container/ProgressDialog";
import Loading from "../container/LoadingComponent";
import { showErrorToast, showSuccessToast } from "../utility/Helper";
import EmptyLayoutComponent from "../container/EmptyLayoutComponent";
import CouponCodeItem from "../container/CouponCodeItem";
import { setCartCount, setGuestId } from "../app_constant/AppSharedPref";
import AskCartLogin from "./AskCartLogin";
import _ from "lodash";
import { EmptyIconConstant } from "../app_constant/EmptyIconConstant";
import CustomIcon2 from "../container/CustomIcon2";
import { getAllOfflineCart, removeAllCart } from "../database/AllSchemas";
import ViewStyle from "../app_constant/ViewStyle";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";
import firebase from "react-native-firebase";
import AnalylticsConstant from "../app_constant/AnalylticsConstant";

export default class CartPage extends React.Component {
  isInComponent = true;
  userId = 1;
  isLogin = "false";
  currentAppliedVouchar = {};
  state = {
    isUpdate: false,
    isLoading: true,
    isProgress: false,
    isBottomSheetDialogVisible: false,
    isCartEligible: false,
    isAppliedCouponButtonClicked: false,
    couponCode: "",
    cartData: {},
    cartProducts: [],
    couponCodeError: ""
  };
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this.isInComponent = false;
  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => this.initialize())
    ];
    this.isInComponent = true;
    let analyticsObject = {};
    firebase.analytics().logEvent(AnalylticsConstant.CART_EVENT, analyticsObject);
    
    
    _getconnection().then(isConnected => {
      if (isConnected) {
        getAllOfflineCart()
          .then(response => {
            console.log(response);
            
            if (response && response.length > 0) {
              Alert.alert(
                strings("OFFLINE_CART_MSG"),
                strings("ASK_USER_TO_ADD_OFFLINE_CART"),
                [
                  {
                    text: strings("AFTER_SOME_TIME"),
                    style: "cancel"
                  },
                  {
                    text: strings("YES_ADD_TO_CART"),
                    style: "cancel",
                    
                    onPress: () => {
                      console.log("OFFLINE DATA");
                      this.callOfflineSyncAPI(response);
                    }
                  }
                ],
                { cancelable: false }
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }else{

      }
    });
  }

  callOfflineSyncAPI(offlineCarts){
    AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
      this.isLogin = islogedIn;
      this.currentAppliedVouchar = {};
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
          let url = AppConstant.BASE_URL + "cart/offline?request=add";
          let data =  {
          "customer_id" : islogedIn && islogedIn === "true" ? userId : "",
          "guest_id" : islogedIn && islogedIn === "true" ? "": userId,
          "data": offlineCarts
          }
          this.setState({
            isProgress: true
          });
          data = JSON.stringify(data);

          fetchDataFromAPI(url, "POST", data, null).then(response=>{
            if (response && response.success) {
              showSuccessToast(response.message);
              if (!isStringEmpty(response.guest_id)) {
                setGuestId(response.guest_id);
                this.userId = response.guest_id;
              }
              removeAllCart();
              this.initialize();
            } else {
              showErrorToast(response.message);
            }
          })
      })
    })
  }

  initialize() {
    AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
      this.isLogin = islogedIn;
      this.currentAppliedVouchar = {};
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
        if (userId) {
          this.userId = userId;
          let url = "";
          if (islogedIn && islogedIn === "true") {
            url =
              AppConstant.BASE_URL +
              "cart/get?customer_id=" +
              this.userId +
              "&width=" +
              SCREEN_WIDTH;
          } else {
            url =
              AppConstant.BASE_URL +
              "cart/get?guest_id=" +
              this.userId +
              "&width=" +
              SCREEN_WIDTH;
          }
          fetchDataFromAPI(url, "GET", "", null).then(response => {
            if (this.isInComponent && response) {
              setCartCount(response.count);
              this.setState({
                cartProducts: response.cart,
                cartData: response,
                isProgress: false,
                couponCodeError: "",
                couponCode: "", //"mkwcpro10",
                isAppliedCouponButtonClicked: false,
                isLoading: false,
                isCartEligible: response.is_cartEligible,
                isUpdate: !this.state.isUpdate
              });
            }
          });
        } else {
          this.setState({
            isLoading: false,
            isCartEligible: false
          });
        }
      });
    });
  }
  _onBackPress = () => {
    this.props.navigation.pop();
  };

  updateCart = (isApplyCoupon, isRemoveCoupon) => {
    this.setState({ isProgress: true });
    let products = [];
    this.state.cartProducts.forEach(product => {
      products.push({
        product_id: product.product_id,
        quantity: product.quantity,
        variation_id: product.variation_id,
        variations: product.variation
      });
    });
    let vouchers = [];
    this.state.cartData.coupon_discount_amounts.forEach(voucher => {
      vouchers.push({
        code: voucher.coupon_code
      });
    });

    if (this.currentAppliedVouchar && this.currentAppliedVouchar.coupon_code) {
      vouchers.push({
        code: this.currentAppliedVouchar.coupon_code
      });
    }

    let updateCartRequestData = JSON.stringify({
      cart: products,
      coupons: vouchers,
      coupon_apply: isApplyCoupon ? isApplyCoupon : false,
      coupon_remove: isRemoveCoupon ? isRemoveCoupon : false,
      shipping_method_id: this.state.cartData.shipping_method.method_id,
      // "request": "update",
      customer_id: this.isLogin && this.isLogin !== "true" ? this.userId : "",
      guest_id: this.isLogin || this.isLogin !== "true" ? this.userId : ""
    });

    let url = AppConstant.BASE_URL + "cart/update?request=update";
    fetchDataFromAPI(url, "PUT", updateCartRequestData, null).then(response => {
      this.initialize();
      if (response.success) {
        if (response.message) showSuccessToast(response.message);
      } else {
        showErrorToast(response.message);
      }
    });
  };

  _updateCartHandler() {
    if (!this.isAppliedCouponButtonClicked) {
      this.setState({ isAppliedCouponButtonClicked: true });
      this.updateCart(false, false);
    }
  }
  removeCart = () => {
    this.setState({ isProgress: true });
    let url = AppConstant.BASE_URL + "cart/empty";
    let body = JSON.stringify({
      customer_id: this.userId
    });
    fetchDataFromAPI(url, "POST", body, null).then(response => {
      setTimeout(()=>{
        this.setState({
          isProgress: false,
        })
      }, Platform.OS=="ios"? 700:1);
      if (this.isInComponent && response && response.success) {
        setCartCount("0");
        this.setState({
          cartProducts: [],
          cartData: {},          
          couponCodeError: "",
          couponCode: "",
          isAppliedCouponButtonClicked: false,
          isLoading: false,
          isCartEligible: false,
          isUpdate: !this.state.isUpdate
        });
        showSuccessToast(response.message);
      } else {
        showErrorToast(response.message);
        this.setState({
          isLoading: false,
          isCartEligible: false
        });
      }
    });
  };
  removeCartHandler() {
    Alert.alert(
      strings("WARNING"),
      strings("DELETE_CART_WARNING"),
      [ {text:strings("CANCEL"), style: "cancel"},
        {text:strings("YES"),  style: "cancel", onPress:()=>{
          if (!this.isAppliedCouponButtonClicked) {
            this.setState({ isAppliedCouponButtonClicked: true });
            this.removeCart();
          }
      }}]
    )    
   
  }

  _onPressApplyCoupon = () => {
    if (!this.isAppliedCouponButtonClicked) {
      this.setState({ isAppliedCouponButtonClicked: true });
      if (isStringEmpty(this.state.couponCode)) {
        this.setState({
          couponCodeError: strings("EMPTY_COUPON_CODE_ERROR"),
          isAppliedCouponButtonClicked: false
        });
      } else {
        this.currentAppliedVouchar = {
          coupon_code: this.state.couponCode
        };
        this.updateCart(true, false);
      }
    }
  };
  _handleCoupon = couponCode => {
    this.setState({ couponCode: couponCode });
  };

  _updateQuantity = (product, qty) => {
    this.state.cartProducts.forEach(item => {
      if (product["product_id"] === item.product_id) {
        item.quantity = qty;
      }
    });
  };
  _onPressViewProduct = product => {
    this.props.navigation.navigate("ProductPage", {
      productId: product.product_id,
      productName: product.name,
      productImage : product.image
    });
  };

  _deleteProduct = product => {
    this.setState({
      isProgress: true
    });
    console.log(product);
    // console.log("islogin=>>" +  this.isLogin );

    let url = AppConstant.BASE_URL + "cart?request=delete";
    let requestBody = JSON.stringify({
      product_id: product.product_id,
      variations: product.variation,
      variation_id: product.variation_id,
      customer_id: this.isLogin && this.isLogin === "true" ? this.userId : "",
      guest_id: !this.isLogin || this.isLogin !== "true" ? this.userId : ""
    });
    fetchDataFromAPI(url, "POST", requestBody, null).then(response => {
      this.initialize();
    });
  };

  _onPressProceedToCheckout = () => {
    if (!this.isAppliedCouponButtonClicked) {
      if (this.state.isCartEligible) {
        console.log("isLogin-->", this.isLogin);
        if (this.isLogin === "true") {
          let analyticsObject = {};
          firebase.analytics().logEvent(AnalylticsConstant.CHECKOUT_EVENT, analyticsObject);
          this.props.navigation.navigate("Checkout");
        } else {
          this.setState({
            isBottomSheetDialogVisible: true
          });
        }
      } else {
        showErrorToast(this.state.cartData.message);
      }
      this.setState({
        isAppliedCouponButtonClicked: false
      });
    }
  };
  _onBackBottomSheet = () => {
    this.setState({
      isBottomSheetDialogVisible: false
    });
  };
  _onDeleteCouponCode = couponCode => {
    if (this.state.cartData.coupon_discount_amounts) {
      var index = this.state.cartData.coupon_discount_amounts.indexOf(
        couponCode
      );
      if (index > -1) {
        this.state.cartData.coupon_discount_amounts.splice(index, 1);
        this.updateCart(false, true);
      }
    }
  };
  _onContinueShopping = () => {
    this.props.navigation.navigate(
      "HomePage",
      {},
      NavigationActions.navigate({ routeName: "HomePageNavigation" })
    );
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
        <View
            style={[ViewStyle.mainContainer, { justifyContent: "space-between" }]}
        >
            <CustomActionbar
                title={strings("CART_TITLE") + (this.state.cartData.total_weight ? strings("OPEN_BRAKET") + this.state.cartData.total_weight + strings("CLOSE_BRAKET") : "")}
                backwordTitle={strings("BACK")}
                _onBackPress={this._onBackPress.bind()}
                backwordImage="close-cross"
            />
            {this.state.isLoading ? (
                <Loading />
            ) : (
                    <KeyboardAvoidingView
                        style={{
                            flex: 1,
                            alignSelf: "stretch",
                            justifyContent: "space-between",
                            backgroundColor: ThemeConstant.BACKGROUND_COLOR_1
                        }}
                    >
                        <View style={{ flex: 8 }}>
                            <ScrollView
                                keyboardShouldPersistTaps="always"
                                keyboardShouldPersistTaps={"always"}
                            >
                                {this.state.cartProducts &&
                                    this.state.cartProducts.length > 0 ? (
                                        <Text style={[styles.normalTextItemCount, globalTextStyle]}>
                                            {this.state.cartProducts.length +
                                                " " +
                                                strings("ITEMS")}
                                        </Text>
                                    ) : null}
                                <FlatList
                                    data={this.state.cartProducts}
                                    extraData={this.state.isUpdate}
                                    renderItem={item => {
                                        return (
                                            <CartProduct
                                                productData={item.item}
                                                updateQuantity={this._updateQuantity.bind(this)}
                                                deleteProduct={this._deleteProduct.bind(this)}
                                                onPressViewProduct={this._onPressViewProduct.bind(this)}
                                            />
                                        );
                                    }}
                                    ListEmptyComponent={
                                        <EmptyLayoutComponent
                                            message={strings("CART_EMPTY_MESSAGE")}
                                            title={strings("CART_EMPTY_TITLE")}
                                            iconName={EmptyIconConstant.emptyCart}
                                            onPress={this._onContinueShopping}
                                            showButton={true}
                                            buttonText={strings("CONTINUE_SHOPPING")}
                                        />
                                    }
                                    keyExtractor={(item, index) => index + ""}
                                />
                                {this.state.cartProducts &&
                                    this.state.cartProducts.length != 0 ? (
                                        <View>
                                            <View style={[styles.viewContainer, {alignItems:localeObject.isRTL?"flex-end" : "flex-start"}]}>
                                                <Text style={styles.headingTitle}>
                                                    {strings("APPLY_DISCOUNT_CODE")}
                                                </Text>
                                                <View style={[styles.couponcodeViewStyle, globleViewStyle]}>
                                                    <TextInput
                                                        style={styles.inputTextStyle}
                                                        value={this.state.couponCode}
                                                        onChangeText={this._handleCoupon.bind(this)}
                                                        placeholder={strings("ENTER_DISCOUNT_CODE")}
                                                        keyboardType="default"
                                                    />
                                                    <TouchableOpacity
                                                        style={styles.accentColorButtonViewStyle}
                                                        activeOpacity={1}
                                                        onPress={this._onPressApplyCoupon.bind(this)}
                                                    >
                                                        <Text
                                                            onPress={this._onPressApplyCoupon.bind(this)}
                                                            style={styles.accentColorCouponButtonStyle}
                                                        >
                                                            {strings("APPLY")}
                                                        </Text>
                                                    </TouchableOpacity>

                                                </View>
                                                <Text style={styles.textError}>
                                                    {this.state.couponCodeError}
                                                </Text>

                                                <FlatList
                                                    data={this.state.cartData.coupon_discount_amounts}
                                                    renderItem={item => {
                                                        return (
                                                            <CouponCodeItem
                                                                couponData={item.item}
                                                                onDeleteCoupon={this._onDeleteCouponCode.bind(
                                                                    this
                                                                )}
                                                            />
                                                        );
                                                    }}
                                                    keyExtractor={item => item.coupon_code}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                style={[styles.updateCartButtonStyle, globleViewStyle]}
                                                onPress={this._updateCartHandler.bind(this)}
                                                activeOpacity={0.6}
                                            >
                                                <CustomIcon2
                                                    name="refresh"
                                                    size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                                                    color={ThemeConstant.DEFAULT_ICON_COLOR}
                                                />
                                                <Text style={styles.updateCartButtonTextStyle}>
                                                    {strings("UPDATE_CART")}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.updateCartButtonStyle, globleViewStyle]}
                                                onPress={this._onContinueShopping.bind(this)}
                                                activeOpacity={0.6}
                                            >
                                                <CustomIcon2
                                                    name="arrow_right"
                                                    size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                                                    color={ThemeConstant.DEFAULT_ICON_COLOR}
                                                />
                                                <Text style={styles.updateCartButtonTextStyle}>
                                                    {strings("CONTINUE_SHOPPING")}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.updateCartButtonStyle, globleViewStyle]}
                                                onPress={this.removeCartHandler.bind(this)}
                                                activeOpacity={0.6}
                                            >
                                                <CustomIcon2
                                                    name="outline-remove_cart"
                                                    size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                                                    color={ThemeConstant.DEFAULT_ICON_COLOR}
                                                />
                                                <Text style={styles.updateCartButtonTextStyle}>
                                                    {strings("EMPTY_CART")}
                                                </Text>
                                            </TouchableOpacity>

                                            <View style={[styles.viewContainer,]}>
                                                <Text style={[styles.headingTitle, globalTextStyle]}>
                                                    {strings("PRICE_DETAIL")}
                                                </Text>
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
                                                    <Text style={styles.priceTextHeadingStyle}>
                                                        {strings("TAX")}
                                                    </Text>
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
                                                <View
                                                    style={[
                                                        styles.subtotalTextViewStyle,
                                                        {
                                                            borderTopColor: ThemeConstant.LINE_COLOR_2,
                                                            borderTopWidth: 0.5
                                                        },
                                                        globleViewStyle
                                                    ]}
                                                >
                                                    <Text style={styles.orderTotalHeadingStyle}>
                                                        {strings("ORDER_TOTAL")}
                                                    </Text>
                                                    <Text style={styles.orderTotalTextStyle}>
                                                        {this.state.cartData.total}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ) : null}
                            </ScrollView>
                        </View>
                        {this.state.cartProducts && this.state.cartProducts.length != 0 ? (
                            <View style={[styles.buttonHeadingView, globleViewStyle]}>
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
                                    onPress={_.debounce(this._onPressProceedToCheckout, 200)}
                                >
                                    <Text
                                        style={styles.accentColorButtonStyle}
                                        onPress={_.debounce(this._onPressProceedToCheckout, 200)}
                                    >
                                        {strings("PROCEED")}
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        ) : null}
                    </KeyboardAvoidingView>
                )}
            <ProgressDialog visible={this.state.isProgress} />
            <AskCartLogin
                visible={this.state.isBottomSheetDialogVisible}
                navigation={this.props.navigation}
                onBack={this._onBackBottomSheet.bind(this)}
            />
        </View>
    );
}
}

const styles = StyleSheet.create({
inputTextStyle: {
    flex: 2,
    height: 54,
    alignSelf: "stretch",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    padding: ThemeConstant.MARGIN_GENERIC
},
normalTextItemCount: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    padding: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_LARGE,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "500",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderBottomWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2
},
textError: {
    color: "red",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_TINNY
},
accentColorButtonViewStyle: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    justifyContent: "center",
    alignItems: "center"
},
accentColorButtonStyle: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    alignSelf: "stretch",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "500"
},
accentColorCouponButtonStyle: {
    // flex: 1,
    // alignSelf: "stretch",
    // backgroundColor: ThemeConstant.ACCENT_COLOR,
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "500"
    // padding: ThemeConstant.MARGIN_GENERIC
},
couponcodeViewStyle: {
    flexDirection: "row",
    alignItems: "center",
    padding: ThemeConstant.MARGIN_EXTRA_LARGE
},
buttonHeadingView: {
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 0.5,
    padding: ThemeConstant.MARGIN_GENERIC,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
},
subtotalTextViewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: ThemeConstant.MARGIN_GENERIC,
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    paddingTop: ThemeConstant.MARGIN_TINNY
},
headingTitle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    padding: ThemeConstant.MARGIN_NORMAL,
    borderBottomWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2
},
priceTextstyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "200"
},
priceTextHeadingStyle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "200"
},
orderTotalHeadingStyle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "bold",
    marginBottom: ThemeConstant.MARGIN_GENERIC
},
orderTotalTextStyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginBottom: ThemeConstant.MARGIN_GENERIC
},
orderTotalTextStyle2: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginBottom: ThemeConstant.MARGIN_NORMAL
},
updateCartButtonStyle: {
    flexDirection: "row",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    alignSelf: "stretch",
    padding: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "flex-start"
},
updateCartButtonTextStyle: {
    alignSelf: "stretch",
    textAlignVertical: "center",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontWeight: "400",
    marginHorizontal: ThemeConstant.MARGIN_NORMAL
},
viewContainer: {
    paddingTop: ThemeConstant.MARGIN_NORMAL,
    paddingBottom: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
}
});

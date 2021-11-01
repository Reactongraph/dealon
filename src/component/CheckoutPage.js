import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {NavigationActions } from "react-navigation";
import CustomActionbar from "../container/CustomActionbar";

import Loading from "../container/LoadingComponent";
import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import { Button } from "react-native-elements";
import CustomIcon2 from "../container/CustomIcon2";
import ThemeConstant from "../app_constant/ThemeConstant";
import { FlatList, ScrollView } from "react-native";
import ShippingMethodItem from "../container/ShippingMethodItem";
import { showErrorToast } from "../utility/Helper";
import ProgressDialog from "../container/ProgressDialog";
import { setCartCount } from "../app_constant/AppSharedPref";
import ViewStyle from "../app_constant/ViewStyle";
import { localeObject, strings } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import AnalylticsConstant from "../app_constant/AnalylticsConstant";
import firebase from "react-native-firebase";

export default class CheckoutPage extends React.Component {
  isLogin = "false";
  userId = "";
  is_shipping_eligible = true;
  state = {
    isLoading: true,
    isProgress: false,
    isEditAddress: false,
    billingAddressText: "",
    shippingAddressText: "",
    shippingMessage: "",
    shippingMethods: [],    
    selectedShippingMethod: {},
    total: 0,
  };
  
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => this.isFocused())
    ];
  }
  isFocused() {
    if (this.props.navigation.getParam("guest_address_shipping", null)) {
      this.initializePage(this.props.navigation.getParam("guest_address_shipping", {}))
    } else {
      if (this.props.navigation.getParam("isAddressUpdated", true)) {
        /// Login User
        AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
          this.isLogin = islogedIn;
          AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
            this.userId = userId ? userId : "";
            let url = AppConstant.BASE_URL + "cart/get/shipping_methods?";
            if (this.isLogin && this.isLogin == "true") {
              url += "customer_id=" + userId;
            } else {
              url += "guest_id=" + userId;
            }
            fetchDataFromAPI(url, "GET", "", null).then(response => {
                this.initializePage(response);
            });
          });
        });
      }
    }
  }

  initializePage =  (response) =>{
     let shippingMethod = this.getInitialShippingMethod(response.shipping_methods, response.shipping_method);
     console.log(shippingMethod)
     this.is_shipping_eligible = typeof response.is_shipping_eligible == 'undefined' ? true : response.is_shipping_eligible ;
    this.setState({
      billingAddressText: response.billing_address,
      shippingAddressText: response.shipping_address,
      shippingMethods:
        response.shipping_methods &&
        typeof response.shipping_methods != "string"
          ? response.shipping_methods
          : [],
      shippingMessage: response.message ? response.message : response.shipping_message,
      selectedShippingMethod : shippingMethod,
      isLoading: false,
      total: response.total
    });
    let analyticsObject = {};
    firebase.analytics().logEvent(AnalylticsConstant.SHIPPING_METHOD_VIEW, analyticsObject); 
    if (!response.success && this.is_shipping_eligible) {
     let shippingMessage = response.message ? response.message : response.shipping_message
      showErrorToast(shippingMessage);
    }
  }
  getInitialShippingMethod=(shipping_methods, shipping_method)=>{
    shipping_methods =  shipping_methods &&
    typeof shipping_methods != "string"
      ? shipping_methods
      : [];
      let shippingMethod = {}
      console.log(shipping_methods)
    if(shipping_methods && shipping_method){
      shipping_methods.forEach(element=>{
        if(element.method_id == shipping_method.method_id){
          shippingMethod = element;
        }
      });
    }
     return shippingMethod;
  }
  _onPressProceed = () => {
    if ( !this.is_shipping_eligible ||
      this.state.shippingMethods.length > 0 &&
      this.state.selectedShippingMethod.method_id
    ) {
      this.setState({
        isProgress: true
      });
      let url = AppConstant.BASE_URL + "cart/shipping_method";
      let body = JSON.stringify({
        customer_id: this.isLogin && this.isLogin === "true" ? this.userId : "",
        guest_id: !this.isLogin || this.isLogin !== "true" ? this.userId : "",
        shipping_method: {
          method_id: this.state.selectedShippingMethod.method_id,
          method_title: this.state.selectedShippingMethod.method_title,
          cost : this.state.selectedShippingMethod.cost,
          tax :this.state.selectedShippingMethod.tax,
        }
      });

      let analyticsObject = {};
      analyticsObject[AnalylticsConstant.ID] = this.state.selectedShippingMethod.method_id;
      analyticsObject[AnalylticsConstant.NAME] = this.state.selectedShippingMethod.method_title;
      firebase.analytics().logEvent(AnalylticsConstant.SHIPPING_METHOD_SELECET, analyticsObject);

      fetchDataFromAPI(url, "POST", body, null).then(response => {
        this.setState({
          isProgress: false
        });
        if (response.success) {
          this.props.navigation.navigate("PaymentMethodPage", response);
        } else {
          if(response.isCartEmpty == true){
            setCartCount("0");
            this.props.navigation.navigate("HomePage", {}, NavigationActions.navigate({ routeName: 'HomePageNavigation' }));  
           }
         showErrorToast(response.message);
        }
      });
    } else{
      if (this.state.shippingMethods.length > 0) {
        showErrorToast(strings("SELECT_SHIPPING_ERROR_MSG"));
      } else {
        showErrorToast(
          this.state.shippingMessage +
            strings("SELECT_SHIPPING_ERROR_MSG_OR_CONTACT_WITH_US")
        );
      }
    }
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };

  _selectedShippingMethod = selectedShippingMethod => {
    this.setState({
      selectedShippingMethod: selectedShippingMethod
    });
  };

  _onPressEditViewAddress = () => {
    this.props.navigation.navigate("UpdateAddress", {
      isFromCart: true,
      guest_address: this.props.navigation.getParam("guest_address", null),
      isLogin: this.isLogin
    });
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
  
    return (
      <View
        style={[ViewStyle.mainContainer, {justifyContent:"space-between"}]}
      >
        <CustomActionbar
          title={strings("CHECKOUT_TITLE")}
          backwordTitle={strings("CART_TITLE")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View style={{ alignSelf: "stretch",flex: 1, justifyContent:"space-between", backgroundColor :ThemeConstant.BACKGROUND_COLOR}}>
            <View style={styles.container}>
              <ScrollView keyboardShouldPersistTaps="always">
                <View style={[styles.addressContainerStyle]}>
                  <Text style={[styles.headingTitle, globalTextStyle]}>
                    {strings("BILLING_ADDRESS")}
                  </Text>
                  <Text style={[styles.textTitle, globalTextStyle]} >{this.state.billingAddressText}</Text>
                  <Text style={[styles.headingTitle, globalTextStyle]}>
                    {strings("SHIPPING_ADDRESS")}
                  </Text>
                  <Text style={[styles.textTitle, globalTextStyle]} >{this.state.shippingAddressText}</Text>

                  <Button
                    clear={true}
                    title={strings("ADD_EDIT_ADDRESS")}
                    icon={
                    <CustomIcon2
                      name="edit"
                      size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                      color={ThemeConstant.ACCENT_COLOR}
                    />
                  }
                  buttonStyle={[styles.addEditButtonStyle,{justifyContent : localeObject.isRTL ? "flex-end" : "flex-start"} ]}
                  titleStyle={styles.buttonTextStyle}
                  onPress={this._onPressEditViewAddress.bind(this)}
                />
                </View>
               
                <View style={styles.addressContainerStyle}>
                  <Text style={[styles.headingTitle, globalTextStyle]}>{strings("SHIPPING_METHODS")}</Text>
                  <FlatList
                    data={this.state.shippingMethods}
                    extraData = {this.state.selectedShippingMethod}
                    renderItem={item => {
                      return (
                        <ShippingMethodItem
                          shippingData={item.item}
                          itemIndex={item.index}
                          selectedItem={this.state.selectedShippingMethod}
                          selectedShippingMethod={this._selectedShippingMethod}
                        />
                      );
                    }}
                    ListEmptyComponent={
                      <Text style={styles.emptyShippingMethodStyle}>
                        {this.state.shippingMessage}{" "}
                      </Text>
                    }
                    keyExtractor={item => item.method_id}
                  />
                </View>
              </ScrollView>
              <ProgressDialog visible={this.state.isProgress} />
            </View>
            <KeyboardAvoidingView style={[styles.buttonHeadingView, globleViewStyle]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: ThemeConstant.MARGIN_GENERIC
                }}
              >
                <Text>{strings("AMMOUNT_TO_BE_PAID")}</Text>
                <Text style={styles.orderTotalTextStyle2}>
                  {this.state.total}
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
                {strings("PROCEED")}
              </Text>
              </TouchableOpacity>
              
            </KeyboardAvoidingView>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 12,
    // backgroundColor: ThemeConstant.BACKGROUND_COLOR_2
  },
  addEditButtonStyle: {
    padding: ThemeConstant.MARGIN_LARGE,
    borderColor: ThemeConstant.LINE_COLOR,
    borderBottomWidth:0.5,
    borderTopWidth: 0.5,
    marginTop:ThemeConstant.MARGIN_TINNY,
    marginBottom:ThemeConstant.MARGIN_GENERIC,
    backgroundColor:ThemeConstant.BACKGROUND_COLOR,
    alignSelf: "stretch",
    justifyContent:"flex-start"
  },
  buttonTextStyle: {
    color: ThemeConstant.ACCENT_COLOR,
    fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight:'500',
  },
  headingTitle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "500",
    padding:ThemeConstant.MARGIN_NORMAL,
    borderBottomWidth:0.4,
    borderColor:ThemeConstant.LINE_COLOR_2
  },
  textTitle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: "100",
    paddingTop:ThemeConstant.MARGIN_TINNY,
    paddingLeft:ThemeConstant.MARGIN_LARGE,
    paddingRight: ThemeConstant.MARGIN_NORMAL,
  },
  addressContainerStyle: {
    paddingTop:ThemeConstant.MARGIN_NORMAL,
    paddingBottom:ThemeConstant.MARGIN_NORMAL,  
    // marginTop: ThemeConstant.MARGIN_EXTRA_LARGE,
    backgroundColor:ThemeConstant.BACKGROUND_COLOR,
    borderBottomWidth:0.3,
    borderColor:ThemeConstant.LINE_COLOR_2
  },
  emptyShippingMethodStyle: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_NORMAL
  },
  shippingMethodViewStyle: {
    // paddingTop:ThemeConstant.MARGIN_NORMAL,
    paddingBottom:ThemeConstant.MARGIN_NORMAL,  
    // marginTop: ThemeConstant.MARGIN_NORMAL,
    backgroundColor:ThemeConstant.BACKGROUND_COLOR
  },
  accentColorButtonViewStyle:{
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    justifyContent:"center",
    alignItems:"center"
  },
  accentColorButtonStyle: {
    textAlign: "center",
    textAlignVertical:"center",
    color: "white",   
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold", 
  },
  orderTotalTextStyle2: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginBottom: Platform.OS == 'ios' ? 0 : ThemeConstant.MARGIN_GENERIC
  },
  buttonHeadingView: {
    height: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 0.5,
    padding: ThemeConstant.MARGIN_GENERIC,
    backgroundColor:ThemeConstant.BACKGROUND_COLOR
  },
});

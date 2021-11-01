import React from "react";
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { SafeAreaView, NavigationActions } from "react-navigation";
import ThemeConstant from "../app_constant/ThemeConstant";
import CustomActionbar from "../container/CustomActionbar";

import { ScrollView, FlatList } from "react-native";
import PaymentMethodItem from "../container/PaymentMethodItem";
import ProgressDialog from "../container/ProgressDialog";
import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import { isStringEmpty } from "../utility/UtilityConstant";
import { showErrorToast } from "../utility/Helper";
import { setCartCount } from "../app_constant/AppSharedPref";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";
import firebase from "react-native-firebase";
import AnalylticsConstant from "../app_constant/AnalylticsConstant";

export default class PaymentMethodPage extends React.Component {
  isLogin = "false";
  userId = "";
  state = {
    isLoading: true,
    isProgress: false,
    paymentMethod: [],
    selectedPayment: {},
    total: 0
  };

  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
      this.isLogin = islogedIn;
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
        this.userId = userId;
      });
    });
    let analyticsObject = {};
    firebase.analytics().logEvent(AnalylticsConstant.PAYMENT_METHOD_VIEW, analyticsObject);
    this.setState({
      paymentMethod: this.props.navigation.getParam("payment_gateways", []),
      total: this.props.navigation.getParam("total", 0),
      isLoading: false
    });
  }

  _onPressPaymentMethod = selectedPayment => {
    this.setState({
      selectedPayment: selectedPayment
    });
  };

  _onPressProceed = () => {
    if (!isStringEmpty(this.state.selectedPayment.method_title)) {
      this.setState({
        isProgress: true
      });
      let url =
        AppConstant.BASE_URL +
        "cart/payment_method?" +
        (this.isLogin && this.isLogin === "true"
          ? "customer_id=" + this.userId
          : "guest_id=" + this.userId);
      let body = JSON.stringify({
        customer_id: this.isLogin && this.isLogin === "true" ? this.userId : "",
        guest_id: !this.isLogin || this.isLogin !== "true" ? this.userId : "",
        payment_method: {
          method_title: this.state.selectedPayment.method_title,
          title: this.state.selectedPayment.title
        }
      });

      let analyticsObject = {};
      analyticsObject[AnalylticsConstant.ID] = this.state.selectedPayment.method_title;
      analyticsObject[AnalylticsConstant.NAME] = this.state.selectedPayment.title;
      firebase.analytics().logEvent(AnalylticsConstant.SELECTED_PAYMENT_METHOD, analyticsObject);

      fetchDataFromAPI(url, "POST", body, null).then(response => {
        this.setState({
          isProgress: false
        });
        if(response.success){
          this.props.navigation.navigate("CheckoutReviews", {
            reviewData: response
          });
        }else{
          if(response.isCartEmpty == true){
            setCartCount("0");
            this.props.navigation.navigate("HomePage", {}, NavigationActions.navigate({ routeName: 'HomePageNavigation' }));  
           }
           showErrorToast (response.message);
        }        
      });
    } else {
      showErrorToast(strings("SELECT_PAYMENT_METHOD_ERROR_MSG"));
    }
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };
  render() {
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <SafeAreaView
        style={{
          backgroundColor: ThemeConstant.BACKGROUND_COLOR,
          flex: 1,
          justifyContent: "space-between"
        }}
      >
        <CustomActionbar
          title={strings("PAYMENT_METHOD_TITLE")}
          backwordTitle={strings("SHIPPING")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        <View style={styles.container}>
          <ScrollView>
            <FlatList
              data={this.state.paymentMethod}
              extraData = {this.state.selectedPayment}
              renderItem={item => {
                return (
                  <PaymentMethodItem
                    paymentData={item.item}
                    index={item.index}
                    selectedItem={this.state.selectedPayment}
                    onPressPaymentMethod={this._onPressPaymentMethod.bind(this)}
                  />
                );
              }}
              keyExtractor={item => item.method_title}
            />
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
            <Text style={styles.orderTotalTextStyle2}>{this.state.total}</Text>
          </View>
          <TouchableOpacity 
          style = {styles.accentColorButtonViewStyle}
            activeOpacity={1}
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
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    alignSelf: "stretch"
  },
  accentColorButtonViewStyle:{
    flex: 1,
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
    marginBottom: ThemeConstant.MARGIN_GENERIC
  },
  buttonHeadingView: {
    // flex: 1,
    height: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 0.5,
    padding: ThemeConstant.MARGIN_GENERIC
  }
});

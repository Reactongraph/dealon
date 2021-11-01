import React from "react";
import { View, Text, StyleSheet, Alert, BackHandler, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ScrollView, } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
import {
  setUserData,
  setIsLogin,
  setCartCount
} from "../app_constant/AppSharedPref";
import Loading from "../container/LoadingComponent";
import CustomActionbar from "../container/CustomActionbar";

import SignInSignUp from "./SignInSignUp";
import ViewStyle from "../app_constant/ViewStyle";
import ProgressDialog from "../container/ProgressDialog";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { showErrorToast, showSuccessToast } from "../utility/Helper";
import { localeObject, strings } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import ItemAccountTouchable from "../container/ItemAccountTouchable";

export default class CustomerAccountPage extends React.Component {
  log = "CustomerAccountPage";
  userId = ""
  state = {
    externalData: [],
    islogedIn: false,
    isSeller: false,
    isLoading: true,
    isProgressLoading : false,
    name: ""
  };
  _handleBackPress = ()=>{
    return false;
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this.isUpdateFlatList = false;
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused()),
      this.props.screenProps.addListener("willFocus", () => {
        this.setState({ isLoading: true });
        this.isFocused();
      })
    ];
  }
  isFocused() {
    console.log(this.log, "isFocused");
    if (this.props.navigation.getParam("isUpdate", false)) {
      this.setState({ isLoading: true });
      this.props.navigation.setParams({ isUpdate: false });
      this.props.screenProps.setParams({ isUpdate: false });
    }

    AsyncStorage.getItem(AppConstant.PREF_IS_SELLER).then(isSeller => {
      let isSellerFlag = false;
      if (isSeller && isSeller == "1") {
        isSellerFlag = true;
      } else {
        isSellerFlag = false;
      }
      AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
        console.log(this.log, "login" +  islogedIn);
        
        if (islogedIn && islogedIn == "true") {
          this.setState({
            islogedIn: true,
            isSeller: isSellerFlag,
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false,
            islogedIn: false,
            isSeller: isSellerFlag,
          });
        }
      })

    });
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
      this.userId = userId ? userId : "";
    });
    AsyncStorage.getItem(AppConstant.PREF_USER_NAME).then(name => {
      this.setState({ name: name });
    });
  }

  _onPressLogin = () => {
    this.props.navigation.navigate("Login");
  };
  _onPressRegister = () => {
    this.props.navigation.navigate("SignUp");
  };
  _onPressDownloads = () => {
    this.props.navigation.navigate("DownloadsList");
  };
  _onPressLogout = () => {
    Alert.alert(strings("WARNING"), strings("ASK_LOGOUT_MSG"), [
      {
        text: strings("YES_LOGOUT"),
        style: "default",
        onPress: () => {
          this.callLogoutAPI();          
        }
      },
      { text: strings("CANCEL"), style: "cancel" }
    ]);
  };
  _onPressMarketplace = () => {
    this.props.navigation.navigate("Marketplace");
  };

  _onPressSellerProduct = () => {
    this.props.navigation.navigate("SellerProduct");
  };

  _onPressSellerOrders = () => {
    this.props.navigation.navigate("SellerOrders");
  };
  
  _onPressChatListing = () => {
    this.props.screenProps.navigate("ChatListing");
  };

  _onPressSellerTransactions = () => {
    this.props.navigation.navigate("SellerTransaction");
  };
  _onPressCustomerOrders = () => {
    this.props.navigation.navigate("CustomerOrders");
  };
  _onPressCustomerDashboard = () => {
    this.props.screenProps.navigate("CustomerDashboard");
  };
  _onPressWishList = () => {
    this.props.screenProps.navigate("Wishlist");
  };
  _onPressUpdateAddress = () => {
    this.props.navigation.navigate("UpdateAddress");
  };
  _onPressCustomerProfile = () => {
    this.props.navigation.navigate("CustomerProfile");
  };
  _onPressAskToAdmin = () => {
    this.props.navigation.navigate("AskQueryToAdminList", { isUpdate: true });
  };
  _onPressSellerProfile = () => {
    this.props.navigation.navigate("SellerProfilePage");
  };
  _onPressSellerList = () => {
    this.props.navigation.navigate("SellerList");
  };

  callLogoutAPI =()=>{
    this.setState({
      isProgressLoading :true,
    });
    
    let url = AppConstant.BASE_URL + "user/logout/" + this.userId;
    fetchDataFromAPI(url, "GET", "", null).then(response=>{
      if(response.success){
         setIsLogin("false");
          setUserData({ id: "", username: "Webkul", email: "", isSeller: 0 });
          this.setState({
            islogedIn: false,
            isSeller: false,
            isProgressLoading :false,
            name: ""
          });
          setCartCount("0");
          showSuccessToast(response.message);
      }else{
        showErrorToast(response.message);
        this.setState({
          isProgressLoading :false,
        });
      }

    })
  }

  isFocused2() {}
  _onClickHome = () => {
    let { navigation, screenProps } = this.props;
    console.log("BACK", screenProps);
    screenProps.navigate("HomePageNavigation", { isUpdate: false });
  };
onSuccessSocialLogin = (response)=>{
  this.userId = response.id
  this.setState({
    islogedIn: true,
    isSeller: response.isSeller == 1,
    isLoading: false
  });
}

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          _onBackPress={this._onClickHome}
          backwordTitle={strings("HOME_TITLE")}
          title={
            strings("ACCOUNT_TITLE")
          }
        />

        {!this.state.isLoading ? (
          <View
            style={{
              flex: 1,
              backgroundColor: ThemeConstant.BACKGROUND_COLOR_1
            }}
          >
            {this.state.islogedIn ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: ThemeConstant.BACKGROUND_COLOR
                }}
              >
                <ScrollView>
                  {AppConstant.IS_MARKETPLACE  &&
                     <ItemAccountTouchable
                     onPress={this._onPressSellerList.bind(this)}
                     title = {strings("SELLER_LIST_TITLE")}
                     iconName = {"baseline-group"}
                  />
                  }

                  {this.state.isSeller ? (
                    <View>
                       <Text style={[styles.headingTitle, globalTextStyle]}>
                        {strings("SELLER_INFO")}
                      </Text>

                      <ItemAccountTouchable
                       onPress={this._onPressMarketplace.bind(this)}
                       title = {strings("MARKETPLACE")}
                       iconName = {"baseline-store"}
                    />

                      <ItemAccountTouchable
                       onPress={this._onPressSellerProduct.bind(this)}
                       title = {strings("PRODUCT_TITLE")}
                       iconName = {"product1"}
                      />

                      <ItemAccountTouchable     
                       onPress={this._onPressChatListing.bind(this)}
                       title = {strings("CHAT")}
                       iconName = {"baseline-message"}
                      />


                      <ItemAccountTouchable
                       onPress={this._onPressSellerOrders.bind(this)}
                       title = {strings("ORDER_HISTORY")}
                       iconName = {"order-2"}
                      />

                      <ItemAccountTouchable
                       onPress={this._onPressSellerTransactions.bind(this)}
                       title = {strings("TRANSACTION_TITLE")}
                       iconName = {"transaction"}
                      />

                      <ItemAccountTouchable
                       onPress={this._onPressSellerProfile.bind(this)}
                       title = {strings("SELLER_PROFILE_TITLE")}
                       iconName = {"seller"}
                      />

                      <ItemAccountTouchable
                       onPress={this._onPressAskToAdmin.bind(this)}
                       title = {strings("ASK_TO_ADMIN")}
                       iconName = {"baseline-email"}
                    />
                    </View>
                  ) : null}

                 <View>
                    <Text style={[styles.headingTitle, globalTextStyle]}>
                      {strings("CUSTOMER_INFO")}
                    </Text>

                    <ItemAccountTouchable
                       onPress={this._onPressCustomerDashboard.bind(this)}
                       title = {strings("DASHBOARD_TITLE")}
                       iconName = {"dashboard"}
                    />

                    <ItemAccountTouchable
                       onPress={this._onPressCustomerOrders.bind(this)}
                       title = {strings("ORDER_TITLE")}
                       iconName = {"order-2"}
                    />

<ItemAccountTouchable
                       onPress={this._onPressWishList.bind(this)}
                       title = {strings("WISHLIST_TITLE")}
                       iconName = {"heart-fill"}
                    />

                    <ItemAccountTouchable
                       onPress={this._onPressUpdateAddress.bind(this)}
                       title = {strings("ADDRESS_TITLE")}
                       iconName = {"order"}
                    />

                    <ItemAccountTouchable
                       onPress={this._onPressCustomerProfile.bind(this)}
                       title = {strings("ACCOUNT_DETAIL_TITLE")}
                       iconName = {"info"}
                    />

                    <ItemAccountTouchable
                       onPress={this._onPressDownloads.bind(this)}
                       title = {strings("DOWNLOADABLE_PRODUCT")}
                       iconName = {"download"}
                    />
                  </View>
                </ScrollView>
                <Text
                  style={[
                    ViewStyle.viewAllStyle,
                    { fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE }
                  ]}
                  onPress={this._onPressLogout.bind(this)}
                >
                  {strings("LOGOUT_TITLE")}
                </Text>
              </View>
            ) : (
              <SignInSignUp
                onPressSignUp={this._onPressRegister.bind(this)}
                onPressSignIn={this._onPressLogin.bind(this)}
                navigation = {this.props.navigation}
                onSuccess = {this.onSuccessSocialLogin.bind(this)}
              />
            )}
          </View>
        ) : (
          <Loading />
        )}
        <ProgressDialog
          visible={this.state.isProgressLoading}
          pleaseWaitVisible={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "bold",
    margin: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  eachItemstyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2,
    padding: ThemeConstant.MARGIN_NORMAL
  },
  eachItemTextStyle: {
    alignSelf: "stretch",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginLeft: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    backgroundColor:"red"
  }
});

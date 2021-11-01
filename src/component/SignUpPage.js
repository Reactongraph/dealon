import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../app_constant/ThemeConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { isStringEmpty } from "../utility/UtilityConstant";
import AppConstant from "../app_constant/AppConstant";
import ProgressDialog from "../container/ProgressDialog";
import { setIsLogin, setUserData } from "../app_constant/AppSharedPref";
import { showSuccessToast, showErrorToast } from "../utility/Helper";

import CustomIcon2 from "../container/CustomIcon2";
import _ from "lodash";
import CustomActionbar from "../container/CustomActionbar";
import ViewStyle from "../app_constant/ViewStyle";
import { strings, localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class SignUp extends React.Component {
  scrollView = null;
  SIZE_OF_EACH_ITEM = 60;
  state = {
    email: "",
    password: "",
    confPassword : "",
    userName: "",
    firstName: "",
    lastName: "",
    shopName: "",
    shopURL: "",
    phoneNumber: "",
    passwordError: "",
    confPasswordError: "",
    userNameError: "",
    emailError: "",
    firstNameError: "",
    lastNameError: "",
    shopNameError: "",
    shopURLError: "",
    phoneNumberError: "",
    isCustomer: true,
    isProgress: false,
    availableURLMSG: "",
    isProgress: false,
    isURLAvailable: false,
    isButtonClicked: false,
    isPasswordVisible: false,
    isConfPasswordVisible : false
  };
  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
      this.userId = userId ? userId : "";
    });
  }

  _handleUserName = userName => {
    this.setState({ userName: userName });
  };
  _handleEmail = email => {
    this.setState({ email: email });
  };
  _handlePassword = password => {
    this.setState({ password: password });
  };
  _handlePasswordVisible = () => {
    this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
  };
  _handleConfPassword = password => {
    this.setState({ confPassword: password });
  };
  _handleConfPasswordVisible = () => {
    this.setState({ isConfPasswordVisible: !this.state.isConfPasswordVisible });
  };

  _handleFirstName = firstName => {
    this.setState({ firstName: firstName });
  };

  _handleLastName = lastName => {
    this.setState({ lastName: lastName });
  };
  _handleShopName = shopName => {
    this.setState({ shopName: shopName });
  };
  _handleShopURL = shopURL => {
    this.setState({
      shopURL: shopURL,
      isURLAvailable: false,
      availableURLMSG: ""
    });
  };
  _handlePhoneNumber = phoneNumber => {
    this.setState({ phoneNumber: phoneNumber });
  };
  _onPressCheckUrlAvailable = () => {
    if (this.state.shopURL) {
      setTimeout(() => {
        this.setState({
          isProgress: false
        });
      }, Platform.OS == 'android' ? 1 : 700);
      
      let URL =
        AppConstant.BASE_URL + "user/checkurl?slug=" + this.state.shopURL;
      fetchDataFromAPI(URL, "GET", "", null).then(response => {
        this.setState({
          isProgress: false
        });
        if (response) {
          this.setState({
            availableURLMSG: response.message,
            isURLAvailable: response.success
          });
        } else {
          this.setState({
            availableURLMSG: "Not Available.",
            isURLAvailable: false
          });
        }
      });
    } else {
      showErrorToast("Shop URL should not be empty.");
    }
  };

  _onPressCustomer = () => {
    this.setState({ isCustomer: true });
  };
  _onPressSeller = () => {
    this.setState({ isCustomer: false });
  };

  _onButtonPress = (email, password, userName) => {
    this.setState({ isButtonClicked: true });
    let isFieldComplete = true;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (userName == null || userName.trim() == "") {
      this.setState({ userNameError: strings("REQUIRED_FIELD") });
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 1 });
      }
      isFieldComplete = false;
    } else {
      this.setState({ userNameError: "" });
    }

    if (reg.test(email) === false) {
      this.setState({ emailError: strings("EMAIL_REQUIRED_FIELD") });
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 2 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    } else {
      this.setState({ emailError: "" });
    }
    if (password == null || password.trim() == "") {
      this.setState({ passwordError: strings("PASSWORD_REQUIRED_FIELD") });
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 3 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    } else {
      this.setState({ passwordError: "" });
    }

     if (password != this.state.confPassword) {
      this.setState({ confPasswordError: strings("CONFIRM_PASSWORD_MATCH_ERROR") });
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 4 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    } else {
      this.setState({ confPasswordError: "" });
    }

    if (!this.state.isCustomer) {
      if (isStringEmpty(this.state.firstName)) {
        this.setState({ firstNameError: strings("REQUIRED_FIELD") });
        if (isFieldComplete) {
          this.scrollView.scrollTo({ y: 5 * this.SIZE_OF_EACH_ITEM });
        }
        isFieldComplete = false;
      } else {
        this.setState({ firstNameError: "" });
      }
      if (isStringEmpty(this.state.lastName)) {
        this.setState({ lastNameError: strings("REQUIRED_FIELD") });
        if (isFieldComplete) {
          this.scrollView.scrollTo({ y: 6 * this.SIZE_OF_EACH_ITEM });
        }
        isFieldComplete = false;
      } else {
        this.setState({ lastNameError: "" });
      }
      if (isStringEmpty(this.state.shopName)) {
        this.setState({ shopNameError: strings("REQUIRED_FIELD") });
        if (isFieldComplete) {
          this.scrollView.scrollTo({ y: 7 * this.SIZE_OF_EACH_ITEM });
        }
        isFieldComplete = false;
      } else {
        this.setState({ shopNameError: "" });
      }
      if (isStringEmpty(this.state.shopURL) || !this.state.isURLAvailable) {
        this.setState({
          shopURLError: isStringEmpty(this.state.shopURL)
            ? strings("REQUIRED_FIELD")
            : strings("URL_VALIDITY_REQUIRED")
        });
        if (isFieldComplete) {
          this.scrollView.scrollTo({ y: 8 * this.SIZE_OF_EACH_ITEM });
        }
        isFieldComplete = false;
      } else {
        this.setState({ shopURLError: "" });
      }
      if (isStringEmpty(this.state.phoneNumber)) {
        this.setState({ phoneNumberError: strings("REQUIRED_FIELD") });
        if (isFieldComplete) {
          this.scrollView.scrollTo({ y: 9 * this.SIZE_OF_EACH_ITEM });
        }
        isFieldComplete = false;
      } else {
        this.setState({ phoneNumberError: "" });
      }
    }

    if (isFieldComplete) {
      let url = AppConstant.BASE_URL + "user/create";
      let data = {
        username: this.state.userName + "",
        email: this.state.email + "",
        password: this.state.password + "",
        guest_id: this.userId,
        isSeller:0
      };
      if (!this.state.isCustomer) {
        data = {
          username: this.state.userName,
          email: this.state.email,
          password: this.state.password,
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          shop_name: this.state.shopName,
          shop_url: this.state.shopURL,
          phone: this.state.phoneNumber,
          guest_id: this.userId,
          isSeller:1
        };
      }

      data = JSON.stringify(data);

      this.setState({
        isProgress: true
      });

      fetchDataFromAPI(url, "POST", data, null).then(response => {
       
        setTimeout(() => {
          this.setState({
            isProgress: false,
            isButtonClicked: false
          });
        }, Platform.OS == 'android' ? 1 : 700);

        if (response.id) {
          setIsLogin("true").then(result => {
            setUserData(response).then(result => {
              showSuccessToast(strings("SUCCESSFULL_REGISTER_MSG"));
              if (this.props.navigation.getParam("isFromCart", false)) {
                this.props.navigation.replace("Checkout");
              } else {
                this.props.navigation.navigate("CustomerDetail", {
                  isUpdate: true
                });
              }
            });
          });
        } else {
          showErrorToast(response.message);
        }
      });
    } else {
      this.setState({ isButtonClicked: false });
    }
  };
  _onPressSignIn = () => {
    this.props.navigation.replace("Login", {
      isFromCart: this.props.navigation.getParam("isFromCart", false)
    });
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          backgroundColor: ThemeConstant.BACKGROUND_COLOR
        }}
      >
        <CustomActionbar
          title={strings("REGISTER_TITLE")}
          backwordTitle={
            this.props.navigation.getParam("isFromCart", false)
              ? strings("CART_TITLE")
              : strings("ACCOUNT_TITLE")
          }
          backwordImage = "close-cross"
          _onBackPress={this._onBackPress.bind(this)}
        />
        <ScrollView ref={view => (this.scrollView = view)}  keyboardShouldPersistTaps={'always'} >
          <KeyboardAvoidingView
            style={{ padding: ThemeConstant.MARGIN_NORMAL }}
          >
            <Text style={styles.headingTextColor}>
              {strings("USER_NAME")}
            </Text>
            <TextInput
              style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right":"left"}]}
              autoCapitalize="none"
              onSubmitEditing={() => this.emailInput.focus()}
              ref={input => (this.userNameInput = input)}
              autoCorrect={false}
              value={this.state.userName}
              onChangeText={this._handleUserName.bind(this)}
              keyboardType="default"
              returnKeyType="next"
              placeholder={strings("USER_NAME")}
            />
            <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>{this.state.userNameError}</Text>

            <Text style={styles.headingTextColor}>{strings("EMAIL")}</Text>
            <TextInput
              style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right":"left"}]}
              autoCapitalize="none"
              onSubmitEditing={() => this.passwordInput.focus()}
              ref={input => (this.emailInput = input)}
              autoCorrect={false}
              value={this.state.email}
              onChangeText={this._handleEmail.bind(this)}
              keyboardType="email-address"
              returnKeyType="next"
              placeholder={strings("EMAIL")}
            />
            <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>{this.state.emailError}</Text>

            <Text style={styles.headingTextColor}>
              {strings("PASSWORD")}
            </Text>
            <View style={[ViewStyle.passInputViewStyle, globleViewStyle]}>
              <TextInput
                returnKeyType="next"
                ref={input => (this.passwordInput = input)}
                placeholder={strings("PASSWORD")}
                style={[ViewStyle.passInputTextStyle, {textAlign:localeObject.isRTL ? "right" : "left"}]}
                value={this.state.password}
                onChangeText={this._handlePassword.bind(this)}
                secureTextEntry={!this.state.isPasswordVisible}
                error={this.state.passwordError}
                onSubmitEditing={() => this.confPasswordInput.focus()}
              />
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={_.debounce(this._handlePasswordVisible, 300)}
              >
                <CustomIcon2
                  name={
                    this.state.isPasswordVisible ? "eye-hide" : "eye-visible"
                  }
                  size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                  color={ThemeConstant.ACCENT_COLOR}
                />
              </TouchableOpacity>
            </View>
            <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>{this.state.passwordError}</Text>

            <Text style={styles.headingTextColor}>
              {strings("CONFIRMATION_PASSWORD")}
            </Text>

            <View style={[ViewStyle.passInputViewStyle, globleViewStyle]}>
              <TextInput
                returnKeyType="next"
                ref={input => (this.confPasswordInput = input)}
                placeholder={strings("CONFIRMATION_PASSWORD")}
                style={[ViewStyle.passInputTextStyle, {textAlign:localeObject.isRTL ? "right" : "left"}]}
                value={this.state.confPassword}
                onChangeText={this._handleConfPassword.bind(this)}
                secureTextEntry={!this.state.isConfPasswordVisible}
              />
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={_.debounce(this._handleConfPasswordVisible, 300)}
              >
                <CustomIcon2
                  name={
                    this.state.isConfPasswordVisible ? "eye-hide" : "eye-visible"
                  }
                  size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                  color={ThemeConstant.ACCENT_COLOR}
                />
              </TouchableOpacity>
            </View>
            <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>{this.state.confPasswordError}</Text>

            {this.state.isCustomer ? null : (
              <View>
                <Text style={styles.headingTextColor}>
                  {strings("FIRST_NAME")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right":"left"}]}
                  autoCapitalize="none"
                  onSubmitEditing={() => this.lastName.focus()}
                  ref={input => (this.firstName = input)}
                  autoCorrect={false}
                  value={this.state.firstName}
                  onChangeText={this._handleFirstName.bind(this)}
                  keyboardType="default"
                  returnKeyType="next"
                  placeholder={strings("FIRST_NAME")}
                />
                <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>
                  {this.state.firstNameError}
                </Text>

                <Text style={styles.headingTextColor}>
                  {strings("LAST_NAME")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right":"left"}]}
                  autoCapitalize="none"
                  onSubmitEditing={() => this.shopName.focus()}
                  ref={input => (this.lastName = input)}
                  autoCorrect={false}
                  value={this.state.lastName}
                  onChangeText={this._handleLastName.bind(this)}
                  keyboardType="default"
                  returnKeyType="next"
                  placeholder={strings("LAST_NAME")}
                />
                <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>
                  {this.state.lastNameError}
                </Text>

                <Text style={styles.headingTextColor}>
                  {strings("SHOP_NAME")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right":"left"}]}
                  autoCapitalize="none"
                  onSubmitEditing={() => {
                    this.shopURL.focus();
                    this.setState({ shopURL: this.state.shopName });
                  }}
                  ref={input => (this.shopName = input)}
                  autoCorrect={false}
                  value={this.state.shopName}
                  onChangeText={this._handleShopName.bind(this)}
                  keyboardType="default"
                  returnKeyType="next"
                  placeholder={strings("SHOP_NAME")}
                />
                <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>
                  {this.state.shopNameError}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.headingTextColor}>
                    {strings("SHOP_URL")}
                  </Text>
                  <Text
                    style={
                      !this.state.isURLAvailable
                        ? [ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]
                        : {
                            marginLeft: ThemeConstant.MARGIN_TINNY,
                            color: "green"
                          }
                    }
                  >
                    {this.state.availableURLMSG}
                  </Text>
                </View>

                <View style={[ViewStyle.passInputViewStyle, globleViewStyle]}>
                  <TextInput
                    style={[ViewStyle.passInputTextStyle, {textAlign:localeObject.isRTL ? "right" : "left"}]}
                    autoCapitalize="none"
                    onSubmitEditing={() => {
                      this.phoneNumber.focus();
                      this._onPressCheckUrlAvailable();
                    }}
                    ref={input => (this.shopURL = input)}
                    autoCorrect={false}
                    value={this.state.shopURL}
                    onChangeText={this._handleShopURL.bind(this)}
                    keyboardType="default"
                    returnKeyType="next"
                    placeholder={strings("SHOP_URL")}
                  />
                  <TouchableOpacity
                    style={{ alignSelf: "center" }}
                    onPress={_.debounce(this._onPressCheckUrlAvailable, 300)}
                  >
                    <Text
                      style={
                        !this.state.isURLAvailable
                          ? styles.validateButton
                          : styles.validatedButton
                      }
                    >
                      {strings("VALIDATE")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>
                  {this.state.shopURLError}
                </Text>

                <Text style={styles.headingTextColor}>
                  {strings("PHONE_NUMBER")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right":"left"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={this.state.phoneNumber}
                  ref={input => (this.phoneNumber = input)}
                  onChangeText={this._handlePhoneNumber.bind(this)}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  placeholder={strings("PHONE_NUMBER")}
                />
                <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL ? "left" : "right"}]}>
                  {this.state.phoneNumberError}
                </Text>
              </View>
            )}

            {/* Seller Button */}
            {AppConstant.IS_MARKETPLACE ? (
              <View
                style={{
                  backgroundColor: ThemeConstant.BACKGROUND_COLOR,
                  flexDirection: "row",
                  margin: ThemeConstant.MARGIN_GENERIC
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: ThemeConstant.MARGIN_NORMAL,
                    borderWidth: 2,
                    borderColor: ThemeConstant.ACCENT_COLOR,
                    backgroundColor: this.state.isCustomer
                      ? ThemeConstant.ACCENT_COLOR
                      : ThemeConstant.BACKGROUND_COLOR,
                    color: !this.state.isCustomer
                      ? ThemeConstant.ACCENT_COLOR
                      : ThemeConstant.BACKGROUND_COLOR
                  }}
                  onPress={this._onPressCustomer.bind(this)}
                >
                  {strings("I_AM_CUSTOMER")}
                </Text>

                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: ThemeConstant.MARGIN_NORMAL,
                    borderColor: ThemeConstant.ACCENT_COLOR,
                    borderWidth: 2,
                    backgroundColor: !this.state.isCustomer
                      ? ThemeConstant.ACCENT_COLOR
                      : ThemeConstant.BACKGROUND_COLOR,
                    color: this.state.isCustomer
                      ? ThemeConstant.ACCENT_COLOR
                      : ThemeConstant.BACKGROUND_COLOR
                  }}
                  onPress={this._onPressSeller.bind(this)}
                >
                  {strings("I_AM_SELLER")}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() =>
                this.state.isButtonClicked
                  ? null
                  : this._onButtonPress(
                      this.state.email,
                      this.state.password,
                      this.state.userName
                    )
              }
              activeOpacity={1}
            >
              <Text style={styles.buttonText}>{strings("SIGN_UP")}</Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.headingTextColor,
                { alignSelf: "center", marginTop: ThemeConstant.MARGIN_LARGE }
              ]}
            >
              {strings("ASK_FOR_LOGIN")}
            </Text>

            <Text
              style={ViewStyle.viewAllStyle}
              onPress={this._onPressSignIn.bind(this)}
            >
              {strings("SIGN_IN_WITH_EMAIL")}
            </Text>
          </KeyboardAvoidingView>

          <ProgressDialog visible={this.state.isProgress} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "stretch",
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_LARGE,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    marginRight: ThemeConstant.MARGIN_TINNY,
    borderRadius: ThemeConstant.MARGIN_TINNY
  },
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold"
  },
  validateButton: {
    color: ThemeConstant.ACCENT_COLOR,
    fontSize: ThemeConstant.DEFAULT_TINNY_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_TINNY,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 10
  },
  validatedButton: {
    color: ThemeConstant.LINE_COLOR,
    fontSize: ThemeConstant.DEFAULT_TINNY_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_TINNY,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    borderRadius: 10
  },
  headingTextColor: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  }
});

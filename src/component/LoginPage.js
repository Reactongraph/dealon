import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ScrollView } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
import {
  setIsLogin,
  setUserData,
  setCartCount,
  isFingerPrintEnable,
  setFingerPrintUserAUTH,
  setFingerPrintEnable,
  setWishListGuestId
} from "../app_constant/AppSharedPref";
import ProgressDialog from "../container/ProgressDialog";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { showSuccessToast, showErrorToast } from "../utility/Helper";

import CustomIcon2 from "../container/CustomIcon2";
import _ from "lodash";
import CustomActionbar from "../container/CustomActionbar";
import ForgotPasswordDialog from "../container/ForgotPasswordDialog";
import ViewStyle from "../app_constant/ViewStyle";
import { isStringEmpty, SCREEN_WIDTH } from "../utility/UtilityConstant";
import FingerprintScanner from "react-native-fingerprint-scanner";
import FingerprintPopup from "../container/fingerprint/FingerprintPopup.component";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";

export default class LoginPage extends React.Component {
  userId = "";
  biometric = undefined;
  state = {
    email: AppConstant.DEMO_USER_DATA,
    password: AppConstant.DEMO_USER_PASSWORD,
    passwordError: "",
    emailError: "",
    isProgress: false,
    isPasswaordVisible: false,
    forgotPasswodVisible: false,
    isFingerPrintEnable : false,
    isFingerPrintDialogEnable : false,
    REQUEST_TYPE : ""
  };

  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
      this.userId = userId ? userId : "";
    });
    this.checkFingurePrintAvailability();
  }
  checkFingurePrintAvailability = () => {
    FingerprintScanner.isSensorAvailable()
      .then(biometryType =>{
        this.biometric = biometryType;
        // console.log("BiometryType", biometryType)
        AsyncStorage.getItem(AppConstant.IS_FINGER_PRINT_ENABLE).then(isEnable=>{
          if(isEnable == 'true'){
            this.setState({
              isFingerPrintEnable : true
            })
          }
        })
       
      } )
      .catch(error => {
        console.log("BiometryType++++", error.message);
      });
  };

  _handleEmail = email => {
    this.setState({ email: email });
  };
  _handlePassword = password => {
    this.setState({ password: password });
  };
  _handlePasswordVisible = () => {
    this.setState({ isPasswaordVisible: !this.state.isPasswaordVisible });
  };
  _onButtonPress = (email, password) => {
    let isFormValid = true;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (isStringEmpty(email)) {
      this.setState({ emailError: strings("EMAIL_USER_NAME_EROR_MSG") });
      isFormValid = false;
    } else {
      this.setState({ emailError: "" });
    }
    if (password == null || password.trim() == "") {
      this.setState({ passwordError: strings("PASSWORD_ERROR_MSG") });
      isFormValid = false;
    } else {
      this.setState({ passwordError: "" });
    }
    if (isFormValid) {
         if(this.biometric){
          // console.log("biometric CASE=>>>", this.biometric);
            if(!this.state.isFingerPrintEnable){
              this.askForBiometricAuthAlert(strings("ASK_FOR_ADD_FINGRE_PRINT", {"biometric": this.biometric}), AppConstant.FINGRE_TYPE_REQUEST.UPDATE);
            }else{
              AsyncStorage.getItem(AppConstant.FINGER_PRINT_LOGIN_USER).then(loginUser=>{
                  if(loginUser && typeof loginUser == "string"  &&  !isStringEmpty(loginUser)){
                    loginUser = JSON.parse(loginUser);
                    if(loginUser.email != this.state.email || loginUser.password != this.state.password){
                     this.askForBiometricAuthAlert(strings("ASK_FOR_UPDATE_FINGRE_PRINT", {"biometric" : this.biometric }), AppConstant.FINGRE_TYPE_REQUEST.UPDATE);
                    }else{
                      this.callLoginAPI();
                    }
                  }else{
                    this.callLoginAPI();
                  }
              })
            }
         }else{
          this.callLoginAPI();
         }
    }
  }

  callLoginAPI = ()=>{
    let url = AppConstant.BASE_URL + "user/login";
    let data = JSON.stringify({
      key: this.state.email, // 'johndoe',
      pass: this.state.password,
      guest_id: this.userId,
      wishlist_guest_id :  AppConstant.WISHLIST_USER_ID
    });
    this.setState({
      isProgress: true
    });
    fetchDataFromAPI(url, "POST", data, null).then(response => {
      setTimeout(() => {
        this.setState({
          isProgress: false
        });
      }, Platform.OS == 'android' ? 1 : 700);

      if (response.success) {
        setIsLogin("true").then(result => {
          setUserData(response).then(result => {
            showSuccessToast(strings("SUCCESSFULL_LOGIN_MSG"));
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
  }

  askForBiometricAuthAlert = (message, requestType)=>{
      Alert.alert(
        strings("LOGIN_AUTHENTICATION_TITLE"),
        message,
        [{
          text : strings("OK"),
          style : "cancel",
          onPress : ()=>{
            this.setState({
              isFingerPrintDialogEnable : true,
              REQUEST_TYPE : requestType,
            })
          }        
        },{
          text : strings("CANCEL"),
          style : "cancel",
          onPress : ()=>{
            this.callLoginAPI();
          }
        }],
        { cancelable: false }
      )
  }

  _onPressForgotPassword = () => {
    this.setState({
      forgotPasswodVisible: true
    });
  };

  onBackForgotPassword = isSuccess => {
    this.setState({
      forgotPasswodVisible: false
    });
  };

  _onPressSignUp = () => {
    this.props.navigation.replace("SignUp", {
      isFromCart: this.props.navigation.getParam("isFromCart", false)
    });
  };

  onPressFingrePrint = ()=>{
      this.setState({
        isFingerPrintDialogEnable : true,
        REQUEST_TYPE : AppConstant.FINGRE_TYPE_REQUEST.NORMAL
      })
  }

  handleFingerprintDismissed = (REQUEST_KEY, AUTHENTICATED)=>{
    this.setState({isFingerPrintDialogEnable : false})
    if(AUTHENTICATED == true){
      switch (REQUEST_KEY) {
        case AppConstant.FINGRE_TYPE_REQUEST.NORMAL:
        AsyncStorage.getItem(AppConstant.FINGER_PRINT_LOGIN_USER).then(loginUser=>{
          if(loginUser && typeof loginUser == "string"  &&  !isStringEmpty(loginUser)){
            loginUser = JSON.parse(loginUser);
            this.setState({
              email : loginUser.email,
              password : loginUser.password
            })
             this.callLoginAPI();
          }
        })
          break;
          case AppConstant.FINGRE_TYPE_REQUEST.UPDATE :          
            let loginUser = JSON.stringify({email : this.state.email, password : this.state.password});
            setFingerPrintUserAUTH(loginUser);
            setFingerPrintEnable("true");
            this.callLoginAPI();
          break;
      
        default:
            this.callLoginAPI();
          break;
      }
    }else{
      //  this.callLoginAPI();
    }
  }

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
          title={strings("LOGIN_TITLE")}
          backwordTitle={
            this.props.navigation.getParam("isFromCart", false)
              ? strings("CART_TITLE")
              : strings("ACCOUNT_TITLE")
          }
          _onBackPress={this._onBackPress.bind(this)}
          backwordImage="close-cross"
        />
        <ScrollView keyboardShouldPersistTaps={"always"}>
          <KeyboardAvoidingView
            behavior="padding"
            enable={true}
            keyboardVerticalOffset={1}
            style={{ padding: ThemeConstant.MARGIN_NORMAL }}
          >
            <Text style={[styles.headingTextColor, globalTextStyle]}>
              {strings("USER_NAME_EMAIL")}
            </Text>
            <TextInput
              style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right" : "left"}]}
              autoCapitalize="none"
              onSubmitEditing={() => this.passwordInput.focus()}
              autoCorrect={false}
              value={this.state.email}
              onChangeText={this._handleEmail.bind(this)}
              keyboardType="email-address"
              returnKeyType="next"
              placeholder={strings("USER_NAME_EMAIL")}
            />
            <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>{this.state.emailError}</Text>

            <Text style={[styles.headingTextColor, globalTextStyle]}>
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
                secureTextEntry={!this.state.isPasswaordVisible}
                error={this.state.passwordError}
              />
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={_.debounce(this._handlePasswordVisible, 300)}
              >
                <CustomIcon2
                  name={
                    this.state.isPasswaordVisible ? "eye-hide" : "eye-visible"
                  }
                  size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                  color={ThemeConstant.ACCENT_COLOR}
                />
              </TouchableOpacity>
            </View>
            <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>{this.state.passwordError}</Text>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() =>
                this._onButtonPress(this.state.email, this.state.password)
              }
              activeOpacity={1}
            >
              <Text style={styles.buttonText}>{strings("SIGN_IN")}</Text>
            </TouchableOpacity>

            <Text
              style={styles.forgotPassword}
              onPress={this._onPressForgotPassword.bind(this)}
            >
              {strings("FORGOT_PASSWORD")}
            </Text>

            <Text style={[styles.headingTextColor, { alignSelf: "center" }]}>
              {strings("ASK_FOR_REGISTER")}
            </Text>

            <Text
              style={[ViewStyle.viewAllStyle, { alignSelf: "stretch" }]}
              onPress={this._onPressSignUp.bind(this)}
            >
              {strings("CREATE_AN_ACCOUNT")}
            </Text>
            {this.state.isFingerPrintEnable 
            ?
            <TouchableOpacity 
             activeOpacity = {1}
             onPress = {this.onPressFingrePrint.bind(this)}
             style = {styles.fingreprintButtonStyle}
            >
              <CustomIcon2
                name = "baseline-fingerprint-24px"
                color = {ThemeConstant.ACCENT_COLOR}
                size = {ThemeConstant.DEFAULT_ICON_SIZE_LARGE}
              />
            </TouchableOpacity>
            : null }
          </KeyboardAvoidingView>
        </ScrollView>
        <ForgotPasswordDialog
          visible={this.state.forgotPasswodVisible}
          onBack={this.onBackForgotPassword.bind(this)}
        />
        <ProgressDialog visible={this.state.isProgress} />
        {this.state.isFingerPrintDialogEnable && (
          <FingerprintPopup
            style={{width:SCREEN_WIDTH*0.9}}
            handlePopupDismissed={this.handleFingerprintDismissed}
            biometric = {this.biometric}
            REQUEST_TYPE = {this.state.REQUEST_TYPE}
          />
        )}
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
  forgotPassword: {
    alignSelf: "center",
    margin: ThemeConstant.MARGIN_GENERIC,
    marginBottom: ThemeConstant.MARGIN_EXTRA_LARGE,
    marginTop: ThemeConstant.MARGIN_LARGE,
    color: ThemeConstant.ACCENT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold"
  },
  headingTextColor: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  fingreprintButtonStyle:{
    alignSelf:"center",
    justifyContent:"center",
    alignItems:"center",
    marginTop : ThemeConstant.MARGIN_LARGE,
  }
});

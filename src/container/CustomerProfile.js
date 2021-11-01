import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Form,} from "native-base";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import Loading from "./LoadingComponent";
import ProgressDialog from "./ProgressDialog";
import CustomActionbar from "./CustomActionbar";

import _ from "lodash";
import CustomIcon2 from "./CustomIcon2";
import { isStringEmpty, isValidEmail } from "../utility/UtilityConstant";
import { showSuccessToast, showErrorToast } from "../utility/Helper";
import ViewStyle from "../app_constant/ViewStyle";
import { strings, localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
export default class CustomerProfile extends React.Component {
  customer = {};
  userID = 0;
  scrollView = null;
  SIZE_OF_EACH_ITEM = 60;

  state = {
    isLoading: true,
    isProgress: false,
    showError: false,
    email: "",
    firstName: "",
    lastName: "",
    oldPassword: "",
    newPassword: "",
    confPassword: "",
    emailError: "",
    newPasswordError: "",
    oldPasswordError: "",
    confPasswordError: "",
    isNewPasswaordVisible: false,
    isOldPasswaordVisible: false,
    isConfPasswaordVisible: false
  };

  _onButtonPress = () => {
    this.setState({
      showError: true
    });
    let flag = true;
    let focused = false;
    let emailError = "";
    let oldPasswordError = "";
    let newPasswordError = "";
    let confPasswordError = "";
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (isStringEmpty(this.state.firstName)) {
      flag = false;
      this.scrollView.scrollTo({ y: 1 });
      // this.firstNameInput.focus();
      focused = true;
    }
    if (isStringEmpty(this.state.lastName)) {
      flag = false;
      if (!focused) {
        // this.lastNameInput.focus();
        this.scrollView.scrollTo({ y: 2 * this.SIZE_OF_EACH_ITEM });
        focused = true;
      }
    }
    if (
      !this.state.email ||
      this.state.email == "" ||
      reg.test(this.state.email) === false
    ) {
      flag = false;
      if(isStringEmpty(this.state.email)){
        emailError = strings("REQUIRED_FIELD");
      }else{
        emailError = strings("EMAIL_REQUIRED_FIELD");
      }
      if (!focused) {
        // this.emailInput.focus();
        focused = true;
        this.scrollView.scrollTo({ y: 3 * this.SIZE_OF_EACH_ITEM });
      }
    } else {
      this.setState({ emailError: "" });
    }

    if (this.state.newPassword != "" && this.state.oldPassword == "") {
      oldPasswordError = strings("OLD_PASSWORD_ERROR");
      flag = false;
      if (!focused) {
        // this.oldPasswordInput.focus();
        this.scrollView.scrollTo({ y: 4 * this.SIZE_OF_EACH_ITEM });
        focused = true;
      }
    } else {
      this.setState({ oldPasswordError: "" });
    }

    if (this.state.oldPassword != "" && this.state.newPassword == "") {
      newPasswordError = strings("NEW_PASSWORD_ERROR");
      flag = false;
      if (!focused) {
        // this.oldPasswordInput.focus();
        this.scrollView.scrollTo({ y: 5 * this.SIZE_OF_EACH_ITEM });
        focused = true;
      }
    } else {
      this.setState({ newPasswordError: "" });
    }
    if (this.state.newPassword != this.state.confPassword) {
      confPasswordError = strings("CONFIRM_PASSWORD_MATCH_ERROR");
      flag = false;
      if (!focused) {
        // this.confPasswordInput.focus();
        this.scrollView.scrollTo({ y: 6 * this.SIZE_OF_EACH_ITEM });
        focused = true;
      }
    } else {
      this.setState({ confPasswordError: "" });
    }
    if (flag) {
      this.setState({ isProgress: true });
      let body = JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        old_password: this.state.oldPassword,
        new_password: this.state.newPassword,
        confirm_password: this.state.confPassword
      });
      let url = AppConstant.BASE_URL + "user/" + this.userID + "/edit-account";
      fetchDataFromAPI(url, "POST", body, null).then(response => {
        this.setState({ isProgress: false });
        // alert(response.message);
        if (response.success) {
          this.componentDidMount();
          showSuccessToast(response.message);
        } else {
          showErrorToast(response.message);
        }
      });
    } else {
      this.setState({
        confPasswordError: confPasswordError,
        newPasswordError: newPasswordError,
        oldPasswordError: oldPasswordError,
        emailError: emailError
      });
    }
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  _handleNewPasswordVisible = () => {
    this.setState({ isNewPasswaordVisible: !this.state.isNewPasswaordVisible });
  };
  _handleOldPasswordVisible = () => {
    this.setState({ isOldPasswaordVisible: !this.state.isOldPasswaordVisible });
  };
  _handleConfPasswordVisible = () => {
    this.setState({
      isConfPasswaordVisible: !this.state.isConfPasswaordVisible
    });
  };

  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      if (userID) {
        this.userID = userID;
        let url = AppConstant.BASE_URL + "user/" + userID;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (response) {
            this.setState({
              isLoading: false,
              email: response.email,
              firstName: response.first_name,
              lastName: response.last_name
              // oldPassword: response.email,
              // newPassword: response.email,
              // confPassword: response.email,
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

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={[ViewStyle.mainContainer]}
      >
        <CustomActionbar
          _onBackPress={this._onBackPress}
          backwordTitle={strings("ACCOUNT_TITLE")}
          title={strings("ACCOUNT_DETAIL_TITLE")}
        />
        {!this.state.isLoading ? (
          <ScrollView ref={view => (this.scrollView = view)} keyboardShouldPersistTaps={'always'}>
            <Form style={{ padding: ThemeConstant.MARGIN_NORMAL }}>
              <Text style={[styles.headingTextColor, globalTextStyle]}>
                {strings("FIRST_NAME")}
              </Text>
              <TextInput
                style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL?"rtl" : "ltr"}]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() => this.lastNameInput.focus()}
                value={this.state.firstName}
                onChangeText={text => this.setState({ firstName: text })}
                ref={ref => (this.firstNameInput = ref)}
                placeholder={strings("FIRST_NAME")}
              />
              <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                {this.state.showError && isStringEmpty(this.state.firstName)
                  ? strings("REQUIRED_FIELD")
                  : null}
              </Text>

              <Text style={[styles.headingTextColor, globalTextStyle]}>
                {strings("LAST_NAME")}
              </Text>
              <TextInput
                style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL?"rtl" : "ltr"}]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() => this.emailInput.focus()}
                value={this.state.lastName}
                onChangeText={text => this.setState({ lastName: text })}
                ref={ref => (this.lastNameInput = ref)}
                placeholder={strings("LAST_NAME")}
              />
              <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                {this.state.showError && isStringEmpty(this.state.lastName)
                  ? strings("REQUIRED_FIELD")
                  : null}
              </Text>

              <Text style={[styles.headingTextColor, globalTextStyle]}>
                {strings("EMAIL")}
              </Text>
              <TextInput
                style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL?"rtl" : "ltr"}]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => this.oldPasswordInput.focus()}
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
                ref={ref => (this.emailInput = ref)}
                placeholder={strings("EMAIL")}
              />
              <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>{this.state.emailError}</Text>

              <Text style={[styles.headingTextColor, globalTextStyle]}>
                {strings("OLD_PASSWORD")}
                <Text style={styles.subMessage}>
                    {strings("BLANK_MSG")}
                </Text>
              </Text>
              <View style={[ViewStyle.passInputViewStyle, globleViewStyle]}>
                <TextInput
                  returnKeyType="next"
                  style={[ViewStyle.passInputTextStyle, {writingDirection:localeObject.isRTL?"rtl" : "ltr", backgroundColor:"red"}, globalTextStyle]}
                  value={this.state.oldPassword}
                  ref={input => (this.oldPasswordInput = input)}
                  placeholder={strings("OLD_PASSWORD")}
                  onChangeText={text => {
                    this.setState({ oldPassword: text });
                  }}
                  secureTextEntry={!this.state.isOldPasswaordVisible}
                />
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={_.debounce(this._handleOldPasswordVisible, 300)}
                >
                  <CustomIcon2
                    name={
                      this.state.isOldPasswaordVisible
                        ? "eye-hide"
                        : "eye-visible"
                    }
                    size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                    color={ThemeConstant.ACCENT_COLOR}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                {this.state.oldPasswordError}
              </Text>

              <Text style={[styles.headingTextColor, globalTextStyle]}>
                {strings("NEW_PASSWORD")}
                <Text style={styles.subMessage}>
                  {" "}
                  {strings("BLANK_MSG")}
                </Text>
              </Text>
              <View style={[ViewStyle.passInputViewStyle, globleViewStyle]}>
                <TextInput
                  returnKeyType="next"
                  ref={input => (this.newPasswordInput = input)}
                  onSubmitEditing={() => this.confPasswordInput.focus()}
                  style={[ViewStyle.passInputTextStyle, {writingDirection:localeObject.isRTL?"rtl" : "ltr"}, globalTextStyle]}
                  value={this.state.newPassword}
                  secureTextEntry={!this.state.isNewPasswaordVisible}
                  error={this.state.passwordError}
                  placeholder={strings("NEW_PASSWORD")}
                  onChangeText={text => {
                    this.setState({ newPassword: text });
                  }}
                />
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={_.debounce(this._handleNewPasswordVisible, 300)}
                >
                  <CustomIcon2
                    name={
                      this.state.isNewPasswaordVisible
                        ? "eye-hide"
                        : "eye-visible"
                    }
                    size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                    color={ThemeConstant.ACCENT_COLOR}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                {this.state.newPasswordError}
              </Text>

              <Text style={[styles.headingTextColor, globalTextStyle]}>
                {strings("CONFIRMATION_PASSWORD")}
                <Text style={styles.subMessage}>
                  {" "}
                  {strings("BLANK_MSG")}
                </Text>
              </Text>
              <View style={[ViewStyle.passInputViewStyle, globleViewStyle]}>
                <TextInput
                  returnKeyType="next"
                  ref={input => (this.confPasswordInput = input)}
                  style={[ViewStyle.passInputTextStyle, {writingDirection:localeObject.isRTL?"rtl" : "ltr"}, globalTextStyle]}
                  // onSubmitEditing={() => this.confPasswordInput.focus()}
                  placeholder={strings("CONFIRMATION_PASSWORD")}
                  value={this.state.password}
                  secureTextEntry={!this.state.isConfPasswaordVisible}
                  error={this.state.passwordError}
                  onChangeText={text => {
                    this.setState({ confPassword: text });
                  }}
                />
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={_.debounce(this._handleConfPasswordVisible, 300)}
                >
                  <CustomIcon2
                    name={
                      this.state.isConfPasswaordVisible
                        ? "eye-hide"
                        : "eye-visible"
                    }
                    size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                    color={ThemeConstant.ACCENT_COLOR}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                {this.state.confPasswordError}
              </Text>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={_.debounce(this._onButtonPress, 300)}
                activeOpacity ={1}
              >
                <Text style={styles.buttonText}>
                  {strings("SAVE_ACCOUNT")}
                </Text>
              </TouchableOpacity>
            </Form>
            <ProgressDialog visible={this.state.isProgress} />
          </ScrollView>
        ) : (
          <Loading />
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
  subMessage: {
    fontSize: ThemeConstant.DEFAULT_TINNY_TEXT_SIZE,
    marginRight: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_TEXT_COLOR
  },
  headingTextColor: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  }
});

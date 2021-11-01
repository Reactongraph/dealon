import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform
} from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";

import { TextInput } from "react-native";
import { isValidEmail } from "../utility/UtilityConstant";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { showSuccessToast, showErrorToast } from "../utility/Helper";
import ProgressDialog from "./ProgressDialog";
import ViewStyle from "../app_constant/ViewStyle";
import { localeObject, strings } from "../localize_constant/I18";

export default class ForgotPasswordDialog extends React.Component {
    state = {
        email : "",
        emailError : "",
        isProgress : false
    }

  _handleEmail = email => {
    this.setState({ email: email });
  };
  handleBackPress = () => {
      this.props.onBack();
  };

  _onButtonPress = (email)=>{
      if(!isValidEmail(email)){
        this.setState({ emailError: strings("EMAIL_EROR_MSG") });
      }else{
        this.setState({ emailError: "", isProgress : true });

        let url = AppConstant.BASE_URL + "user/forgot-password";
        let data = JSON.stringify({
            email : this.state.email
        });
        fetchDataFromAPI(url, "POST", data, null).then(response=>{
          setTimeout(() => {
            this.setState({
              isProgress: false
            });
          }, Platform.OS == 'android' ? 1 : 700);

            if(response.success){
                this.props.onBack(true);
                showSuccessToast(response.message);
            }else{
                showErrorToast(response.message);
            }
        })
      }

  }
  render() {
    return (
      <Modal
        onRequestClose={() => {
          this.handleBackPress();
        }}
        visible={this.props.visible}
        animationType="slide"
        transparent={true}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => {
            this.handleBackPress();
          }}
        >
          <TouchableWithoutFeedback>
            <View style={styles.content}>

            <Text style={{ alignSelf: "center", fontWeight : "bold" }}>
              {strings("ASK_FOR_FORGOT_PASSWORD")}
            </Text>
            
              <TextInput
                style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right" : "left"}]}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.email}
                onChangeText={this._handleEmail.bind(this)}
                keyboardType="email-address"
                returnKeyType="next"
                placeholder={strings("EMAIL")}
              />
              <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>{this.state.emailError}</Text>

              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() =>
                  this._onButtonPress(this.state.email)
                }
              >
                <Text style={styles.buttonText}>{strings("RESET_PASSWORD")}</Text>
              </TouchableOpacity>

              <ProgressDialog visible={this.state.isProgress} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  content: {
    backgroundColor: "white",
    alignItems: "stretch",
    alignSelf: "center",
    height: "40%",
    width: "100%",
    padding: ThemeConstant.MARGIN_GENERIC
  },
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
});

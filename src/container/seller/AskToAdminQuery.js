import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Form, Textarea } from "native-base";
import { ScrollView } from "react-native";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import ProgressDialog from "../ProgressDialog";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { showSuccessToast, showErrorToast } from "../../utility/Helper";
import StringConstant from "../../app_constant/StringConstant";
import CustomActionbar from "../CustomActionbar";
import { strings, localeObject } from "../../localize_constant/I18";

export default class AskToAdminQuery extends React.Component {
  userId = 2;
  state = {
    subject: "",
    me: "admin",
    msgError: "",
    subjectError: "",
    isProgress: false
  };

  componentDidMount() {
    this.userId = this.props.navigation.getParam("userID", 0);
  }

  _handleSubject = subject => {
    this.setState({ subject: subject });
  };
  _handleMSG = message => {
    this.setState({ message: message });
  };
  _onButtonPress = (subject, message) => {
    let isFormValid = true;
    if (subject == null || subject.trim() == "") {
      this.setState({ subjectError: strings("SUBJECT_ERROR_MSG") });
      isFormValid = false;
    } else {
      this.setState({ subjectError: "" });
    }
    if (message == null || message.trim() == "") {
      this.setState({ msgError: strings("MESSAGE_ERROR_MSG") });
      isFormValid = false;
    } else {
      this.setState({ msgError: "" });
    }
    if (isFormValid) {
      let url =
        AppConstant.BASE_URL +
        "seller/asktoadmin/ask/?seller_id= " +
        this.userId;
      let data = JSON.stringify({
        subject: this.state.subject,
        message: this.state.message
      });
      this.setState({
        isProgress: true
      });

      fetchDataFromAPI(url, "POST", data, null).then(response => {
        this.setState({
          isProgress: false
        });
        if (response.success) {
          showSuccessToast(response.message);
          this.props.navigation.navigate("AskQueryToAdminList", {
            isUpdate: true
          });
        } else {
          showErrorToast(response.message);
        }
      });
    }
  };
  _onBackPress = () => {
    this.props.navigation.navigate("AskQueryToAdminList", { isUpdate: false });
  };
  render() {
    return (
      <View style = {{flex: 1,backgroundColor:ThemeConstant.BACKGROUND_COLOR}} >
        <CustomActionbar
          backwordTitle={strings("SELLER_QUERY_LIST_TITLE")}
          title={strings("ASK_QUERY")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        <ScrollView>
          <KeyboardAvoidingView
            behavior="padding"
            enable={true}
            keyboardVerticalOffset={1}
            style={{ padding: ThemeConstant.MARGIN_GENERIC }}
          >
          <Text style={styles.headingTextColor} >{strings("SUBJECT")}</Text>
           
            <TextInput
              style={ViewStyle.inputTextStyle}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.subject}
              onChangeText={this._handleSubject.bind(this)}
              keyboardType="default"
              returnKeyType="next"
              placeholder={strings("SUBJECT")}
            />
            <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL?"left":"right"}]}>{this.state.subjectError}</Text>
            
            <Text style={styles.headingTextColor}>{strings("MESSAGE")}</Text>
            <Form>
              <Textarea
                value={this.state.message}
                rowSpan={6}
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                keyboardType="default"
                placeholder={strings("ENTER_YOUR_QUERY")}
                onChangeText={this._handleMSG.bind(this)}
                multiline={true}
              />
            </Form>
            <Text style={[ViewStyle.textError, {textAlign:localeObject.isRTL?"left":"right"}]}>{this.state.msgError}</Text>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() =>
                this._onButtonPress(this.state.subject, this.state.message)
              }
              activeOpacity={1}
            >
              <Text style={styles.buttonText}>{strings("SEND_MESSAGE")}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
        <ProgressDialog visible={this.state.isProgress} />
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
  headingTextColor:{
    color:ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
 },
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold"
  },
  signUpButtonStyle: {
    alignSelf: "center",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    color: ThemeConstant.ACCENT_COLOR,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  }
});

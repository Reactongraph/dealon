import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import CustomActionbar from "../container/CustomActionbar";
import { strings } from "../localize_constant/I18";
import ThemeConstant from "../app_constant/ThemeConstant";
import AnalylticsConstant from "../app_constant/AnalylticsConstant";
import firebase from "react-native-firebase";

export default class AskCartLogin extends React.Component {
    state={
        visible : false,
    }
//   componentWillUpdate(nextProps){
//       if(this.props.visible !== nextProps.visible ){
//       this.setState({
//           visible:nextProps.visible
//       })
//     }
//   }
  _onPressCheckoutasGuest = () => {
    this.props.onBack();
    let analyticsObject = {};
    firebase.analytics().logEvent(AnalylticsConstant.GO_FOR_GUEST_CHECKOUT, analyticsObject);
    this.props.navigation.navigate("Checkout");
  };
  _onPressCheckoutasLogin = () => {
    this.props.onBack();
    let analyticsObject = {};
    firebase.analytics().logEvent(AnalylticsConstant.LOGIN, analyticsObject);
    this.props.navigation.navigate("Login", {isFromCart : true});
   
  };
  _onPressCheckoutasRegister = () => {
    this.props.onBack();
    let analyticsObject = {};
    firebase.analytics().logEvent(AnalylticsConstant.SIGN_UP, analyticsObject);
    this.props.navigation.navigate("SignUp", {isFromCart:true}); 
  };

  handleBackPress = () => {
    this.props.onBack();
  };
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
            <View style={styles.content} >
              <CustomActionbar
                _onBackPress={this.handleBackPress}
                backwordTitle={strings("BACK")}
                title={strings("CHECKOUT_OPTIONS")}
              />
              <Text style={styles.buttonRect}  onPress= {this._onPressCheckoutasLogin.bind(this)}>
                {strings("LOGIN_TITLE")}
              </Text>
              <Text style={styles.buttonRectAccent}  onPress= {this._onPressCheckoutasRegister.bind(this)}>
                {strings("REGISTER_TITLE")}
              </Text>
              <Text style={styles.buttonRectAccentRadious} onPress= {this._onPressCheckoutasGuest.bind(this)}>
                {strings("CHECKOUT_AS_GUEST")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  buttonRect: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    alignSelf: "stretch",
    textAlign: "center",
    color: ThemeConstant.ACCENT_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 12,
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  },
  buttonRectAccent: {
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    alignSelf: "stretch",
    textAlign: "center",
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 12,
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  },
  buttonRectAccentRadious: {
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    alignSelf: "stretch",
    textAlign: "center",
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  },
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
    width: "100%",
    padding: ThemeConstant.MARGIN_TINNY,
    paddingBottom:28
  }
});

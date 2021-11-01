import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Form, Textarea } from "native-base";
import { ScrollView } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
import ProgressDialog from "../container/ProgressDialog";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { showSuccessToast, showErrorToast } from "../utility/Helper";
import CustomActionbar from "./CustomActionbar";
import StarRating from 'react-native-star-rating';
import { SCREEN_WIDTH } from "../utility/UtilityConstant";
import ItemOrderProductReview from "./ItemOrderProductReview";
import ViewStyle from "../app_constant/ViewStyle";
import { strings, localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class WriteProductReview extends React.Component {
  userId = 2;
  state = {
    name: "",
    message: "",
    email: "",
    rating: 0,
    msgError: "",
    nameError: "",
    emailError: "",
    ratingError: "",
    isProgress: false
  };

  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_USER_EMAIL).then(email => {
      this.setState({
        email: email ? email : ""
      });
    });
    AsyncStorage.getItem(AppConstant.PREF_USER_NAME).then(name => {
      this.setState({
        name: name ? name : ""
      });
    });
  }

  _handlename = name => {
    this.setState({ name: name });
  };
  _handleReviewMSG = message => {
    this.setState({ message: message });
  };
  _handleEmail = email => {
    this.setState({ email: email });
  };
  _onButtonPress = (name, message) => {
    let isFormValid = true;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === false) {
      this.setState({ emailError: strings("EMAIL_EROR_MSG") });
      isFormValid = false;
    } else {
      this.setState({ emailError: "" });
    }
    if (this.state.rating == 0 && this.props.navigation.getParam("star_rating", true) && this.props.navigation.getParam("star_rating_required", true) ) {
      this.setState({ ratingError: strings("RATING_EMPTY_ERROR") });
      isFormValid = false;
    } else {
      this.setState({ ratingError: "" });
    }
    if (name == null || name.trim() == "") {
      this.setState({ nameError: strings("NAME_EMPTY_ERROR") });
      isFormValid = false;
    } else {
      this.setState({ nameError: "" });
    }
    if (message == null || message.trim() == "") {
      this.setState({ msgError: strings("MESSAGE_EMPTY_ERROR") });
      isFormValid = false;
    } else {
      this.setState({ msgError: "" });
    }
    if (isFormValid) {
      let url =
        AppConstant.BASE_URL +
        "products/" +
        this.props.navigation.getParam("productId", 0) +
        "/reviews";
      let data = JSON.stringify({
        review: this.state.message,
        name: this.state.name,
        email: this.state.email,
        rating: this.state.rating
      });
      this.setState({
        isProgress: true
      });

      fetchDataFromAPI(url, "POST", data, null).then(response => {
        setTimeout(() => {
          this.setState({
            isProgress: false
          });
        }, Platform.OS == 'android'? 1: 700);
        if (response.success) {
          showSuccessToast(response.message);
          if (this.props.navigation.getParam("isFromProductPage", false)) {
            this.props.navigation.navigate("ProductPage", {
              productId: this.props.navigation.getParam("productId"),
              productName: this.props.navigation.getParam("productName"),
              productImage: this.props.navigation.getParam("productImage", ""),
              dominantColor: this.props.navigation.getParam(
                "dominantColor",
                ""
              ),
              isUpdate: true
            });
          } else {
            this.props.navigation.pop();
          }
        } else {
          showErrorToast(response.message);
        }
      });
    }
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={ViewStyle.mainContainer}
      >
        <CustomActionbar
          backwordTitle={strings("BACK")}
          title={strings("WRITE_REVIEWS")}
          _onBackPress={this._onBackPress.bind(this)}
          backwordImage="close-cross"
        />
        <ItemOrderProductReview
          productData={{
            image: this.props.navigation.getParam("productImage", ""),
            dominantColor: this.props.navigation.getParam("dominantColor", ""),
            productId: this.props.navigation.getParam("productId"),
            name: this.props.navigation.getParam("productName")
          }}
        />
        <ScrollView keyboardShouldPersistTaps={"always"}>
          <KeyboardAvoidingView
            behavior="padding"
            enable={true}
            keyboardVerticalOffset={1}
            style={{ padding: ThemeConstant.MARGIN_GENERIC }}
          >
          {this.props.navigation.getParam("star_rating", true) ?
          <View>
          <Text style={[styles.headingTextColor, globalTextStyle]}>
              {strings("YOUR_REVIEW")}
            </Text>
            <StarRating
              disabled={false}
              maxStars={5}
              starSize ={32}
              rating={this.state.rating}
              selectedStar={rating => {
                this.setState({ rating: rating });
              }}
              reversed = {localeObject.isRTL}
              fullStarColor = {ThemeConstant.RATING_COLOR}
              emptyStarColor = 'gray'
              containerStyle={[styles.ratingStyle, {alignSelf:localeObject.isRTL ? "flex-end" : "flex-start" ,}]}
            />
          </View>
          : null}
           
            <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>{this.state.ratingError}</Text>
            <Form>
              <Textarea
                value={this.state.message}
                rowSpan={3}
                style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right" : "left"}]}
                keyboardType="default"
                placeholder={strings("ENTER_YOUR_MESSAGE")}
                onChangeText={this._handleReviewMSG}
                multiline={true}
                returnKeyType="next"
              />
            </Form>
            <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>{this.state.msgError}</Text>

            <Text style={[styles.headingTextColor, globalTextStyle]}>{strings("NAME_")}</Text>
            <TextInput
              style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right" : "left"}]}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.name}
              // onSubmitEditing={() => this.emailInput.focus()}
              ref={input => (this.nameInput = input)}
              onChangeText={this._handlename}
              keyboardType="default"
              placeholder={strings("NAME_")}
              returnKeyType="next"
            />
            <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>{this.state.nameError}</Text>

            <Text style={[styles.headingTextColor, globalTextStyle]}>{strings("EMAIL")}</Text>
            <TextInput
              style={[ViewStyle.inputTextStyle, {textAlign:localeObject.isRTL ? "right" : "left"}]}
              ref={input => (this.emailInput = input)}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.email}
              onChangeText={this._handleEmail}
              keyboardType="email-address"
              placeholder={strings("EMAIL")}
              returnKeyType="next"
            />
            <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>{this.state.emailError}</Text>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() =>
                this._onButtonPress(this.state.name, this.state.message)
              }
              activeOpacity={1}
            >
              <Text style={styles.buttonText}>
                {strings("SUBMIT_REVIEW")}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
        <ProgressDialog visible={this.state.isProgress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bannerStyle: {
    height: SCREEN_WIDTH / 1.5 - ThemeConstant.MARGIN_GENERIC,
    width: SCREEN_WIDTH - ThemeConstant.MARGIN_GENERIC,
    marginBottom: ThemeConstant.MARGIN_LARGE
  },
  buttonContainer: {
    alignSelf: "stretch",
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_EXTRA_LARGE,
    marginTop: ThemeConstant.MARGIN_NORMAL
  },
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold"
  },
  ratingStyle: {
    alignSelf: "flex-start",
    marginHorizontal: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ThemeConstant.MARGIN_GENERIC
  },
  headingTextColor: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  }
});

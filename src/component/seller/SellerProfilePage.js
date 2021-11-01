import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Icon, Picker, Form, Textarea } from "native-base";
import ThemeConstant from "../../app_constant/ThemeConstant";
import {
  fetchDataFromAPI,
  fetchDataFromAPIMultipart
} from "../../utility/APIConnection";
import {
  isStringEmpty,
  SCREEN_WIDTH,
  isValidEmail
} from "../../utility/UtilityConstant";
import AppConstant from "../../app_constant/AppConstant";
import ProgressDialog from "../../container/ProgressDialog";
import { showErrorToast, showSuccessToast } from "../../utility/Helper";
import Loading from "../../container/LoadingComponent";
import StringConstant from "../../app_constant/StringConstant";
import CustomActionbar from "../../container/CustomActionbar";
import { CustomImage } from "../../container/CustomImage";
import AskCameraGalleryDialog from "../../container/AskCameraGalleryDialog";
import _ from "lodash";
import { strings, localeObject } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";

export default class SellerProfilePage extends React.Component {
  scrollView = null;
  SIZE_OF_EACH_ITEM = 85;
  state = {
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    shopName: "",
    shopURL: "",
    phoneNumber: "",

    address1: "",
    address2: "",
    city: "",
    postCode: "",
    sState: "",
    country: "",
    aboutShop: "",
    facebookId: "",
    twitterId: "",
    youtubeId: "",
    linkedinId: "",
    googleId: "",
    paymentInfo: "",

    userNameError: "",
    emailError: "",
    firstNameError: "",
    lastNameError: "",
    shopNameError: "",
    shopURLError: "",
    phoneNumberError: "",

    address1Error: "",
    address2Error: "",
    cityError: "",
    postCodeError: "",
    stateError: "",
    countryError: "",
    aboutShopError: "",
    facebookIdError: "",
    twitterIdError: "",
    youtubeIdError: "",
    linkedinIdError: "",
    googleIdError: "",
    paymentInfoError: "",

    selectedCountry: {},
    selectedState: {},
    stateList: [],
    countryList: [],

    isProgress: false,
    availableURLMSG: "",
    isLoading: true,
    isURLAvailable: false,
    isButtonClicked: false,
    isSubmitPress: false,

    profileImage: "",
    bannerImage: "",
    logoImage: "",
    uploadProfileImage: null,
    uploadBannerImage: null,
    uploadLogoImage: null,
    updateImageType: 0,
    openImageGallery: false,
    profileImageId: "",
    logoImageId: "",
    bannerImageId: "",
    imagewidth: 0,
    imageHeight: 0,
    isCropping: false
  };

  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      if (userID) {
        this.userID = userID;
        let url =
          AppConstant.BASE_URL +
          "seller/edit-profile/get?seller_id=" +
          userID +
          "&width=" +
          SCREEN_WIDTH;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          let countryURL = AppConstant.BASE_URL + "countries/";
          fetchDataFromAPI(countryURL, "GET", "", null).then(result => {
            if (result.success) {
              this.setState(
                {
                  countryList: result.countries,
                  isLoading: false
                },
                () => {
                  this._setupInitialCountry(result.countries, response);
                }
              );
            }
          });

          if (response) {
            let socialIds = response.social;

            this.setState({
              userName: response.username,
              email: response.email,
              firstName: response.first_name,
              lastName: response.last_name,
              shopName: response.shop_name,
              shopURL: response.shop_url,
              address1: response.address_line1,
              address2: response.address_line2,
              city: response.city,
              postCode: response.postcode,
              country: response.country,
              sState: response.state,
              phoneNumber: response.phone,
              aboutShop: response.about_shop,
              paymentInfo: response.payment_method,
              shopLogo: response.shop_logo,
              bannerImage: response.banner_image,
              bannerDisplay: response.banner_display,
              facebookId: socialIds.facebook,
              twitterId: socialIds.twitter,
              googleId: socialIds.google_plus,
              linkedinId: socialIds.linkedin,
              youtubeId: socialIds.youtube,
              profileImage: response.user_image,
              bannerImage: response.banner_image,
              logoImage: response.shop_logo
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

  _setupInitialCountry = (countries, address) => {
    countries.forEach(country => {
      if (country["code"] === address.country) {
        let states = country.states;
        this._selectCountry(country);
        states.forEach(state => {
          if (state["key"] === address.state) {
            this._selectState(state);
          }
        });
      }
    });
  };

  _selectState = state => {
    this.setState({
      selectedState: state,
      sState: state["key"]
    });
  };
  _selectCountry = country => {
    this.setState({
      selectedCountry: country,
      stateList: country.states,
      country: country["code"]
    });
  };

  _handleUserName = userName => {
    this.setState({ userName: userName });
  };
  _handleEmail = email => {
    this.setState({ email: email });
  };
  _handleAddress1 = address1 => {
    this.setState({ address1: address1 });
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
    this.setState({ shopURL: shopURL });
  };
  _handlePhoneNumber = phoneNumber => {
    this.setState({ phoneNumber: phoneNumber });
  };

  _handleAddress1 = address1 => {
    this.setState({ address1: address1 });
  };

  _handleAddress2 = address2 => {
    this.setState({ address2: address2 });
  };

  _handleCity = city => {
    this.setState({ city: city });
  };
  _handlePostCode = postCode => {
    this.setState({ postCode: postCode });
  };
  _handleFacebookId = facebookId => {
    this.setState({ facebookId: facebookId });
  };
  _handleAboutShop = aboutShop => {
    this.setState({ aboutShop: aboutShop });
  };
  _handleTwitterId = twitterId => {
    this.setState({ twitterId: twitterId });
  };
  _handleYoutubeId = youtubeId => {
    this.setState({ youtubeId: youtubeId });
  };
  _handleGoogleId = googleId => {
    this.setState({ googleId: googleId });
  };
  _handlepaymentInfo = paymentInfo => {
    this.setState({ paymentInfo: paymentInfo });
  };
  _handleLinkedinId = linkedinId => {
    this.setState({ linkedinId: linkedinId });
  };
  _handleState = state => {
    this.setState({ sState: state });
  };
  _onButtonPress = () => {
    this.setState({ isProgress: true, isSubmitPress: true });
    let isFieldComplete = true;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    console.log(this.state);
    if (isStringEmpty(this.state.userName)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 4 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.firstName)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 5 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.lastName)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 6 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (reg.test(this.state.email) === false) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 7 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.shopName)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 8 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.shopURL)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 9 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.phoneNumber)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 10 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.address1)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 11 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.city)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 13 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.postCode)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 14 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    if (isStringEmpty(this.state.sState)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 16 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
    }

    console.log("test", isFieldComplete);
    if (isFieldComplete) {
      this.setState({
        isProgress: true
      });

      let url =
        AppConstant.BASE_URL + "seller/edit-profile?seller_id=" + this.userID;
      let data = JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        shop_name: this.state.shopName,
        phone: this.state.phoneNumber,
        address_line1: this.state.address1,
        address_line2: this.state.address2,
        city: this.state.city,
        postcode: this.state.postCode,
        country: this.state.country,
        state: this.state.sState,
        shop_logo: this.state.logoImageId,
        banner_image: this.state.bannerImageId,
        user_image: this.state.profileImageId,
        about_shop: this.state.aboutShop,
        banner_display: this.state.bannerDisplay,
        social: {
          facebook: this.state.facebookId,
          twitter: this.state.twitterId,
          google_plus: this.state.googleId,
          linkedin: this.state.linkedinId,
          youtube: this.state.youtubeId
        },
        payment_method: this.state.paymentInfo
      });

      fetchDataFromAPI(url, "POST", data, null).then(response => {
        this.setState({
          isProgress: false,
          isButtonClicked: false
        });
        if (response.success) {
          showSuccessToast(response.message);
        } else {
          showErrorToast(response.message);
        }
      });
    } else {
      this.setState({
        isProgress: false
      });
    }
  };

  callMultiPartAPI = (uploadImageData, updateImageType) => {
    if (uploadImageData) {
      let formData = new FormData();
      formData.append("profile_Image", {
        uri: uploadImageData.path,
        type: uploadImageData.mime,
        name: this.getFileName(uploadImageData.path)
      });
      let url = AppConstant.BASE_URL + "media/upload";
      fetchDataFromAPIMultipart(url, "POST", formData, null).then(response => {
        this.setState({
          isProgress: false,
          isButtonClicked: false
        });
        if (response && response.success) {
          switch (updateImageType) {
            case AppConstant.SAVE_PROFILE_IMAGE:
              this.setState({
                profileImageId: response.image_id
              });
              break;
            case AppConstant.SAVE_LOGO_IMAGE:
              this.setState({
                logoImageId: response.image_id
              });
              break;
            case AppConstant.SAVE_BANNER_IMAGE:
              this.setState({
                bannerImageId: response.image_id
              });
              break;
            default:
              break;
          }
        } else {
          showErrorToast(response.message);
        }
      });
    }
  };

  _handelViewProfile = () => {
    this.props.navigation.navigate("SellerProfileView", {
      sellerId: this.userID
    });
  };
  _handleGalleryDialog = (image, updateImageType) => {
    switch (updateImageType) {
      case AppConstant.SAVE_PROFILE_IMAGE:
        this.setState({
          uploadProfileImage: image,
          openImageGallery: false
        });
        this.callMultiPartAPI(image, AppConstant.SAVE_PROFILE_IMAGE);
        break;
      case AppConstant.SAVE_LOGO_IMAGE:
        this.setState({
          uploadLogoImage: image,
          openImageGallery: false
        });
        this.callMultiPartAPI(image, AppConstant.SAVE_LOGO_IMAGE);
        break;
      case AppConstant.SAVE_BANNER_IMAGE:
        this.setState({
          uploadBannerImage: image,
          openImageGallery: false
        });
        this.callMultiPartAPI(image, AppConstant.SAVE_BANNER_IMAGE);
        break;
      default:
        break;
    }
  };

  _onBackGalleryDialog = () => {
    this.setState({
      openImageGallery: false
    });
  };

  _openGalleryDialog = updateImageType => {
    let width = 0;
    let height = 0;
    let isCropping = false;
    switch (updateImageType) {
      case AppConstant.SAVE_PROFILE_IMAGE:
      case AppConstant.SAVE_LOGO_IMAGE:
        width = ThemeConstant.UPLOAD_IMAGE_SIZE;
        height = ThemeConstant.UPLOAD_IMAGE_SIZE;
        isCropping = true;
        break;
      case AppConstant.SAVE_BANNER_IMAGE:
        width = ThemeConstant.UPLOAD_IMAGE_SIZE;
        height = ThemeConstant.UPLOAD_IMAGE_SIZE/2;
        break;
      default:
        width = ThemeConstant.UPLOAD_IMAGE_SIZE;
        height = ThemeConstant.UPLOAD_IMAGE_SIZE;
        isCropping = true;
        break;
    }
    this.setState({
      updateImageType: updateImageType,
      openImageGallery: true,
      imagewidth: width,
      imageHeight: height,
      isCropping: isCropping
    });
  };
  getFileName = uri => {
    return uri.substring(uri.lastIndexOf("/") + 1, uri.length);
    // return uri.substring(uri.lastIndexOf("/") + 1, uri.lastIndexOf("."));
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
          _onBackPress={this._onBackPress}
          _onForwordPress={this._handelViewProfile.bind(this)}
          backwordTitle={strings("BACK")}
          iconName={"baseline-streetview"}
          title={strings("SELLER_PROFILE")}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView
            ref={view => (this.scrollView = view)}
            keyboardShouldPersistTaps={"always"}
          >
            <KeyboardAvoidingView
              style={{ padding: ThemeConstant.MARGIN_NORMAL }}
            >
              <View style={[styles.uploadImageContainer, globleViewStyle]}>
                <CustomImage
                  image={
                    !this.state.uploadProfileImage
                      ? this.state.profileImage
                      : this.state.uploadProfileImage.path
                  }
                  imagestyle={styles.imagestyle}
                />
                <View style={styles.imageDescriptionstyle}>
                  <Text style={styles.headingTitleStyle}>
                    {strings("PROFILE_IMAGE")}
                  </Text>
                  <Text style={styles.headingTitleStyle2}>
                    {this.state.uploadProfileImage
                      ? this.getFileName(this.state.uploadProfileImage.path)
                      : strings("NO_FILE_SELECTED")}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.uploadButtonContainer,
                      {
                        alignSelf: localeObject.isRTL
                          ? "flex-end"
                          : "flex-start"
                      }
                    ]}
                    onPress={this._openGalleryDialog.bind(
                      this,
                      AppConstant.SAVE_PROFILE_IMAGE
                    )}
                  >
                    <Text style={styles.buttonText}>
                      {strings("UPLOAD_IMAGE")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.uploadImageContainer, globleViewStyle]}>
                <CustomImage
                  image={
                    !this.state.uploadLogoImage
                      ? this.state.logoImage
                      : this.state.uploadLogoImage.path
                  }
                  imagestyle={styles.imagestyle}
                />
                <View style={styles.imageDescriptionstyle}>
                  <Text style={styles.headingTitleStyle}>
                    {strings("SELLER_LOGO")}
                  </Text>

                  <Text style={styles.headingTitleStyle2}>
                    {this.state.uploadLogoImage
                      ? this.getFileName(this.state.uploadLogoImage.path)
                      : strings("NO_FILE_SELECTED")}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.uploadButtonContainer,
                      {
                        alignSelf: localeObject.isRTL
                          ? "flex-end"
                          : "flex-start"
                      }
                    ]}
                    onPress={this._openGalleryDialog.bind(
                      this,
                      AppConstant.SAVE_LOGO_IMAGE
                    )}
                  >
                    <Text style={styles.buttonText}>
                      {strings("UPLOAD_IMAGE")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.headingTitleStyle}>
                {strings("PROFILE_BANNER")}
              </Text>
              <View style={styles.uploadBannerImageContainer}>
                <CustomImage
                  image={
                    !this.state.uploadBannerImage
                      ? this.state.bannerImage
                      : this.state.uploadBannerImage.path
                  }
                  imagestyle={styles.bannerImageStyle}
                />
                <View style={styles.bannerImageDescriptionstyle}>
                  <Text style={styles.headingTitleStyle2}>
                    {this.state.uploadBannerImage
                      ? this.getFileName(this.state.uploadBannerImage.path)
                      : strings("NO_FILE_SELECTED")}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.uploadButtonContainer,
                      {
                        alignSelf: localeObject.isRTL
                          ? "flex-end"
                          : "flex-start"
                      }
                    ]}
                    onPress={this._openGalleryDialog.bind(
                      this,
                      AppConstant.SAVE_BANNER_IMAGE
                    )}
                  >
                    <Text style={styles.buttonText}>
                      {strings("UPLOAD_IMAGE")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.headingTitleStyle}>
                {strings("USER_NAME")}{" "}
              </Text>

              <TextInput
                style={ViewStyle.inputTextStyle}
                autoCapitalize="none"
                onSubmitEditing={() => this.firstName.focus()}
                ref={input => (this.userName = input)}
                autoCorrect={false}
                value={this.state.userName}
                onChangeText={this._handleUserName.bind(this)}
                keyboardType="default"
                returnKeyType="next"
                placeholder={strings("USER_NAME")}
                editable={false}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress && isStringEmpty(this.state.userName)
                  ? strings("REQUIRED_FIELD")
                  : ""}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("FIRST_NAME")}
              </Text>

              <TextInput
                style={ViewStyle.inputTextStyle}
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
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress && isStringEmpty(this.state.firstName)
                  ? strings("REQUIRED_FIELD")
                  : ""}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("LAST_NAME")}
              </Text>

              <TextInput
                style={ViewStyle.inputTextStyle}
                autoCapitalize="none"
                onSubmitEditing={() => this.email.focus()}
                ref={input => (this.lastName = input)}
                autoCorrect={false}
                value={this.state.lastName}
                onChangeText={this._handleLastName.bind(this)}
                keyboardType="default"
                returnKeyType="next"
                placeholder={strings("LAST_NAME")}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress && isStringEmpty(this.state.lastName)
                  ? strings("REQUIRED_FIELD")
                  : ""}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("EMAIL_ADDRESS")}
              </Text>

              <TextInput
                style={ViewStyle.inputTextStyle}
                autoCapitalize="none"
                onSubmitEditing={() => this.shopName.focus()}
                ref={input => (this.email = input)}
                autoCorrect={false}
                value={this.state.email}
                onChangeText={this._handleEmail.bind(this)}
                keyboardType="email-address"
                returnKeyType="next"
                placeholder={strings("EMAIL_ADDRESS")}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress && !isValidEmail(this.state.email)
                  ? strings("EMAIL_REQUIRED_FIELD")
                  : ""}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("SHOP_NAME")}
              </Text>

              <TextInput
                style={ViewStyle.inputTextStyle}
                autoCapitalize="none"
                onSubmitEditing={() => {
                  this.phoneNumber.focus();
                }}
                ref={input => (this.shopName = input)}
                autoCorrect={false}
                value={this.state.shopName}
                onChangeText={this._handleShopName.bind(this)}
                keyboardType="default"
                returnKeyType="next"
                placeholder={strings("SHOP_NAME")}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress && isStringEmpty(this.state.shopName)
                  ? strings("REQUIRED_FIELD")
                  : ""}
              </Text>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.headingTitleStyle}>
                  {strings("SHOP_URL")}
                </Text>
              </View>

              <TextInput
                style={ViewStyle.inputTextStyle}
                autoCapitalize="none"
                onSubmitEditing={() => {}}
                ref={input => (this.shopURL = input)}
                autoCorrect={false}
                value={this.state.shopURL}
                onChangeText={this._handleShopURL.bind(this)}
                keyboardType="default"
                returnKeyType="next"
                placeholder={strings("SHOP_URL")}
                editable={false}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.shopURLError}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("TELEPHONE")}
              </Text>

              <TextInput
                style={ViewStyle.inputTextStyle}
                autoCapitalize="none"
                onSubmitEditing={() => this.address1.focus()}
                autoCorrect={false}
                value={this.state.phoneNumber}
                ref={input => (this.phoneNumber = input)}
                onChangeText={this._handlePhoneNumber.bind(this)}
                keyboardType="default"
                returnKeyType="next"
                placeholder={strings("TELEPHONE")}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress &&
                isStringEmpty(this.state.phoneNumber)
                  ? strings("REQUIRED_FIELD")
                  : ""}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("ADDRESS_LINE_1")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                onSubmitEditing={() => this.address2.focus()}
                ref={input => (this.address1 = input)}
                placeholder={strings("ADDRESS_LINE_1")}
                value={this.state.address1}
                onChangeText={this._handleAddress1.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress && isStringEmpty(this.state.address1)
                  ? strings("REQUIRED_FIELD")
                  : ""}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("ADDRESS_LINE_2")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                onSubmitEditing={() => this.city.focus()}
                ref={input => (this.address2 = input)}
                placeholder={strings("ADDRESS_LINE_2")}
                value={this.state.address2}
                onChangeText={this._handleAddress2.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.address2Error}
              </Text>

              <Text style={styles.headingTitleStyle}>{strings("CITY")}</Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                onSubmitEditing={() => this.postCode.focus()}
                ref={input => (this.city = input)}
                placeholder={strings("CITY")}
                value={this.state.city}
                onChangeText={this._handleCity.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress && isStringEmpty(this.state.city)
                  ? strings("REQUIRED_FIELD")
                  : ""}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("ZIP_CODE")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                ref={input => (this.postCode = input)}
                //   onSubmitEditing={() => this.sState.focus()}
                placeholder={strings("ZIP_CODE")}
                value={this.state.postCode}
                onChangeText={this._handlePostCode.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.isSubmitPress && isStringEmpty(this.state.postCode)
                  ? strings("REQUIRED_FIELD")
                  : ""}
              </Text>

              <View style={{ flexDirection: "row" }}>
                <Text style={styles.headingTitleStyle}>
                  {strings("COUNTRY")}
                </Text>
                <Text
                  style={[
                    ViewStyle.textError,
                    { textAlign: localeObject.isRTL ? "left" : "right" }
                  ]}
                >
                  {this.state.showError &&
                  (!this.state.country || this.state.country == "")
                    ? "isRequired"
                    : null}
                </Text>
              </View>
              <Picker
                mode="dropdown"
                placeholder={strings("COUNTRY")}
                iosIcon={<Icon name="arrow-down" />}
                // renderHeader={backAction => (
                //   <Header
                //     style={{ backgroundColor: ThemeConstant.PRIMARY_COLOR }}
                //   >
                //     <Left>
                //       <Button transparent onPress={backAction}>
                //         <Icon name="arrow-back" />
                //       </Button>
                //     </Left>
                //     <Body style={{ flex: 3 }}>
                //       <Title> Select Country</Title>
                //     </Body>
                //     <Right />
                //   </Header>
                // )}
                selectedValue={this.state.selectedCountry}
                onValueChange={this._selectCountry.bind(this)}
                style={styles.pickerStyle}
              >
                {this.state.countryList.map((country, i) => {
                  return (
                    <Picker.Item key={i} value={country} label={country.name} />
                  );
                })}
              </Picker>

              {this.state.stateList && this.state.stateList.length > 0 ? (
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.normalTextstyle}>
                      {strings("STATE")}
                    </Text>
                    <Text
                      style={[
                        ViewStyle.textError,
                        { textAlign: localeObject.isRTL ? "left" : "right" }
                      ]}
                    >
                      {this.state.showError &&
                      (!this.state.sState || this.state.sState == "")
                        ? "isRequired"
                        : null}
                    </Text>
                  </View>
                  <Picker
                    mode="dropdown"
                    placeholder={strings("STATE")}
                    iosIcon={<Icon name="arrow-down" />}
                    // renderHeader={backAction => (
                    //   <Header
                    //     style={{ backgroundColor: ThemeConstant.PRIMARY_COLOR }}
                    //   >
                    //     <Left>
                    //       <Button transparent onPress={backAction}>
                    //         <Icon name="arrow-back" />
                    //       </Button>
                    //     </Left>
                    //     <Body style={{ flex: 3 }}>
                    //       <Title>Select State</Title>
                    //     </Body>
                    //     <Right />
                    //   </Header>
                    // )}
                    selectedValue={this.state.selectedState}
                    onValueChange={this._selectState.bind(this)}
                    style={styles.pickerStyle}
                  >
                    {this.state.stateList.map((states, i) => {
                      return (
                        <Picker.Item
                          key={i}
                          value={states}
                          label={states.name}
                        />
                      );
                    })}
                  </Picker>
                </View>
              ) : (
                <View>
                  <Text style={styles.headingTitleStyle}>
                    {strings("STATE")}
                  </Text>
                  <TextInput
                    style={ViewStyle.inputTextStyle}
                    returnKeyType="next"
                    //   onSubmitEditing={() => this.aboutShop.focus()}
                    ref={input => (this.sState = input)}
                    placeholder={strings("STATE")}
                    value={this.state.sState}
                    onChangeText={this._handleState.bind(this)}
                  />
                  <Text
                    style={[
                      ViewStyle.textError,
                      { textAlign: localeObject.isRTL ? "left" : "right" }
                    ]}
                  >
                    {this.state.isSubmitPress &&
                    isStringEmpty(this.state.sState)
                      ? strings("REQUIRED_FIELD")
                      : ""}
                  </Text>
                </View>
              )}

              <Text style={styles.headingTitleStyle}>
                {strings("ABOUT_SHOP")}
              </Text>
              <Form>
                <Textarea
                  value={this.state.aboutShop}
                  rowSpan={6}
                  style={ViewStyle.inputTextStyle}
                  returnKeyType="next"
                  keyboardType="default"
                  onSubmitEditing={() => this.facebookId.focus()}
                  ref={input => (this.aboutShop = input)}
                  placeholder={strings("ABOUT_SHOP")}
                  onChangeText={this._handleAboutShop.bind(this)}
                  multiline={true}
                />
              </Form>
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.aboutShopError}
              </Text>

              <Text style={[styles.mainHeading]}>
                {strings("SOCIAL_PROFILE")}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("FACEBOOK_PROFILE")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                onSubmitEditing={() => this.twitterId.focus()}
                ref={input => (this.facebookId = input)}
                placeholder={strings("FACEBOOK")}
                value={this.state.facebookId}
                onChangeText={this._handleFacebookId.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.facebookIdError}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("TWITTER_PROFILE")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                onSubmitEditing={() => this.googleId.focus()}
                ref={input => (this.twitterId = input)}
                placeholder={strings("TWITTER")}
                value={this.state.twitterId}
                onChangeText={this._handleTwitterId.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.twitterIdError}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("GOOGLE_PROFILE")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                onSubmitEditing={() => this.linkedinId.focus()}
                ref={input => (this.googleId = input)}
                placeholder={strings("GOOGLE")}
                value={this.state.googleId}
                onChangeText={this._handleGoogleId.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.googleIdError}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("LINKED_IN_PROFILE")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                onSubmitEditing={() => this.youtubeId.focus()}
                ref={input => (this.linkedinId = input)}
                placeholder={strings("LINKED_IN")}
                value={this.state.linkedinId}
                onChangeText={this._handleLinkedinId.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.linkedinIdError}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("YOUTUBE_PROFILE")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                onSubmitEditing={() => this.paymentInfo.focus()}
                ref={input => (this.youtubeId = input)}
                placeholder={strings("YOUTUBE")}
                value={this.state.youtubeId}
                onChangeText={this._handleYoutubeId.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.youtubeIdError}
              </Text>

              <Text style={styles.headingTitleStyle}>
                {strings("PAYMENT_INFO")}
              </Text>
              <TextInput
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                //   onSubmitEditing={() => this.button.focus()}
                ref={input => (this.paymentInfo = input)}
                placeholder={strings("PAYMENT_INFO")}
                value={this.state.paymentInfo}
                onChangeText={this._handlepaymentInfo.bind(this)}
              />
              <Text
                style={[
                  ViewStyle.textError,
                  { textAlign: localeObject.isRTL ? "left" : "right" }
                ]}
              >
                {this.state.paymentInfoError}
              </Text>

              <TouchableOpacity
                activeOpacity={1}
                style={styles.buttonContainer}
                onPress={_.debounce(this._onButtonPress, 300)}
              >
                <Text style={styles.buttonText}>{strings("UPDATE")}</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </ScrollView>
        )}

        <ProgressDialog visible={this.state.isProgress} />
        <AskCameraGalleryDialog
          visible={this.state.openImageGallery}
          _handleUploadImage={this._handleGalleryDialog.bind(this)}
          updateType={this.state.updateImageType}
          width={this.state.imagewidth}
          height={this.state.imageHeight}
          isCropping={this.state.isCropping}
          onBack={this._onBackGalleryDialog.bind(this)}
        />
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
  mainHeading: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    marginBottom: ThemeConstant.MARGIN_GENERIC
  },
  headingTitleStyle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  headingTitleStyle2: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  signUpButtonStyle: {
    alignSelf: "center",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    paddingHorizontal: ThemeConstant.MARGIN_NORMAL,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    marginRight: ThemeConstant.MARGIN_TINNY,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.ACCENT_COLOR,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  uploadImageContainer: {
    flexDirection: "row",
    padding: ThemeConstant.MARGIN_TINNY,
    borderWidth: 1,
    borderColor: ThemeConstant.LINE_COLOR,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    marginBottom: ThemeConstant.MARGIN_GENERIC
  },
  uploadBannerImageContainer: {
    padding: ThemeConstant.MARGIN_TINNY,
    borderWidth: 1,
    borderColor: ThemeConstant.LINE_COLOR,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_TINNY
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3
  },
  bannerImageStyle: {
    height: ThemeConstant.SELLER_BANNER_HEIGHT
  },
  imageDescriptionstyle: {
    flex: 1,
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
    justifyContent: "space-between"
  },
  bannerImageDescriptionstyle: {
    flex: 1,
    flexDirection: "row",
    marginTop: ThemeConstant.MARGIN_GENERIC,
    justifyContent: "space-between"
  },
  uploadButtonContainer: {
    width: 100,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_LARGE,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    marginRight: ThemeConstant.MARGIN_TINNY,
    borderRadius: ThemeConstant.MARGIN_TINNY
  }
});

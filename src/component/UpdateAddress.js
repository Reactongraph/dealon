/**
 * Webkul Software.
 *
 * @category Webkul
 * @package Webkul_Mobikul_React_WooCommerce
 * @author Webkul
 * @copyright Copyright (c) 2010-2018 WebkulSoftware Private Limited (https://webkul.com)
 * @license https://store.webkul.com/license.html
 *
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  PermissionsAndroid,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {
  Form,
  Icon,
  Picker,
  CheckBox,
  Container
} from "native-base";
import ThemeConstant from "../app_constant/ThemeConstant";
import Loading from "../container/LoadingComponent";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import ProgressDialog from "../container/ProgressDialog";
import {
  isStringEmpty,
  isPhoneNumber,
  isValidEmail
} from "../utility/UtilityConstant";
import CustomActionbar from "../container/CustomActionbar";
import { showErrorToast, showSuccessToast } from "../utility/Helper";
import ViewStyle from "../app_constant/ViewStyle";
import Geolocation from "react-native-geolocation-service";
import { localeObject, strings, } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class UpdateAddress extends React.Component {
  isLogin = true;
  userId = 0;
  hasLocationPermission = false;
  scrollView = null;
  SIZE_OF_EACH_ITEM = 60;
  initial_B_Country = "";
  initial_B_State = "";
  initial_S_State = "";
  initial_S_Country = "";
  state = {
    isFromCart: false,
    isLoading: true,
    isProgress: false,
    showError: false,
    isShippingSameAsBilling: true,
    email: "", // Billing Address
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    postCode: "",
    phone: "",
    sfirstName: "", // Shipping Address
    slastName: "",
    scompany: "",
    saddress: "",
    saddress2: "",
    scity: "",
    sstate: "",
    scountry: "",
    spostCode: "",
    sphone: "",
    selectedCountry: {},
    selectedState: {},
    sSelectedCountry: {},
    sSelectedState: {},
    stateList: [],
    countryList: [],
    sStateList: [],
    sCountryList: [],
    isButtonClicked: false
  };
  componentDidMount() {
    this.setState({
      isFromCart: this.props.navigation.getParam("isFromCart", false)
    });
    // this.requestLocationPermission();

    if (this.props.navigation.getParam("isLogin", "true") === "true") {
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
        if (userId) {
          this.userId = userId;
          let url = AppConstant.BASE_URL + "user/" + userId;
          fetchDataFromAPI(url, "GET", "", null).then(response => {
            console.log("url-->", url);
            console.log("response-->", response);
            let countryURL = AppConstant.BASE_URL + "countries/";
            fetchDataFromAPI(countryURL, "GET", "", null).then(result => {
              console.log("countryURL -->", countryURL);
              console.log("result-->", result);
              if (result.success) {
                this.setState(
                  {
                    countryList: result.countries,
                    isLoading: false
                  },
                  () => {
                    this._setupInitialCountry(
                      result.countries,
                      response.billing_address,
                      response.shipping_address
                    );
                  }
                );
              }
            });
            if (response) {
              let billingAddress = response.billing_address;
              let shippingAddress = response.shipping_address;

              if (isStringEmpty(billingAddress.first_name)) {
                billingAddress.first_name = response.first_name;
                shippingAddress.first_name = response.first_name;
                billingAddress.last_name = response.last_name;
                shippingAddress.last_name = response.last_name;
                billingAddress.email = response.email;
                shippingAddress.email = response.email;
              }

              this.setupAddress(billingAddress, shippingAddress);
            } else {
              this.setState({
                isLoading: false
              });
              showErrorToast(response.message);
            }
          });
        }
      });
    } else {
      this.isLogin = false;
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
        if (userId) {
          this.userId = userId;
          let countryURL = AppConstant.BASE_URL + "countries/";
          fetchDataFromAPI(countryURL, "GET", "", null).then(result => {
            console.log("countryURL -->", countryURL);
            console.log("result-->", result);
            let guestAddress = this.props.navigation.getParam(
              "guest_address",
              null
            );
            let billingAddress = null;
            let shippingAddress = null;
            if (guestAddress) {
              billingAddress = guestAddress.billing_address;
              shippingAddress = guestAddress.shipping_address;
              this.setupAddress(billingAddress, shippingAddress);
            }

            if (result.success) {
              this.setState(
                {
                  countryList: result.countries,
                  isLoading: false
                },
                () => {
                  this._setupInitialCountry(
                    result.countries,
                    billingAddress,
                    shippingAddress
                  );
                }
              );
            }
          });
        }
      });
    }
  }
  setupAddress = (billingAddress, shippingAddress) => {
    this.initial_B_Country = billingAddress.country;
    this.initial_B_State = billingAddress.state;
    this.initial_S_Country = shippingAddress.country;
    this.initial_S_State = shippingAddress.sstate;

    this.setState({
      email: billingAddress.email,
      firstName: billingAddress.first_name,
      lastName: billingAddress.last_name,
      company: billingAddress.company,
      address: billingAddress.address_1,
      address2: billingAddress.address_2,
      city: billingAddress.city,
      postCode: billingAddress.postcode,
      country: billingAddress.country,
      phone: billingAddress.phone,
      state: billingAddress.state,
      sfirstName: shippingAddress.first_name, // Shipping Address
      slastName: shippingAddress.last_name,
      scompany: shippingAddress.company,
      saddress: shippingAddress.address_1,
      saddress2: shippingAddress.address_2,
      scity: shippingAddress.city,
      sstate: shippingAddress.sstate,
      scountry: shippingAddress.country,
      spostCode: shippingAddress.postcode
    });
  };

  _setupInitialCountry = (countries, billing_address, shipping_address) => {
    countries.forEach(country => {
      if (!billing_address || isStringEmpty(billing_address.country)) {
        this._selectCountry(countries[0]);
      } else if (country["code"] === billing_address.country) {
        let states = country.states;
        this._selectCountry(country);
        states.forEach(state => {
          if (state["key"] === billing_address.state) {
            this._selectState(state);
          }
        });
      }
      if (!shipping_address || isStringEmpty(shipping_address.country)) {
        this._sSelectCountry(countries[0]);
      } else if (country["code"] === shipping_address.country) {
        let states = country.states;
        this._sSelectCountry(country);
        states.forEach(state => {
          if (state["key"] === shipping_address.state) {
            this._sSelectState(state);
          }
        });
      }
    });
  };

  _onButtonPress = () => {
    this.setState({
      showError: true,
      isButtonClicked: true
    });

    if (!this.state.isShippingSameAsBilling) {
      isStringEmpty(this.state.sstate)
        ? this.scrollView.scrollTo({ y: 17 * this.SIZE_OF_EACH_ITEM })
        : null;
      isStringEmpty(this.state.spostCode)
        ? this.scrollView.scrollTo({ y: 16 * this.SIZE_OF_EACH_ITEM })
        : null;
      isStringEmpty(this.state.scity)
        ? this.scrollView.scrollTo({ y: 15 * this.SIZE_OF_EACH_ITEM })
        : null;
      isStringEmpty(this.state.saddress)
        ? this.scrollView.scrollTo({ y: 14 * this.SIZE_OF_EACH_ITEM })
        : null;
      isStringEmpty(this.state.slastName)
        ? this.scrollView.scrollTo({ y: 13 * this.SIZE_OF_EACH_ITEM })
        : null;
      isStringEmpty(this.state.sfirstName)
        ? this.scrollView.scrollTo({ y: 12 * this.SIZE_OF_EACH_ITEM })
        : null;
    }

    isStringEmpty(this.state.state)
      ? this.scrollView.scrollTo({ y: 9 * this.SIZE_OF_EACH_ITEM })
      : null;
    !isPhoneNumber(this.state.phone)
      ? this.scrollView.scrollTo({ y: 7 * this.SIZE_OF_EACH_ITEM })
      : null;
    isStringEmpty(this.state.postCode)
      ? this.scrollView.scrollTo({ y: 6 * this.SIZE_OF_EACH_ITEM })
      : null;
    isStringEmpty(this.state.city)
      ? this.scrollView.scrollTo({ y: 5 * this.SIZE_OF_EACH_ITEM })
      : null;
    isStringEmpty(this.state.address)
      ? this.scrollView.scrollTo({ y: 4 * this.SIZE_OF_EACH_ITEM })
      : null;
    !isValidEmail(this.state.email)
      ? this.scrollView.scrollTo({ y: 3 * this.SIZE_OF_EACH_ITEM })
      : null;
    isStringEmpty(this.state.lastName)
      ? this.scrollView.scrollTo({ y: 2 * this.SIZE_OF_EACH_ITEM })
      : null;
    isStringEmpty(this.state.firstName)
      ? this.scrollView.scrollTo({ y: 1 * this.SIZE_OF_EACH_ITEM - 20 })
      : null;

    if (
      isStringEmpty(this.state.firstName) ||
      isStringEmpty(this.state.lastName) ||
      isStringEmpty(this.state.address) ||
      isStringEmpty(this.state.city) ||
      isStringEmpty(this.state.state) ||
      isStringEmpty(this.state.postCode) ||
      isStringEmpty(this.state.country) ||
      !isValidEmail(this.state.email) ||
      !isPhoneNumber(this.state.phone)
    ) {
      this.setState({ isButtonClicked: false });
      return;
    }

    if (
      !this.state.isShippingSameAsBilling &&
      (isStringEmpty(this.state.sfirstName) ||
        isStringEmpty(this.state.slastName) ||
        isStringEmpty(this.state.saddress) ||
        isStringEmpty(this.state.scity) ||
        isStringEmpty(this.state.sstate) ||
        isStringEmpty(this.state.spostCode) ||
        isStringEmpty(this.state.scountry))
      // isStringEmpty(this.state.sphone)
    ) {
      console.log(this.state.isShippingSameAsBilling);

      this.setState({ isButtonClicked: false });
      return;
    }

    let url = AppConstant.BASE_URL + "user/" + this.userId + "/address";
    if (this.state.isFromCart) {
      url +=
        "?request=checkout" +
        (this.isLogin
          ? "&customer_id=" + this.userId
          : "&guest_id=" + this.userId);
    }
    let body = JSON.stringify({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      billing_address: {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        company: this.state.company,
        address_1: this.state.address,
        address_2: this.state.address2,
        city: this.state.city,
        state: this.state.state,
        postcode: this.state.postCode,
        country: this.state.country,
        email: this.state.email,
        phone: this.state.phone
      },
      shipping_address: {
        first_name: !this.state.isShippingSameAsBilling
          ? this.state.sfirstName
          : this.state.firstName,
        last_name: !this.state.isShippingSameAsBilling
          ? this.state.slastName
          : this.state.lastName,
        company: !this.state.isShippingSameAsBilling
          ? this.state.scompany
          : this.state.company,
        address_1: !this.state.isShippingSameAsBilling
          ? this.state.saddress
          : this.state.address,
        address_2: !this.state.isShippingSameAsBilling
          ? this.state.saddress2
          : this.state.address2,
        city: !this.state.isShippingSameAsBilling
          ? this.state.scity
          : this.state.city,
        state: !this.state.isShippingSameAsBilling
          ? this.state.sstate
          : this.state.state,
        postcode: !this.state.isShippingSameAsBilling
          ? this.state.spostCode
          : this.state.postCode,
        country: !this.state.isShippingSameAsBilling
          ? this.state.scountry
          : this.state.country
        // phone: !this.state.isShippingSameAsBilling ? this.state.sphone : this.state.phone
      }
    });
    this.setState({
      isProgress: true
    });
    fetchDataFromAPI(url, "POST", body, null).then(response => {
      // this.componentDidMount();
      this.setState({
        isProgress: false,
        isButtonClicked: false
      });
      if (!this.isLogin) {
        this.props.navigation.navigate("Checkout", {
          isAddressUpdated: true,
          guest_address_shipping: response,
          guest_address: JSON.parse(body)
        });
      } else {
        if (response.success) {
          showSuccessToast(response.message);
          if (this.state.isFromCart) {
            this.props.navigation.navigate("Checkout", {
              isAddressUpdated: true
            });
          }
        } else {
          showErrorToast(response.message);
        }
      }
    });
  };
  _selectState = state => {
    this.setState({
      selectedState: state,
      state: state["key"]
    });
  };
  _selectCountry = country => {
    let bState = "";
    if (country.code == this.initial_B_Country) {
      bState = this.initial_B_State;
    } else {
      bState = country.states.length == 0 ? "" : country.states[0]["key"];
    }

    this.setState({
      selectedCountry: country,
      stateList: country.states,
      state: bState,
      country: country["code"]
    });
  };
  _sSelectState = state => {
    this.setState({
      sSelectedState: state,
      sstate: state["key"]
    });
  };

  _sSelectCountry = country => {
    let sState = "";
    if (country.code == this.initial_S_Country) {
      sState = this.initial_S_State;
    } else {
      sState = country.states.length == 0 ? "" : country.states[0]["key"];
    }
    this.setState({
      sSelectedCountry: country,
      sStateList: country.states,
      sstate: sState,
      scountry: country["code"]
    });
  };
  _onBackPress = () => {
    if (this.state.isFromCart) {
      this.props.navigation.navigate("Checkout", { isAddressUpdated: false });
    } else {
      this.props.navigation.pop();
    }
  };
  onPressCheckBox = (checked) => {
    this.setState({
      isShippingSameAsBilling: !this.state.isShippingSameAsBilling
    });
  };

  async requestLocationPermission() {
    try {
      if(Platform.OS == 'ios'){
        Geolocation.setRNConfiguration({skipPermissionRequests:false, authorizationLevel:"always"});
        Geolocation.requestAuthorization();
        this.getLocation();
      }else{
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: strings("LOCATION_ACCESS_TITLE"),
          message: strings("LOCATION_ACCESS_MESSAGE"),
          buttonNeutral: strings("AFTER_SOME_TIME"),
          buttonNegative: strings("CANCEL"),
          buttonPositive: strings("OK")
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.hasLocationPermission = true;
        this.getLocation();
      } else {
        this.hasLocationPermission = false;
        console.log("Camera permission denied");
      }
    }
      
    } catch (err) {
      console.warn(err);
    }
  }
  getLocation = () => {
    this.setState({
      isProgress : true
    })
    Geolocation.getCurrentPosition(
      position => {
        console.log(position);
        if (position != null && position.coords != null) {
          this.updateAddress(
            position.coords.latitude,
            position.coords.longitude
          );
        }
      },
      error => {
        // See error code charts below.
        this.setState({
          isProgress : false
        })
        console.log(error.code, error.message);
        showErrorToast(error.message);
        if(error.code == 1){
        //  this.requestLocationPermission();
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  updateAddress = (lat, long) => {
    console.log("log->>> updateAddress" );
    
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        lat +
        "," +
        long +
        "&key=" +
        "AIzaSyBN2Lj0qGVQkfzaxCjAqdFJ52wcx2k5wnk"
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isProgress : false
        })
        if (
          responseJson &&
          responseJson.results &&
          responseJson.results.length > 0
        ) {
          let address = "";
          let address2 = "";
          let city = "";
          let state = "";
          let country = "";
          let zip_code = "";

          let location = responseJson.results[0];
          let address_components = location.address_components;
          if (address_components && address_components.length > 0) {
            address_components.forEach(element => {
              if (element.types && element.types.length > 0) {
                element.types.forEach(type => {
                  switch (type) {
                    case "premise":
                    case "sublocality_level_2":
                      if(isStringEmpty(address)){
                        address = address + element.short_name;
                      }else{
                        address = address + ", " + element.short_name;
                      }
                      break;
                    case "sublocality_level_1":
                      address2 = address2 + element.short_name;
                      break;
                    case "locality":
                      city = city + element.short_name;
                      break;
                    case "administrative_area_level_1":
                      state = element.short_name;
                      break;
                    case "country":
                      country = element.short_name;
                      break;
                    case "postal_code":
                      zip_code = element.short_name;
                      break;

                    default:
                      break;
                  }
                });
              }
            });
          }

          this.setState({
            address: address,
            address2: address2,
            city: city,
            postCode: zip_code
          });
          this.setupCountryForLocation(country, state);
        }
      });
  };

  setupCountryForLocation = (countryData, stateData) => {
    this.state.countryList.forEach(country => {
      if (country["code"] === countryData) {
        let states = country.states;
        this._selectCountry(country);
        states.forEach(state => {
          if (state["key"] === stateData) {
            this._selectState(state);
            return false
          }
        });
        return false
      }
    });
  };

  onPressLocation = () => {
    if(!this.state.isLoading){
      if (this.hasLocationPermission) {
        this.getLocation();
      } else {
        this.requestLocationPermission();
      }
    }
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <Container
        style={{
          backgroundColor: ThemeConstant.BACKGROUND_COLOR
        }}
      >
        <CustomActionbar
          title={strings("UPDATE_ADDRESS")}
          backwordTitle={
            this.state.isFromCart
              ? strings("CHECKOUT_TITLE")
              : strings("ACCOUNT_TITLE")
          }
          _onBackPress={this._onBackPress.bind(this)}
          iconName="current_location"
          _onForwordPress={this.onPressLocation.bind(this)}
        />
       {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView
            ref={view => (this.scrollView = view)}
            keyboardShouldPersistTaps={"always"}
          >
            <KeyboardAvoidingView
              style={{ padding: ThemeConstant.MARGIN_NORMAL, paddingTop: 0 }}
            >
              <Form>
                <Text style={[styles.headingTextStyle, globalTextStyle]}>
                  {strings("BILLING_ADDRESS")}
                </Text>

                <Text style={[styles.headingTextColor, globalTextStyle]}>
                  {strings("FIRST_NAME")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
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
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  onSubmitEditing={() => this.emailAddressInput.focus()}
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
                  {strings("EMAIL_ADDRESS")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => this.companyInput.focus()}
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                  ref={ref => (this.emailAddressInput = ref)}
                  placeholder={strings("EMAIL_ADDRESS")}
                />
                <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                  {this.state.showError && !isValidEmail(this.state.email)
                    ? isStringEmpty(this.state.email)
                      ? strings("REQUIRED_FIELD")
                      : strings("EMAIL_REQUIRED_FIELD")
                    : null}
                </Text>

                <Text style={[styles.headingTextColor, globalTextStyle]}>
                  {strings("COMPANY_NAME")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  onSubmitEditing={() => this.street1Input.focus()}
                  value={this.state.company}
                  onChangeText={text => this.setState({ company: text })}
                  ref={ref => (this.companyInput = ref)}
                  placeholder={strings("COMPANY_NAME")}
                />
                <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                  {this.state.showError && isStringEmpty(this.state.company)
                    ? strings("REQUIRED_FIELD")
                    : null}
                </Text>

                <Text style={[styles.headingTextColor, globalTextStyle]}>
                  {strings("STREET_ADDRESS")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  onSubmitEditing={() => this.street2Input.focus()}
                  value={this.state.address}
                  onChangeText={text => this.setState({ address: text })}
                  ref={ref => (this.street1Input = ref)}
                  placeholder={strings("STREET_ADDRESS")}
                />
                <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                  {this.state.showError && isStringEmpty(this.state.address)
                    ? strings("REQUIRED_FIELD")
                    : null}
                </Text>

                <Text style={[styles.headingTextColor, globalTextStyle]}>
                  {strings("STREET_ADDRESS_2")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  onSubmitEditing={() => this.cityInput.focus()}
                  value={this.state.address2}
                  onChangeText={text => this.setState({ address2: text })}
                  ref={ref => (this.street2Input = ref)}
                  placeholder={strings("STREET_ADDRESS_2")}
                />
                {/* <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                  {this.state.showError && isStringEmpty(this.state.address2)
                    ? strings("")REQUIRED_FIELD
                    : null}
                </Text> */}

                <Text style={[styles.headingTextColor, globalTextStyle]}>
                  {strings("CITY")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  onSubmitEditing={() => this.zipCodeInput.focus()}
                  value={this.state.city}
                  onChangeText={text => this.setState({ city: text })}
                  ref={ref => (this.cityInput = ref)}
                  placeholder={strings("CITY")}
                />
                <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                  {this.state.showError && isStringEmpty(this.state.city)
                    ? strings("REQUIRED_FIELD")
                    : null}
                </Text>

                <Text style={[styles.headingTextColor, globalTextStyle]}>
                  {strings("ZIP_CODE")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="next"
                  onSubmitEditing={() => this.telephoneInput.focus()}
                  value={this.state.postCode}
                  onChangeText={text => this.setState({ postCode: text })}
                  ref={ref => (this.zipCodeInput = ref)}
                  placeholder={strings("ZIP_CODE")}
                />
                <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                  {this.state.showError && isStringEmpty(this.state.postCode)
                    ? strings("REQUIRED_FIELD")
                    : null}
                </Text>

                <Text style={[styles.headingTextColor, globalTextStyle]}>
                  {strings("TELEPHONE")}
                </Text>
                <TextInput
                  style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    this.stateInput ? this.stateInput.focus() : null
                  }
                  value={this.state.phone}
                  onChangeText={text => this.setState({ phone: text })}
                  ref={ref => (this.telephoneInput = ref)}
                  placeholder={strings("TELEPHONE")}
                />
                <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                  {this.state.showError && !isPhoneNumber(this.state.phone)
                    ? strings("REQUIRED_FIELD")
                    : null}
                </Text>

                <View style={globleViewStyle}>
                  <Text style={[styles.headingTextColor]}>
                    {strings("COUNTRY")}
                  </Text>
                  <Text style={styles.textError}>
                    {this.state.showError &&
                    (!this.state.country || this.state.country == "")
                      ? strings("REQUIRED_FIELD")
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
                  //       <Title>Select Country</Title>
                  //     </Body>
                  //     <Right />
                  //   </Header>
                  // )}
                  selectedValue={this.state.selectedCountry}
                  onValueChange={this._selectCountry.bind(this)}
                  style={[styles.pickerStyle, globleViewStyle]}
                >
                  {this.state.countryList.map((country, i) => {
                    return (
                      <Picker.Item
                        key={i}
                        value={country}
                        label={country.name}
                      />
                    );
                  })}
                </Picker>

                <Text style={[styles.headingTextColor, globalTextStyle]}>
                  {strings("STATE")}
                </Text>

                {this.state.stateList && this.state.stateList.length > 0 ? (
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
                    //       <Title>Select Country</Title>
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
                ) : (
                  <View>
                    <TextInput
                      style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType={
                        this.state.isShippingSameAsBilling ? "done" : "next"
                      }
                      // onSubmitEditing={() => this.state.isShippingSameAsBilling ? this._onButtonPress.bind(this) :  this.sFirstNameInput.focus() }
                      value={this.state.state}
                      onChangeText={text => this.setState({ state: text })}
                      ref={ref => (this.stateInput = ref)}
                      placeholder={strings("STATE")}
                    />
                    <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                      {this.state.showError && isStringEmpty(this.state.state)
                        ? strings("REQUIRED_FIELD")
                        : null}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                 activeOpacity ={1}
                  onPress={this.onPressCheckBox.bind(this)}
                  style={[{
                    padding: ThemeConstant.MARGIN_GENERIC,
                  }, globleViewStyle]}
                >
                  <CheckBox
                    checked={this.state.isShippingSameAsBilling}
                    onPress={this.onPressCheckBox.bind(this)}
                    color={ThemeConstant.ACCENT_COLOR}
                    style = {{marginHorizontal:ThemeConstant.MARGIN_GENERIC}}
                  />
                    <Text
                      onPress={this.onPressCheckBox.bind(this)}
                      style={{ marginHorizontal: ThemeConstant.MARGIN_GENERIC }}
                    >
                      {strings("SHIPPING_SAME_AS_BILLING")}
                    </Text>
                </TouchableOpacity>

                {!this.state.isShippingSameAsBilling ? (
                  <Form>
                    <Text style={[styles.headingTextStyle, globalTextStyle]}>
                      {strings("SHIPPING_ADDRESS")}
                    </Text>

                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("FIRST_NAME")}
                    </Text>
                    <TextInput
                      style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType="next"
                      onSubmitEditing={() => this.sLastNameInput.focus()}
                      value={this.state.sfirstName}
                      onChangeText={text => this.setState({ sfirstName: text })}
                      ref={ref => (this.sFirstNameInput = ref)}
                      placeholder={strings("FIRST_NAME")}
                    />
                    <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                      {this.state.showError &&
                      isStringEmpty(this.state.sfirstName)
                        ? strings("REQUIRED_FIELD")
                        : null}
                    </Text>

                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("LAST_NAME")}
                    </Text>
                    <TextInput
                      style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType="next"
                      onSubmitEditing={() => this.sCompanyNameInput.focus()}
                      value={this.state.slastName}
                      onChangeText={text => this.setState({ slastName: text })}
                      ref={ref => (this.sLastNameInput = ref)}
                      placeholder={strings("LAST_NAME")}
                    />
                    <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                      {this.state.showError &&
                      isStringEmpty(this.state.slastName)
                        ? strings("REQUIRED_FIELD")
                        : null}
                    </Text>

                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("COMPANY_NAME")}
                    </Text>
                    <TextInput
                      style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType="next"
                      onSubmitEditing={() => this.sStreet1Input.focus()}
                      value={this.state.scompany}
                      onChangeText={text => this.setState({ scompany: text })}
                      ref={ref => (this.sCompanyNameInput = ref)}
                      placeholder={strings("COMPANY_NAME")}
                    />
                    <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                      {this.state.showError &&
                      isStringEmpty(this.state.scompany)
                        ? strings("REQUIRED_FIELD")
                        : null}
                    </Text>

                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("STREET_ADDRESS")}
                    </Text>
                    <TextInput
                      style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType="next"
                      onSubmitEditing={() => this.sStreet2Input.focus()}
                      value={this.state.saddress}
                      onChangeText={text => this.setState({ saddress: text })}
                      ref={ref => (this.sStreet1Input = ref)}
                      placeholder={strings("STREET_ADDRESS")}
                    />
                    <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                      {this.state.showError &&
                      isStringEmpty(this.state.saddress)
                        ? strings("REQUIRED_FIELD")
                        : null}
                    </Text>

                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("STREET_ADDRESS_2")}
                    </Text>
                    <TextInput
                      style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType="next"
                      onSubmitEditing={() => this.sCityInput.focus()}
                      value={this.state.saddress2}
                      onChangeText={text => this.setState({ saddress2: text })}
                      ref={ref => (this.sStreet2Input = ref)}
                      placeholder={strings("STREET_ADDRESS_2")}
                    />
                    <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                      {this.state.showError &&
                      isStringEmpty(this.state.saddress2)
                        ? strings("REQUIRED_FIELD")
                        : null}
                    </Text>

                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("CITY")}
                    </Text>
                    <TextInput
                      style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType="next"
                      onSubmitEditing={() => this.sZipCodeInput.focus()}
                      value={this.state.scity}
                      onChangeText={text => this.setState({ scity: text })}
                      ref={ref => (this.sCityInput = ref)}
                      placeholder={strings("CITY")}
                    />
                    <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                      {this.state.showError && isStringEmpty(this.state.scity)
                        ? strings("REQUIRED_FIELD")
                        : null}
                    </Text>

                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("ZIP_CODE")}
                    </Text>
                    <TextInput
                      style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="default"
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        this.sStateInput ? this.sStateInput.focus() : null
                      }
                      value={this.state.spostCode}
                      onChangeText={text => this.setState({ spostCode: text })}
                      ref={ref => (this.sZipCodeInput = ref)}
                      placeholder={strings("ZIP_CODE")}
                    />
                    <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                      {this.state.showError &&
                      isStringEmpty(this.state.spostCode)
                        ? strings("REQUIRED_FIELD")
                        : null}
                    </Text>

                    {/* <Item stackedLabel style={styles.itemStyle}> */}
                    {/* <Label>Telephone</Label>
                <Text style={styles.textError}>
                  {this.state.showError &&
                  (!this.state.sphone || this.state.sphone == "")
                    ? strings("")REQUIRED_FIELD
                    : null}
                </Text>
                <TextInput
                  value={this.state.sphone}
                  style={styles.inputTextStyle}
                  onChangeText={text => this.setState({ sphone: text })}
                />
                </Item> */}
                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("COUNTRY")}
                    </Text>
                    <Picker
                      mode="dialog"
                      placeholder={strings("COUNTRY")}
                      iosIcon={<Icon name="arrow-down" />}
                      selectedValue={this.state.sSelectedCountry}
                      onValueChange={this._sSelectCountry.bind(this)}
                      style={[styles.pickerStyle]}
                    >
                      {this.state.countryList.map((country, i) => {
                        return (
                          <Picker.Item
                            key={i}
                            value={country}
                            label={country.name}
                          />
                        );
                      })}
                    </Picker>
                    <Text style={[styles.headingTextColor, globalTextStyle]}>
                      {strings("STATE")}
                    </Text>
                    {this.state.sStateList &&
                    this.state.sStateList.length > 0 ? (
                      <Picker
                        mode="dropdown"
                        placeholder={strings("STATE")}
                        iosIcon={<Icon name="arrow-down" />}
                        selectedValue={this.state.sSelectedState}
                        onValueChange={this._sSelectState.bind(this)}
                        style={styles.pickerStyle}
                      >
                        {this.state.sStateList.map((states, i) => {
                          return (
                            <Picker.Item
                              key={i}
                              value={states}
                              label={states.name}
                            />
                          );
                        })}
                      </Picker>
                    ) : (
                      <View>
                        <TextInput
                          style={[ViewStyle.inputTextStyle, {writingDirection:localeObject.isRTL? "rtl":"ltr"}]}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="default"
                          returnKeyType="done"
                          onSubmitEditing={() => this._onButtonPress.focus()}
                          value={this.state.sstate}
                          onChangeText={text => this.setState({ sstate: text })}
                          ref={ref => (this.sStateInput = ref)}
                          placeholder={strings("STATE")}
                        />
                        <Text style={[ViewStyle.textError, {alignSelf:localeObject.isRTL ? "flex-start" : "flex-end"}]}>
                          {this.state.showError &&
                          isStringEmpty(this.state.sstate)
                            ? strings("REQUIRED_FIELD")
                            : null}
                        </Text>
                      </View>
                    )}
                  </Form>
                ) : null}

                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={this._onButtonPress.bind(this)}
                  activeOpacity={1}
                >
                  <Text style={styles.buttonText}>
                    {strings("SAVE_ADDRESS")}
                  </Text>
                </TouchableOpacity>
              </Form>
              <ProgressDialog visible={this.state.isProgress} />
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "stretch",
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    borderRadius: ThemeConstant.MARGIN_TINNY
  },
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold"
  },

  headingTextStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    // marginLeft: 10,
    // marginRight: 10,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_GENERIC
  },
  pickerStyle: {
    marginTop: 0,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_TINNY
  },
  headingTextColor: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  }
});

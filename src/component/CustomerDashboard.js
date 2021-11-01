import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import { CustomImage } from "../container/CustomImage";
import ThemeConstant from "../app_constant/ThemeConstant";
import { SCREEN_WIDTH, isStringEmpty } from "../utility/UtilityConstant";
import CustomIcon2 from "../container/CustomIcon2";
import { Tabs, ScrollableTab, Tab, Header, Container } from "native-base";
import CustomerDashboardOrder from "../container/CustomerDashboardOrder";
import CustomerDashboardAddress from "../container/CustomerDashboardAddress";
import { fetchDataFromAPI, fetchDataFromAPIMultipart } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import ProgressDialog from "../container/ProgressDialog";
import AskCameraGalleryDialog from "../container/AskCameraGalleryDialog";
import { showErrorToast, showSuccessToast } from "../utility/Helper";
import CustomerDashdoardReview from "../container/CustomerDashboardReview";
import ViewStyle from "../app_constant/ViewStyle";
import { strings, localeObject } from "../localize_constant/I18";

export default class CustomerDashboard extends React.Component {
  screenProps = null;
  userId = 0;
  isInComponent = true;
  state = {
    isLoading: true,
    billingAddress: "",
    shippingAddress: "",
    profileBanner: "",
    profileImage: "",
    uploadBannerImage: null,
    uploadProfileImage: null,
    profileImageId: "",
    bannerImageId: "",
    isProgress: false,
    openImageGallery: false,
    orders : [],
    userInfo : {},
    isOrderLoading : true,
  };
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this.isInComponent = false;
  }
  componentDidMount() {
    this.isInComponent = true;

    let { navigation, screenProps } = this.props;
    this.screenProps = screenProps;
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused())
    ];
  }
  isFocused = () => {
    this.callAPI();
  };

  callAPI() {
    // AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
      let userId = AppConstant.USER_KEY;
      if (userId) {
        this.userId = userId;
        let url = AppConstant.BASE_URL + "user/" + userId;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (response.success) {
            let billingAddress = response.billing_address;
            let shippingAddress = response.shipping_address;
            billingAddress = this.getAddressText(billingAddress);
            shippingAddress = this.getAddressText(shippingAddress);
            this.setState({
              isLoading: true,
              billingAddress: billingAddress,
              shippingAddress: shippingAddress,
              profileBanner: response.banner_image,
              profileImage: response.profile_image,
              userInfo : response,
            });
          }
          this.callOrderAPI();
        });
      }
    // });
  }

  callOrderAPI = ()=>{
    // AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      let userID = AppConstant.USER_KEY;
      if (userID) {
        let url =
          AppConstant.BASE_URL +
          "user/orders/" +
          userID +
          "?page=" +
          this.page +
          "&width=" +
          SCREEN_WIDTH;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (response && response.success) {
            response.orders.forEach(element => {
              if(element.items && element.items.length > 0)
              if (isStringEmpty(element.items[0].image)) {
                element.items.forEach(item => {
                  if (!isStringEmpty(item.image)) {
                    element.image = item.image;
                    element.dominantColor = item.dominantColor;
                  }
                });
              } else {
                element.image = element.items[0].image;
                element.dominantColor = element.items[0].dominantColor;
              }
            });
            this.setState({
              orders: response.orders,
              isOrderLoading: false
            });
          } else {
            this.setState({
              isOrderLoading: false
            });
          }
        });
      }
    // });
  }

  getAddressText = (address) =>{
    let textAddress = "";
    if (!isStringEmpty(address.first_name)) {
      textAddress = textAddress + address.first_name;
    }
    if (!isStringEmpty(address.last_name)) {
      textAddress = textAddress + " " + address.last_name;
    }
    if (!isStringEmpty(address.email)) {
      textAddress = textAddress + "\n" + address.email;
    }
    if (!isStringEmpty(address.phone)) {
      textAddress = textAddress + "\n" + address.phone;
    }
    if (!isStringEmpty(address.company)) {
      textAddress = textAddress + "\n" + address.company;
    }
    if (!isStringEmpty(address.address_1)) {
      textAddress = textAddress + "\n" + address.address_1;
    }
    if (!isStringEmpty(address.address_2)) {
      textAddress = textAddress + ", " + address.address_2;
    }
    if (!isStringEmpty(address.city)) {
      textAddress = textAddress + ", " + address.city;
    }
    if (!isStringEmpty(address.state)) {
      textAddress = textAddress + "\n " + address.state;
    }
    if (!isStringEmpty(address.country)) {
      textAddress = textAddress + ", " + address.country;
    }
    if (!isStringEmpty(address.postcode)) {
      textAddress = textAddress + ", " + address.postcode;
    }

    if (isStringEmpty(textAddress)) {
      return strings("EMPTY_ADDRESS");
    } else {
      return textAddress;
    }
  }
  saveProfile = ()=> {
    let saveType = "";
    
    if (
      !isStringEmpty(this.state.profileImageId) &&
      !isStringEmpty(this.state.bannerImageId)
    ) {
      saveType = "both";
    } else if (!isStringEmpty(this.state.profileImageId)) {
      saveType = "profile";
    } else if (!isStringEmpty(this.state.bannerImageId)) {
      saveType = "banner";
    } else {
      saveType = null;
    }
    // console.log("this.state.saveType", saveType);

    if (saveType) {
      let url = AppConstant.BASE_URL + "user/edit-profile";
      let body = JSON.stringify({
        user_id: this.userId,
        image_id: this.state.profileImageId,
        banner_id: this.state.bannerImageId,
        type: saveType,
        request: "update"
      });
      fetchDataFromAPI(url, "POST", body, null).then(response => {
          if(response.success){
              showSuccessToast(response.message);
              this.setState({
                profileImageId : "",
                bannerImageId : ""
              })

          }else{
              showErrorToast(response.message);
          }

      });
    } else {
      showErrorToast(strings("IMAGE_NOT_UPDATE"));
    }
  }
  //   IMAGE UPDATE //
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
                profileImageId: response.image_id + ""
              });
              break;
            case AppConstant.SAVE_BANNER_IMAGE:
              this.setState({
                bannerImageId: response.image_id + ""
              });
              break;
            default:
              break;
          }
        } else {
          if(updateImageType ==  AppConstant.SAVE_PROFILE_IMAGE){
            this.setState({
              uploadProfileImage: null,
              profileImageId : ""
            });
          }else{
            this.setState({
              uploadBannerImage: null,
              bannerImageId : ""
            });
          }
          showErrorToast(response.message);
        }
      });
    }
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
        width = ThemeConstant.UPLOAD_IMAGE_SIZE;
        height = ThemeConstant.UPLOAD_IMAGE_SIZE;
        isCropping = true;
        break;
      case AppConstant.SAVE_BANNER_IMAGE:
        width =  ThemeConstant.UPLOAD_IMAGE_SIZE;
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

  onPressEditInfo(){
    this.props.navigation.navigate("CustomerProfile");
  }

  ////////////////////////////

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <View
        style={ViewStyle.mainContainer}
      >
        
        <ImageBackground
          source={
            (isStringEmpty(this.state.profileBanner) &&
            (this.state.uploadBannerImage == null ||
              isStringEmpty(this.state.uploadBannerImage.path)))
              ? require("../../resources/images/profile_banner.png")
              : {
                  uri: this.state.uploadBannerImage
                    ? this.state.uploadBannerImage.path
                    : this.state.profileBanner
                }
          }
          style={styles.background_Image}
          resizeMode="stretch"
        >
          <View
            style={{
              height: 54,
              width: SCREEN_WIDTH,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: ThemeConstant.MARGIN_GENERIC,
              paddingRight: ThemeConstant.MARGIN_GENERIC
            }}
          >
            <TouchableOpacity
              //   style={styles.editIconViewStyle}
              onPress={this._onBackPress}
            >
              <CustomIcon2
                name={"back"}
                size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                color={ThemeConstant.ACCENT_BUTTON_TEXT_COLOR}
              />
            </TouchableOpacity>

            <TouchableOpacity
              //   style={styles.editIconViewStyle}
              onPress={this.saveProfile}
            >
              <CustomIcon2
                name={"baseline-cloud_upload"}
                size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                color={ThemeConstant.ACCENT_BUTTON_TEXT_COLOR}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.backgroundView}>
            <View style={styles.bannerViewStyle}>
              <CustomImage
                image={
                  this.state.uploadProfileImage
                    ? this.state.uploadProfileImage.path
                    : this.state.profileImage
                }
                size = {ThemeConstant.DASHBOARD_PROFILE_IMAGE_SIZE}
                dominantColor={"yellow"}
                imagestyle={styles.bannerStyle}
              />
              <TouchableOpacity
                style={styles.editIconViewStyle}
                onPress={this._openGalleryDialog.bind(
                  this,
                  AppConstant.SAVE_PROFILE_IMAGE
                )}
              >
                <CustomIcon2
                  name={"edit"}
                  size={ThemeConstant.DEFAULT_ICON_SMALL_SIZE}
                  color={ThemeConstant.ACCENT_COLOR}
                />
              </TouchableOpacity>
              
            </View>
              <Text style={styles.headingText} >{this.state.userInfo.display_name}</Text>
              <Text style ={styles.subHeadingText} >{this.state.userInfo.email}</Text>
              <Text style={styles.editText} onPress={this.onPressEditInfo.bind(this)} >{strings("EDIT_INFO")}</Text>

            <TouchableOpacity
              style={styles.editIconBannerViewStyle}
              onPress={this._openGalleryDialog.bind(
                this,
                AppConstant.SAVE_BANNER_IMAGE
              )}
            >
              <CustomIcon2
                name={"edit"}
                size={ThemeConstant.DEFAULT_ICON_SMALL_SIZE}
                color={ThemeConstant.ACCENT_COLOR}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        {/* <ScrollView> */}
        <Tabs
        //   renderTabBar={() => <ScrollableTab />}
          tabBarUnderlineStyle={{
            backgroundColor: ThemeConstant.ACCENT_COLOR,
            height:1
          }}
          tabContainerStyle = {{flexDirection: localeObject.isRTL? "row-reverse" : "row"}}
        >
          <Tab
            heading={strings("RECENT_ORDER_TITLE")}
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            textStyle={styles.textStyle}
            activeTextStyle={styles.activeTextStyle}
          >
            <CustomerDashboardOrder
              navigation={this.props.navigation}
              screenProps={this.props.screenProps}
              orders = {this.state.orders}
              isOrderLoading = {this.state.isOrderLoading}
            />
          </Tab>
          <Tab
            heading={strings("ADDRESS_TITLE")}
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            textStyle={styles.textStyle}
            activeTextStyle={styles.activeTextStyle}
          >
            <CustomerDashboardAddress
              navigation={this.props.navigation}
              screenProps={this.props.screenProps}
              shippingAddress={this.state.shippingAddress}
              billingAddress={this.state.billingAddress}
            />
          </Tab>
          <Tab
            heading={strings("REVIEWS_TITLE")}
            tabStyle={styles.tabStyle}
            activeTabStyle={styles.activeTabStyle}
            textStyle={styles.textStyle}
            activeTextStyle={styles.activeTextStyle}
          >
            <CustomerDashdoardReview
              navigation={this.props.navigation}
              screenProps={this.props.screenProps}
            />
          </Tab>
        </Tabs>
        {/* </ScrollView>  */}
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
  background_Image: {
    height: ThemeConstant.DASHBOARD_BANNER_IMAGE_SIZE,
    width: SCREEN_WIDTH,
    alignItems: "stretch",
  },
  backgroundView: {
    alignSelf: "stretch",
    flexDirection: "column",
    alignItems: "center",
    height: ThemeConstant.DASHBOARD_BANNER_IMAGE_SIZE - 30,
    width: SCREEN_WIDTH,
    position :"absolute",
    top : 30,
  },
  bannerViewStyle: {
    width: ThemeConstant.DASHBOARD_PROFILE_IMAGE_SIZE,
    height: ThemeConstant.DASHBOARD_PROFILE_IMAGE_SIZE,
    borderRadius: ThemeConstant.DASHBOARD_PROFILE_IMAGE_SIZE/2,
    justifyContent:"center",
    alignItems:"center",
    position: "relative",
    borderColor: ThemeConstant.LINE_COLOR_2,
    borderWidth: 1,
  },
  bannerStyle: {
    width: ThemeConstant.DASHBOARD_PROFILE_IMAGE_SIZE,
    height: ThemeConstant.DASHBOARD_PROFILE_IMAGE_SIZE,
    borderRadius: ThemeConstant.DASHBOARD_PROFILE_IMAGE_SIZE/2,
    borderColor: ThemeConstant.LINE_COLOR_2,
    borderWidth: 1,
  },
  editIconViewStyle: {
    position: "absolute",
    right: -4,
    top: -4,
    borderRadius: ThemeConstant.DEFAULT_ICON_SIZE_NORMAL/2,
    borderColor: ThemeConstant.DEFAULT_SECOND_ICON_COLOR,
    borderWidth: 0.5,
    height: ThemeConstant.DEFAULT_ICON_SIZE_NORMAL,
    width: ThemeConstant.DEFAULT_ICON_SIZE_NORMAL,
    backgroundColor: 'rgba(255,255, 255, 0.8)',
    justifyContent: "center",
    alignItems: "center"
  },
  editIconBannerViewStyle: {
    position: "absolute",
    right: 10,
    bottom: 10,
    borderRadius: ThemeConstant.DEFAULT_ICON_SIZE_NORMAL / 2,
    borderColor: ThemeConstant.DEFAULT_SECOND_ICON_COLOR,
    borderWidth: 0.5,
    height: ThemeConstant.DEFAULT_ICON_SIZE_NORMAL,
    width: ThemeConstant.DEFAULT_ICON_SIZE_NORMAL,
    backgroundColor: 'rgba(255,255, 255, 0.8)',
    justifyContent: "center",
    alignItems: "center"
  },
  tabStyle: { backgroundColor: ThemeConstant.BACKGROUND_COLOR, justifyContent : "center", alignItems:"center" },
  activeTabStyle: { backgroundColor: ThemeConstant.BACKGROUND_COLOR, justifyContent : "center", alignItems:"center"},
  textStyle: { color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,  textAlignVertical: "center", textAlign:"center", },
  activeTextStyle: { color: ThemeConstant.ACCENT_COLOR, textAlignVertical: "center", textAlign:"center",},
  headingText : {
    fontSize : ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight : "bold",
    color : "white",
    marginTop : ThemeConstant.MARGIN_TINNY
  },
  subHeadingText:{
    fontSize : ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color : "white",
    // marginTop : ThemeConstant.MARGIN_TINNY
  },
  editText:{
    backgroundColor: 'rgba(255,255, 255, 0.5)',
    textAlign: "center",
    color: "white",
    borderRadius: 12,
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  }
});

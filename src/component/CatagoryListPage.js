import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  BackHandler
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../app_constant/ThemeConstant";
import CustomActionbar from "../container/CustomActionbar";

import Loading from "../container/LoadingComponent";
import { CustomImage } from "../container/CustomImage";
import CustomIcon2 from "../container/CustomIcon2";
import { isStringEmpty, SCREEN_WIDTH } from "../utility/UtilityConstant";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { setCartCount } from "../app_constant/AppSharedPref";
import { showErrorToast } from "../utility/Helper";
import DemoData from "../utility/DemoData";
import ViewStyle from "../app_constant/ViewStyle";
import { localeObject, strings } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class CategoryListPage extends React.Component {
  screenProps = null;
  state = {
    categories: [],
    isLoading: true,
    cartCount : "0",
    isReferesh : false,
    loadingEnable :true
  };

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this.isUpdateFlatList = false;
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }
  _handleBackPress = ()=>{
    return false;
  }

  componentDidMount() {
    this.screenProps = this.props.screenProps;
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused()),
      this.screenProps.addListener("willFocus", () => this.isFocused())
    ];

    let homePagedata = this.props.screenProps.getParam("homePagedata", null);
    if(homePagedata){
      this.setState({
        categories: homePagedata.categories,
        isLoading: false,
        loadingEnable :false
      });
    }else{
      let homePagedata = DemoData.homePageData;
      if(homePagedata){
        this.setState({
          categories: homePagedata.categories,
          isLoading: false,
        });
      }
       this.callAPI();
    }
        
  }

  isFocused = () => {
    AsyncStorage.getItem(AppConstant.PREF_CART_COUNT).then(cartCount => {
      this.setState({
        cartCount: cartCount ? cartCount : "0"
      });
    });
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
  };

  callAPI = () => {
    // AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
      let islogedIn = AppConstant.IS_USER_LOGIN;
      let url = AppConstant.BASE_URL + "homepage/?width=" + SCREEN_WIDTH; // * 3
      if (islogedIn && islogedIn == "true") {
        url += "&customer_id=";
      } else {
        url += "&guest_id=";
      }
      // AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
        let userId = AppConstant.USER_KEY;
        url += userId ? userId : "";
        fetchDataFromAPI(url, "GET", "", null, 1).then(result => {
          if (
            result &&
            (result.success || typeof result.success === "undefined")
          ) {
            this.isUpdateFlatList = true;
            setCartCount(result.count);
            let homePagedata = result;
            this.setState({
              cartCount: homePagedata.count ? homePagedata.count : "0",
              categories: homePagedata.categories,
              isReferesh: false,
              loadingEnable : false,
              isLoading : false
            });
          } else {
            showErrorToast(result.message);
            this.setState({
              isReferesh: false
            });
          }
        });
      // });
    // });
  };

  onReferesh = () => {
    this.setState({
      isReferesh: true
    });
    this.callAPI();
  };
  onPressCategory = category => {
    if (!category.children || category.children == 0) {
      this.screenProps.navigate("CategoryProductPage", {
        categoryId: category.ID,
        categoryName: category.name
      });
    } else {
      this.screenProps.navigate("SubCatagoryPage", {
        categoryId: category.ID,
        categoryName: category.name
      });
    }
  };
  _onBackPress = () => {
    if (this.screenProps) {
      this.screenProps.navigate("HomePageNavigation");
    }
  };
  _onPressCart = () => {
    if (this.screenProps) {
      this.screenProps.navigate("CartPage");
    } else {
      this.props.navigation.navigate("CartPage");
    }
  };
  render() {
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={ViewStyle.mainContainer}
      >
        <CustomActionbar
          _onBackPress={this._onBackPress.bind(this)}
          backwordTitle={strings("HOME_TITLE")}
          title={strings("CATEGORY_TITLE")}
          navigation = {this.screenProps}
          iconName={"cart"}
          cartCount={this.state.cartCount}
          _onForwordPress={this._onPressCart.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView 
          refreshControl={
            <RefreshControl
              colors={[ThemeConstant.ACCENT_COLOR, ThemeConstant.ACCENT_COLOR]}
              onRefresh={this.onReferesh.bind(this)}
              refreshing={this.state.isReferesh}
            />
          }
          >
            <FlatList
              data={this.state.categories}
              keyExtractor={item => item.ID + ""}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: ThemeConstant.MARGIN_NORMAL,
                    borderBottomColor: ThemeConstant.LINE_COLOR,
                    borderBottomWidth: 1
                  }, globleViewStyle]}
                  activeOpacity={0.6}
                  onPress={this.onPressCategory.bind(this, item)}
                >
                  <View style={[{ flexDirection: "row", alignItems: "center" }, globleViewStyle]}>
                    {isStringEmpty(item.icon) ? (
                      <CustomIcon2
                        name="category"
                        size={ThemeConstant.CATEGORY_ICON_SIZE}
                        color={ThemeConstant.ACCENT_COLOR}
                      />
                    ) : (
                      <CustomImage
                        imagestyle={{
                          width: ThemeConstant.CATEGORY_ICON_SIZE,
                          height: ThemeConstant.CATEGORY_ICON_SIZE
                        }}
                        image={item.icon}
                      />
                    )}
                    <Text
                      style={{
                        paddingHorizontal: ThemeConstant.MARGIN_NORMAL,
                        textAlignVertical: "center",
                        color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
                        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                        fontWeight: "400"
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                  <CustomIcon2
                    name= {localeObject.isRTL ? "arrow-left" : "arrow-right"}
                    size={ThemeConstant.DEFAULT_ICON_SIZE}
                  />
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        )}
         {this.state.loadingEnable ? (
          <Text
            style={[
              { padding: ThemeConstant.MARGIN_TINNY,
                paddingRight: ThemeConstant.MARGIN_NORMAL,
                paddingLeft: ThemeConstant.MARGIN_NORMAL,
                marginTop: ThemeConstant.MARGIN_LARGE,
                marginBottom: ThemeConstant.MARGIN_NORMAL,
                marginRight: ThemeConstant.MARGIN_GENERIC,
                fontWeight: "100",
                fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
                backgroundColor: ThemeConstant.BACKGROUND_COLOR_2,
                position: "absolute", alignSelf: "center", top: 50 }
            ]}
          >
            {strings("LOADING")}
          </Text>
        ) : null}
      </View>
    );
  }
}

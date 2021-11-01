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
import { Dimensions, View, Text, Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { ScrollView, FlatList } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { Button } from "react-native-elements";
import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import CategoryGridProduct from "../container/CategoryGridProduct";
import CategoryListProduct from "../container/CategoryListProduct";
import EmptyLayoutComponent from "../container/EmptyLayoutComponent";
import { EmptyIconConstant } from "../app_constant/EmptyIconConstant";
import Loading from "../container/LoadingComponent";
import SortContainer from "../container/SortContainer";
import ProgressDialog from "../container/ProgressDialog";

import CustomActionbar from "../container/CustomActionbar";
import CustomIcon2 from "../container/CustomIcon2";
import { showSuccessToast, showErrorToast } from "../utility/Helper";
import { isStringEmpty } from "../utility/UtilityConstant";
import { setGuestId, setCartCount, setWishListGuestId } from "../app_constant/AppSharedPref";
import _ from "lodash";
import { Spinner } from "native-base";
import { CustomImage } from "../container/CustomImage";
import ViewStyle from "../app_constant/ViewStyle";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";
import firebase from "react-native-firebase";
import AnalylticsConstant from "../app_constant/AnalylticsConstant";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class CategoryProductPage extends React.Component {
  total = 0;
  page = 1;
  viewInComponent = true;
  screenProps = {};
  orderBy = "";
  isLogin = "false";
  userId = "";
  initialProduct = [];
  isInAPICall = false;

  state = {
    cartCount: "0",
    products: [],
    sortLabel: [],
    loading: true,
    isGrid: false,
    sortDialogVisible: false,
    isProgressLoading: false,
    title: "",
    isHasProduct: true,
    isButtonClicked: false,
    banner : {}
  };

  componentDidMount() {
    this.viewInComponent = false;
   this.screenProps = this.props.navigation;
   this.subs = [
     this.props.navigation.addListener("didFocus", () => this.isFocused()),
     this.props.navigation.addListener("willBlur", () => this.isBlur())
   ];
   this.LoadComponentData();
    }
 LoadComponentData = ()=>{
   this.page = 1;
   let urlObject = this.calculateURL();
   fetchDataFromAPI(urlObject.url, "GET", "", null, urlObject.dbId).then(
     response => {
       this.setState({
         loading: false,
         isProgressLoading: false,
       });
       if (response.success ) {
         this.total = response.total
           ? response.total
           : response.total_products;
         this.initialProduct = response.products;
         this.setState(
           {
             products: response.products,
             sortLabel: response.sort_label,
             isHasProduct: response.products && response.products.length > 0 ? true : false,
             banner : response.banner && response.banner.length > 0? response.banner[0]: {}
           },
           () => {
             // this.fetchResult();
           }
         );
       }else { 
         this.setState({
           products : [],
           isHasProduct : false
         })
       }
     }
   );
 }
 isBlur =()=>{
    this.setState({
      isProgressLoading: false
    })
    this.viewInComponent = false;
  }

  componentWillUnmount() {
    this.setState({
      isProgressLoading: false
    })
    this.subs.forEach(sub => sub.remove());
    this.viewInComponent = false;
  }
  isFocused = () => {
    this.viewInComponent = true;
    this.isInAPICall = false;
    this.isLogin = AppConstant.IS_USER_LOGIN;
    this.userId = AppConstant.USER_KEY ? AppConstant.USER_KEY : "";
    AsyncStorage.getItem(AppConstant.PREF_CART_COUNT).then(cartCount => {
      this.setState({
        cartCount: cartCount ? cartCount : "0"
      });
    });
    if(this.props.navigation.getParam("search_refresh",  false)){
      this.props.navigation.setParams("search_refresh",  false)
      this.setState({
        loading: true,
      });
     this.LoadComponentData()
    }
  };

  calculateURL = () => {
    let url = AppConstant.BASE_URL;
    let dbId;
    let analyticsObject = {};
    switch (
      this.props.navigation.getParam("CATAGORY_PAGE", AppConstant.IS_CATAGORY)
    ) {
      case AppConstant.IS_SELLER:
        dbId = this.props.navigation.getParam("sellerId", 0);
        analyticsObject[AnalylticsConstant.METHOD] = AnalylticsConstant.SELLER_PRODUCT;
        url +=
          "seller/collection?seller_id=" +
          this.props.navigation.getParam("sellerId", 0) +
          "&width=" +
          SCREEN_WIDTH +
          "&page=" +
          this.page +
          "&orderby=" +
          this.orderBy;
        this.setState({
          title: this.props.navigation.getParam("sellerName", "")
        });
        break;
      case AppConstant.IS_SEARCH:
        dbId = this.props.navigation.getParam("searchKey", "");
        analyticsObject[AnalylticsConstant.METHOD] = AnalylticsConstant.SEARCH;
        url +=
          "products/search/?s=" +
          this.props.navigation.getParam("searchKey", "") +
          "&width=" +
          SCREEN_WIDTH +
          "&page=" +
          this.page +
          "&orderby=" +
          this.orderBy;
        this.setState({
          title: this.props.navigation.getParam("searchKey", "")
        });
        break;
      case AppConstant.IS_HOME_PRODUCT:
        dbId = this.props.navigation.getParam("type", "");
        analyticsObject[AnalylticsConstant.METHOD] = AnalylticsConstant.PAGE_HOME;
        url +=
          "products/" +
          "?width=" +
          SCREEN_WIDTH +
          "&page=" +
          this.page +
          "&type=" +
          dbId +
          "&orderby=" +
          this.orderBy;
        this.setState({
          title: this.props.navigation.getParam("title", "")
        });
        break;

      case AppConstant.IS_CATAGORY:
      default:
        analyticsObject[AnalylticsConstant.METHOD] = AnalylticsConstant.METHOD;

        dbId = this.props.navigation.getParam("categoryId");
        url +=
          "category/products/" +
          this.props.navigation.getParam("categoryId") +
          "?width=" +
          SCREEN_WIDTH +
          "&page=" +
          this.page +
          "&orderby=" +
          this.orderBy;
        this.setState({
          title: this.props.navigation.getParam("categoryName", "Category")
        });
    }
       analyticsObject[AnalylticsConstant.ID] = dbId;
        firebase.analytics().logEvent(AnalylticsConstant.CATALOG, analyticsObject);

    return { url: url, dbId: dbId };
  };

  fetchResult = () => {
    if (this.total > this.state.products.length && this.viewInComponent && !this.isInAPICall) {
      this.page = this.page + 1;
      let urlObject = this.calculateURL();
      this.isInAPICall = true
      fetchDataFromAPI(urlObject.url, "GET", "", null).then(response => {
        this.isInAPICall = false
        if(this.viewInComponent)
        if (response.success != 0) {
          this.setState(
            {
              products: this.state.products.concat(response.products),
              isProgressLoading: false
            },
            () => {
              // this.fetchResult();
            }
          );
        } else {
          this.page = this.page - 1;
          this.setState({
            isProgressLoading: false
          })
        }
      });
    }else{
      this.setState({
        isProgressLoading: false
      })
    }
  };
  _onPressListGrid = () => {
    if (!this.isButtonClicked) {
      this.isButtonClicked = true;
      this.setState(
        {
          products: this.initialProduct,
          isGrid: !this.state.isGrid,
          refreshing: true
        },
        () => {
          this.isButtonClicked = false;
          this.page = 1;
        }
      );
    }
  };
  _getItemLayout = (data, index) => {
    const productHeight = SCREEN_WIDTH * 1.2;
    return {
      length: productHeight,
      offset: productHeight * index,
      index
    };
  };
  _onPressSort = () => {
    if (this.state.sortLabel && this.state.sortLabel.length > 0) {
      if(this.orderBy == ""){
        this.orderBy = this.state.sortLabel[0].value
      }
      this.setState({
        sortDialogVisible: true
      });
    } else {
      showErrorToast(strings("MESSAGE_NO_SORTING_OPTION"));
    }
  };
  _onSortResponseListner = (item) => {
    this.setState({
      sortDialogVisible: false
    }, ()=>{
      setTimeout(()=>{ item && item.value != this.orderBy ?  this.setState({isProgressLoading : true}, ()=>{
        this.orderBy = item.value;
        this.componentDidMount()
      }) : null },  Platform.OS == 'ios' ? 500 : 5) ;
    });
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };

  _onPressProduct = product => {
    let productName = product.title ? product.title : product.name;
    if (this.screenProps) {
      this.screenProps.navigate("ProductPage", {
        productId: product.id,
        productName: productName,
        productImage : product.image
      });
    } else {
      this.props.navigation.navigate("ProductPage", {
        productId: product.id,
        productName: productName,
        productImage : product.image
      });
    }
  };
  _onPressAddToCart = product => {
    if (product.product_type != "simple") {
      this._onPressProduct(product);
    } else {
      this.setState({
        isProgressLoading: true
      });
      let url = AppConstant.BASE_URL + "cart?request=add";
      let body = JSON.stringify({
        product_id: product.id,
        variations: product.variation,
        variation_id: product.variation_id,
        quantity: 1,
        customer_id: this.isLogin && this.isLogin == "true" ? this.userId : "",
        guest_id: !this.isLogin || this.isLogin !== "true" ? this.userId : ""
      });      
      fetchDataFromAPI(url, "POST", body, null).then(response => {
        this.setState({
          isProgressLoading: false
        });
        if (response && response.success) {
          showSuccessToast(response.message);
          if (!isStringEmpty(response.guest_id)) {
            setGuestId(response.guest_id);
          }
          setCartCount(response.count);
          this.setState({
            cartCount: response.count
          });
        } else {
          showErrorToast(response.message);
        }
      });
    }
  };
  
  onPressWishlist = (product)=>{
    this.setState({
      isProgressLoading: true
    });
    let url = AppConstant.BASE_URL + "wishlist/create";
      let body = JSON.stringify({
        product_id: product.id,
        user_id: AppConstant.WISHLIST_USER_ID
      });      
      fetchDataFromAPI(url, "POST", body, null).then(response => {
        this.setState({
          isProgressLoading: false
        });
        if (response && response.success) {
          showSuccessToast(response.message);
          if (!isStringEmpty(response.guest_id)) {
            setWishListGuestId(response.guest_id);
          }
        } else {
          showErrorToast(response.message);
        }
      });
  }

  _onPressCart = () => {
    if (this.screenProps) {
      this.screenProps.navigate("CartPage");
    } else {
      this.props.navigation.navigate("CartPage");
    }
  };

  renderCategoryPage = (item) => {
    return this.state.isGrid ? (
      <CategoryGridProduct
        productData={item.item}
        onPress={this._onPressProduct.bind(this)}
        onPressAddToCart={this._onPressAddToCart.bind(this)}
        onPressWishlist = {this.onPressWishlist.bind(this)}
      />
    ) : (
      <CategoryListProduct
        productData={item.item}
        onPress={this._onPressProduct.bind(this)}
        onPressAddToCart={this._onPressAddToCart.bind(this)}
        onPressWishlist = {this.onPressWishlist.bind(this)}
      />
    );
  };

  onPressShowAllCategory = ()=>{
    this.props.navigation.navigate("CategoryNavigation");
  }

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: ThemeConstant.BACKGROUND_COLOR,
          paddingBottom: ThemeConstant.MARGIN_TINNY,
          alignSelf: "stretch"
        }}
      >
        <CustomActionbar
          backwordTitle={
            this.props.navigation.getParam("categoryName")
              ? strings("CATEGORY_TITLE")
              : strings("BACK")
          }
          title={this.state.title}
          iconName={"cart"}
          cartCount={this.state.cartCount}
          _onBackPress={this._onBackPress}
          navigation = {this.props.navigation}
          _onForwordPress={this._onPressCart.bind(this)}
        />
        {this.state.isHasProduct ? (
          <View
            style={[{
              height: 54,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: ThemeConstant.PRIMARY_COLOR,
              borderBottomWidth: 1,
              borderBottomColor: ThemeConstant.LINE_COLOR,
              paddingLeft: ThemeConstant.MARGIN_TINNY,
              paddingRight: ThemeConstant.MARGIN_TINNY,
              paddingTop: ThemeConstant.MARGIN_GENERIC,
              paddingBottom: ThemeConstant.MARGIN_GENERIC
            }, globleViewStyle]}
          >
            {this.props.navigation.getParam(
              "CATAGORY_PAGE",
              AppConstant.IS_CATAGORY
            ) === AppConstant.IS_SEARCH ? (
              <View
                style={{
                  alignSelf: "center",
                  flex: 1,
                  justifyContent: "center"
                }}
              />
            ) : (
              <Button
                clear
                title={strings("SORT")}
                titleStyle={{ color: ThemeConstant.ACTION_BAR_TEXT_COLOR, fontWeight:"bold" }}
                containerStyle={{
                  flex: 1,
                  alignSelf: "stretch",
                  justifyContent: "center",
                  alignItems:"center",
                  backgroundColor:ThemeConstant.PRIMARY_COLOR
                }}
                buttonStyle={{flex: 1, backgroundColor:ThemeConstant.PRIMARY_COLOR}}
                onPress={this._onPressSort.bind(this)}
                icon={
                  <CustomIcon2
                    name="baseline-sort"
                    size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                    color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                  />
                }
              />
            )}
            {/* {this.props.navigation.getParam(
              "CATAGORY_PAGE",
              AppConstant.IS_CATAGORY
            ) === AppConstant.IS_SEARCH ? null : (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: ThemeConstant.LINE_COLOR,
                  width: 1,
                  marginLeft: ThemeConstant.MARGIN_GENERIC,
                  marginRight: ThemeConstant.MARGIN_GENERIC
                }}
              />
            )} */}

            <Button
              clear
              title={this.state.isGrid ? strings("LIST") : strings("GRID") }
              titleStyle={{ color: ThemeConstant.ACTION_BAR_TEXT_COLOR, marginLeft:ThemeConstant.MARGIN_TINNY, fontWeight:"bold" }}
              containerStyle={{
                alignSelf:"stretch",
                flex: 1,
                alignItems:"center",
                justifyContent: "center",
                backgroundColor:ThemeConstant.PRIMARY_COLOR
              }}
               buttonStyle={{flex: 1,  backgroundColor:ThemeConstant.PRIMARY_COLOR }}
              onPress={_.debounce(this._onPressListGrid, 500)}
              icon={
                this.state.isGrid ? (
                  <CustomIcon2
                    name="list-view"
                    size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                    color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                  />
                ) : (
                  <CustomIcon2
                    name="sharp-view-grid"
                    size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                    color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                  />
                )
              }
            />
          </View>
        ) : null}

        {!this.state.loading ? (
          // <ScrollView>
          //   {this.state.banner.src ? 
          //   <CustomImage
          //     image={this.state.banner.src}
          //     dominantColor={this.state.banner.dominantColor}
          //     imagestyle={ViewStyle.bannerStyle}
          //   />
          //   : null}
            <FlatList
              refreshing={this.state.refreshing}
              data={this.state.products}
              key={this.state.isGrid ? 1 : 0}
              numColumns={this.state.isGrid ? 2 : 1}
              extraData={this.state.isGrid}
              renderItem={this.renderCategoryPage.bind(this)}
              windowSize={27}
              scrollsToTop={this.state.refreshing}
              // pagingEnabled = {true}

              initialNumToRender={5}
              keyExtractor={(item, index) => {
                return item.id + "";
              }}
              ListEmptyComponent={
                <EmptyLayoutComponent
                  message={strings("EMPTY_SELLER_PRODUCT")}
                  iconName={EmptyIconConstant.emptyCategory}
                  showButton ={true}
                  buttonText = {strings("SHOW_ALL_CATEGORY")}
                  onPress = {this.onPressShowAllCategory}
                />
              }
              ListHeaderComponent = {
                this.state.banner.src ? 
                  <CustomImage
                    image={this.state.banner.src}
                    dominantColor={this.state.banner.dominantColor}
                    imagestyle={ViewStyle.bannerStyle}
                  />
                  : null
              }
              ListFooterComponent={
                this.state.products.length < 5 ? null : this.state.products
                    .length == this.total ? (
                  <Text
                    style={{
                      alignSelf: "center",
                      justifyContent: "center",
                      height: 20,
                      margin: ThemeConstant.MARGIN_GENERIC
                    }}
                  >
                    {strings("NO_MORE_PRODUCT_FOUND")}
                  </Text>
                ) : (
                  <Spinner
                    style={{
                      alignSelf: "center",
                      justifyContent: "center",
                      width: 20,
                      height: 20,
                      margin: ThemeConstant.MARGIN_GENERIC
                    }}
                    color={ThemeConstant.ACCENT_COLOR}
                  />
                )
              }
              onEndReached={this.fetchResult.bind(this)}
              onEndReachedThreshold={0.8}
              style={{ flex: 1, alignSelf: "stretch" }}
            />
          // </ScrollView>
        ) : (
          <Loading />
        )}
        <SortContainer
          visible={this.state.sortDialogVisible}
          data={this.state.sortLabel}
          onBack={this._onSortResponseListner.bind(this)}
        />
        <ProgressDialog
          visible={this.state.isProgressLoading}
          pleaseWaitVisible={false}
        />
      </View>
    );
  }
}

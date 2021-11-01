import React from "react";
import { Alert, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { ScrollView, FlatList } from "react-native";
import SellerProductView from "../../container/seller/SellerProductView";
import CustomActionbar from "../../container/CustomActionbar";
import StringConstant from "../../app_constant/StringConstant";
import EmptyLayoutComponent from "../../container/EmptyLayoutComponent";
import Loading from "../../container/LoadingComponent";
import ProgressDialog from "../../container/ProgressDialog";
import { showErrorToast, showSuccessToast } from "../../utility/Helper";
import { strings, localeObject } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";

export default class SellerDashboardProduct extends React.Component {
  page = 1;
  userId = 0;
  total = 0;
  isInComponent = false;
  screenProps = {};
  state = {
    products: [],
    isLoading: true,
    isProgress : false,
  };
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this.isInComponent = false;
  }

  componentDidMount() {
    let { navigation, screenProps } = this.props;
    this.isInComponent = true;
    this.screenProps = screenProps;
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused())
    ];
  } 
  isFocused() {
    this.page = 1;
    this.total = 0;
    if (this.props.navigation.getParam("isUpdate", false)) {
      this.setState({ isLoading: true });
      this.props.navigation.setParams({ isUpdate: false });
    }
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      this.userId = userID;
      if (userID) {
        let url =
          AppConstant.BASE_URL +
          "seller/product/list?seller_id=" +
          userID +
          "&page=" +
          this.page;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (this.isInComponent) {
            if (response) {
              this.total = response.total_products;
              this.setState({
                products: response.products ? response.products : [],
                isLoading: false
              });
            } else {
              this.setState({
                isLoading: false
              });
            }
          }
        });
      }
    });
  }

  fetchResult = ()=>{
    if (this.total > this.state.products.length) {
      this.page = this.page + 1;
      let url =
          AppConstant.BASE_URL +
          "seller/product/list?seller_id=" +
           this.userId +
          "&page=" +
          this.page;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (this.isInComponent) {
            if (response) {
              this.total = response.total_products;
              this.setState({
                products: this.state.products.concat(response.products ? response.products : []),
                isLoading: false
              });
            } 
          }
        });
    }
  }

  onPressAddNewProduct = () => {
    this.props.navigation.navigate("StartAddProduct", {
      sellerId: this.userId
    });
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  _onPressViewProduct = product => {
    if (this.screenProps && product.status.toLowerCase() == "publish".toLowerCase()) { 
      this.screenProps.navigate("ProductPage", {
        productId: product.id,
        productName: product.title,
        productImage : product.image,
      });
    }
  };
  _onPressDeleteProduct = (product)=>{ 
    Alert.alert(
      strings("WARNING"),
      strings("DELETE_SELLER_PRODUCT_WARNING"),
      [ {text:strings("CANCEL"), style: "cancel"},
        {text:strings("YES"),  style: "cancel", onPress:()=>{
     
      this.setState({
          isProgress : true
      })
      let url = AppConstant.BASE_URL + "seller/product/delete/?seller_id="+ this.userId;
      let body = JSON.stringify({
        product_id : product.id
      })
      fetchDataFromAPI(url, "POST", body, null).then(response=>{
        this.setState({
            isProgress : false
        })
          if(response && response.success){
              showSuccessToast(response.message);
              this.setState({ isLoading: true });
              this.isFocused();
          }else{
              showErrorToast(response.message);
          }
      })
    }}]
    )  
  }

  _onPressEditProduct = product => {
    this.props.navigation.navigate("AddEditProduct", { sellerId: this.userId,productId : product.id,  productName: product.title});
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          title={strings("SELLER_PRODUCT_TITLE")}
          iconName={"add-product"}
          backwordTitle={strings("ACCOUNT_TITLE")}
          _onBackPress={this._onBackPress.bind(this)}
          _onForwordPress={this.onPressAddNewProduct.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView>
            <FlatList
              style={{ alignSelf: "stretch" }}
              data={this.state.products}
              renderItem={item => {
                return (
                  <SellerProductView
                    productData={item.item}
                    onPressEdit={this._onPressEditProduct.bind(this)}
                    onPressDelete = {this._onPressDeleteProduct.bind(this)}
                    onPressViewProduct={this._onPressViewProduct.bind(this)}
                  />
                );
              }}
              onEndReached={this.fetchResult}
              onEndReachedThreshold={0.7}
              keyExtractor={item => {
                return item.id + "";
              }}
              ListEmptyComponent={
                <EmptyLayoutComponent
                  message={strings("EMPTY_SELLER_PRODUCT")}
                />
              }
            />
          </ScrollView>
        )}
        <ProgressDialog visible={this.state.isProgress}></ProgressDialog>
      </View>
    );
  }
}

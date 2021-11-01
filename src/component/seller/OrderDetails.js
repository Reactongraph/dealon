import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { ScrollView, FlatList } from "react-native";
import SellerOrderProduct from "../../container/seller/SellerOrderProduct";
import Loading from "../../container/LoadingComponent";
import CustomActionbar from "../../container/CustomActionbar";
import StringConstant from "../../app_constant/StringConstant";
import ViewStyle from "../../app_constant/ViewStyle";
import { getOrderStatus } from "../../utility/UtilityConstant";
import { showErrorToast, showSuccessToast } from "../../utility/Helper";
import { localeObject, strings } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant"; 
import { Picker } from "native-base";
import ProgressDialog from "../../container/ProgressDialog";

export default class OrderDetails extends React.Component {
  page = 1;
  userID=0;
screenProps = {}
  state = {
    isLoading : true,
    orderDetail: {},
    billing_address : "",
    shipping_address :"",
    shipping :{},
    email :"",
    phone :"",
    order_status :[],
    selectedorderStatus :"",
    isProgress:false 
  };

  componentDidMount() {
    let { navigation, screenProps } = this.props; 
    this.screenProps =  screenProps;
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      this.userID = userID;
      if (userID) {
        console.log("OrderID", this.props.navigation.getParam("orderId"));        
        let url =
          AppConstant.BASE_URL + 
          "seller/order/" +
          this.props.navigation.getParam("orderId") +
          "?seller_id=" +
          userID +
          "&page=" +
          this.page;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (response && response.success) {
            let orderStatus = response.order_status ? response.order_status : {};
            orderStatus = Object.values(orderStatus);
            orderStatus.splice(0,0, strings("CHANGE_STATUS"));
            this.setState({
              isLoading:false,
              isProgress:false,
              orderDetail: response,
              billing_address : this._getBillingAddress(response.billing_address),
              shipping_address : this._getShippingAddress(response.shipping_address),
              shipping : response.shipping,
              email : response.billing_address ? response.billing_address.email : "",
              phone : response.billing_address ? response.billing_address.phone : "",
              order_status:orderStatus,
              selectedorderStatus : response.status
            });
          }else{
            this.setState({
              isLoading : false,
              isProgress:false
            })
            showErrorToast(response.message);
          }
        });
      }
    });
  }
  _selectOrderStatus =(status)=>{
    this.setState({
      selectedorderStatus : status
    })
}
updateOrderStatus=()=>{
  if(this.state.selectedorderStatus.toUpperCase() != this.state.orderDetail.status.toUpperCase() 
  && this.state.selectedorderStatus != strings("CHANGE_STATUS")){

    let status = Object.keys(this.state.orderDetail.order_status).find((key)=> this.state.orderDetail.order_status[key] == this.state.selectedorderStatus)
    let URL = AppConstant.BASE_URL + "seller/order/updateOrder/"
    let body = JSON.stringify({
    "order":{
      "order_id": this.props.navigation.getParam("orderId"),
      "seller_id": this.userID,
      "order_status": status,
      "old_order_status": this.state.orderDetail.status
  }
    })
    this.setState({isProgress:true})
    fetchDataFromAPI(URL, "POST", body,"").then(response=>{
     if(response.success){
       this.componentDidMount();
       showSuccessToast(response.message)
     }else{
       setTimeout(()=>{
         this.setState({isProgress:false})
       }, Platform.OS == "android" ? 0 : 500)
      showErrorToast(response.message)
     }
    })

  }else{
    showErrorToast(strings("PLEASE_SELECT_ANOTHER"))
  }
}

  _onPressViewProducts = (product)=>{
    if (this.screenProps) {
      this.screenProps.navigate("ProductPage", {
        productId: product.product_id,
        productName: product.name,
        productImage : product.product_image
      });
    }else{
      this.props.navigation.navigate("ProductPage", {
        productId: product.product_id,
        productName: product.name,
        productImage : product.product_image
      });
    }

  }

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  _getShippingAddress = (address)=>{
    if(address){
    return address.first_name  + " " + address.last_name + "\n" + address.address_1 + "\n" + address.address_2 
        + "\n" + address.city + ", " + address.state  + "\n" + address.orderStatus  + ", " + address.postcode;
    }else{
        return "";
    }
  }
  _getBillingAddress = (address)=>{
    if(address){
    return address.first_name  + " " + address.last_name + "\n" + address.address_1 + "\n" + address.address_2 
        + "\n" + address.city + ", " + address.state  + "\n" + address.orderStatus  + ", " + address.postcode;
    }else{
      return "";
    }
  }

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={ViewStyle.mainContainer}
      >
        <CustomActionbar
          _onBackPress={this._onBackPress}
          backwordTitle={strings("BACK")}
          title={strings("ORDER_DETAIL")}
          borderBottomWidth = {0}
        />

        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View style={{ flex: 1,}}>
            <Text
              style={[
                { padding: ThemeConstant.MARGIN_NORMAL, paddingBottom:ThemeConstant.MARGIN_EXTRA_LARGE,fontWeight:"normal", borderColor:ThemeConstant.LINE_COLOR_2, borderWidth:0.8, borderTopLeftRadius:20, borderTopRightRadius:20, fontSize:ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE, color:ThemeConstant.DEFAULT_SECOND_TEXT_COLOR }, globalTextStyle
              ]}
            >
              {strings("ORDER_ID") + this.state.orderDetail.order_id}
            </Text>
            <ScrollView>
              <View style={{backgroundColor:ThemeConstant.BACKGROUND_COLOR_1, }} >
                <View
                  style={[{
                    flexDirection: "row",
                    padding: ThemeConstant.MARGIN_NORMAL,
                    justifyContent:"space-between",
                    backgroundColor:ThemeConstant.BACKGROUND_COLOR
                  }, globleViewStyle]}
                >
                  <View style={{flex: 1, justifyContent:"space-between", alignItems: localeObject.isRTL ? "flex-end" : "flex-start",}}>
                    <Text style={[styles.priceDetailTitle]}>
                      {strings("ORDER_CREATED_ON")}
                    </Text>
                    <Text style={styles.headingTitle2} >{this.state.orderDetail.date}</Text>
                  </View>
                    <Text style={[ViewStyle.statusView,{ backgroundColor: this.state.orderDetail.status_bg ? this.state.orderDetail.status_bg : getOrderStatus(this.state.orderDetail.status) , alignSelf:"flex-end"}]} >{this.state.orderDetail.status}</Text>
                </View>

                <View style={styles.contentstyle}>
                  <Text style={[styles.headingTitle, globalTextStyle]}>
                    {strings("UPDATE_ORDER_STATUS")}
                  </Text>

                <View style ={globleViewStyle} >

                <Picker
                  mode="dropdown"
                  placeholder={strings("CHANGE_STATUS")}
                  // // iosIcon={<Icon name="arrow-down" />}
                  selectedValue={this.state.selectedorderStatus}
                  onValueChange={this._selectOrderStatus.bind(this)}
                  style={[styles.pickerStyle, globleViewStyle]}
                >
                  {this.state.order_status.map((orderStatus, i) => {
                    return (
                      <Picker.Item
                        key={i}
                        value={orderStatus}
                        label={orderStatus}
                      />
                    );
                  })}
                </Picker>
                <TouchableOpacity activeOpacity={1} style={styles.buttonContainer} onPress={this.updateOrderStatus.bind(this)} >
                <Text style={styles.buttonText} >{strings("SAVE")}</Text>
                </TouchableOpacity>
</View>
</View>
                <View style={styles.contentstyle}>
                  <Text style={[styles.headingTitle, globalTextStyle]}>
                    {this.state.orderDetail.line_items.length}
                    {strings("ITEM_ORDERED")}
                  </Text>
                  <FlatList
                    style={{
                      marginTop: ThemeConstant.MARGIN_GENERIC,
                      backgroundColor: ThemeConstant.BACKGROUND_COLOR
                    }}
                    data={this.state.orderDetail.line_items}
                    renderItem={item => {
                      return (
                        <SellerOrderProduct
                          productData={item.item}
                          _onPressViewProducts={this._onPressViewProducts.bind(
                            this
                          )}
                        />
                      );
                    }}
                    keyExtractor={item => {
                      return item.name + "";
                    }}
                  />
                </View>
                
                <View style={styles.contentstyle}>
                <Text style={[styles.headingTitle, globalTextStyle]} >{strings("PRICE_DETAIL")}</Text>
                  {/* <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.priceDetailTitle}>
                      {strings("")SUBTOTAL}
                    </Text>
                    <Text style={styles.priceDetailValue}>
                      {this.state.orderDetail.subtotal}
                    </Text>
                  </View> */}
                  <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.priceDetailTitle}>
                      {strings("SHIPPING_COST")}
                    </Text>
                    <Text style={styles.priceDetailValue}>
                      {this.state.orderDetail.shipping_total}
                    </Text>
                  </View>
                  <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.priceDetailTitle}>
                      {strings("ADMIN_COMMISSION")}
                    </Text>
                    <Text style={styles.priceDetailValue}>
                      {this.state.orderDetail.admin_commission}
                    </Text>
                  </View>
                  {/* <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.priceDetailTitle}>
                      {strings("")DISCOUNT}
                    </Text>
                    <Text style={styles.priceDetailValue}>
                      -{this.state.orderDetail.total_discount}
                    </Text>
                  </View> */}
                  <View style={[styles.viewRowStyle, globleViewStyle]}>
                    <Text style={styles.headingTitleLarge}>
                      {strings("ORDER_TOTAL")}
                    </Text>
                    <Text style={[styles.headingTitleLarge, {color:ThemeConstant.DEFAULT_TEXT_COLOR}]}>
                      {this.state.orderDetail.total}
                    </Text>
                  </View>
                  {this.state.orderDetail.coupon_lines &&
                  this.state.orderDetail.coupon_lines.length > 0 ? (
                    <View style={styles.couponViewStyle}>
                      <Text style={styles.priceDetailTitle}>
                        {strings("APPLIED_COUPON")}
                      </Text>
                      <FlatList
                        data={this.state.orderDetail.coupon_lines}
                        renderItem={({ item }) => {
                          return (
                            <View style={styles.couponContainer}>
                              <Text style={styles.couponCodeTextStyle}>
                                {item.code}
                              </Text>
                              <Text style={styles.couponCodeTextStyle}>
                                {item.amount}
                              </Text>
                            </View>
                          );
                        }}
                        keyExtractor={item => item.code + ""}
                      />
                    </View>
                  ) : null}

                  {this.state.orderDetail.tax_lines &&
                  this.state.orderDetail.tax_lines.length > 0 ? (
                    <View style={styles.couponViewStyle}>
                      <Text style={[styles.headingTitle, globalTextStyle]}>
                        {strings("APPLIED_TAX")}
                      </Text>
                      <FlatList
                        data={this.state.orderDetail.tax_lines}
                        renderItem={({ item }) => {
                          return (
                            <View style={styles.couponContainer}>
                              <Text style={styles.couponCodeTextStyle}>
                                {item.title}
                              </Text>
                              <Text style={styles.couponCodeTextStyle}>
                                {item.total}
                              </Text>
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index + ""}
                      />
                    </View>
                  ) : null}
                </View>

                <View style={styles.contentstyle}>
                <Text style={[styles.headingTitle, globalTextStyle]} >{strings("SHIPPING_AND_PAYMENT_INFORMATION")}</Text>
                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("CUSTOMER_DETAIL")}
                  </Text>
                  <Text>
                    {strings("EMAIL")} : {this.state.email}
                  </Text>
                  <Text style={styles.normalTextStyle}>
                    <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                      {strings("TELEPHONE_")}
                    </Text>{" "}
                    {this.state.phone}
                  </Text>
                  <Text style={[styles.headingTitleOrder,globalTextStyle ]}>
                    {strings("SHIPPING_ADDRESS")}
                  </Text>
                  <Text style={[styles.normalTextStyle,globalTextStyle]}>
                    {this.state.shipping_address}
                  </Text>
                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("BILLING_ADDRESS")}
                  </Text>
                  <Text style={[styles.normalTextStyle, globalTextStyle]}>
                    {this.state.billing_address}
                  </Text>

                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("SHIPPING_METHOD_TITLE")}
                  </Text>
                  <Text style={[styles.normalTextStyle, globalTextStyle]}>
                    {this.state.shipping.name}(
                    {this.state.shipping.value})
                  </Text>
                  <Text style={[styles.headingTitleOrder, globalTextStyle]}>
                    {strings("PAYMENT_METHOD_TITLE")}
                  </Text>
                  <Text style={[styles.normalTextStyle, globalTextStyle]}>
                    {this.state.orderDetail.payment_method}
                  </Text>
                </View>

              </View>
            </ScrollView>
          </View>
        )}
        <ProgressDialog
              visible={this.state.isProgress}
              pleaseWaitVisible={false}
            />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentstyle: {
    flex: 1,
    padding: ThemeConstant.MARGIN_NORMAL,
    alignItems:"stretch",
    marginTop:ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
  },
  couponViewStyle: {
    marginBottom: ThemeConstant.MARGIN_TINNY,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    borderTopColor: ThemeConstant.LINE_COLOR,
    borderTopWidth: 1
  },
  couponContainer: {
    flexDirection: "row",
    marginBottom: ThemeConstant.MARGIN_TINNY,
    marginTop: ThemeConstant.MARGIN_TINNY
  },
  couponCodeTextStyle: {
    alignSelf: "center",
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE
  },
  headingTitleOrder: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginTop: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "600",
    paddingBottom: ThemeConstant.MARGIN_NORMAL,
    paddingTop:ThemeConstant.MARGIN_NORMAL,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    borderBottomWidth:0.5,
    borderColor:ThemeConstant.LINE_COLOR_2
  },
  headingTitleLarge: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "600",
    paddingBottom: ThemeConstant.MARGIN_NORMAL,
    paddingTop:ThemeConstant.MARGIN_NORMAL,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
  },
  priceDetailTitle: {
    fontWeight: "200",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight:"normal",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
  },
  priceDetailValue: {
    fontWeight: "200",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight:"normal",
  },
  normalTextStyle: {
    fontWeight: "200",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight:"normal",
  },
  viewRowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    paddingTop:ThemeConstant.MARGIN_GENERIC,
  },
  headingTitle2: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color:ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight:"200"
  },
  pickerStyle: {
    flex:1,
    margin:ThemeConstant.MARGIN_GENERIC
  },
  buttonText: {
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold"
  },
  buttonContainer: {
    width :100,
    height:40,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_GENERIC,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    alignItems:"center",
    justifyContent:"center",
    alignSelf:"center"
  },
});

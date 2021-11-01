import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { ScrollView, FlatList } from "react-native";
import Loading from "../../container/LoadingComponent";
import CustomActionbar from "../../container/CustomActionbar";
import { SCREEN_WIDTH, isStringEmpty } from "../../utility/UtilityConstant";
import CardView from "react-native-cardview";
import CustomImage from "../../container/CustomImage";
import { Button } from "react-native-elements";
import CustomIcon2 from "../../container/CustomIcon2";
import { showErrorToast } from "../../utility/Helper";
import SellerOrderChart from "./SellerOrderChart";
import { strings, localeObject } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";

export default class Marketplace extends React.Component {
  screenProps = null;
  state = {
    isLoading: true,
    marketplace: {}
  };

  componentDidMount() {
    let { navigation, screenProps } = this.props;
    this.screenProps = screenProps;
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      if (userID) {
        let url = AppConstant.BASE_URL + "seller/dashboard?seller_id=" + userID;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (response && response.success) {
            if(response.recent_orders){
              response.recent_orders.forEach(element => {
                if(element.items)
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
            }

            this.setState({
              isLoading: false,
              marketplace: response
            });
          } else {
            this.setState({
              isLoading: false,
              marketplace: {}
            });
            showErrorToast(response.message);
          }
        });
      }
    });
  }

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  _onPressOrder = order => {
    this.props.navigation.navigate("OrderDetails", { orderId: order.order_id });
  };

  _onPressViewProduct = product => {
    if (this.screenProps) {
      this.screenProps.navigate("ProductPage", {
        productId: product.ID,
        productName: product.title,
        productImage : product.image
      });
    }
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;

    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          _onBackPress={this._onBackPress}
          backwordTitle={strings("ACCOUNT_TITLE")}
          title={strings("DASHBOARD_TITLE")}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView
            style={{ backgroundColor: ThemeConstant.BACKGROUND_COLOR_1 }}
          >
            <View style={styles.headerContainerStyle}>
              <View style={styles.contentstyle}>
                <Text style={styles.titleStyle}>
                  {this.state.marketplace.total_sale}
                </Text>
                <Text style={styles.subTitleStyle}>
                  {strings("LIFE_TIME_SALE")}
                </Text>
              </View>
              <View style={styles.contentstyle}>
                <Text style={styles.titleStyle}>
                  {this.state.marketplace.total_payout}
                </Text>
                <Text style={styles.subTitleStyle}>
                  {strings("TOTAL_PAYMENT")}
                </Text>
              </View>              
            </View>

            <View style={[styles.headerContainerStyle, {paddingTop:0}]}>              
              <View style={styles.contentstyle}>
                <Text style={styles.titleStyle}>
                  {this.state.marketplace.total_refund}
                </Text>
                <Text style={styles.subTitleStyle}>
                  {strings("REFUNDED_AMOUNT")}
                </Text>
              </View>
              <View style={styles.contentstyle}>
                <Text style={styles.titleStyle}>
                  {this.state.marketplace.remaining_amount}
                </Text>
                <Text style={styles.subTitleStyle}>
                  {strings("REMAINING_AMOUNT")}
                </Text>
              </View>
            </View>

            {this.state.marketplace.top_selling_products &&
            this.state.marketplace.top_selling_products.length > 0 ? (
              <View style={styles.eachItemStyle}>
                <Text style={[styles.headingTitle, globalTextStyle]}>
                  {strings("TOP_SELLING_PRODUCT")}
                </Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  inverted={localeObject.isRTL}
                  data={this.state.marketplace.top_selling_products}
                  horizontal={true}
                  renderItem={({item}) => {
                    return (
                     
                      <CardView
                      cardElevation={6}
                      cardMaxElevation={8}
                      cornerRadius={2}
                      style={styles.sellingProductStyle}
                    >
                    <TouchableOpacity activeOpacity={1}  onPress={this._onPressViewProduct.bind(this, item)} >
                      <CustomImage
                        image={item.image}
                        imagestyle={styles.productImagestyle}
                        onPress={this._onPressViewProduct.bind(this, item)}
                        dominantColor={item.dominantColor}
                      />
                      <View style={styles.productInfoTheme}>
                      <Text  style={styles.sellingProductTitle} >
                          {item.title}
                        </Text>
                        <Text style={styles.sellingProductSale}>
                          {item.qty}
                          <Text
                            style={{ color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR }}
                          >
                            {strings("SALE")}
                          </Text>
                        </Text>
                      
                      </View>
                      </TouchableOpacity>
                    </CardView>


                    );
                  }}
                  ListEmptyComponent = {
                    <Text style={styles.emptyTitle}>
                      {strings("EMPTY_TOP_SELLING_PRODUCT")}
                    </Text>}
                  keyExtractor={item => {
                    return item.ID;
                  }}
                  
                />
              </View>
            ) : null}

            <View style={styles.eachItemStyle}>
              <Text style={[styles.headingTitle, globalTextStyle]}>
                {strings("RECENT_ORDER")}
              </Text>
              {this.state.marketplace.total_orders && this.state.marketplace.total_orders.total_orders >  0 ?
              <SellerOrderChart
                orderCount = {this.state.marketplace.total_orders.total_orders}
                orderGraph = {this.state.marketplace.total_orders.order_status_count}
              />
              : null}
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={this.state.marketplace.recent_orders}
                horizontal={false}
                renderItem={({item, index}) => {
                  return (
                    <View style={{ marginBottom: ThemeConstant.MARGIN_NORMAL }}>
                    <View style={[styles.eachOrderItemContainer,globleViewStyle]}>
                      <CustomImage
                        image={item.image}
                        imagestyle={styles.imagestyle}
                        dominantColor={item.dominantColor}
                      />
                      <View style={[styles.infoTheme, {alignItems:localeObject.isRTL? "flex-end":"flex-start"}]}>
                        <Text
                          style={styles.orderTitleStyle}
                        >
                          #{item.order_id}
                        </Text>

                        <Text style={styles.headingTitle1}>
                          {item.order_date}
                        </Text>

                        <Text style={styles.headingTitle2}>
                        {item.billing_email}
                      </Text>
                      <Text style={styles.headingTitle2}>
                        {item.first_name} {item.last_name ? item.last_name : ""}
                      </Text>

                        <Text style={styles.headingTitle1}>
                          {item.item_count} {strings("ITEMS")}
                        </Text>
                       
                        <Text style={[styles.orderTitleStyle, {fontSize:ThemeConstant.DEFAULT_LARGE_TEXT_SIZE}]} >
                          {item.order_total}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.buttonContanerStyle, globleViewStyle]}>
                      <Button
                        clear
                        title={strings("DETAIL")}
                        icon={
                          <CustomIcon2
                            name="arrow-circle-right"
                            size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                            color={ThemeConstant.DEFAULT_SECOND_ICON_COLOR}
                          />
                        }
                        titleStyle={{
                          color: ThemeConstant.DEFAULT_TEXT_COLOR,
                          fontWeight: "400",
                          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                          marginHorizontal: ThemeConstant.MARGIN_TINNY ,
                        }}
                        buttonStyle={[{ alignSelf: "flex-end", flex: 1, backgroundColor:ThemeConstant.BACKGROUND_COLOR }, globleViewStyle]}
                        onPress={this._onPressOrder.bind(this, item)}
                      />
                    </View>
                  </View>
                  );
                }}
                keyExtractor={item => {
                  return item.order_id;
                }}
                ListEmptyComponent = {
                  <Text style={styles.emptyTitle}>
                    {strings("EMPTY_RECENT_ORDER")}
                  </Text>
                }
              />
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainerStyle: {
    flexDirection: "row",
    paddingTop: ThemeConstant.MARGIN_GENERIC,
    paddingBottom: ThemeConstant.MARGIN_GENERIC,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
  },
  contentstyle: {
    flex: 1,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    marginRight: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_LARGE,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: "space-between",
    alignItems: "center"
  },
  eachItemStyle: {
    marginTop: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    paddingBottom: ThemeConstant.MARGIN_NORMAL
  },
  titleStyle: {
    color: ThemeConstant.ACCENT_COLOR,
    fontSize: ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "600"
  },
  subTitleStyle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "500",
    marginTop:ThemeConstant.MARGIN_NORMAL,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    padding: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
  },
  emptyTitle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    alignSelf: "stretch",
    color :ThemeConstant.DEFAULT_TEXT_COLOR,
    // borderBottomWidth : 1,
    // borderColor: ThemeConstant.LINE_COLOR_2,
    marginTop: 30,
    paddingBottom: 30
  },
  sellingProductStyle: {
    flexWrap: "wrap",
    flexDirection: "column",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    margin: ThemeConstant.MARGIN_TINNY,
    padding:ThemeConstant.MARGIN_TINNY,
    width: SCREEN_WIDTH / 2.7 + (ThemeConstant.MARGIN_TINNY * 2) ,
  },
  sellingProductTitle: {
    flex: 1,
    textAlign: "center",
    color: ThemeConstant.ACCENT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "500"
  },
  sellingProductSale: {
    flex: 1,
    textAlign: "center",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "500"
  },
  recentOrderStyle: {
    padding: ThemeConstant.MARGIN_NORMAL,
    alignContent: "center",
    justifyContent: "center",
    borderColor: ThemeConstant.LINE_COLOR_2,
    borderTopWidth: 1,
  },
  orderTitleStyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    fontWeight : "bold"
  },
  headingTitle2: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontWeight : "bold"
  },
  headingTitle1: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3.5,
    height: SCREEN_WIDTH / 3.5
  },
  eachOrderItemContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 0.3,
    borderBottomColor: ThemeConstant.LINE_COLOR_2,
    borderTopColor: ThemeConstant.LINE_COLOR,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_GENERIC,
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_GENERIC
  },
  infoTheme: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_TINNY,
    width: SCREEN_WIDTH - SCREEN_WIDTH / 3.2
  },
  buttonContanerStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent:"space-between",
    padding: ThemeConstant.MARGIN_GENERIC,
    borderBottomWidth:1,
    borderColor:ThemeConstant.LINE_COLOR_2
  },
  productImagestyle: {
    alignSelf: "center",
    width: SCREEN_WIDTH / 2.7,
    height: SCREEN_WIDTH / 2.7
  },
  productInfoTheme: {
    flex:1,
    alignItems: "stretch",
    alignSelf: "stretch",
    justifyContent: 'center' ,
    padding: ThemeConstant.MARGIN_GENERIC,
    width: SCREEN_WIDTH / 2.7,
  },
});

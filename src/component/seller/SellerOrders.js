import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { ScrollView, FlatList } from "react-native";
import CustomActionbar from "../../container/CustomActionbar";
import StringConstant from "../../app_constant/StringConstant";
import EmptyLayoutComponent from "../../container/EmptyLayoutComponent";
import Loading from "../../container/LoadingComponent";
import { EmptyIconConstant } from "../../app_constant/EmptyIconConstant";
import CustomIcon2 from "../../container/CustomIcon2";
import { Button } from "react-native-elements";
import { CustomImage } from "../../container/CustomImage";
import { SCREEN_WIDTH, isStringEmpty, getOrderStatus } from "../../utility/UtilityConstant";
import { localeObject, strings } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";

export default class SellerOrders extends React.Component {
  page = 1;
  state = {
    orders: [],
    isLoading :true,
  };

  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      if (userID) {
        let url =
          AppConstant.BASE_URL +
          "seller/order/list?seller_id=" +
          userID +
          "&page=" +
          this.page;
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
              isLoading : false,
            });
          }else{
            this.setState({
              isLoading : false
            })
          }
        });
      }
    });
  }

  _onBackPress = () => {
    this.props.navigation.pop();
  };
  _onPressViewOrderDeatil = orderId => {
    this.props.navigation.navigate("OrderDetails", { orderId: orderId });
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          title={strings("SELLER_ORDER_TITLE")}
          backwordTitle={strings("ACCOUNT_TITLE")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView
            contentContainerStyle={{
              backgroundColor: ThemeConstant.BACKGROUND_COLOR_1
            }}
          >
            <FlatList
              data={this.state.orders}
              renderItem={({item}) => {
                return (
                  <View style={{ marginBottom: ThemeConstant.MARGIN_NORMAL }}>
                    <View style={[styles.eachItemContainer, globleViewStyle]}>
                      <CustomImage
                        image={item.image}
                        imagestyle={styles.imagestyle} 
                        dominantColor={item.dominantColor}
                      />
                      <View style={[styles.infoTheme, {alignItems:localeObject.isRTL ? "flex-end" : "flex-start"}]}>
                        <Text
                          style={styles.orderTitleStyle}
                        >
                          #{item.order_id}
                        </Text>

                        <View 
                        style={[
                          styles.statusView,
                          { backgroundColor:item.status_bg ? item.status_bg : getOrderStatus(item.status)}
                        ]}>
                        <Text
                          style={[
                            styles.statusText
                          ]}
                        >
                          {item.status.toLocaleUpperCase()}
                        </Text>
                        </View>
                        <Text style={styles.headingTitle}>
                          {item.date}
                        </Text>

                        <Text style={styles.headingTitle}>
                          {item.quantity} {strings("ITEMS")}
                        </Text>
                       
                        <Text style={[styles.orderTitleStyle, {fontSize:ThemeConstant.DEFAULT_LARGE_TEXT_SIZE}]} >
                          {item.total_price}
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
                          marginLeft:ThemeConstant.MARGIN_TINNY,
                          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
                        }}
                        buttonStyle={{ alignSelf: "flex-end", flex: 1, backgroundColor:ThemeConstant.BACKGROUND_COLOR }}
                        onPress={this._onPressViewOrderDeatil.bind(this, item.order_id)}
                      />
                    </View>
                  </View>
                );
              }}
              keyExtractor={item => {
                return item.order_id + "";
              }}
              ListEmptyComponent={
                <EmptyLayoutComponent
                  message={strings("NO_ORDER_GENERATED")}
                  iconName={EmptyIconConstant.emptyOrder}
                />
              }
            />
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoTheme: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_TINNY,
    width: SCREEN_WIDTH - SCREEN_WIDTH / 3.2
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3.5,
    height: SCREEN_WIDTH / 3.5
  },
  buttonContanerStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent:"space-between",
    padding: ThemeConstant.MARGIN_GENERIC
  },
  eachItemContainer: {
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
  orderTitleStyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    fontWeight : "bold"
  },
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
  },
  statusText:{
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontWeight: "500",
    fontStyle: "normal",
    textAlign: "center",
  },
  statusView : {
    fontSize : ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight : "500",
    fontStyle:"normal",
    textAlign : "center",
    padding :ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_TINNY,
  },
});

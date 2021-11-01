import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { ScrollView, FlatList } from "react-native";
import Loading from "../container/LoadingComponent";
import EmptyLayoutComponent from "../container/EmptyLayoutComponent";
import { EmptyIconConstant } from "../app_constant/EmptyIconConstant";
import { CustomImage } from "../container/CustomImage";
import { SCREEN_WIDTH, isStringEmpty } from "../utility/UtilityConstant";
import { Button } from "react-native-elements";
import CustomIcon2 from "../container/CustomIcon2";
import { showErrorToast, showSuccessToast } from "../utility/Helper";
import ProgressDialog from "../container/ProgressDialog";
import { setCartCount } from "../app_constant/AppSharedPref";
import { localeObject, strings } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class CustomerDashboardOrder extends React.Component {
  screenProps = null;
  isInComponent = true;
  page = 1;
  state = {
    orders: [],
    isLoading: true,
    isProgress: false,
    products: []
  };

  componentDidMount() {
    let { navigation, screenProps } = this.props;
    this.screenProps = screenProps;
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused())
    ];
   
  }
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this.isInComponent = false;
  }

  isFocused = ()=>{
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
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
      }
    // });
  }

  componentWillUpdate(newProps, newState) {
    if (
      this.props.orders != newProps.orders 
    ) {
      this.setState({
        orders: newProps.orders,
        isLoading: false
      });
    }
  }

  _onBackPress = () => {
    this.props.navigation.pop();
  };
  _onPressViewOrderDetail = orderId => {
    this.props.navigation.navigate("CustomerOrderDetails", {
      orderId: orderId
    });
  };
  _onPressViewOrderReview = products => {
      this.props.navigation.navigate("OrderProductReview", {
        products: products
      });
  };
  _onPressReOrder = orderId => {
    this.setState({
      isProgress: true
    });
    let url = AppConstant.BASE_URL + "user/reorder";
    let body = JSON.stringify({
      order_id: orderId
    });
    fetchDataFromAPI(url, "POST", body, null).then(response => {
      this.setState({
        isProgress: false
      });
      if (response && response.success) {
          setCartCount(response.count);
          this.props.navigation.navigate("CartPage");
        showSuccessToast(response.message);
      } else {
        showErrorToast(response.message);
      }
    });
  };

  onPressViewAllOrder =()=>{

  }

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        {this.state.isLoading ? (
          <Loading />
        ) : (
            <View style={{flex:1, alignItems:"stretch", justifyContent:"space-between"}} >
          <ScrollView
            style ={{flex:12}}
            contentContainerStyle={{
              backgroundColor: ThemeConstant.BACKGROUND_COLOR_1
            }}
          >
            <FlatList
              data={this.state.orders}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: ThemeConstant.MARGIN_NORMAL }}>
                    <View style={[styles.eachItemContainer, globleViewStyle]}>
                      <CustomImage
                        image={item.image}
                        imagestyle={styles.imagestyle}
                        dominantColor={item.dominantColor}
                      />
                      <View style={[styles.infoTheme, {alignItems : localeObject.isRTL ? "flex-end" : "flex-start"}]}>
                        <Text style={styles.orderTitleStyle}>#{item.id}</Text>

                        <View 
                        style={[
                          styles.statusView,
                          { backgroundColor: item.status_bg }
                        ]}
                        >
                        <Text
                          style={[
                            styles.statusText
                          ]}
                        >
                          {item.status.toLocaleUpperCase()}
                        </Text>
                        </View>
                        
                        <Text style={styles.headingTitle}>{item.date}</Text>

                        <Text
                          style={[
                            styles.orderTitleStyle,
                            { fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE }
                          ]}
                        >
                          {item.total}
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
                            color={ThemeConstant.DEFAULT_ICON_COLOR}
                          />
                        }
                        titleStyle={{
                          color: ThemeConstant.DEFAULT_TEXT_COLOR,
                          fontWeight: "400",
                          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                          backgroundColor:ThemeConstant.BACKGROUND_COLOR
                        }}
                        buttonStyle={{ alignSelf: "flex-end", flex: 1,  backgroundColor:ThemeConstant.BACKGROUND_COLOR }}
                        onPress={this._onPressViewOrderDetail.bind(
                          this,
                          item.id
                        )}
                      />
                       {!isStringEmpty(item.status) && item.status == 'completed' &&
                      <Button
                        clear
                        title={strings("REORDER")}
                        icon={
                          <CustomIcon2
                            name="repeat"
                            size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                            color={ThemeConstant.DEFAULT_ICON_COLOR}
                          />
                        }
                        titleStyle={{
                          color: ThemeConstant.DEFAULT_TEXT_COLOR,
                          fontWeight: "400",
                          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                          backgroundColor:ThemeConstant.BACKGROUND_COLOR
                        }}
                        buttonStyle={{ alignSelf: "flex-end", flex: 1,  backgroundColor:ThemeConstant.BACKGROUND_COLOR }}
                        onPress={this._onPressReOrder.bind(this, item.id)}
                       /> }
                      <Button
                        clear
                        title={strings("REVIEW").toLocaleUpperCase()}
                        icon={
                          <CustomIcon2
                            name="post-edit"
                            size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                            color={ThemeConstant.DEFAULT_ICON_COLOR}
                          />
                        }
                        titleStyle={{
                          color: ThemeConstant.DEFAULT_TEXT_COLOR,
                          fontWeight: "400",
                          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                          backgroundColor:ThemeConstant.BACKGROUND_COLOR
                        }}
                        buttonStyle={{ alignSelf: "flex-end", flex: 1, backgroundColor:ThemeConstant.BACKGROUND_COLOR }}
                        onPress={this._onPressViewOrderReview.bind(
                          this,
                          item.items
                        )}
                      />
                    </View>
                  </View>
                );
              }}
              keyExtractor={item => {
                return item.id + "";
              }}
              ListEmptyComponent={
                <EmptyLayoutComponent
                  message={strings("NO_ORDER_GENERATED")}
                  iconName={EmptyIconConstant.emptyOrder}
                />
              }
            />
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
    accentColorButtonStyle: {
        // height:35,
        alignSelf:"stretch",
        backgroundColor: ThemeConstant.ACCENT_COLOR,
        textAlign: "center",
        textAlignVertical: "center",
        color: "white",
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
        fontWeight: "500",
        padding: ThemeConstant.MARGIN_NORMAL,
        margin: ThemeConstant.MARGIN_NORMAL,
        marginTop:ThemeConstant.MARGIN_TINNY,
        marginBottom:ThemeConstant.MARGIN_TINNY
      },
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
    justifyContent: "space-between",
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
    fontWeight: "bold"
  },
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  statusText:{
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontWeight: "500",
    fontStyle: "normal",
    textAlign: "center",
  },
  statusView: {
    // flex: 1,
    justifyContent:"center",
    alignItems:"center",    
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_GENERIC,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    marginTop: ThemeConstant.MARGIN_TINNY
  }
});

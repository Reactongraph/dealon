import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
import ViewStyle from "../../app_constant/ViewStyle";
import { strings, localeObject } from "../../localize_constant/I18";
import CardView from "react-native-cardview";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";
import CustomIcon2 from "../../container/CustomIcon2";

export default class SellerTransaction extends React.Component {
  page = 1;
  state = {
    transactions: [],
    isLoading: true
  };

  componentDidMount() {
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      if (userID) {
        let url =
          AppConstant.BASE_URL +
          "seller/transaction?seller_id=" +
          userID +
          "&page=" +
          this.page;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (response) {
            this.setState({
              transactions: response.transactions,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
      }
    });
  }

  onClickTransactionDetail = transactionId => {
    this.props.navigation.navigate("TransactionDetail", {
      transactionId: transactionId
    });
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;

    return (
      <View style={ViewStyle.mainContainer}>
        <CustomActionbar
          title={strings("TRANSACTION_TITLE")}
          backwordTitle={strings("ACCOUNT_TITLE")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView>
            <FlatList
              data={this.state.transactions}
              renderItem={({ item }) => {
                return (
                  <CardView
                    cardElevation={6}
                    cardMaxElevation={8}
                    cornerRadius={2}
                    style={[
                      globleViewStyle,
                      {
                        margin: ThemeConstant.MARGIN_TINNY,
                        alignItems: "center",
                        justifyContent: "space-between"
                      }
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      style={styles.recentOrderStyle}
                      onPress={this.onClickTransactionDetail.bind(
                        this,
                        item.id
                      )}
                    >
                      <Text
                        style={[
                          styles.orderTitleStyle,
                          { textAlign: localeObject.isRTL ? "right" : "left" }
                        ]}
                      >
                        <Text style={styles.headingTitle2}>
                          {strings("TRANSACTION_ID")}
                        </Text>
                        {item.transaction_id}
                      </Text>
                      <Text style={[styles.headingTitle, globalTextStyle]}>
                        <Text style={styles.headingTitle2}>
                          {strings("TRANSACTION_DATE")}
                        </Text>
                        {item.transaction_date}
                      </Text>
                      <Text style={[styles.headingTitle, globalTextStyle]}>
                        <Text style={styles.headingTitle2}>
                          {strings("TRANSACTION_TOTAL")}
                        </Text>
                        {item.amount}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={this.onClickTransactionDetail.bind(
                        this,
                        item.id
                      )}
                    >
                      <CustomIcon2
                        name={localeObject.isRTL ? "arrow-left" : "arrow-right"}
                        size={ThemeConstant.DEFAULT_ICON_SIZE}
                      />
                    </TouchableOpacity>
                  </CardView>
                );
              }}
              keyExtractor={item => {
                return item.id + "";
              }}
              ListEmptyComponent={
                <EmptyLayoutComponent
                  message={strings("EMPTY_SELLER_TRANSACTION")}
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
  recentOrderStyle: {
    flex: 1,
    padding: ThemeConstant.MARGIN_NORMAL,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "stretch",
    borderColor: ThemeConstant.LINE_COLOR_2,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5
  },
  orderTitleStyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    fontWeight: "bold"
  },
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "200"
  },
  headingTitle2: {
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontWeight: "600"
  }
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { FlatList, ScrollView } from "react-native";
import { showAlert } from "../../utility/Helper";
import CustomActionbar from "../../container/CustomActionbar";
import StringConstant from "../../app_constant/StringConstant";
import Loading from "../../container/LoadingComponent";
import EmptyLayoutComponent from "../../container/EmptyLayoutComponent";
import { strings, localeObject } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";
import CardView from "react-native-cardview";

export default class AskQueryToAdminList extends React.Component {
  page = 1;
  userID = 0;
  totalQuery = 0;
  state = {
    isLoading: true,
    queries: [],
    userID: 0
  };

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => this.isFocused())
      // this.props.navigation.addListener("willFocus", () => this.isFocused2())
    ];
  }

  isFocused() {
    console.log("isUpdated", this.props.navigation.getParam("isUpdate", false));
    if (this.props.navigation.getParam("isUpdate", false)) {
      this.page = 1;
      this.isUpdated = true;
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
        if (userID) {
          let url =
            AppConstant.BASE_URL +
            "seller/asktoadmin/list/?seller_id=" +
            userID +
            "&page=" +
            this.page;
          fetchDataFromAPI(url, "GET", "", null).then(response => {
            if (response && response.success) {
              this.setState({
                queries: response.queries ? response.queries : [],
                userID: userID,
                isLoading: false
              });
              this.totalQuery = response.total;
            } else {
              showAlert(response.message);
            }
          });
        }
      });
    }
  }

  _getPagingQuery = () => {
    if (this.totalQuery > this.state.queries.length) {
      this.page += 1;

      let url =
        AppConstant.BASE_URL +
        "seller/asktoadmin/list/?seller_id=" +
        this.state.userID +
        "&page=" +
        this.page;
      fetchDataFromAPI(url, "GET", "", null).then(response => {
        if (response && response.success) {
          this.setState(
            {
              queries: response.queries
                ? this.state.queries.concat(response.queries)
                : this.state.queries.concat([])
            },
            () => {
              this.page += 1;
            }
          );
        } else {
          this.setState({
            isLoading: false
          });
        }
      });
    }
  };
  _openQueryDialog = () => {
    // if (this.state.userID != 0) {
    this.props.navigation.navigate("AskToAdminQuery", {
      userID: this.state.userID
    });
    // }
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
	const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          backwordTitle={strings("ACCOUNT_TITLE")}
          title={strings("SELLER_QUERY_LIST_TITLE")}
          iconName={"baseline-add_comment-24px"}
          _onBackPress={this._onBackPress.bind(this)}
          _onForwordPress={this._openQueryDialog.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView>
            <FlatList
              data={this.state.queries}
              renderItem={({ item, index }) => {
                return (
					<CardView 
					cardElevation={6}
                    cardMaxElevation={8}
                    cornerRadius={2}
                    style={[
                      globleViewStyle,
                      { alignSelf:"stretch",
                        margin: ThemeConstant.MARGIN_TINNY,
                      }
                    ]}
					>
						
                  <View style={styles.recentOrderStyle}>
                    <View
                      style={[styles.eachTextViewStyle, globleViewStyle]}
                    >
                      <Text style={styles.headingTitle2}>
                        {strings("DATE_")}
                      </Text>
                      <Text style={styles.orderTitleStyle}>
                        {item.create_date}
                      </Text>
                    </View>
                    <View
                      style={[styles.eachTextViewStyle, globleViewStyle]}
                    >
                      <Text style={styles.headingTitle2}>
                        {strings("SUBJECT_")}
                      </Text>
                      <Text style={styles.headingTitle}>{item.subject}</Text>
                    </View>
                    <View
                      style={[styles.eachTextViewStyle, globleViewStyle]}
                    >
                      <Text style={styles.headingTitle2}>
                        {strings("MESSAGE_")}
                      </Text>
                      <Text style={styles.headingTitle}>{item.message}</Text>
                    </View>
                  </View>

					</CardView>
                );
              }}
              keyExtractor={item => {
                return item.id + "";
              }}
              pagingEnabled={true}
              onEndReached={this._getPagingQuery}
              onEndReachedThreshold={0.9}
              ListEmptyComponent={
                <EmptyLayoutComponent
                  message={strings("EMPTY_QUERY_MSG")}
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
	flex:1,
    padding: ThemeConstant.MARGIN_NORMAL,
    alignContent: "center",
    justifyContent: "center",
  },
  orderTitleStyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "bold"
  },
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "200",
    flex: 1
  },
  headingTitle2: {
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontWeight: "600"
  },
  eachTextViewStyle:{
	flexDirection: "row",
	paddingTop: ThemeConstant.MARGIN_GENERIC,
	alignItems: "center",
	alignSelf: "stretch"
  }
});

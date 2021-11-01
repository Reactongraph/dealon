import React from "react";
import { View, Text, StyleSheet} from "react-native";
import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import { SCREEN_WIDTH } from "../utility/UtilityConstant";
import { ScrollView, FlatList } from "react-native";
import Loading from "./LoadingComponent";
import ThemeConstant from "../app_constant/ThemeConstant";
import EmptyLayoutComponent from "./EmptyLayoutComponent";
import { EmptyIconConstant } from "../app_constant/EmptyIconConstant";
import ItemDashboardReview from "./ItemDashboardReview";
import { strings } from "../localize_constant/I18";

export default class CustomerDashdoardReview extends React.Component {
  state = {
    isLoading: true,
    reviewList: [],
    reviewGraph: [],
    reviewCount: 1,
    averageRating: 0
  };
  componentDidMount() {
    this.callAPI();
  }

  callAPI = () => {
    // AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      let userID = AppConstant.USER_KEY;
      if (userID) {
        let url =
          AppConstant.BASE_URL +
          "user/" +
          userID +
          "/reviews/" +
          "?width=" +
          SCREEN_WIDTH;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          this.setState({
            isLoading: false
          });
          if (response) {
            this.setState({
              reviewList: response.data ? response.data : []
            });
          }
        });
      }
    // });
  };

  _writeReview = () => {
    this.props.navigation.navigate("WriteProductReview", {
      productId: this.props.navigation.getParam("productId", 0),
      productImage: this.props.navigation.getParam("productImage", ""),
      dominantColor: this.props.navigation.getParam("dominantColor", ""),
      productName: this.props.navigation.getParam("productName", "")
    });
  };
  onPressProduct = product => {
    this.props.navigation.navigate("ProductPage", {
      productId: product.product_id,
      productImage: product.image,
      dominantColor: product.dominantColor,
      productName: product.name
    });
  };
  onPressReviewsDesc = product => {
    this.props.navigation.navigate("DashboardReviewListPage", {
      product: product
    });
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View style={styles.contentStyle}>
            <View style={{ flex: 9 }}>
              <ScrollView>
                <FlatList
                  data={this.state.reviewList}
                  renderItem={({ item, index }) => (
                    <ItemDashboardReview
                      productData={item}
                      onPressProduct={this.onPressProduct.bind(this)}
                      onPressReviewsDesc={this.onPressReviewsDesc.bind(this)}
                    />
                  )}
                  keyExtractor={(item, index) => item.product_id + ""}
                  ListEmptyComponent={
                    <EmptyLayoutComponent
                    title = {strings("OOPS")}
                      message={strings("NO_REVIEW_MSG")}
                      iconName={EmptyIconConstant.emptyReview}
                    />
                  }
                />
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    padding: ThemeConstant.MARGIN_NORMAL
  },
  contentStyle: {
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "space-between"
  },
  containerStyle: {
    flex: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR_1,
    alignSelf: "stretch"
  },
  reviewButtonStyle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    fontWeight: "400",
    color: ThemeConstant.LINK_COLOR
  },
  reviewCountStyle: {
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  reviewCountStyleLarge: {
    fontSize: ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE,
    fontWeight: "bold",
    marginTop: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_TEXT_COLOR
  }
});

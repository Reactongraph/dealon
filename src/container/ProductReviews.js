import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import CustomActionbar from "./CustomActionbar";

import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import { SCREEN_WIDTH } from "../utility/UtilityConstant";
import { ScrollView, FlatList } from "react-native";
import Loading from "./LoadingComponent";
import ThemeConstant from "../app_constant/ThemeConstant";
import EmptyLayoutComponent from "./EmptyLayoutComponent";
import ItemProductReview from "./ItemProductReview";
import RatingView from "../component/RatingView";
import ReviewChart from "./ReviewChart";
import ViewStyle from "../app_constant/ViewStyle";
import { EmptyIconConstant } from "../app_constant/EmptyIconConstant";
import { strings } from "../localize_constant/I18";

export default class ProductReviews extends React.Component {
  state = {
    isLoading: true,
    reviewList: [],
    reviewGraph: [],
    reviewCount: 1,
    averageRating: 0,
  };
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => this.isFocused())
      // this.props.navigation.addListener("willFocus", () => this.isFocused2())
    ];
   this.callAPI();
  }
  isFocused() {
    console.log("isUpdated", this.props.navigation.getParam("isUpdate", false));
    if (this.props.navigation.getParam("isUpdate", false)) {
      this.callAPI();
    }
  }
  callAPI = ()=>{
    let productId = this.props.navigation.getParam("productId", 0);
    let url =
      AppConstant.BASE_URL +
      "products/" +
      productId +
      "/reviews?width=" +
      SCREEN_WIDTH;
    fetchDataFromAPI(url, "GET", "", null).then(response => {
      this.setState({
        isLoading: false
      });
      if (response) {
        this.setState({
          reviewList: response.reviews ? response.reviews : [],
          reviewGraph: response.review_graph ? response.review_graph : {},
          reviewCount :response.rating_count ,
          averageRating : response.average_rating
        });
      }
    });
  }

  _writeReview = () => {
    this.props.navigation.navigate("WriteProductReview", {
      productId: this.props.navigation.getParam("productId", 0),
      productImage: this.props.navigation.getParam("productImage", ""),
      dominantColor: this.props.navigation.getParam("dominantColor", ""),
      productName: this.props.navigation.getParam("productName", ""),
      star_rating : this.props.navigation.getParam("star_rating", true),
      star_rating_required : this.props.navigation.getParam("star_rating_required", true),
    });
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  }
  
  render() {
    console.log("Rating=>>>", this.props.navigation.getParam("star_rating", "tyt"));
    console.log("Rating=>>>", this.props.navigation.getParam("star_rating_required", "rt"));
    return (
      <View
        style={ViewStyle.mainContainer}
      >
        <CustomActionbar
          title={strings("PRODUCT_REVIEWS")}
          backwordTitle={strings("BACK")}
          _onBackPress={this._onBackPress.bind(this)}
          backwordImage = "close-cross"
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View
            style={styles.contentStyle}
          >
            <View style={{ flex: 9, padding: ThemeConstant.MARGIN_GENERIC }}>
              <ScrollView>
                {this.state.reviewList.length > 0 ? 
                <View style={ViewStyle.reviewStyle}>
                  <ReviewChart
                    reviewCount={this.state.reviewCount}
                    reviewGraph={this.state.reviewGraph}
                  />
                  <View style={ViewStyle.reviewDescriptionStyle}>
                    <View style={{ width: 60 }}>
                      <RatingView
                        ratingValue={this.state.averageRating}
                        iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
                        ratingViewVisible = {true}
                      />
                    </View>
                    <Text style={[styles.reviewCountStyle, { marginLeft: 0 }]}>
                      {strings("BASED_ON")}
                    </Text>

                    <Text style={styles.reviewCountStyleLarge}>
                      {this.state.reviewCount +
                        " " +
                        (this.state.reviewCount > 0
                          ? strings("REVIEWS")
                          : strings("REVIEW"))}
                    </Text>
                    <Text
                      style={[styles.reviewButtonStyle, { marginLeft: 0 }]}
                      onPress={this._writeReview.bind(this)}
                    >
                      {strings("ADD_YOUR_REVIEWS")}
                    </Text>
                  </View>
                </View>
                 : <View></View> }

                <FlatList
                  data={this.state.reviewList}
                  renderItem={({ item, index }) => (
                    <ItemProductReview reviewItem={item} />
                  )}
                  keyExtractor={(item, index) => item.id + ""}
                  ListEmptyComponent={
                    <EmptyLayoutComponent
                      message={strings("NO_REVIEW_MSG")}
                      iconName={EmptyIconConstant.emptyReview}
                    />
                  }
                />
              </ScrollView>
            </View>
            <Text style={styles.buttonStyle} onPress={this._writeReview.bind()}>
              {strings("WRITE_REVIEWS")}
            </Text>
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
  contentStyle : {
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "space-between"
  },
  containerStyle : {
    flex: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
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

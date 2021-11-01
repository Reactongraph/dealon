import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
import ItemDashboardReview from "./ItemDashboardReview";
import { CustomImage } from "./CustomImage";
import { strings } from "../localize_constant/I18";

export default class DashboardReviewListPage extends React.Component {
  state = {
    isLoading: true,
    product: {}
  };
  componentDidMount() {
    this.setState({
      isLoading: false,
      product: this.props.navigation.getParam("product", {})
    });
  }

  onPressProduct = () => {
    let product = this.state.product;
    this.props.navigation.navigate("ProductPage", {
      productId: product.product_id,
      productImage: product.image,
      dominantColor: product.dominantColor,
      productName: product.name
    });
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <View style={styles.containerStyle}>
        <CustomActionbar
          title={strings("PRODUCT_REVIEWS_DETAIL")}
          backwordTitle={strings("BACK")}
          _onBackPress={this._onBackPress.bind(this)}
          backwordImage="close-cross"
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View style={styles.contentStyle}>
            <View style={{ flex: 9, padding: ThemeConstant.MARGIN_GENERIC }}>
              <ScrollView>
                <View style={styles.product_container}>
                  <CustomImage
                    image={this.state.product.image}
                    imagestyle={styles.imagestyle}
                    onPress={this.onPressProduct.bind(this)}
                    dominantColor={this.state.product.dominantColor}
                  />
                  <TouchableOpacity
                    style={styles.productInfoTheme}
                    activeOpacity={1}
                  >
                    <Text style={styles.firstTextTheme} numberOfLines={2}>
                      {this.state.product.name}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <RatingView
                        ratingValue={this.state.product.average_rating}
                        iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
                      />
                      <Text style={styles.secondaryTextTheme}>
                        {this.state.product.rating_count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.headingTitle} >{strings("YOUR_REVIEWS")}</Text>

                <FlatList
                  data={this.state.product.reviews}
                  renderItem={({ item, index }) => (
                    <ItemProductReview reviewItem={item} />
                  )}
                  keyExtractor={(item, index) => item.product_id + ""}
                  ListEmptyComponent={
                    <EmptyLayoutComponent
                      message={strings("NO_REVIEW_MSG")}
                      iconName={EmptyIconConstant.emptyReview}
                    />
                  }
                />
              </ScrollView>
            </View>
            {/* <Text style={styles.buttonStyle} onPress={this._writeReview.bind()}>
              {strings("")WRITE_REVIEWS}
            </Text> */}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headingTitle: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    padding: ThemeConstant.MARGIN_NORMAL,
    borderBottomWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2
  },
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
    justifyContent: "space-between",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
  },
  containerStyle: {
    flex: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR_1,
    alignSelf: "stretch"
  },
  product_container: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems:"center" ,
    marginTop:ThemeConstant.MARGIN_NORMAL
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: 80,
    height: 80
  },
  productInfoTheme: {
    alignSelf: "stretch",
    justifyContent:"center",
    alignItems:"flex-start",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_TINNY,
    width:SCREEN_WIDTH-160
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: "200",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginBottom: ThemeConstant.MARGIN_GENERIC
  },
  secondaryTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
  },
  secondaryTextHeadingTheme: {
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold"
  }
});

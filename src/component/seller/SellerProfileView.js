import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Rating } from "react-native-elements";
import Loading from "../../container/LoadingComponent";
import { ScrollView, FlatList } from "react-native";
import StringConstant from "../../app_constant/StringConstant";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { SCREEN_WIDTH, isStringEmpty, sendEmail, callNumber } from "../../utility/UtilityConstant";
import HomeProductLayout from "../../container/HomeProductLayout";
import CustomActionbar from "../../container/CustomActionbar";
import { CustomImage } from "../../container/CustomImage";
import ItemSellerReview from "../../container/seller/ItemSellerReviews";
import { strings, localeObject } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";
import CustomIcon2 from "../../container/CustomIcon2";
import SocialLinkImage from "../../container/seller/SocialLInkImage";
import StarRating from "react-native-star-rating";

export default class SellerProfileView extends React.Component {
  sellerId = 0;
  sellerName = "";
  screenProps = {};
  state = {
    seller: {},
    isLoading: true,
    isProgress: false
  };

  componentDidMount() {
    this.sellerId = this.props.navigation.getParam("sellerId", 0);
    let { navigation, screenProps } = this.props;
    this.screenProps =
      screenProps && screenProps.navigate ? screenProps : navigation;
    let url =
      AppConstant.BASE_URL +
      "seller/shop?seller_id= " +
      this.sellerId +
      "&width=" +
      SCREEN_WIDTH;

    fetchDataFromAPI(url, "GET", "", null).then(response => {
      if (response.success) {
        this.setState({
          seller: response,
          isLoading: false
        });
        this.sellerName = response.seller_name;
      }
    });
  }
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  _onPressProduct = product => {
    if (this.screenProps) {
      this.screenProps.navigate("ProductPage", {
        productId: product.id,
        productName: product.name,
        productImage: product.banner_image
      });
    }
  };
  onPressSeller = () => {
    if (this.screenProps) {
      this.screenProps.navigate("CategoryProductPage", {
        sellerId: this.sellerId,
        sellerName: this.sellerName,
        CATAGORY_PAGE: AppConstant.IS_SELLER
      });
    }
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    const social =
      typeof this.state.seller.social == "object" &&
      JSON.stringify(this.state.seller.social) != "[]"
        ? this.state.seller.social
        : {};
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          _onBackPress={this._onBackPress}
          backwordTitle={strings("BACK")}
          title={strings("SELLER_PROFILE_VIEW")}
        />

        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView
            contentContainerStyle={{
              backgroundColor: ThemeConstant.BACKGROUND_COLOR_1
            }}
          >
            {/* Seller Profile Logo Info */}
            <View style={[styles.product_container, globleViewStyle]}>
              <CustomImage
                image={this.state.seller.shop_logo}
                imagestyle={styles.imagestyle}
                onPress={this.onPressSeller.bind(this)}
                dominantColor={this.state.seller.dominantColor}
              />

              <View style={[styles.productInfoTheme, {alignItems:localeObject.isRTL? "flex-end":"flex-start",}]}>
                <Text style={styles.headingTextTheme} numberOfLines={2}>
                  {this.state.seller.seller_name}
                </Text>
                <Text style={styles.secondaryTextTheme} numberOfLines={1} onPress={()=>{
                  sendEmail(this.state.seller.email)
                }} >
                  {this.state.seller.email}
                </Text>
                <Text style={styles.secondaryTextTheme}  onPress={()=>{
                  callNumber(this.state.seller.phone);
                }

                } >
                  {this.state.seller.phone}
                </Text>
                <Text style={styles.secondaryTextTheme}>
                  {this.state.seller.location}
                </Text>
              </View>
            </View>
            <View style={styles.ratingTopViewStyle}>
              <View style={styles.ratingViewStyle}>
                <Text style={styles.ratingTitleHeading}>
                  {strings("PRICE")}
                </Text>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={ThemeConstant.RATING_SIZE_MEDIUM}
                  rating={parseFloat(this.state.seller.average_rating.price)}
                  reversed={localeObject.isRTL}
                  fullStarColor={ThemeConstant.RATING_COLOR}
                  emptyStarColor="gray"
                />
              </View>
              <View style={styles.ratingViewStyle}>
                <Text style={styles.ratingTitleHeading}>
                  {strings("VALUE")}
                </Text>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={ThemeConstant.RATING_SIZE_MEDIUM}
                  rating={parseFloat(this.state.seller.average_rating.value)}
                  reversed={localeObject.isRTL}
                  fullStarColor={ThemeConstant.RATING_COLOR}
                  emptyStarColor="gray"
                />
              </View>
              <View style={styles.ratingRightViewStyle}>
                <Text style={styles.ratingTitleHeading}>
                  {strings("QUALIY")}
                </Text>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={ThemeConstant.RATING_SIZE_MEDIUM}
                  rating={parseFloat(this.state.seller.average_rating.quality)}
                  reversed={localeObject.isRTL}
                  fullStarColor={ThemeConstant.RATING_COLOR}
                  emptyStarColor="gray"
                />
              </View>
            </View>
            {JSON.stringify(social) != "{}" && (
              <View
                style={[
                  globleViewStyle,
                  { justifyContent: "center" },
                  styles.aboutShopView
                ]}
              >
                {!isStringEmpty(social.facebook) && (
                  <SocialLinkImage
                    iconName="facebook"
                    iconColor="#3b5998"
                    link={social.facebook}
                  />
                )}
                {!isStringEmpty(social.twitter) && (
                  <SocialLinkImage
                    iconName="twitter"
                    iconColor="#00acee"
                    link={social.twitter}
                  />
                )}
                {!isStringEmpty(social.google_plus) && (
                  <SocialLinkImage
                    iconName="google-plus"
                    iconColor="#db4a39"
                    link={social.google_plus}
                  />
                )}
                {!isStringEmpty(social.linkedin) && (
                  <SocialLinkImage
                    iconName="linked-in"
                    iconColor="#0e76a8"
                    link={social.linkedin}
                  />
                )}
                {!isStringEmpty(social.youtube) && (
                  <SocialLinkImage
                    iconName="youtube"
                    iconColor="#c4302b"
                    link={social.youtube}
                  />
                )}
              </View>
            )}

            <View style={styles.aboutShopView}>
              <Text style={[styles.aboutShopHeading, globalTextStyle]}>
                {strings("ABOUT_SHOP")}
              </Text>
              <Text style={globalTextStyle} >{this.state.seller.about}</Text>
            </View>
            <View style={[styles.aboutShopView, { padding: 0 }]}>
              <View
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                  },
                  globleViewStyle
                ]}
              >
                <Text style={styles.headingTextStyle}>
                  {strings("RECENT_PRODUCT_FROM_SELLER")}
                </Text>
                <Text
                  style={styles.accentHeadingTextStyle}
                  onPress={this.onPressSeller.bind(this)}
                >
                  {strings("VIEW_ALL")}
                </Text>
              </View>
              <HomeProductLayout
                data={this.state.seller.recent_products}
                onPressOut={this._onPressProduct}
                randomNum={2}
              />
            </View>

            <View style={styles.aboutShopView}>
              <Text style={[styles.aboutShopHeading, globleViewStyle]}>
                {strings("RECENT_REVIEW")}
              </Text>
              <FlatList
                data={this.state.seller.recent_reviews}
                keyExtractor={(item, index) => index.toString()}
                renderItem={item => {
                  return <ItemSellerReview ratingData={item.item} />;
                }}
                ListEmptyComponent={
                  <Text style={styles.aboutShopHeading}>
                    {strings("NO_REVIEW_MSG")}
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
  product_container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    padding: ThemeConstant.MARGIN_GENERIC
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 2.5,
    height: SCREEN_WIDTH / 2.5
  },
  productInfoTheme: {
    flex: 1,
    justifyContent: "flex-start",
    marginHorizontal: ThemeConstant.MARGIN_GENERIC
  },
  headingTextTheme: {
    fontWeight: "bold",
    // alignSelf: "stretch",
    // textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR
  },
  secondaryTextTheme: {
    // alignSelf: "stretch",
    // textAlign: "left",
    marginTop: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR
  },
  ratingTopViewStyle: {
    flex: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: ThemeConstant.LINE_COLOR,
    padding: ThemeConstant.MARGIN_GENERIC,
    borderWidth: 1
  },
  aboutShopView: {
    flex: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderBottomColor: ThemeConstant.LINE_COLOR,
    padding: ThemeConstant.MARGIN_GENERIC,
    paddingBottom: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_NORMAL
  },
  aboutShopHeading: {
    fontWeight: "bold",
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  ratingViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: ThemeConstant.LINE_COLOR,
    borderRightWidth: 1,
    paddingTop: ThemeConstant.MARGIN_GENERIC,
    paddingBottom: ThemeConstant.MARGIN_GENERIC
  },
  ratingRightViewStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: ThemeConstant.MARGIN_GENERIC,
    paddingBottom: ThemeConstant.MARGIN_GENERIC
  },
  ratingTitleHeading: {
    fontWeight: "bold",
    margin: ThemeConstant.MARGIN_TINNY,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR
  },
  headingTextStyle: {
    fontWeight: "bold",
    alignSelf: "stretch",
    textAlign: "left",
    margin: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  accentHeadingTextStyle: {
    padding: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_NORMAL,
    paddingLeft: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
    fontWeight: "100",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR_2
  }
});

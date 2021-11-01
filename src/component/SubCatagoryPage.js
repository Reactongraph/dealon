import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import CustomActionbar from "../container/CustomActionbar";
import { ScrollView } from "react-native";
import Loading from "../container/LoadingComponent";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { SCREEN_WIDTH, isStringEmpty } from "../utility/UtilityConstant";
import ProductView from "../container/ProductView";
import ThemeConstant from "../app_constant/ThemeConstant";
import { CustomImage } from "../container/CustomImage";
import CustomIcon2 from "../container/CustomIcon2";
import { showErrorToast } from "../utility/Helper";
import { strings, localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import EmptyLayoutComponent from "../container/EmptyLayoutComponent";
import EmptyIconConstant from "../app_constant/EmptyIconConstant";
import IndicatorViewPager from "../container/viewpager/IndicatorViewPager";
import PagerDotIndicator from "../container/viewpager/indicator/PagerDotIndicator";
import ProductContext from "../context/ProductContext";

export default class SubCatagoryPage extends React.Component {
  viewInComponent = false;
  state = {
    isLoading :true,
    banners: [],
    products: [],
    subCategory: [],
    cartCount :"0",
    autoPlayEnable : true,
    message :""
  };
  componentWillUnmount() {
    viewInComponent = false;
    this.subs.forEach(sub => sub.remove());
  }
  isFocused = () => {
    AsyncStorage.getItem(AppConstant.PREF_CART_COUNT).then(cartCount => {
      this.setState({
        cartCount: cartCount ? cartCount : "0"
      });
    });
    this.setState({
      autoPlayEnable : true,
    })
  };
  isBlur = ()=>{
    this.setState({
      autoPlayEnable : false
    })
  }
  componentDidMount() {
    viewInComponent = true;
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused()),
      this.props.navigation.addListener("willBlur", () => this.isBlur())
    ];
    this.setState({
      title: this.props.navigation.getParam("categoryName", "Category")
    });
    let url = AppConstant.BASE_URL;
    let dbId = this.props.navigation.getParam("categoryId");
    url +=
      "category/products/" +
      this.props.navigation.getParam("categoryId") +
      "?width=" +
      SCREEN_WIDTH +
      "&page=" +
      1 +
      "&orderby=";
    fetchDataFromAPI(url, "GET", "", null, dbId).then(response => {
      if (viewInComponent) {
        this.setState({
          isLoading: false,
          message: response.message
        });
        if (response.success) {
          this.setState({
            products: response.products,
            banners: response.banner,
            subCategory:response.children,
          });
        }else{
          showErrorToast(response.message);
        }
      }
    });
  }
  onPressCategory = (category) => {
    this.setState({
      autoPlayEnable : true,
    })
    if (!category.child || category.child == 0) {
      this.props.navigation.navigate("CategoryProductPage", {
        categoryId: category.id,
        categoryName: category.name
      });
    } else {
      this.props.navigation.navigate("SubCatagoryPage", {
        categoryId: category.id,
        categoryName: category.name
      });
    }
  };
  onPressProduct = (product) => {
    this.setState({
      autoPlayEnable : true,
    })
    let productName = product.title ? product.title : product.name;
    this.props.navigation.navigate("ProductPage", {
      productId: product.id,
      productName: productName,
      productImage : product.image
    });
  };

  onPressViewAll = ()=>{
    this.setState({
      autoPlayEnable : true,
    })
    this.props.navigation.navigate("CategoryProductPage", {
      categoryId:this.props.navigation.getParam("categoryId"),
      categoryName: this.props.navigation.getParam("categoryName")
    });
  }

  onBackPress = () => {
    this.props.navigation.pop();
  };

  _renderDotIndicator() {
    return (
      <PagerDotIndicator
        pageCount={this.state.banners.length}
        hideSingle={true}
        dotStyle={{width:6, height:6,  borderRadius:3, backgroundColor: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR, borderColor: ThemeConstant.ACCENT_COLOR, borderWidth:1}}
        selectedDotStyle={{ width:10, height:10,  borderRadius:5, borderColor: ThemeConstant.ACCENT_COLOR, borderWidth:1 , backgroundColor: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR }}
      />
    );
  }
  _onPressCart = () => {
    this.setState({
      autoPlayEnable : true,
    })
    if (this.screenProps) {
      this.screenProps.navigate("CartPage");
    } else {
      this.props.navigation.navigate("CartPage");
    }
  }
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR_1 }}
      >
        <CustomActionbar
          title={this.props.navigation.getParam("categoryName", "Category")}
          backwordTitle={strings("BACK")}
          _onBackPress={this.onBackPress.bind()}
          navigation = {this.props.navigation}
          iconName={"cart"}
          cartCount={this.state.cartCount}
          _onForwordPress={this._onPressCart.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView>
            {this.state.banners && this.state.banners.length > 0 ? (
              <IndicatorViewPager
                autoPlayEnable={this.state.autoPlayEnable}
                style={styles.viewPagerStyle}
                indicator={this._renderDotIndicator()}
              >
                {this.state.banners.map((banner, index) => {
                  return (
                    <View style={styles.bannerStyle} key={index + ""}>
                      <Image
                        style={[styles.bannerStyle]}
                        source={{ uri: banner.src }}
                        resizeMode={"cover"}
                      />
                    </View>
                  );
                })}
              </IndicatorViewPager>
            ) : null}

            {this.state.subCategory && this.state.subCategory.length > 0 &&
            <View style={styles.viewStyle}>
              <Text style={[styles.headingTextSize, globalTextStyle]}>
                {strings("EXPLORE", {"category":this.props.navigation.getParam("categoryName", "Category")})}
              </Text>
              <FlatList
                data={this.state.subCategory}
                keyExtractor={(item, index) =>  index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.eachSubCategory, globleViewStyle]}
                    activeOpacity={0.6}
                    onPress={this.onPressCategory.bind(this, item)}
                  >
                    <View
                      style={[{alignItems: "center" }, globleViewStyle]}
                    >
                    {isStringEmpty(item.icon)?
                      <CustomIcon2
                      name= "category"
                      size={ThemeConstant.CATEGORY_ICON_SIZE}
                      color = {ThemeConstant.ACCENT_COLOR}
                    />
                    :
                      <CustomImage
                        imagestyle={{
                          width: ThemeConstant.CATEGORY_ICON_SIZE,
                          height: ThemeConstant.CATEGORY_ICON_SIZE
                        }}
                        image={item.icon}
                      />
                    }
                      <Text
                        style={styles.subcategoryHeading}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <CustomIcon2
                      name= {localeObject.isRTL ? "arrow-left" : "arrow-right"}
                      size={ThemeConstant.DEFAULT_ICON_SIZE}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            }

            {this.state.products && this.state.products.length> 0 &&
            <View style={styles.viewStyle}>
              <View
                style={[{
                  justifyContent: "space-between",
                  alignItems: "center"
                }, globleViewStyle]}
              >
                <Text style={styles.headingTextSize}>
                  {strings("PRODUCTS")}
                </Text>
                <Text style={styles.viewAll} onPress = {this.onPressViewAll.bind(this)} >
                  {strings("VIEW_ALL").toUpperCase()}
                </Text>
              </View>

              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.state.products}
                inverted = {localeObject.isRTL}
                renderItem={({ item, index }) => {
                  return (
                    <ProductContext.Provider value ={{onPressProduct:this.onPressProduct.bind(this)}}>

                    <ProductView
                      productData={item}
                      // onPressOut={this.onPressProduct.bind(this)}
                      isCategory = {true}
                    />
                    </ProductContext.Provider>
                    
                  );
                }}
                keyExtractor={(item, index) =>  index + ""}
              />
            </View>
        }

        {
          this.state.products && this.state.products.length == 0 && this.state.subCategory && this.state.subCategory.length == 0 && this.state.banners && this.state.banners.length ==0 &&
          <EmptyLayoutComponent
                  message={this.state.message}
                  iconName={EmptyIconConstant.emptyCategory}
                  showButton ={false}
                  title = {strings("OOPS")}
                />
        }
          </ScrollView>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bannerStyle: {
    height: ThemeConstant.BANNER_SIZE,
    width: SCREEN_WIDTH
  },
  viewPagerStyle: {
    height: ThemeConstant.BANNER_SIZE,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
  },
  viewStyle: {
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR
  },
  eachSubCategory:{
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ThemeConstant.MARGIN_NORMAL,
    borderColor: ThemeConstant.LINE_COLOR_2,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
  },
  subcategoryHeading:{
    paddingHorizontal: ThemeConstant.MARGIN_NORMAL,
    textAlignVertical: "center",
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "400"
  },
  headingTextSize: {
    paddingHorizontal: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    fontWeight: "500",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR
  },
  viewAll: {
    padding: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_GENERIC,
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
    fontWeight: "100",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR_2
  }
});

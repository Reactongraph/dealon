/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  BackHandler,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ThemeConstant from '../app_constant/ThemeConstant';
import CustomActionbar from '../container/CustomActionbar';
import AppConstant from '../app_constant/AppConstant';
import { fetchDataFromAPI } from '../utility/APIConnection';
import { setCartCount, setCategoryData } from '../app_constant/AppSharedPref';
import { showErrorToast, showWarnToast } from '../utility/Helper';
import DemoData from '../utility/DemoData';
import { localeObject, strings } from '../localize_constant/I18';
import HomePageProducts from '../container/HomePageProducts';
import FeaturedCatagory from '../container/FeaturedCatagory';
import IndicatorViewPager from '../container/viewpager/IndicatorViewPager';
import PagerDotIndicator from '../container/viewpager/indicator/PagerDotIndicator';
import ProductContext from '../context/ProductContext';
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  'window',
);

/**
 * Webkul Software.
 *
 * @category Webkul
 * @package Webkul_Mobikul_React_WooCommerce
 * @author Webkul
 * @copyright Copyright (c) 2010-2018 WebkulSoftware Private Limited (https://webkul.com)
 * @license https://store.webkul.com/license.html
 *
 */
export default class HomePage extends React.Component {
  subs;
  _willBlurSubscription;
  screenProps = {};
  isUpdateFlatList = false;
  backPressExist = false;
  state = {
    homePagedata: {},
    banners: [],
    homeProduct: [],
    featuredCategory: [],
    cartCount: '0',
    isReferesh: false,
    autoPlayEnable: true,
    loadingEnable: true,
  };

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this._willBlurSubscription.forEach(sub => sub.remove());
    // BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }
  _handleBackPress = () => {
    if (!this.backPressExist) {
      this.backPressExist = true;
      showWarnToast(strings('EXIT_APP_MSG'));
      setTimeout(() => {
        this.backPressExist = false;
      }, 2000);
      return true;
    } else {
      return false;
    }
  };
  isFocused = () => {
    this.backPressExist = false;
    AsyncStorage.getItem(AppConstant.PREF_CART_COUNT).then(cartCount => {
      this.setState({
        cartCount: cartCount ? cartCount : '0',
        autoPlayEnable: true,
      });
    });
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
  };
  isBlur = () => {
    this.setState({
      autoPlayEnable: false,
    });
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  };
  componentDidMount() {
    this.screenProps = this.props.screenProps;
    this.backPressExist = false;
    console.log('-------------------------------------------');
    this.subs = [
      this.props.navigation.addListener('willFocus', () => this.isFocused()),
      this.screenProps.addListener('willFocus', () => this.isFocused()),
    ];
    this._willBlurSubscription = [
      this.props.navigation.addListener('willBlur', () => this.isBlur()),
      this.screenProps.addListener('willBlur', () => this.isBlur()),
    ];

    if (this.props.screenProps.getParam('homePagedata', null)) {
      let homePagedata = this.props.screenProps.getParam('homePagedata');

      homePagedata.homepage_products = homePagedata.homepage_products.filter(
        item => item.products.length >= 1,
      );
      this.setState({
        cartCount: homePagedata.count ? homePagedata.count : '0',
        homePagedata: homePagedata,
        banners: homePagedata.banners,
        homeProduct: homePagedata.homepage_products,
        featuredCategory: homePagedata.featured_category,
        loadingEnable: false,
      });
    } else {
      let homePagedata = DemoData.homePageData;
      if (homePagedata) {
        this.setState({
          cartCount: homePagedata.count ? homePagedata.count : '0',
          homePagedata: homePagedata,
          banners: homePagedata.banners,
          homeProduct: homePagedata.homepage_products,
          featuredCategory: homePagedata.featured_category,
        });
      }
      this.callAPI();
    }
  }
  callAPI = () => {
    AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
      let url = AppConstant.BASE_URL + 'homepage/?width=' + SCREEN_WIDTH; // * 3
      if (islogedIn && islogedIn == 'true') {
        url += '&customer_id=';
      } else {
        url += '&guest_id=';
      }
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
        url += userId ? userId : '';
        fetchDataFromAPI(url, 'GET', '', null, 1).then(result => {
          if (
            result &&
            (result.success || typeof result.success === 'undefined')
          ) {
            setCartCount(result.count);
            let homePagedata = result;
            homePagedata.homepage_products = homePagedata.homepage_products.filter(
              item => item.products.length >= 1,
            );
            this.setState({
              cartCount: homePagedata.count ? homePagedata.count : '0',
              homePagedata: homePagedata,
              banners: homePagedata.banners,
              homeProduct: homePagedata.homepage_products,
              featuredCategory: homePagedata.featured_category,
              isReferesh: false,
              loadingEnable: false,
            });
          } else {
            showErrorToast(result.message);
            this.setState({
              isReferesh: false,
            });
          }
        });
      });
    });
  };

  onPressProduct = product => {
    this.screenProps.navigate('ProductPage', {
      productId: product.id,
      productName: product.name,
      productImage: product.banner_image,
    });
  };
  onPressFeatureCategory = category => {
    this.screenProps.navigate('CategoryProductPage', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };
  onPressViewAllProduct = (type, title) => {
    this.screenProps.navigate('CategoryProductPage', {
      type: type,
      title: title,
      CATAGORY_PAGE: AppConstant.IS_HOME_PRODUCT,
    });
  };
  _onPressCart = () => {
    this.screenProps.navigate('CartPage');
  };

  _onPressFilter = () => {
    this.screenProps.navigate('FiltersProduct');
  };

  onPressNotification = () => {
    this.screenProps.navigate('NotificationPage');
  };

  onPressSearch = () => {
    this.screenProps.navigate('SearchProductPage');
  };

  _onPressBanner = banner => {
    if (banner.banner_type == 'product') {
      this.screenProps.navigate('ProductPage', {
        productId: banner.id,
      });
    } else if (banner.banner_type == 'category') {
      this.screenProps.navigate('CategoryProductPage', {
        categoryId: banner.id,
      });
    }
  };

  onReferesh = () => {
    this.setState({
      isReferesh: true,
    });
    this.callAPI();
  };

  _renderDotIndicator() {
    return (
      <PagerDotIndicator
        pageCount={this.state.banners.length}
        hideSingle={true}
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
          borderColor: ThemeConstant.ACCENT_COLOR,
          borderWidth: 1,
        }}
        selectedDotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          borderColor: ThemeConstant.ACCENT_COLOR,
          borderWidth: 1,
          backgroundColor: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
        }}
      />
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: ThemeConstant.BACKGROUND_COLOR_1,
          position: 'relative'
        }}>



        <CustomActionbar
          title={AppConstant.APP_NAME}
          iconName={'cart'}
          forwordTitle={strings('CART_TITLE')}
          _onForwordPress={this._onPressCart.bind(this)}
          cartCount={this.state.cartCount}
          navigation={this.screenProps}
          onPressSearch={this.onPressSearch.bind(this)}
          onPressNotification={this.onPressNotification.bind(this)}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[ThemeConstant.ACCENT_COLOR, ThemeConstant.ACCENT_COLOR]}
              onRefresh={this.onReferesh.bind(this)}
              refreshing={this.state.isReferesh}
            />
          }>


          <FeaturedCatagory
            featuredCategory={this.state.featuredCategory}
            onPressFeatureCategory={this.onPressFeatureCategory}
          />

          {this.state.banners && this.state.banners.length > 0 ? (
            <IndicatorViewPager
              autoPlayEnable={this.state.autoPlayEnable}
              style={styles.viewPagerStyle}
              indicator={this._renderDotIndicator()}
              inverted={localeObject.isRTL}>
              {this.state.banners.map((banner, index) => {
                return (
                  <View style={styles.bannerStyle} key={index.toString()}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={this._onPressBanner.bind(this, banner)}>
                      <Image
                        style={[
                          styles.bannerStyle,
                          { backgroundColor: banner.dominantColor },
                        ]}
                        source={{ uri: banner.image }}
                        // resizeMode={"contain"}
                        resizeMode={'cover'}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </IndicatorViewPager>
          ) : null}

          <ProductContext.Provider
            value={{ onPressProduct: this.onPressProduct }}>
            <HomePageProducts
              homeProduct={this.state.homeProduct}
              onPressViewAllProduct={this.onPressViewAllProduct}
              onPressProduct={this.onPressProduct}
            />
          </ProductContext.Provider>




        </ScrollView>

        <View style={{ position: 'absolute', right: 20, bottom: 20, }}>
          <TouchableOpacity
            onPress={() => this._onPressFilter()}
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              backgroundColor: '#fff',
              borderRadius: 100,

            }}>
            <Image style={{ width: 20, height: 20, }} source={require('../../resources/images/ic_filter.png')} />
          </TouchableOpacity>
        </View>



        {this.state.loadingEnable ? (
          <Text
            style={[
              styles.viewAll,
              { position: 'absolute', alignSelf: 'center', top: 50 },
            ]}>
            {strings('LOADING')}
          </Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bannerStyle: {
    height: ThemeConstant.BANNER_SIZE,
    width: SCREEN_WIDTH - 2 * ThemeConstant.MARGIN_TINNY,
  },
  viewPagerStyle: {
    height: ThemeConstant.BANNER_SIZE,
    margin: ThemeConstant.MARGIN_TINNY,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    // borderWidth: 1,
    borderColor: ThemeConstant.LINE_COLOR,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderRadius: 1,
  },
  headingTextSize: {
    paddingHorizontal: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    fontWeight: 'bold',
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
  },
  viewAll: {
    padding: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_NORMAL,
    paddingLeft: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
    fontWeight: '100',
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR_2,
  },
});

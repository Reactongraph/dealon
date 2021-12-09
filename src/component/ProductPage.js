import AsyncStorage from "@react-native-community/async-storage";
import _ from 'lodash';
import { Button } from 'native-base';
import React from 'react';
import { Alert, Dimensions, FlatList, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight, Share } from 'react-native';
import FastImage from 'react-native-fast-image';
import firebase from 'react-native-firebase';
import AnalylticsConstant from '../app_constant/AnalylticsConstant';
import AppConstant from '../app_constant/AppConstant';
import { setCartCount, setGuestId } from '../app_constant/AppSharedPref';
import TextStyle from '../app_constant/TextStyle';
import ThemeConstant from '../app_constant/ThemeConstant';
import ViewStyle from '../app_constant/ViewStyle';
import CustomActionbar from '../container/CustomActionbar';
import CustomIcon2 from '../container/CustomIcon2';
import { CustomImage } from '../container/CustomImage';
import GridProduct from '../container/GridProduct';
import GroupProductItem from '../container/GroupProductItem';
import ItemProductReview from '../container/ItemProductReview';
import Loading from '../container/LoadingComponent';
import MaintenanceLayout from '../container/MaintenanceLayout';
import { ProductCustomOption } from '../container/ProductCustomOption';
import ProgressDialog from '../container/ProgressDialog';
import ReviewChart from '../container/ReviewChart';
import PagerDotIndicator from "../container/viewpager/indicator/PagerDotIndicator";
import IndicatorViewPager from "../container/viewpager/IndicatorViewPager";
import { insertAllProductInCart, insertProductInCart } from '../database/AllSchemas';
import { localeObject, strings } from '../localize_constant/I18';
import { localizeStyle } from '../localize_constant/LocalizeViewConstant';
import { fetchDataFromAPI } from '../utility/APIConnection';
import { showErrorToast, showSuccessToast, showToast } from '../utility/Helper';
import { isStringEmpty, stringToNumber, _getconnection } from '../utility/UtilityConstant';
import AutoHeightWebView from './AutoHeightWebview';
import RatingView from './RatingView';
import NativeMethod from './ShareProductBridge'
import VideoPlayer from "../container/VideoPlayer.js";

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

export default class ProductPage extends React.Component {
  componentVisible = true;
  productId = '';
  state = {
    isLoading: true,
    banners: [],
    product: {},
    quantity: 1,
    cartCount: '0',
    selectedVariation: null,
    isProgressLoading: false,
    isMaintenance: false,
    selectedAtrribute: null,
    viewReviews: true,
    children: [],
    showDominant: 1,
  };
  _renderDotIndicator() {
    return (
      <PagerDotIndicator
        pageCount={
          this.state.banners.length > 1 ? this.state.banners.length + 1 : 0
        }
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
        hideSingle={true}
      />
    );
  }
  componentDidMount() {
    this.componentVisible = true;
    this.productId = this.props.navigation.getParam('productId');
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this.isFocused()),
    ];
    this.loadProduct(false);
    let analyticsObject = {};
    analyticsObject[AnalylticsConstant.ID] = this.productId;
    analyticsObject[AnalylticsConstant.NAME] = this.props.navigation.getParam(
      "productName",
      ""
    );
    firebase
      .analytics()
      .logEvent(AnalylticsConstant.PRODUCT_PAGE, analyticsObject);
  }

  loadProduct = isRetry => {
    this.setState({
      isLoading: true,
    });
    let productId = this.props.navigation.getParam('productId');
    let url =
      AppConstant.BASE_URL +
      'products/' +
      productId +
      '/?width=' +
      SCREEN_WIDTH;

    fetchDataFromAPI(url, 'GET', '', AppConstant.TOKEN, productId).then(
      response => {
        this.setState({
          isLoading: false,
        });
        console.log("Check Viral Response  " + JSON.stringify(response))
        console.log("check curren user login id  >>> " + this.userId + " seller id >>>> " + response.product.seller_id)
        if (response && response.success !== false) {
          response.product.in_stock =
            response.product.stock_status == 'instock' ? true : false;
          let product = response.product;
          if (product.attributes && product.attributes.length > 0) {
            product.attributes = product.attributes.filter(
              item => item.variation,
            );
          }
          let banners = response.product.images;
          if (banners.length > 0) {
            banners.forEach(item => {
              item.showDominant = true;
            });
          }
          this.setState({
            banners: banners,
            product: product,
            isMaintenance: false,
            isFav: product.isFav
          });
        } else {
          this.setState({
            isMaintenance: true,
          });
        }
      },
    );
  };

  isFocused = () => {
    AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
      this.isLogin = islogedIn;
    });
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
      this.userId = userId ? userId : '';
    });
    AsyncStorage.getItem(AppConstant.PREF_CART_COUNT).then(cartCount => {
      this.setState({
        cartCount: cartCount ? cartCount : '0',
      });
    });
    if (this.productId != this.props.navigation.getParam('productId')) {
      this.loadProduct();
    }
  };

  _onPressViewDescription = description => {
    this.props.navigation.navigate('ProductDescription', {
      description: description,
    });
  };
  _onPressProductReviews = () => {
    this.props.navigation.navigate('ProductReviews', {
      productId: this.props.navigation.getParam('productId'),
      productImage: this.state.product.image,
      dominantColor: this.state.product.dominantColor,
      productName: this.state.product.title,
      star_rating: this.state.product.star_rating,
      star_rating_required: this.state.product.star_rating_required,
    });
  };
  _onPressViewReviews = () => {
    this.setState({
      viewReviews: !this.state.viewReviews,
    }, () => {
      setTimeout(() => {
        this.scrollViewRef.scrollToEnd()
      }, 500)
    });
  };

  _onPressProductAdditionalInfo = attributes => {
    this.props.navigation.navigate('ProductAdditionalInformation', {
      attributes: attributes,
    });
  };

  // Quantity Listner
  removeQuantityListner = () => {
    if (this.state.quantity != 1) {
      this.setState({
        quantity: this.state.quantity - 1,
      });
    }
  };
  addQuantityListner = () => {
    if (this.state.selectedVariation && (this.state.selectedVariation.backordered || this.state.selectedVariation.stock_quantity > this.state.quantity)) {
      this.setState({
        quantity: this.state.quantity + 1,
      });
    } else if (!this.state.selectedVariation && (this.state.product.manage_stock != 'yes' || this.state.quantity < stringToNumber(this.state.product.stock))) {
      this.setState({
        quantity: this.state.quantity + 1,
      });
    } else {
      showErrorToast(strings("OUT_OF_STOCK_QUANTITY_ADD"))
    }
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };
  _onPressCart = () => {
    this.props.navigation.navigate('CartPage');
  };

  _onPressAddToCart = isBuyNow => {

    if (this.state.product.seller_id == this.userId) {
      showErrorToast("you can't add to cart or buy your own products.")
    } else {
      if (
        this.state.product.product_type !== 'simple' &&
        this.state.product.attributes &&
        this.state.product.attributes.length > 0 &&
        !this.state.selectedVariation
      ) {
        if (this.state.selectedAtrribute) {
          showErrorToast(strings("PURCHASABLE_CHOICE_ERROR"));
        } else {
          showErrorToast(strings("NO_ATTRIBUTE_SELECTED_ERROR"));
        }
        return;
      } else if (
        this.state.selectedVariation &&
        !this.state.selectedVariation.purchaseable
      ) {
        showErrorToast(strings("PURCHASABLE_CONTACT_ERROR"));
      } else if (
        this.state.selectedVariation &&
        (!this.state.selectedVariation.in_stock && !this.state.selectedVariation.backordered && this.state.selectedVariation.stock_quantity <= 0)
      ) {
        showErrorToast(strings("OUT_OF_STOCK_CONTACT_ERROR"));
      } else if (this.state.product.product_type == 'simple' && this.state.product.manage_stock == 'yes' && stringToNumber(this.state.product.stock) <= 0) {
        showErrorToast(strings("SIMPLE_PRODUCT_OUT_OF_STOCK_CONTACT_ERROR"));
      } else {
        let product = this.state.product;
        let productId = product.id;
        let quantity = this.state.quantity;
        if (product.product_type == 'grouped' && product.children) {
          let qty = '';
          let ids = '';
          product.children.forEach(element => {
            if (element.qty && element.qty > 0) {
              if (isStringEmpty(ids)) {
                ids = ids.concat(element.id + '');
                qty = qty.concat(element.qty + '');
              } else {
                ids = ids.concat(',' + element.id);
                qty = qty.concat(',' + element.qty);
              }
            }
          });
          if (isStringEmpty(qty)) {
            showErrorToast(strings("EMPTY_QUANTITY_ERROR"));
            return;
          } else {
            productId = ids;
            quantity = qty;
          }
        }

        let url = AppConstant.BASE_URL + 'cart?request=add';
        let cartObj = {
          product_id: productId,
          variations: this.state.selectedAtrribute
            ? this.state.selectedAtrribute
            : {},
          variation_id: this.state.selectedVariation
            ? this.state.selectedVariation.id
            : product.variation_id,
          quantity: quantity,
          customer_id: this.isLogin && this.isLogin == 'true' ? this.userId : '',
          guest_id: !this.isLogin || this.isLogin !== 'true' ? this.userId : '',
        };
        let analyticsObject = {};
        analyticsObject[AnalylticsConstant.ID] = productId;
        analyticsObject[AnalylticsConstant.VARIATION] = this.state
          .selectedAtrribute
          ? this.state.selectedAtrribute
          : {};
        firebase
          .analytics()
          .logEvent(AnalylticsConstant.ADD_TO_CART, analyticsObject);
        let body = JSON.stringify(cartObj);
        _getconnection().then(isConnected => {
          if (isConnected) {
            this.setState({
              isProgressLoading: true,
            });
            fetchDataFromAPI(url, 'POST', body, null).then(response => {
              setTimeout(() => {
                this.setState({
                  isProgressLoading: false,
                });
              }, Platform.OS == "ios" ? 700 : 1);

              if (response && response.success) {
                showSuccessToast(response.message);
                if (!isStringEmpty(response.guest_id)) {
                  setGuestId(response.guest_id);
                  this.userId = response.guest_id;
                }
                setCartCount(response.count).then(result => {
                  if (isBuyNow) {
                    this._onPressCart();
                  }
                });
                this.setState({
                  cartCount: response.count,
                });
              } else {
                showErrorToast(response.message);
              }
            });
          } else {
            this.insertIntoOfflineCart(cartObj, product);
          }
        });
      }
    }




  };

  insertGroupProductInCart(cartObject, product) {
    console.log('Carts=>>>', cartObject);
    let carts = [];
    product.children.forEach(element => {
      if (element.qty && element.qty > 0) {
        let cart = {
          product_id:
            typeof element.id == 'string' ? parseInt(element.id) : element.id,
          composite_key: element.id + '_' + '0',
          quantity:
            typeof element.qty == 'string'
              ? parseInt(element.qty)
              : element.qty,
          variation_id: 0,
          customer_id: cartObject.customer_id,
          guest_id: cartObject.guest_id,
        };
        carts.push(cart);
      }
    });
    insertAllProductInCart(carts).then(result => {
      if (result) {
        showSuccessToast(strings("OFFLINE_CART_SUCCESS_MESSAGE"));
      } else {
        showErrorToast(strings("OFFLINE_CART_ERROR_MESSAGE"));
      }
    });

    console.log('Carts=>>>', carts);
  }

  insertIntoOfflineCart = (cart, product) => {
    Alert.alert(
      strings("OFFLINE_ERROR"),
      strings("ASK_OFFLINE_ADD_TO_CART_MSG"),
      [
        {
          text: strings("CANCEL"),
          style: 'cancel',
        },
        {
          text: strings("YES_ADD_TO_CART"),
          style: 'cancel',
          onPress: () => {
            if (product.product_type == 'grouped' && product.children) {
              this.insertGroupProductInCart(cart, product);
            } else {
              cart.product_id =
                typeof cart.product_id == 'string'
                  ? parseInt(cart.product_id)
                  : cart.product_id;
              cart.variations =
                typeof cart.variations == 'object'
                  ? JSON.stringify(cart.variations)
                  : cart.variations;
              cart.variation_id = !cart.variation_id
                ? 0
                : typeof cart.variation_id == 'string'
                  ? parseInt(cart.variation_id)
                  : cart.variation_id;
              cart.quantity =
                typeof cart.quantity == 'string'
                  ? parseInt(cart.quantity)
                  : cart.quantity;
              cart.customer_id = cart.customer_id;
              cart.guest_id = cart.guest_id;
              cart.composite_key = cart.product_id + '_' + cart.variation_id;
              insertProductInCart(cart).then(result => {
                if (result) {
                  showSuccessToast(strings("OFFLINE_CART_SUCCESS_MESSAGE"));
                } else {
                  showErrorToast(strings("OFFLINE_CART_ERROR_MESSAGE"));
                }
              });
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  _onPressRelatedProductAddToCart = product => {
    if (product.product_type != 'simple') {
      this.onPressViewProduct(product);
    } else {
      this.setState({
        isProgressLoading: true,
      });
      let url = AppConstant.BASE_URL + 'cart?request=add';
      let cartObj = {
        product_id: product.id,
        variations: product.variation,
        variation_id: product.variation_id,
        quantity: 1,
        customer_id: this.isLogin && this.isLogin == 'true' ? this.userId : '',
        guest_id: !this.isLogin || this.isLogin !== 'true' ? this.userId : '',
      };
      let body = JSON.stringify(cartObj);
      let analyticsObject = {};
      analyticsObject[AnalylticsConstant.ID] = product.id;
      analyticsObject[AnalylticsConstant.NAME] = product.name;
      firebase
        .analytics()
        .logEvent(AnalylticsConstant.ADD_TO_CART, analyticsObject);
      _getconnection().then(isConnected => {
        if (isConnected) {
          fetchDataFromAPI(url, 'POST', body, null).then(response => {
            setTimeout(() => {
              this.setState({
                isProgressLoading: false,
              });
            }, Platform.OS == "ios" ? 700 : 1);

            if (response && response.success) {
              showSuccessToast(response.message);
              if (!isStringEmpty(response.guest_id)) {
                setGuestId(response.guest_id);
              }
              setCartCount(response.count);
              this.setState({
                cartCount: response.count,
              });
            } else {
              showErrorToast(response.message);
            }
          });
        } else {
          this.insertIntoOfflineCart(cartObj);
        }
      });
    }
  };

  _selectedVariation = (selectedVariation, selectedAtrribute) => {
    if (selectedVariation) console.log('Images=>>', selectedVariation.image);
    let banners = selectedVariation
      ? selectedVariation.image
      : this.state.product.images;
    if (banners.length > 0) {
      banners.forEach(item => {
        item.showDominant = true;
      });
    } else {
      banners = [];
    }

    this.setState({
      selectedVariation: selectedVariation,
      selectedAtrribute: selectedAtrribute,
      banners: banners,
    });
  };
  onpressSeller = () => {
    if (this.state.product.seller_id && this.state.product.seller_id != "1") {
      this.props.navigation.navigate("SellerProfileView", {
        sellerId: this.state.product.seller_id
      });
    }
  }
  _onPressExternalProductLink = () => {
    if (!isStringEmpty(this.state.product.product_url)) {
      Linking.canOpenURL(this.state.product.product_url).then(supported => {
        if (supported) {
          Linking.openURL(this.state.product.product_url);
        } else {
          showErrorToast(strings("NO_URL_ADDED_YET"));
        }
      });
    } else {
      showErrorToast(strings("NO_URL_ADDED_YET"));
    }
  };
  onPressViewProduct = product => {
    this.props.navigation.push('ProductPage', {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
    });
  };
  _onPressZoomProduct = index => {
    this.props.navigation.navigate('ZoomImageContainer', {
      images: this.state.banners,
      productName: this.props.navigation.getParam('productName', ''),
      index: index,
    });
  };
  _writeReview = () => {
    this.props.navigation.navigate('WriteProductReview', {
      productId: this.props.navigation.getParam('productId', 0),
      productImage: this.state.product.image,
      dominantColor: this.state.product.dominantColor,
      productName: this.state.product.title,
      star_rating: this.state.product.star_rating,
      star_rating_required: this.state.product.star_rating_required,
      isFromProductPage: true,
    });
  };

  updateQuantity = (product, qty) => {
    product['qty'] = qty;
  };

  _onclickChatWithSeller = () => {
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
      this.props.navigation.navigate('ChatRoom', { userID: userId, sellerId: this.state.product.seller_id, title: this.state.product.seller });
    });
  }

  _onClickAddToWishlist = () => {
    let url = this.state.product.isFav ? AppConstant.BASE_URL + "wishlist-remove-product" : AppConstant.BASE_URL + "wishlist-add-product"
    let body = { product_id: this.state.product.id }
    fetchDataFromAPI(url, "POST", JSON.stringify(body), null).then((response) => {
      if (url.includes("add") && response.success) {
        this.state.product.isFav = true
        showToast(response.message);
      } else {
        this.state.product.isFav = false
        showToast(response.message);
      }
      this.setState({
        product: this.state.product
      })
    })
  }

  _onClickShareProduct = () => {
    let url = AppConstant.BASE_URL + "share-wishlist-product"
    let body = { product_id: this.state.product.id }
    fetchDataFromAPI(url, "POST", JSON.stringify(body), null).then((response) => {
      if (response) {
        NativeMethod.shareProduct(response);
      } else {
        showToast(response);
      }
    })
  }

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={ViewStyle.mainContainer}>
        <CustomActionbar
          backwordTitle={strings("BACK")}
          title={this.props.navigation.getParam('productName', '')}
          iconName={'cart'}
          navigation={this.props.navigation}
          cartCount={this.state.cartCount}
          _onBackPress={this._onBackPress}
          _onForwordPress={this._onPressCart.bind(this)}
        />

        {this.state.isLoading ? (
          <View>
            <CustomImage
              image={this.props.navigation.getParam('productImage', '')}
              imagestyle={styles.bannerStyle}
            />
            <Loading style={{ height: 50, width: SCREEN_WIDTH }} />
          </View>
        ) : (
            <View
              style={{
                flex: 1,
                alignSelf: 'stretch',
              }}>
              {this.state.isMaintenance ? (
                <MaintenanceLayout
                  onPress={this.loadProduct.bind(this, true)}
                  message={strings("SERVER_MAINTENANCE")}
                />
              ) : (
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch',
                      justifyContent: 'space-between',
                      // backgroundColor: ThemeConstant.BACKGROUND_COLOR_2
                    }}>
                    <View
                      style={{
                        flex: 8,
                        backgroundColor: ThemeConstant.BACKGROUND_COLOR_1,
                      }}>
                      <ScrollView showsVerticalScrollIndicator={false} ref={(ref) => this.scrollViewRef = ref} >
                        <IndicatorViewPager
                          autoPlayEnable={false}
                          style={{
                            height: SCREEN_WIDTH,
                            padding: ThemeConstant.MARGIN_TINNY,
                            backgroundColor: ThemeConstant.BACKGROUND_COLOR,
                          }}
                          initialPage={this.state.banners && localeObject.isRTL ? this.state.banners.length - 1 : 0}
                          indicator={this._renderDotIndicator()}
                          inverted={localeObject.isRTL}
                        >
                          {this.state.banners.map((banner, index) => {
                            return (
                              <View key={index + ''}>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  style={styles.bannerStyle}
                                  onPress={_.debounce(
                                    this._onPressZoomProduct.bind(this, index),
                                    300,
                                  )}>
                                  <FastImage
                                    source={{ uri: banner.src }}
                                    style={[
                                      styles.bannerStyle,
                                      {
                                        backgroundColor:
                                          this.state.showDominant &&
                                            banner.dominantColor &&
                                            banner.showDominant
                                            ? banner.dominantColor
                                            : 'white',
                                      },
                                    ]}
                                    onLoadEnd={() => {
                                      banner.showDominant = false;
                                      this.setState({
                                        showDominant: this.state.showDominant + 1,
                                      });
                                    }}
                                    resizeMode={'contain'}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          })}
                          <VideoPlayer />
                        </IndicatorViewPager>
                        <View style={[styles.productViewStyle, { marginTop: 0 }]}>
                          <Text
                            style={[
                              styles.headingStyleLeft,
                              {
                                fontWeight: 'normal',
                                color: ThemeConstant.DEFAULT_TEXT_COLOR,
                                fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                              },
                              globalTextStyle
                            ]}>
                            {this.state.product.title}
                          </Text>

                          <View style={[styles.priceViewStyle, globleViewStyle]}>
                            <Text style={[TextStyle.priceTextStyle]}>
                              {this.state.selectedVariation
                                ? this.state.selectedVariation.price
                                : this.state.product.price}
                            </Text>
                            {this.state.selectedVariation ? (
                              this.state.selectedVariation.price ===
                                this.state.selectedVariation.regular_price ? null : (
                                  <Text style={[TextStyle.regularPriceTextStyle]}>
                                    {this.state.selectedVariation.regular_price}
                                  </Text>
                                )
                            ) : this.state.product.price ===
                              this.state.product.regular_price ? null : (
                                  <Text style={TextStyle.regularPriceTextStyle}>
                                    {this.state.product.regular_price}
                                  </Text>
                                )}
                            {isStringEmpty(
                              this.state.product.discount_percent,
                            ) ? null : (
                                <Text style={[TextStyle.discountText]}>
                                  {this.state.product.discount_percent +
                                    ' ' +
                                    strings("OFF")}{' '}
                                </Text>
                              )}
                          </View>

                          {this.state.product.reviews_allowed ? (
                            <View style={[styles.priceViewStyle, globleViewStyle]}>
                              <RatingView
                                ratingValue={this.state.product.average_rating}
                                iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
                              />
                              {this.state.product.wc_review_count &&
                                this.state.product.wc_review_count != 0 ? (
                                  <Text
                                    style={[styles.reviewCountStyle, { marginRight: localeObject.isRTL ? ThemeConstant.MARGIN_GENERIC : 0 }]}
                                    onPress={this._onPressProductReviews.bind(this)}>
                                    {this.state.product.wc_review_count +
                                      ' ' +
                                      (this.state.product.wc_review_count > 1
                                        ? strings("REVIEWS")
                                        : strings("REVIEW"))}
                                  </Text>
                                ) : null}

                              <Text
                                style={styles.reviewButtonStyle}
                                onPress={this._writeReview.bind(this)}>
                                {strings("ADD_YOUR_REVIEWS")}
                              </Text>
                            </View>
                          ) : null}

                          {this.state.selectedVariation ||
                            this.state.product.product_type != 'variable' ? (
                              <Text
                                style={
                                  [this.state.selectedVariation
                                    ? (this.state.selectedVariation.backordered || this.state.selectedVariation.stock_quantity > 0)
                                      ? styles.inStockStyle
                                      : styles.outOfStockStyle
                                    : (this.state.product.manage_stock != "yes" || stringToNumber(this.state.product.stock) > 0)
                                      ? styles.inStockStyle
                                      : styles.outOfStockStyle, globalTextStyle]
                                }
                                numberOfLines={1}>
                                {this.state.selectedVariation
                                  ? (this.state.selectedVariation.backordered || this.state.selectedVariation.stock_quantity > 0)
                                    ? this.state.product?.stock + strings("INSTOCK")
                                    : strings("OUT_OF_STOCK")
                                  : (this.state.product.manage_stock != "yes" || stringToNumber(this.state.product.stock) > 0)
                                    ? this.state.product?.stock + strings("INSTOCK")
                                    : strings("OUT_OF_STOCK")}
                              </Text>
                            ) : null}

                          {AppConstant.IS_MARKETPLACE ? (
                            <Text style={globalTextStyle} onPress={this.onpressSeller.bind(this)} >
                              <Text style={[styles.headingStyleLeft, globalTextStyle]}>
                                {strings("SELLER_NAME")}
                              </Text>
                              {this.state.product.seller}
                            </Text>
                          ) : null}
                          {AppConstant.IS_MARKETPLACE && !isStringEmpty(this.state.product.shop_name) ? (
                            <Text style={globalTextStyle} onPress={this.onpressSeller.bind(this)}>
                              <Text style={[styles.headingStyleLeft, globalTextStyle]}>
                                {strings("SHOP_NAME")}
                              </Text>
                              {this.state.product.shop_name}
                            </Text>
                          ) : null}
                        </View>

                        {/* share and wishlit button */}
                        <View style={styles.quantityContainerStyle}>

                          <View style={styles.shareAndWishlistConatinerStyle}>
                            <TouchableOpacity onPress={this._onClickShareProduct.bind(this)} style={{ flex: 1 }}>
                              <View style={styles.shareBtnStyle}>
                                <CustomIcon2
                                  name="share"
                                  style={{ marginStart: 10, marginEnd: 10 }}
                                  size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                                  color={ThemeConstant.DEFAULT_ICON_COLOR}
                                />
                                <Text style={styles.shareAndFavTextStyle}>{strings("share")}</Text>
                              </View>
                            </TouchableOpacity>
                            <View style={{ width: 1, backgroundColor: ThemeConstant.PRIMARY_COLOR }} />
                            <TouchableOpacity onPress={this._onClickAddToWishlist.bind(this)} style={{ flex: 1 }}>
                              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                <CustomIcon2
                                  name="heart-fill"
                                  ref="fav_icon"
                                  style={{ marginStart: 10, marginEnd: 10 }}
                                  size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                                  color={this.state.product.isFav ? ThemeConstant.RED_COLOR : ThemeConstant.DEFAULT_ICON_COLOR}
                                />
                                <Text style={styles.shareAndFavTextStyle}>{strings("add_to_wishlist")}</Text>
                              </View>
                            </TouchableOpacity>

                          </View>

                        </View>

                        {isStringEmpty(
                          this.state.product.short_description,
                        ) ? null : (
                            <View
                              style={{
                                marginTop: ThemeConstant.MARGIN_NORMAL,
                                backgroundColor: ThemeConstant.BACKGROUND_COLOR,
                              }}>
                              <Text
                                style={[
                                  styles.headingStyleLeft,
                                  { padding: ThemeConstant.MARGIN_NORMAL },
                                  globalTextStyle
                                ]}>
                                {strings("PRODUCT_SHORT_DESCRIPTION")}
                              </Text>
                              <AutoHeightWebView
                                // default width is the width of screen
                                // if there are some text selection issues on iOS, the width should be reduced more than 15 and the marginTop should be added more than 35
                                style={{
                                  width:
                                    Dimensions.get('window').width -
                                    2 * ThemeConstant.MARGIN_GENERIC,
                                  marginLeft: ThemeConstant.MARGIN_GENERIC,
                                  marginRight: ThemeConstant.MARGIN_GENERIC,
                                }}
                                customScript={`document.body.style.background = 'white';`}
                                // add custom CSS to the page's <head>
                                customStyle={`
                                         * {
                                           font-family: 'Times New Roman';
                                         }
                                         p {
                                           font-size: 12px;
                                         }
                                     `}
                                // either height or width updated will trigger this
                                onSizeUpdated={size => {
                                  console.log(size.height);
                                }}
                                /*
                                 use local or remote files
                                 to add local files:
                                 add baseUrl/files... to android/app/src/assets/ on android
                                add baseUrl/files... to project root on iOS
                                */
                                files={[
                                  {
                                    href: 'cssfileaddress',
                                    type: 'text/css',
                                    rel: 'stylesheet',
                                  },
                                ]}
                                // baseUrl now contained by source
                                // 'web/' by default on iOS
                                // 'file:///android_asset/web/' by default on Android
                                // or uri
                                source={{
                                  html: (localeObject.isRTL) ?
                                    "<html dir=\"rtl\" lang=\"\"><body>" + this.state.product.short_description + "</body></html>"
                                    : this.state.product.short_description
                                }}
                                // disables zoom on ios (true by default)
                                zoomable={false}

                              />
                            </View>
                          )}

                        {/* Group Ptoduct */}

                        {this.state.product.product_type == 'grouped' ? (
                          <View style={styles.productViewStyle}>
                            <Text
                              style={[
                                styles.headingStyleLeft,
                                { marginBottom: ThemeConstant.MARGIN_NORMAL },
                                globalTextStyle
                              ]}>
                              {strings("ADD_GROUP_ITEMS")}
                            </Text>
                            <FlatList
                              data={this.state.product.children}
                              renderItem={({ item, index }) => {
                                return (
                                  <GroupProductItem
                                    productData={item}
                                    position={index}
                                    onPressViewProduct={this.onPressViewProduct.bind(
                                      this,
                                    )}
                                    updateQuantity={this.updateQuantity.bind(this)}
                                  />
                                );
                              }}
                              keyExtractor={(item, index) => index + ''}
                            />
                          </View>
                        ) : (
                            <View style={styles.productViewStyle}>
                              {this.state.product.product_type !== 'external' ? (
                                <View style={styles.productViewStyle}>
                                  <Text style={[styles.headingStyleLeft, globalTextStyle]}>
                                    {strings("QUANTITY")}
                                  </Text>
                                  <View style={[styles.quantityContainerStyle, globleViewStyle]}>
                                    <Button
                                      onPress={this.removeQuantityListner.bind(this)}
                                      style={styles.buttonStyle}>
                                      <CustomIcon2
                                        name="minus"
                                        color={ThemeConstant.ACCENT_BUTTON_TEXT_COLOR}
                                        size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                                      />
                                    </Button>
                                    <Text style={styles.headingStyle}>
                                      {this.state.quantity +
                                        ' ' +
                                        strings("UNITS")}
                                    </Text>
                                    <Button
                                      style={styles.buttonStyle}
                                      onPress={this.addQuantityListner.bind(this)}>
                                      <CustomIcon2
                                        name="plus"
                                        color={ThemeConstant.ACCENT_BUTTON_TEXT_COLOR}
                                        size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                                      />
                                    </Button>
                                  </View>
                                </View>
                              ) : (
                                  <View>
                                    <Text
                                      style={styles.signUpButtonStyle}
                                      onPress={_.debounce(
                                        this._onPressExternalProductLink,
                                        400,
                                      )}>
                                      {this.state.product.button_text}
                                    </Text>
                                  </View>
                                )}
                            </View>
                          )}
                        {/* custom Option List  */}
                        {this.state.product.product_type == 'variable' &&
                          this.state.product.attributes &&
                          this.state.product.attributes.length > 0 ? (
                            <View style={styles.productViewStyle}>
                              <Text
                                style={[
                                  styles.headingStyleLeft,
                                  { marginBottom: ThemeConstant.MARGIN_LARGE },
                                  globalTextStyle
                                ]}>
                                {strings("CHOOSE_OPTIONS")}
                              </Text>
                              <ProductCustomOption
                                attributesList={this.state.product.attributes}
                                variationList={this.state.product.variations}
                                selectedAttributeList={{}}
                                selectedVariation={this._selectedVariation.bind(this)}
                              />
                            </View>
                          ) : null}

                        {/* {this.state.product.is_chat_enable ? ( */}
                        {true ? (
                          <View>
                            <TouchableOpacity
                              activeOpacity={1}
                              style={[
                                styles.descriptionStyle,
                                { marginTop: ThemeConstant.MARGIN_NORMAL },
                                globleViewStyle
                              ]}
                              onPress={this._onclickChatWithSeller.bind(this)}>
                              <Text style={styles.descriptionTextStyle}>
                                {strings("CHAT_WITH_SELLER")}
                              </Text>
                              <CustomIcon2
                                name={localeObject.isRTL ? "arrow-left" : "arrow-right"}
                                size={ThemeConstant.DEFAULT_ICON_SIZE}
                                color={ThemeConstant.DEFAULT_ICON_COLOR}
                              />
                            </TouchableOpacity></View>) : null}


                        <View>
                          <TouchableOpacity
                            activeOpacity={1}
                            style={[
                              styles.descriptionStyle,
                              { marginTop: ThemeConstant.MARGIN_NORMAL },
                              globleViewStyle
                            ]}
                            onPress={this._onPressViewDescription.bind(
                              this,
                              this.state.product.description,
                            )}>
                            <Text style={styles.descriptionTextStyle}>
                              {strings("VIEW_ALL").toUpperCase() +
                                ' ' +
                                strings("PRODUCT_DESCRIPTION")}
                            </Text>
                            <CustomIcon2
                              name={localeObject.isRTL ? "arrow-left" : "arrow-right"}
                              size={ThemeConstant.DEFAULT_ICON_SIZE}
                              color={ThemeConstant.DEFAULT_ICON_COLOR}
                            />
                          </TouchableOpacity>

                          {this.state.product.product_type != 'variable' &&
                            this.state.product.attributes &&
                            this.state.product.attributes.length > 0 ? (
                              <TouchableOpacity
                                activeOpacity={1}
                                style={[
                                  styles.descriptionStyle,
                                  { marginTop: ThemeConstant.MARGIN_NORMAL },
                                  globleViewStyle
                                ]}
                                onPress={this._onPressProductAdditionalInfo.bind(
                                  this,
                                  this.state.product.attributes,
                                )}>
                                <Text style={styles.descriptionTextStyle}>
                                  {strings("ADDITIONAL_INFORMATION")}
                                </Text>
                                <CustomIcon2
                                  name={localeObject.isRTL ? "arrow-left" : "arrow-right"}
                                  size={ThemeConstant.DEFAULT_ICON_SIZE}
                                  color={ThemeConstant.DEFAULT_ICON_COLOR}
                                />
                              </TouchableOpacity>
                            ) : null}

                          {this.state.product.wc_review_count > 0 &&
                            this.state.product.reviews_allowed ? (
                              <View
                                style={[styles.productViewStyle, { paddingBottom: 0 }]}>
                                <TouchableOpacity
                                  activeOpacity={1}
                                  style={[
                                    styles.descriptionStyle,
                                    {
                                      padding: 0,
                                      paddingTop: ThemeConstant.MARGIN_NORMAL,
                                      paddingBottom: ThemeConstant.MARGIN_NORMAL,
                                    },
                                    globleViewStyle
                                  ]}
                                  activeOpacity={1}
                                  onPress={this._onPressViewReviews}>
                                  <Text style={styles.descriptionTextStyle}>
                                    {strings("PRODUCT_REVIEWS_")}
                                  </Text>
                                  <CustomIcon2
                                    name={
                                      this.state.viewReviews
                                        ? 'arrow-up'
                                        : 'arrow-down'
                                    }
                                    size={ThemeConstant.DEFAULT_ICON_SIZE}
                                    color={ThemeConstant.DEFAULT_TEXT_COLOR}
                                  />
                                </TouchableOpacity>
                                {this.state.viewReviews ? (
                                  <View>
                                    <View style={ViewStyle.reviewStyle}>
                                      <ReviewChart
                                        reviewCount={
                                          this.state.product.wc_review_count
                                        }
                                        reviewGraph={this.state.product.review_graph}
                                      />
                                      <View style={ViewStyle.reviewDescriptionStyle}>
                                        <View style={{ width: 60 }}>
                                          <RatingView
                                            ratingValue={
                                              this.state.product.average_rating
                                            }
                                            iconSize={
                                              ThemeConstant.DEFAULT_ICON_TINNY_SIZE
                                            }
                                            ratingViewVisible={true}
                                          />
                                        </View>
                                        <Text
                                          style={[
                                            styles.reviewCountStyle,
                                            { marginLeft: 0 },
                                          ]}>
                                          {strings("BASED_ON")}
                                        </Text>

                                        <Text style={styles.reviewCountStyleLarge}>
                                          {this.state.product.wc_review_count +
                                            ' ' +
                                            (this.state.product.wc_review_count > 0
                                              ? strings("REVIEWS")
                                              : strings("REVIEW"))}
                                        </Text>
                                        <Text
                                          style={[
                                            styles.reviewButtonStyle,
                                            { marginLeft: 0 },
                                          ]}
                                          onPress={this._writeReview.bind(this)}>
                                          {strings("ADD_YOUR_REVIEWS")}
                                        </Text>
                                      </View>
                                    </View>
                                    <FlatList
                                      data={this.state.product.reviews}
                                      renderItem={({ item, index }) => (
                                        <ItemProductReview reviewItem={item} />
                                      )}
                                      keyExtractor={(item, index) => item.id + ''}
                                    />

                                    <Text
                                      ref={(ref) => this.viewAllReviewRef = ref}
                                      style={ViewStyle.viewAllStyle}
                                      onPress={this._onPressProductReviews.bind(
                                        this,
                                      )}>
                                      {strings("VIEW_ALL_PRODUCT_REVIEWS")}
                                    </Text>
                                  </View>
                                ) : (
                                    <View />
                                  )}
                              </View>
                            ) : null}

                          {this.state.product.related_ids &&
                            this.state.product.related_ids.length > 0 ? (
                              <View style={styles.productViewStyle}>
                                <Text
                                  style={[
                                    styles.headingStyleLeft,
                                    { marginBottom: ThemeConstant.MARGIN_GENERIC },
                                  ]}>
                                  {strings("RELATED_PRODUCT")}
                                </Text>
                                <FlatList
                                  horizontal={true}
                                  inverted={localeObject.isRTL}
                                  data={this.state.product.related_ids}
                                  keyExtractor={(item, index) => index + ''}
                                  renderItem={({ item, index }) => {
                                    return (
                                      <GridProduct
                                        productData={item}
                                        onPressAddToCart={this._onPressRelatedProductAddToCart.bind(
                                          this,
                                        )}
                                        onPress={this.onPressViewProduct.bind(this)}
                                      />
                                    );
                                  }}
                                />
                              </View>
                            ) : null}
                        </View>
                      </ScrollView>
                    </View>

                    {this.state.product.product_type != 'external' ? (
                      <View
                        style={[{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                          alignSelf: 'stretch',
                          borderTopWidth: 1,
                          borderTopColor: ThemeConstant.ACCENT_COLOR,
                        }, globleViewStyle]}>
                        <Text
                          style={{
                            backgroundColor: ThemeConstant.ACCENT_COLOR,
                            color: 'white',
                            flex: 1,
                            textAlign: 'center',
                            fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
                            padding: 15,
                          }}
                          onPress={


                            _.debounce(
                              this._onPressAddToCart.bind(this, false),
                            )





                          }>
                          {strings("ADD_TO_CART")}
                        </Text>
                        <Text
                          style={{
                            backgroundColor: 'white',
                            color: ThemeConstant.ACCENT_COLOR,
                            flex: 1,
                            textAlign: 'center',
                            fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
                            fontWeight: 'bold',
                            padding: 15,
                          }}
                          onPress={_.debounce(
                            this._onPressAddToCart.bind(this, true),
                          )}>
                          {strings("BUY_NOW")}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                )}
              <ProgressDialog
                visible={this.state.isProgressLoading}
                pleaseWaitVisible={false}
              />
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  quantityContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: ThemeConstant.LINE_COLOR,
    elevation: 3,
    padding: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
  },
  descriptionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderBottomWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2,
    padding: ThemeConstant.MARGIN_NORMAL,
  },
  descriptionTextStyle: {
    alignSelf: 'center',
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: 'bold',
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
  },
  shareAndFavTextStyle: {
    alignSelf: 'center',
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: 'bold',
    color: ThemeConstant.PRIMARY_COLOR,
  },
  bannerStyle: {
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
  },
  productViewStyle: {
    paddingLeft: ThemeConstant.MARGIN_NORMAL,
    paddingRight: ThemeConstant.MARGIN_NORMAL,
    paddingBottom: ThemeConstant.MARGIN_NORMAL,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    marginTop: ThemeConstant.MARGIN_NORMAL,
  },
  headingStyle: {
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight: '500',
  },
  headingStyleLeft: {
    fontWeight: 'bold',
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_NORMAL,
  },
  priceViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ThemeConstant.MARGIN_TINNY,
  },
  shortDescriptionViewStyle: {
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    padding: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    height: 130,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
  },
  buttonStyle: {
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    width: SCREEN_WIDTH > 500 ? 70 : 60,
    height: SCREEN_WIDTH > 500 ? 50 : 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  signUpButtonStyle: {
    alignSelf: 'center',
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    paddingHorizontal: ThemeConstant.MARGIN_EXTRA_LARGE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.ACCENT_COLOR,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
  },
  inStockStyle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: 'bold',
    marginTop: ThemeConstant.MARGIN_NORMAL,
  },
  outOfStockStyle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: 'red',
    fontWeight: 'bold',
    marginTop: ThemeConstant.MARGIN_NORMAL,
  },
  reviewButtonStyle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    fontWeight: '400',
    color: ThemeConstant.LINK_COLOR,
  },
  reviewCountStyle: {
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
  },
  reviewCountStyleLarge: {
    fontSize: ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE,
    fontWeight: 'bold',
    marginTop: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
  },
  shareAndWishlistConatinerStyle: { flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderRadius: 5, alignContent: 'center', paddingTop: 2, paddingBottom: 2 },
  shareBtnStyle: { flex: 1, flexDirection: 'row', justifyContent: 'center' }
});

import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationActions,
  StackActions
} from "react-navigation";
import SplashScreen from "../component/SplashScreen";
import ProductPage from "../component/ProductPage";
import CustomIcon2 from "../container/CustomIcon2";
import ThemeConstant from "../app_constant/ThemeConstant";
import CategoryNavigation from "./CategoryNavigation";
import HomePageNavigation from "./HomePageNavigation";
import SearchProductPage from "../component/SearchProductPage";
import CustomerNavigation,  {StackNavigatorCustomer} from "./CustomerAccountNavigation";
import CartPage from "../component/CartPage";
import CheckoutPage from "../component/CheckoutPage";
import UpdateAddress from "../component/UpdateAddress";
import PaymentMethodPage from "../component/PaymentMethodPage";
import CheckoutReviews from "../component/CheckoutReviews";
import ProductDescription from "../container/ProductDescription";
import ProductReviews from "../container/ProductReviews";
import WriteProductReview from "../container/WriteProductReview";
import OrderDetails from "../component/seller/OrderDetails";
import CategoryProductPage from "../component/CategoryProductPage";
import CustomerOrderDetails from "../component/CustomerOrderDeatails";
import AskCartLogin from "../component/AskCartLogin";
import LoginPage from "../component/LoginPage";
import SignUp from "../component/SignUpPage";
import ProductAdditionalInformation from "../container/ProductAdditionalInformation";

import ZoomImageContainer from "../container/ZoomImageContainer";
import OrderProductReview from "../component/OrderProductReview";
import SubCatagoryPage from "../component/SubCatagoryPage";
import NotificationPage from "../component/NotificationPage";
import ExternalLinks from "../container/ExternalLinks";
import ViewMorePage from "../component/ViewMorePage";
import CustomerDashboard from "../component/CustomerDashboard";
import DashboardReviewListPage from "../container/DashboardReviewListPage";
import OrderPlaceMessagePage from "../component/OrderPlaceMessagePage";
import SellerList from "../component/seller/SellerList";
import SellerProfileView from "../component/seller/SellerProfileView";
import CustomerProfile from "../container/CustomerProfile";
import FilterproductScreen from "../component/FilterProduct";
// /**
// * Webkul Software.
// *
// * @category Webkul
// * @package Webkul_Mobikul_React_WooCommerce
// * @author Webkul
// * @copyright Copyright (c) 2010-2018 WebkulSoftware Private Limited (https://webkul.com)
// * @license https://store.webkul.com/license.html
// *
// */

import CustomerAccountPage from '../component/CustomerAccountPage';
import SellerDashboardProduct from '../component/seller/SellerDashboardProduct';
import SellerOrders from '../component/seller/SellerOrders';
import SellerTransaction from '../component/seller/SellerTransaction';
import CustomerOrders from '../component/CustomerOrders';
import AskQueryToAdminList from '../component/seller/AskQueryToAdminList';
import SellerProfilePage from '../component/seller/SellerProfilePage';
import AddEditProduct from '../component/seller/AddEditProduct';
import StartAddProduct from '../component/seller/StartAddProduct';
import NewProductInformationEdit from '../component/seller/NewProductInformationEdit';
import DownloadsList from '../component/DownloadsList';
import TransactionDetail from '../component/seller/TransactionDetail';
import Marketplace from "../component/seller/Marketplace";
import AskToAdminQuery from "../container/seller/AskToAdminQuery";
import { strings, localeObject } from "../localize_constant/I18";
import ChatRoom from "../component/ChatRoom";
import ChatListing from "../component/seller/ChatListing";
import Wishlist from "../component/Wishlist";

export const StackNavigatorCustomer2 = createStackNavigator (
  {
      CustomerDetail : {
      screen:CustomerAccountPage,
      navigationOptions:({navigation})=>({
          header:null
      })
  },
  Login :{
      screen : LoginPage,
      navigationOptions:({navigation})=>({
         header : null   
      })
  },
  SignUp : {
      screen : SignUp,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  Marketplace : {
      screen : Marketplace,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  SellerProduct : {
      screen : SellerDashboardProduct,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  SellerOrders : {
      screen : SellerOrders,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  SellerTransaction : {
      screen : SellerTransaction,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  TransactionDetail : {
      screen : TransactionDetail,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  SellerProfilePage :{
      screen :SellerProfilePage,
      navigationOptions : ({navigation})=>({
          header: null
      })
  },
  OrderDetails : {
      screen : OrderDetails,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  CustomerOrders : {
      screen : CustomerOrders,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  Wishlist : {
      screen : Wishlist,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  CustomerOrderDetails : {
      screen : CustomerOrderDetails,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  UpdateAddress : {
      screen : UpdateAddress,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  CustomerProfile : {
      screen : CustomerProfile,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  AskQueryToAdminList : {
      screen : AskQueryToAdminList,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  AskToAdminQuery : {
      screen : AskToAdminQuery,
      navigationOptions : ({navigation})=>({
          header : null  
      })
  },
  SellerProfileView : {
      screen :SellerProfileView,
      navigationOptions : ({navigation})=>({
          header:null
      })
  },
  SellerList : {
      screen : SellerList,
      navigationOptions : ({navigation})=>({
          header:null
      })
  },
  StartAddProduct : {
      screen: StartAddProduct,
      navigationOptions : ({naviagtion})=>({
          header :null
      })
  },
  AddEditProduct :{
      screen : AddEditProduct,
      navigationOptions : ({navigation})=>({
          header:null
      })
  },
  NewProductInformationEdit :{
      screen : NewProductInformationEdit,
      navigationOptions : ({navigation})=>({
          header:null
      })
  },
  DownloadsList :{
      screen : DownloadsList,
      navigationOptions : ({navigation})=>({
          header:null
      })
  }
},{
  initialRouteName : "CustomerDetail"
}
);

export const APPNavigation = createBottomTabNavigator(
  {
    HomePageNavigation: {
      screen: HomePageNavigation,
      navigationOptions: ({ navigation, screenProps }) => ({
        title: strings("HOME_TITLE")
      })
    },
    CategoryNavigation: {
      screen: CategoryNavigation,
      navigationOptions: ({ navigation }) => ({
        title: strings("CATEGORY_TITLE"),
        // tabBarOnPress: ({previousScene, scene, jumpToIndex }) => {
        //   // const { route, focused, index } = scene;
        //   // if (focused) {
        //   //   if (route.index > 0) {
        //   //     // eslint-disable-next-line immutable/no-let
        //   //     let currentIndex = route.index;
        //   //     while (currentIndex > 0) {
        //   //       navigation.dispatch(NavigationActions.back({}));
        //   //       currentIndex -= 1;
        //   //     }
        //   //   }
        //   // } else {
        //   //   jumpToIndex(index);
        //   // }
        // },
      })
    },  
    Account: {
      screen: CustomerNavigation,
      // screen: StackNavigatorCustomer2,
      navigationOptions: ({ navigation }) => ({
        title: strings("ACCOUNT_TITLE"),
        //  tabBarOnPress: ({previousScene, scene, jumpToIndex }) => {
        // const resetAction = StackActions.reset({
        //   index: 0,
        //   actions: [NavigationActions.navigate({ routeName: 'CustomerDetail',params:{
        //         isUpdate: true
        //       } })],
        // });
        //  navigation.dispatch(resetAction);
        // },
        
      })
    },
    ViewMorePage: {
      screen: ViewMorePage,
      navigationOptions: ({ navigation }) => ({
        title: strings("MORE_TITLE")
      })
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor, focused, horizontal }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case "CategoryNavigation":
            iconName = "category";
            break;
          case "HomePageNavigation":
            iconName = "home";
            break;
          case "ViewMorePage":
            iconName = "more_baseline";
            break;
          case "Account":
            iconName = "user";
            break;
          default:
            iconName = "shop";
        }
        // You can return any component that you like here! We usually use an
        return (
          <CustomIcon2
            name={iconName}
            size={ThemeConstant.DEFAULT_BOTTOM_NAV_ICON_SIZE}
            color={tintColor}
          />
        );
      },      
    }),
    tabBarOptions: {
      activeTintColor: ThemeConstant.ACCENT_COLOR,
      inactiveTintColor: "#a0a0a0",
      adaptive: false,
      showIcon: true, 
      showLabel: true,
      upperCaseLabel: true,
      style: {
        backgroundColor: "#fff",
        flexDirection: localeObject.isRTL ? 'row-reverse' : "row", 
      },
      labelStyle :{
        fontWeight:"bold",
        fontSize:ThemeConstant.DEFAULT_SMALL_TEXT_SIZE
      },
      indicatorStyle: {
        backgroundColor: "#000"
      }
    },
    animationEnabled: true,
    // initialRouteName: "HomePageNavigation"
  }
);


const StackNavigator = createStackNavigator(
  {
    HomePage: {
      screen: APPNavigation,
    },
    SplashScreen: {
      screen: SplashScreen,
    },
    ProductPage: {
      screen: ProductPage,
    },
    ProductDescription : {
      screen :ProductDescription,
    },
    ProductAdditionalInformation : {
      screen :ProductAdditionalInformation,
    },
    ProductReviews : {
      screen : ProductReviews,
    },
    WriteProductReview : {
      screen : WriteProductReview,
    },
    CategoryProductPage :{
      screen : CategoryProductPage,
     
    },
    CartPage: {
      screen: CartPage,
      // navigationOptions: ({ navigation }) => ({
      //   header: null
      // })
    },
    Checkout: {
      screen: CheckoutPage,
      // navigationOptions: ({ navigation }) => ({
      //   header: null
      // })
    },
    CustomerOrderDetails: {
      screen: CustomerOrderDetails,
      // navigationOptions: ({ navigation }) => ({
      //   header: null
      // })
    },
    UpdateAddress : {
      screen : UpdateAddress,
      // navigationOptions : ({navigation})=>({
      //   header : null
      // })
    },
    PaymentMethodPage : {
      screen : PaymentMethodPage,
      // navigationOptions : ({navigation})=>({
      //   header: null,
      // })
    },
    CheckoutReviews : {
      screen : CheckoutReviews,
      // navigationOptions : ({navigation})=>({
      //   header: null,
      // })
    },
    Login:{
      screen:LoginPage,
      // navigationOptions : ({navigation})=>({
      //   header: null,
      // })
    },
    SignUp:{
      screen:SignUp,
      // navigationOptions : ({navigation})=>({
      //   header: null,
      // })
    },
    ZoomImageContainer :{
      screen :ZoomImageContainer,
    },

    OrderProductReview :{
      screen :OrderProductReview,
    },
    SubCatagoryPage :{
      screen:SubCatagoryPage
    },
    NotificationPage :{
      screen:NotificationPage
    },
    SearchProductPage :{
      screen:SearchProductPage
    },
    FiltersProduct:{
      screen: FilterproductScreen,
    },
    ExternalLinks : {
       screen:ExternalLinks
    },
    CustomerDashboard :{
      screen:CustomerDashboard
    },
    Wishlist:{
      screen: Wishlist
    },
    DashboardReviewListPage :{
      screen:DashboardReviewListPage
    },
    CustomerProfile : {
      screen : CustomerProfile,
  },
    SellerList :{
      screen:SellerList
    },
    SellerProfileView :{
      screen:SellerProfileView
    },
    OrderPlaceMessagePage :{
      screen:OrderPlaceMessagePage
    },
    ChatListing :{
      screen : ChatListing,
      navigationOptions : ({navigation})=>({
          header:null
      })
  },
  ChatRoom :{
    screen : ChatRoom,
    navigationOptions : ({navigation})=>({
        header:null
    })
  }
  },
  {
    initialRouteName: "SplashScreen",
    headerMode: 'none'
  }
);
export default StackNavigator;

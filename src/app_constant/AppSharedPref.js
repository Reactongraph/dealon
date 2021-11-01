import AsyncStorage from "@react-native-community/async-storage";
import AppConstant from "./AppConstant";
import { isStringEmpty } from "../utility/UtilityConstant";
import firebase from "react-native-firebase";
import AnalylticsConstant from "./AnalylticsConstant";
export const setIsLogin = async function (isLogin){
    try {
        AppConstant.IS_USER_LOGIN = isLogin;
         await AsyncStorage.setItem(AppConstant.PREF_IS_LOGIN, isLogin);
      } catch (error) {
        // Error saving data
        console.log("AppAsync.setIsLogin =>>", error);
      }
}

export const setUserData = async function (user){
    try {
      user.isSeller = user.isSeller ? user.isSeller : 0;
      console.log("AppAsync =>>"+ user.isSeller);
         await AsyncStorage.setItem(AppConstant.PREF_USER_ID, user.id + ""); 
         await AsyncStorage.setItem(AppConstant.PREF_USER_EMAIL, user.email);
         await AsyncStorage.setItem(AppConstant.PREF_IS_SELLER, user.isSeller + "");
         await AsyncStorage.setItem(AppConstant.PREF_USER_NAME, user.display_name ? user.display_name : "");
         await AsyncStorage.setItem(AppConstant.PREF_CART_COUNT, user.product_count ? user.product_count +"" : "0");
         AppConstant.USER_KEY = user.id;      
         let analyticsObject = {};
         analyticsObject[AnalylticsConstant.ID] = user.id;
         analyticsObject[AnalylticsConstant.NAME] = user.display_name ? user.display_name : "";
         firebase.analytics().logEvent(AnalylticsConstant.LOGIN, analyticsObject);   
      }catch (error) {
        // Error saving data
        console.log("AppAsync.setUserData =>>", error);
      }
}

export const setGuestId = async function (guestId){
  try {
       await AsyncStorage.setItem(AppConstant.PREF_USER_ID, guestId);
       AppConstant.USER_KEY = guestId; 
    } catch (error) {
      // Error saving data
      console.log("AppAsync.setGuestId =>>", error);
    }
}
export const setCartCount = async function (cartCount){
  try {
          cartCount = cartCount ? cartCount + "" : "0"
       await AsyncStorage.setItem(AppConstant.PREF_CART_COUNT, !isStringEmpty(cartCount + "") ? cartCount + "" : "0" );
    } catch (error) {
      // Error saving data
      console.log("AppAsync.setCartCount =>>", error);
    }
}

export const setCategoryData = async function (categoryData){
  try {
       await AsyncStorage.setItem(AppConstant.CATEGORY_DATA, categoryData );
    } catch (error) {
      // Error saving data
      console.log("AppAsync.setCategoryData =>>", error);
    }
}

export const setFingerPrintEnable = async function(enable){
  try{
    await AsyncStorage.setItem(AppConstant.IS_FINGER_PRINT_ENABLE, enable);
  }catch(error){
    console.log("AppSharedPref.setFingerPrintEnable",error)
  }
}

export const isFingerPrintEnable = async function(){
  try{
    // return (await AsyncStorage.getItem(AppConstant.IS_FINGER_PRINT_ENABLE));
    return "true";
  }catch{
    return("false");
  }
}

export const setFingerPrintUserAUTH = async function(user){
  try{
    await AsyncStorage.setItem(AppConstant.FINGER_PRINT_LOGIN_USER, user);
  }catch(error){
    console.log("AppSharedPref.setFingerPrintUserAUTH",error)
  }
}
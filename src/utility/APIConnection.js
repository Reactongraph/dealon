import { Alert, PixelRatio } from "react-native";
import {NavigationActions} from 'react-navigation';
import { _getconnection } from "./UtilityConstant";
import md5 from "md5";
import AppConstant from "../app_constant/AppConstant";

import { insertHomePageData, getHomePageData, insertProductPageData, insertCategoryPageData, getProductPageData, getCategoryPageData, insertCategoryProductSerachPageData, getCategorySearchProductPageData } from "../database/AllSchemas";
import { setIsLogin, setUserData, setCartCount } from "../app_constant/AppSharedPref";
import { showErrorToast } from "./Helper";
import { strings } from "../localize_constant/I18";

export const fetchDataFromAPI = (url, method, body, token, dbKey) =>
  new Promise((resolve, reject) => {
    let session1 = md5(
      AppConstant.API_USER_NAME + ":" + AppConstant.API_PASSWORD
    );
    let session2 = md5(session1 + ":" + AppConstant.TOKEN);
    if(AppConstant.IS_MARKETPLACE)
    session2 = md5(session2 + ":"+ (AppConstant.USER_KEY == "" ? "0" :AppConstant.USER_KEY));
    console.debug(
      "----------------APICAll(fetchDataFromAPI)------------------------"
    );
        console.log("Body", body);
        console.log("authKey", session2);
        console.log("method", method);
        console.log("dbKey", dbKey);
        console.log("USER_KEY=>>", AppConstant.USER_KEY);

    _getconnection().then(isConnected => {
      if (isConnected) {
        if (!url.includes("?")) {
          url = url + "?mFactor=" + PixelRatio.get();
        } else if (!url.includes("&mFactor")) {
          url = url + "&mFactor=" + PixelRatio.get();
        }
        url = url.replace(/ /g, '%20'),
        console.debug("Url=> " + url);
        
        // console.log("Session1=>", session1);
        // console.log("Session2=>", session2);
        return fetch(url, {
          method: method,
          credentials: "include",
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
            authKey: session2,
            "X-authKey": session2,
            "user_key": AppConstant.USER_KEY
          }),
          mode: "no-cors",
          body: body
        })
          .then(response => {
            // console.log(response)
            return response.json();
          })
          .then(responseJson => {
            console.log('APIConnection =>>> ',  responseJson);
            if (!responseJson.success && responseJson.status === 401) {
              AppConstant.TOKEN = responseJson.session_id;
              console.log("SessionID" + AppConstant.TOKEN);
              fetchDataFromAPI(url, method, body, responseJson.session_id, dbKey).then(
                response => {
                  resolve(response);
                }
              );
            } else if(responseJson.data && responseJson.data.status == 500 ){
              resolve({
                success: false,
                message: responseJson.message
              });
            }else if(responseJson.user_not_exist){
              setIsLogin("false");
              setUserData({ id: "", username: "Webkul", email: "", isSeller: 0 });
              setCartCount("0");
              showErrorToast(responseJson.message);
              if(AppConstant.navigation){
                AppConstant.navigation.navigate("HomePage", {isUpdate:true}, NavigationActions.navigate({ routeName: 'HomePageNavigation' }));  
              }else{
                resolve(responseJson);
              }
            }else {
              if(method == 'GET' && dbKey){
                  updateDataBase(url, responseJson, dbKey);
              }              
                resolve(responseJson);
              
            }
          })
          .catch(error => {
            console.log("API_ERROR-> ", error);
            if(!url.includes("products/search/suggestions")){
            Alert.alert(
              strings("OOPS"),
              strings("SERVER_MAINTENANCE"),
              [
                {
                  text: strings("CANCEL"),
                  style: "cancel",
                  onPress: () => {
                    resolve({
                      success: false,
                      message: strings("SERVER_MAINTENANCE")
                    });
                  }
                },
                {
                  text: strings("RETRY"),
                  style: "cancel",
                  onPress: () => {
                    fetchDataFromAPI(url, method, body, token, dbKey).then(
                      response => {
                        resolve(response);
                      }
                    );
                  }
                }
              ],
              { cancelable: false }
            );
            }else{
              resolve({ success: 0, message: strings(NO_PRODUCT_FOUND_MSG) })
            }
          });
      } else if(method == 'GET' && dbKey){
        console.debug(
          "----------------APICAll(fetchDataFromAPI rrrrr)------------------------"
        );
        getDataFromDB(url, dbKey).then(response => {
          if (response) {
            resolve(response);
          } else {
            showNetworkErrorAlert(url, method, body, token, dbKey, resolve);
          }
        });
      }else{
        console.debug(
          "----------------APICAll(fetchDataFromAPI tttttt)------------------------"
        );
        showNetworkErrorAlert(url, method, body, token, dbKey, resolve);
      }
    });
  });

  const showNetworkErrorAlert = ( url, method, body, token, dbKey, resolve) =>{
    return Alert.alert(
      strings("OOPS"),
      strings("NETWORK_ERROR"),
      [
        {
          text: strings("CANCEL"),
          style: "cancel",
          onPress: () => {
            resolve({
              success: false,
              message: strings("NETWORK_ERROR")
            });
          }
        },
        {
          text: strings("RETRY"),
          style: "cancel",
          onPress: () => {
            fetchDataFromAPI(url, method, body, token, dbKey).then(
              response => {
                resolve(response);
              }
            );
          }
        }
      ],
      { cancelable: false }
    );

  }

////////////////////////  MultiPart Request ////////////////////////////////////

export const fetchDataFromAPIMultipart = (url, method, body, token) =>
  new Promise((resolve, reject) => {
    let session1 = md5(
      AppConstant.API_USER_NAME + ":" + AppConstant.API_PASSWORD
    );
    let session2 = md5(session1 + ":" + AppConstant.TOKEN);
    if(AppConstant.IS_MARKETPLACE)
       session2 = md5(session2 + ":"+ (AppConstant.USER_KEY == "" ? "0" :AppConstant.USER_KEY));

    _getconnection().then(isConnected => {
      if (isConnected) {
        console.debug(
          "----------------APICAll(fetchDataFromAPI)------------------------"
        );
        console.debug("Url=> " + url);
        console.log("Body", JSON.stringify(body));
        console.log("method", method);
        console.log("Session1=>", session1);
        console.log("Session2=>", session2);
        return fetch(url, {
          method: method,
          credentials: "include",
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            authKey: session2,
            "X-authKey": session2,
            "user_key": AppConstant.USER_KEY
          }),
          mode: "no-cors",
          body: body
        })
          .then(response => {
            return response.json();
          })
          .then(responseJson => {
            console.log(responseJson);
            if (!responseJson.success && responseJson.status === 401) {
              AppConstant.TOKEN = responseJson.session_id;
              console.log("SessionID" + AppConstant.TOKEN);
              fetchDataFromAPI(url, method, body, responseJson.session_id).then(
                response => {
                  resolve(response);
                }
              );
            } else {
              resolve(responseJson);
            }
          })
          .catch(error => {
            reject(error);
          });
      } else {
        return Alert.alert(
          strings("OOPS"),
          strings("NETWORK_ERROR"),
          [
            {
              text: strings("CANCEL"),
              style: "cancel",
              onPress: () => {
                resolve({
                  success: false,
                  message: strings("NETWORK_ERROR")
                });
              }
            },
            {
              text: strings("RETRY"),
              style: "cancel",
              onPress: () => {
                fetchDataFromAPI(url, method, body, token).then(response => {
                  resolve(response);
                });
              }
            }
          ],
          { cancelable: false }
        );
      }
    });
  });

///////////////////////  Supported Function of API Call /////////////////////////////

const updateDataBase = (url, response, dbKey) => {
  if (url.includes("homepage/")) {
    insertHomePageData({ id: 1, homePageData: JSON.stringify(response) });
  }else if(url.includes("products/search/?s=")) {
    insertCategoryProductSerachPageData({search : dbKey, categorySearchPageData : JSON.stringify(response)})
  }else if(url.includes("category/products/")) {
     dbKey = convertDBKey(dbKey);
    insertCategoryPageData({id : dbKey, categoryPageData : JSON.stringify(response)})
  }else if(url.includes("products/")) {
     dbKey = convertDBKey(dbKey);
    insertProductPageData({id : dbKey, productPageData : JSON.stringify(response)})
  }
};

async function getDataFromDB(url, dbKey) {
  let response;
  try {
    if (url.includes("homepage/")) {
      response = await getHomePageData();
    }else if (url.includes("products/search/?s=")) {
      response = await getCategorySearchProductPageData(dbKey);
    }else if (url.includes("category/products/")) {
      dbKey = convertDBKey(dbKey);
      response = await getCategoryPageData(dbKey);
    }else if (url.includes("products/")) {
      dbKey = convertDBKey(dbKey);
      response = await getProductPageData(dbKey);
    } 
    return response;
  } catch (error) {
    console.log(error);
    return response;
  }
}

const convertDBKey = (dbkey)=>{
  if(typeof dbkey == 'string'){
    return parseInt(dbkey);
  }else if(typeof dbkey == 'undefined' || !dbkey){
    return 1;
  }else{
    return dbkey;
  }
  
}

import React from "react";
import {
  StyleSheet,
  Dimensions,
  Linking,
  BackHandler,
  Alert,
  PixelRatio,
  View,
  Platform,
  ImageBackground
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import Loading from "../container/LoadingComponent";
import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import { setCartCount, setCategoryData } from "../app_constant/AppSharedPref";
import { showErrorToast } from "../utility/Helper";
import VersionCheck from "react-native-version-check";
import ThemeConstant from "../app_constant/ThemeConstant";
import {
  _getconnection,
  getNotificationRoot
} from "../utility/UtilityConstant";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
import CustomIcon2 from "../container/CustomIcon2";
import * as Animatable from "react-native-animatable";
import { setCurrentLocale, strings } from "../localize_constant/I18";
import AnalylticsConstant from "../app_constant/AnalylticsConstant";
import firebase from "react-native-firebase";
// import io from "socket.io-client";

export default class SplashScreen extends React.Component {
  handleViewRef = ref => (this.view = ref);
  notificationData = null;
  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener("didFocus", () => this.isFocused())
    ];
    // setCurrentLocale(AppConstant.CURRENT_LOCALE);
    // this.view.bounce(800);
    this.notificationData = this.props.screenProps.notificationData;
    console.log("SplashScreen.APP_DATA", this.props.screenProps);

    console.log("PixelRatio", PixelRatio.get());
    console.log("PixelRatio", SCREEN_WIDTH);
    // VersionCheck.getLatestVersion({
    //   provider: 'playStore'  // for Android
    // })

    // .then(latestVersion => {
    //   console.log("playStore", latestVersion);    // 0.1.2
    // });
    // console.log(VersionCheck.getCurrentBuildNumber());
  }

  getDerivedStateFromProps(newProps) {
    if (newProps != this.props) {
      this.notificationData = newProps.screenProps.notificationData;
      this.isFocused();
    }

    // this.socket = io("https://dealon.uk:3000");
    // this.socket.on("chat message", msg => {
    //       this.setState({ chatMessages: [...this.state.chatMessages, msg]   
    //  });
  // });
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps != this.props) {
  //     this.notificationData = newProps.screenProps.notificationData;
  //     this.isFocused();
  //   }
  // }
  isFocused = () => {   
    _getconnection().then(isConnected => {
      if (isConnected) {
        VersionCheck.needUpdate()
          .then(res => {
            console.log("SplashScreen2=>>", res.isNeeded); // true            
            
            if (res.isNeeded) {
              Alert.alert(
                strings("UPDATE_WARNING"),
                AppConstant.VERSION_CHECKER,
                [
                  {
                    text: strings("UPDATE_TEXT"),
                    onPress: async () => {
                      if(Platform.OS == "android"){
                        BackHandler.exitApp();
                        Linking.openURL(await VersionCheck.getStoreUrl()); // open store if update is needed.
                      }else{
                        // Linking.openURL(await VersionCheck.getAppStoreUrl()); // open store if update is needed.
                      Linking.openURL(AppConstant.APP_STORE_URL)
                      }
                      
                    },
                    style: "cancel"
                  }
                ],
                { cancelable: false }
              );
            } else {
              this.callAPI();
            }
          })
          .catch(err => {
            this.callAPI();
          });
      } else {
        this.callAPI();
        // Alert.alert(
        //      strings("")OOPS,
        //       strings("")NETWORK_ERROR,
        //     [
        //       { text:strings("")RETRY,
        //       style: "cancel",
        //       onPress: ()=> {
        //           this.isFocused();
        //     }},
        //     ],
        //     { cancelable: false }
        //   )
      }
    });
  };

  callAPI = () => {
    AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
      AppConstant.IS_USER_LOGIN =  islogedIn ? islogedIn : "false";
    });
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
    AppConstant.navigation = this.props.navigation;
    AppConstant.USER_KEY =  userId ? userId : "";

    let analyticsObject = {};
    analyticsObject[AnalylticsConstant.ID] = AppConstant.USER_KEY;
    firebase.analytics().logEvent(AnalylticsConstant.SPLASHSCREEN, analyticsObject);

    if (this.notificationData) {
      let routeData = getNotificationRoot(
        this.props.screenProps.notificationData
      );
      this.props.navigation.navigate(routeData.root, routeData.data);
      this.notificationData = null;
    } else if (AppConstant.ISDEMO) {
      
      setTimeout(() => {
        this.props.navigation.replace("HomePage", {
          // homePagedata: result
        });
      }, Platform.OS == 'ios' ? 2000 : 700);
    } else {
      AsyncStorage.getItem(AppConstant.PREF_IS_LOGIN).then(islogedIn => {
        let url = AppConstant.BASE_URL + "homepage/?width=" + SCREEN_WIDTH; //  * 3
        if (islogedIn && islogedIn == "true") {
          url += "&customer_id=";
        } else {
          url += "&guest_id=";
        }
        // AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
          url += userId ? userId : "";
          fetchDataFromAPI(url, "GET", "", null, 1).then(result => {
            if (
              result &&
              (result.success || typeof result.success === "undefined")
            ) {
              setCartCount(result.count);
              // if(result.categories && typeof result.categories == 'object' ){
              //   setCategoryData(JSON.stringify(result.categories));
              // }
              this.props.navigation.replace("HomePage", {
                homePagedata: result
              });
            } else {
              showErrorToast(result.message);
            }
          });
        // });
      });
    }
  });
  };

  render() {
    return (
      <ImageBackground
        source={require("../../resources/images/splash_screen.png")}
        style={styles.background_Image}
        resizeMode = 'stretch'>
        <Loading style={styles.loadingStyle} />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background_Image: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  loadingStyle: {
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100
  },
  headingMain: {
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontWeight: "700",
    fontStyle: "normal",
    textAlign: "center",
    margin: ThemeConstant.MARGIN_GENERIC,
    fontSize: 40
  },
  headingMain2: {
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    fontSize: 24
  },
  headingMain3: {
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  }
});

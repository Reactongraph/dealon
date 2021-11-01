import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { ScrollView, FlatList } from "react-native";
import CustomActionbar from "../container/CustomActionbar";

import Loading from "../container/LoadingComponent";
import EmptyLayoutComponent from "../container/EmptyLayoutComponent";
import { EmptyIconConstant } from "../app_constant/EmptyIconConstant";
import { SCREEN_WIDTH, isStringEmpty } from "../utility/UtilityConstant";
import { Button } from "react-native-elements";
import CustomIcon2 from "../container/CustomIcon2";
import { showErrorToast, showSuccessToast, showToast } from "../utility/Helper";
import ProgressDialog from "../container/ProgressDialog";
import RNFetchBlob from "rn-fetch-blob";
import { PermissionsAndroid } from "react-native";
import { strings, localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

const { config, fs } = RNFetchBlob;
const android = RNFetchBlob.android

export default class DownloadsList extends React.Component {
  screenProps = null;
  page = 1;
  state = {
    downloads: [],
    isLoading: true,
    isProgress: false,
    products: []
  };

  componentDidMount() {
    let { navigation, screenProps } = this.props;
    this.screenProps = screenProps;
    // AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      let userID = AppConstant.USER_KEY;
      if (userID) {
        let url =
          AppConstant.BASE_URL +
          "user/" +
          userID +
          "/downloads" +
          "?page=" +
          this.page +
          "&width=" +
          SCREEN_WIDTH;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (response && response.success) {
            this.setState({
              downloads: response.downloads,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
      }
    // });
  }

  _onBackPress = () => {
    this.props.navigation.pop();
  };
  _onPressViewOrderDetail = orderId => {
    this.props.navigation.navigate("CustomerOrderDetails", {
      orderId: orderId
    });
  };
  _onPressViewProduct = product => {
    if (this.screenProps) {
      this.screenProps.navigate("ProductPage", {
        productId: product.product_id,
        productName: product.product_name
      });
    } else {
      this.props.navigation.navigate("ProductPage", {
        productId: product.product_id,
        productName: product.product_name
      });
    }
  };
  async requestCameraPermission(downloadFile) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: strings("PERMISSION_REQUEST"),
          message: strings("WRITE_PERMISSION_MSG"),
          buttonNeutral: strings("ASK_ME_LATTER"),
          buttonNegative: strings("CANCEL"),
          buttonPositive: strings("OK")
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("PERMISSION GRANTED");
        this.downloadFile(downloadFile);
      } else {
        showErrorToast(strings("USER_PERMISSION_DENIED"));
      }
    } catch (err) {
      console.warn(err);
    }
  }
  downloadFile( downloadFile) {
    this.setState({
      isProgress: true
    });
    downloadFile.download_extension = isStringEmpty(downloadFile.download_extension) ? "html" : downloadFile.download_extension
    downloadFile.download_type = isStringEmpty(downloadFile.download_type) ? "text/html" : downloadFile.download_type

    let path =
      "/"+ (AppConstant.APP_NAME.replace(" ", "_")) +"/" +
     ( downloadFile.download_name) + "."+ downloadFile.download_extension;

      // console.log("Directory===> ", fs.dirs.DocumentDir + path);
      
    let options =  null;
    if(Platform.OS == "ios"){
      options = {
        fileCache: true,
        path: fs.dirs.DocumentDir + path,
        description: "Downloading image."
      }
    }else{
      options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: false,
          path: fs.dirs.DownloadDir + path, // this is the path where your downloaded file will live in
          description: "Downloading image."
        }
    }
    };
    config(options)
      .fetch("GET", downloadFile.download_url)
      .progress((received, total) => {
        // showToast(((received * 100) / total )+ "%");
        // console.log("progress", received / total);
      })
      .then(res => {
        // console.log("Download=>>>", res);
        
        this.setState({
          isProgress: false
        }, ()=>{   
          showSuccessToast(strings("DOWNLOADING_STATUS"));
        });

        if(Platform.OS == 'ios'){
          RNFetchBlob.ios.previewDocument(res.path());
        }else{
          android.actionViewIntent(
            res.path(),
            downloadFile.download_type
          );
        }       
        
      })
    
  }
  _onPressDownloads = (downloadFile) => {
    if(Platform.OS == 'ios'){
      this.downloadFile(downloadFile);
    }else{
       this.requestCameraPermission(downloadFile);
    }
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          title={strings("DOWNLOAD_TITLE").toUpperCase()}
          backwordTitle={strings("ACCOUNT_TITLE")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView
            contentContainerStyle={{
              backgroundColor: ThemeConstant.BACKGROUND_COLOR_1
            }}
          >
            <FlatList
              data={this.state.downloads}
              renderItem={({ item }) => {
                return (
                  <View style={{ marginBottom: ThemeConstant.MARGIN_NORMAL }}>
                    <View style={[styles.eachItemContainer, globleViewStyle]}>
                      <View style={[styles.infoTheme, {alignItems: localeObject.isRTL ? "flex-end" : "flex-start"}]}>
                        <Text style={styles.orderTitleStyle}>
                          #{item.order_id}
                        </Text>
                        <Text style={styles.orderTitleStyle}>
                          {item.product_name}
                        </Text>

                        <Text
                          style={[
                            styles.statusView,
                            { backgroundColor: ThemeConstant.ACCENT_COLOR }
                          ]}
                        >
                          {item.download_name}
                        </Text>

                        <Text style={[styles.headingTitle]}>
                          {strings("REMAINING_DOWNLOADS")}
                          {item.downloads_remaining}
                        </Text>
                        {
                          isStringEmpty(item.access_expires) ? null :
                         <Text style={[styles.headingTitle]}>
                         {strings("EXPIRE_DATE")}
                         {item.access_expires}
                       </Text>
                        }
                       
                      </View>
                    </View>
                    <View style={[styles.buttonContanerStyle, globleViewStyle]}>
                      <Button
                        clear
                        title={strings("DOWNLOAD")}
                        icon={
                          <CustomIcon2
                            name="download"
                            size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                            color={ThemeConstant.DEFAULT_ICON_COLOR}
                          />
                        }
                        titleStyle={{
                          color: ThemeConstant.DEFAULT_TEXT_COLOR,
                          fontWeight: "400",
                          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
                        }}
                        buttonStyle={{ flex: 1, backgroundColor:ThemeConstant.BACKGROUND_COLOR }}
                        onPress={this._onPressDownloads.bind(
                          this,
                          item
                        )}
                      />

                      <Button
                        clear
                        title={strings("DETAIL")}
                        icon={
                          <CustomIcon2
                            name="arrow-circle-right"
                            size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                            color={ThemeConstant.DEFAULT_ICON_COLOR}
                          />
                        }
                        titleStyle={{
                          color: ThemeConstant.DEFAULT_TEXT_COLOR,
                          fontWeight: "400",
                          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                          marginLeft:ThemeConstant.MARGIN_TINNY,
                        }}
                        buttonStyle={{ flex: 1, backgroundColor:ThemeConstant.BACKGROUND_COLOR  }}
                        onPress={this._onPressViewOrderDetail.bind(
                          this,
                          item.order_id
                        )}
                      />

                      <Button
                        clear
                        title={strings("PRODUCT").toLocaleUpperCase()}
                        icon={
                          <CustomIcon2
                            name="product"
                            size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                            color={ThemeConstant.DEFAULT_ICON_COLOR}
                          />
                        }
                        titleStyle={{
                          color: ThemeConstant.DEFAULT_TEXT_COLOR,
                          fontWeight: "400",
                          marginLeft:ThemeConstant.MARGIN_TINNY,
                          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
                        }}
                        buttonStyle={{flex: 1, backgroundColor:ThemeConstant.BACKGROUND_COLOR }}
                        onPress={this._onPressViewProduct.bind(this, item)}
                      />
                    </View>
                  </View>
                );
              }}
              keyExtractor={item => {
                return item.id + "";
              }}
              ListEmptyComponent={
                <EmptyLayoutComponent
                  message={strings("NO_ORDER_GENERATED")}
                  iconName={EmptyIconConstant.emptyOrder}
                />
              }
            />
          </ScrollView>
        )}
        <ProgressDialog
          visible={this.state.isProgress}
          pleaseWaitVisible={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoTheme: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_TINNY,
    width: SCREEN_WIDTH - SCREEN_WIDTH / 3.2
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3.5,
    height: SCREEN_WIDTH / 3.5
  },
  buttonContanerStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    padding: ThemeConstant.MARGIN_GENERIC
  },
  eachItemContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 0.3,
    borderBottomColor: ThemeConstant.LINE_COLOR_2,
    borderTopColor: ThemeConstant.LINE_COLOR,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_GENERIC,
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_GENERIC
  },
  orderTitleStyle: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    fontWeight: "bold"
  },
  headingTitle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  statusView: {
    flex: 1,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "500",
    fontStyle: "normal",
    textAlign: "center",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_GENERIC,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    marginTop: ThemeConstant.MARGIN_TINNY
  }
});

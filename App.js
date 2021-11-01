/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, Alert, Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import { Container, Header } from 'native-base';
import NavigationConst from './src/navigation/NavigationConst';
import ThemeConstant from './src/app_constant/ThemeConstant';
import firebase from 'react-native-firebase';
import AppConstant from './src/app_constant/AppConstant';
import { getNotificationRoot } from './src/utility/UtilityConstant';
import DeepLinking from 'react-native-deep-linking';
import DeviceInfo from 'react-native-device-info';
import { addNotofication, getAllNotification } from './src/database/AllSchemas';
import { showErrorToast } from './src/utility/Helper';
const url = require('url');

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
// https://github.com/invertase/react-native-firebase-docs/blob/master/docs/messaging/receiving-messages.md
type Props = {};
export default class App extends Component<Props> {

state = {
  notification :null,
  linkURL : null,
}

  async componentDidMount() {    
    this.checkPermission();
    DeepLinking.addScheme('http://');

    Linking.addEventListener('url', this.handleUrl);

    let regex = /\/ragarwal.com\/(.*)/g;
      DeepLinking.addRoute(regex, (response) => {
        console.log("test3", response.scheme + response.path);
        console.log("test3", response.match);
      
     });

    Linking.getInitialURL().then((url) => {
        // DeepLinking.evaluateUrl(url);
        
        this.redirectLinkPage(url);
    }).catch(err => console.error('An error occurred', err));
  }

  redirectLinkPage = (linkURL)=>{
    // if (url && url.includes(AppConstant.BASE_URL)) {
  if (linkURL && linkURL.includes("ragarwal.com")) {
    let url1 = url.parse(linkURL);
    let queries = url1.query.split("&");
    console.log("Product id =>> " , queries);    
    console.log("Product id =>> " , url1.search);    
    let productId = null;
    let productName  =  null; 
    queries.forEach((element, index)=>{

        if(element.includes("productId")){
          productId =  element.substring(element.indexOf("=") + 1);             
        } 
        if(element.includes("productName")){
          productName = element.substring(element.indexOf("=") + 1);
        }           
    });
    console.log("Product id =>> " , productId + " Product Name=>>" +  productName); 
  }
  }

  handleUrl = ({ url }) => {
    console.log("handleUrl->>url", url);
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        // DeepLinking.evaluateUrl(url);
        this.redirectLinkPage(url);
      }
    });
  }


  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleUrl);
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
        this.subscribeTopic();
        this.createNotificationListeners();
    } else {
        this.requestPermission();
    }
  }

    //3
async getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken', null);
  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
  console.log("fcmToken=>>>>", fcmToken);

      if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
}

  //2
async requestPermission() {
  try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
      this.subscribeTopic();
        this.createNotificationListeners();
  } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
  }
}

// 4
async subscribeTopic (){
  firebase.messaging().subscribeToTopic(AppConstant.TOPIC);
  firebase.messaging().subscribeToTopic("woocommerce-mp-0");

}
showNotification = (notification)=>{
  firebase.notifications().displayNotification(notification)
  let {data} = notification;
  if(data && data.id_page){
    addNotofication(data.id_page);
  }
}

async createNotificationListeners() {
  // /*
  // * Triggered when a particular notification has been received in foreground
  // * */
  this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body, data } = notification;
      notification.setTitle(title).setBody(body).setSound("500");
      notification.android.setColor(ThemeConstant.ACCENT_COLOR);
      notification.android.setSmallIcon("ic_stat_name");

      notification.android.setPriority(firebase.notifications.Android.Priority.High) /// set to High
      notification.android.setChannelId("autocaptions")  ///for android 8.0 and above
      notification.android.setAutoCancel(true);
      
      const channel = new firebase.notifications.Android.Channel(
      "autocaptions",
      "Reminders",
      firebase.notifications.Android.Importance.High
    ).setDescription("Reminds you....");
    firebase.notifications().android.createChannel(channel).then(response=>{
      if(data.image){
        notification.android.setBigPicture( data.image, data.image, title, body);
      }
      this.showNotification(notification);
    }

    );
  });

  // /*
  // * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  // * */
  this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      this.onPressNotification(notificationOpen.notification.data);
      firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId)
  });

  // /*
  // * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  // * */
  const notificationOpen = await firebase.notifications().getInitialNotification();
  if (notificationOpen) {
    this.onPressNotification(notificationOpen.notification.data);
    firebase.notifications().removeDeliveredNotification(notificationOpen.notification.notificationId) 
  }
} 


onPressNotification = (data)=>{
  if(AppConstant.navigation){
    let routeData = getNotificationRoot(data);
    
    AppConstant.navigation.navigate(routeData.root, routeData.data);
  }else{
    this.setState({
      notification : data,
    })
  }
}

  render() {
    return (
      <Container style={{backgroundColor:ThemeConstant.BACKGROUND_COLOR }} >
        {Platform.OS === 'android' ? (
          <Header 
          style={{
            height: DeviceInfo.hasNotch() ? 30 : 24,
            backgroundColor: ThemeConstant.PRIMARY_COLOR
          }}
          androidStatusBarColor = {ThemeConstant.PRIMARY_COLOR}
          >
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent barStyle= "light-content" networkActivityIndicatorVisible/>
          </Header>
        ) :(
          <View
            style={{
              height: DeviceInfo.hasNotch()? 36 : 18,
              backgroundColor: ThemeConstant.PRIMARY_COLOR
            }}
          >
            <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent barStyle= "dark-content" networkActivityIndicatorVisible/>
            </View>
        )
      }
      <NavigationConst screenProps = {{isFromNotification : true, notificationData: this.state.notification, linkURL : this.state.linkURL }}/>
      </Container>      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

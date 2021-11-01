import React from "react";
import {View} from "native-base";
import { Image, Text,StyleSheet,BackHandler } from "react-native";
import {NavigationActions} from 'react-navigation'
import ThemeConstant from "../app_constant/ThemeConstant";
import _ from "lodash";
import CustomActionbar from "../container/CustomActionbar";
import { strings } from "../localize_constant/I18";

export default class OrderPlaceMessagePage extends React.Component {
    state={
        orderId : "",
        order_title :"",
        order_message:""
    }
    componentDidMount(){       
        this.setState({
          orderId:this.props.navigation.getParam("OrderId", "0"),
          order_title:this.props.navigation.getParam("order_title",  strings("ORDER_PLACE_MSG")),
          order_message:this.props.navigation.getParam("order_message",strings("OORDER_PLACE_SUBTITLE"))
      })
        BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    }
    onPressOrderView = ()=>{
        // this.props.navigation.navigate("CustomerOrderDetails", {orderId : this.state.orderId, isFromCheckout : true});
    }
    _handleBackPress = ()=>{
      this.onPressButton();
      return true
    }

    componentWillUnmount(){
      BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
    }
  

  onPressButton = () => {
    this.props.navigation.navigate("HomePage", {}, NavigationActions.navigate({ routeName: 'HomePageNavigation' }));
  };
  render() {
    return (
      <View style={{flex:1, backgroundColor:ThemeConstant.BACKGROUND_COLOR}}>
         <CustomActionbar
          title={strings("ORDER_PLACE_TITLE")}
          backwordTitle={strings("PAYMENT")}
          _onBackPress={this.onPressButton.bind(this)}
        />
        <View style={{ flex:1, justifyContent:"center", alignItems:"center"}}>
        <Image
          source={require("../../resources/images/order_place_msg.png")}
          style={{
            alignSelf: "center",
            width: ThemeConstant.EMPTY_ICON_SIZE,
            height: ThemeConstant.EMPTY_ICON_SIZE
          }}
        />
        <Text
          style={styles.titleText}
        >
          {this.state.order_title}
        </Text>

        <Text
          style={styles.messageText}
        >
          {strings("YOUR_ORDER_NUMBER_IS")}<Text style={{color:ThemeConstant.ACCENT_COLOR}} onPress={this.onPressOrderView} >{this.state.orderId}</Text>
        </Text>
        <Text
          style={styles.messageText}
        >
          {this.state.order_message}
        </Text>
          <Text
            style={styles.accentColorButtonStyle}
            onPress={_.debounce(this.onPressButton, 200)}
          >
            {strings("CONTINUE_SHOPPING")}
          </Text>
        </View>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  accentColorButtonStyle: {
    width: ThemeConstant.EMPTY_ICON_SIZE,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    fontWeight: "500",
    padding: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_LARGE
  },
  titleText: {
    alignSelf: "center",
    fontWeight: "500",
    textAlign: "center",
    marginTop: ThemeConstant.MARGIN_LARGE,
    fontSize:ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    color:ThemeConstant.DEFAULT_TEXT_COLOR
  },
  messageText:{
    alignSelf: "center",
    textAlign: "center",
    marginTop: ThemeConstant.MARGIN_LARGE,
    fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color:ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  }
});

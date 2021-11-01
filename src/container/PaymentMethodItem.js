import React from "react";
import { View, StyleSheet, Text, Platform, TouchableOpacity } from "react-native";
import { Radio,CheckBox } from "native-base";
import ThemeConstant from "../app_constant/ThemeConstant";
import { localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class PaymentMethodItem extends React.Component {
  state = {
    selectedItem: {},
    paymentData: {}
  };

  componentDidMount() {
    this.setState({
      paymentData: this.props.paymentData ? this.props.paymentData : {},
      selectedItem : this.props.selectedItem
    });
  }
  UNSAFE_componentWillUpdate (newProps){
   if(newProps.selectedItem != this.props.selectedItem){
     this.setState({
       selectedItem : newProps.selectedItem,
     })
   }
 }

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View style= {{margin:ThemeConstant.MARGIN_GENERIC }} >
        <TouchableOpacity activeOpacity={1} style={[styles.radioViewStyle, globleViewStyle]} onPress = {()=> this.props.onPressPaymentMethod(this.state.paymentData)} >
        {Platform.OS == 'android' ? 
          <Radio
            selected={this.state.paymentData.method_title === this.state.selectedItem.method_title}
            selectedColor={ThemeConstant.ACCENT_COLOR}
            color = {ThemeConstant.DEFAULT_CHECKBOX_COLOR}
            onPress = {()=> this.props.onPressPaymentMethod(this.state.paymentData)}
          />
          :
          <CheckBox style = {styles.checkBoxStyle}
          checked={this.state.paymentData.method_title === this.state.selectedItem.method_title}
          color = {ThemeConstant.ACCENT_COLOR}
          onPress = {()=> this.props.onPressPaymentMethod(this.state.paymentData)}
        />
    }
          <Text style={styles.radioButtonTextStyle} onPress = {()=> this.props.onPressPaymentMethod(this.state.paymentData) } >
            {this.state.paymentData.title}
          </Text>
        </TouchableOpacity>
        <Text style = {[styles.descriptionTextTitle, globalTextStyle]} > {this.state.paymentData.description} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  radioViewStyle: {
    flexDirection: "row",
  },
  radioButtonTextStyle: {
    fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight:'600',
    alignSelf: 'center',
    color : ThemeConstant.DEFAULT_CHECKBOX_COLOR,
    marginHorizontal : ThemeConstant.MARGIN_GENERIC,
  },
  descriptionTextTitle :{
    marginHorizontal: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_TINNY,
    fontWeight : '200',
    fontSize:ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color :ThemeConstant.DEFAULT_TEXT_COLOR
  },
  checkBoxStyle : {
    marginRight: ThemeConstant.MARGIN_NORMAL
  }

});

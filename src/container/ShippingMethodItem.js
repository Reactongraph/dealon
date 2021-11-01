import React from "react";
import { View, StyleSheet, Text, Platform} from "react-native";
import { Radio, CheckBox} from "native-base";
import ThemeConstant from "../app_constant/ThemeConstant";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject } from "../localize_constant/I18";

export default class ShippingMethodItem extends React.Component {
  state = {
    selectedItem: {},
    shippingData: {}
  };

  componentDidMount() {
    this.setState({
      shippingData: this.props.shippingData ? this.props.shippingData : {},
      selectedItem : this.props.selectedItem
    });
  }
  UNSAFE_componentWillUpdate (newProps){
    if(newProps.selectedItem != this.props.selectedItem){
      this.setState({
        selectedItem : newProps.selectedItem,
      })
    }
    if(newProps.shippingData != this.props.shippingData){
      this.setState({
        selectedItem : newProps.selectedItem,
        shippingData: newProps.shippingData ? newProps.shippingData : {},
      })
    }
  }

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
        const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View style={[styles.radioViewStyle, globleViewStyle]}>
      {Platform.OS == 'android' ?
        <Radio
          selected={
            this.state.selectedItem.method_id === this.state.shippingData.method_id }
          selectedColor={ThemeConstant.ACCENT_COLOR}
          color = {ThemeConstant.DEFAULT_CHECKBOX_COLOR}
          onPress = {()=> this.props.selectedShippingMethod(this.state.shippingData)}
        />
         : 
         <CheckBox style = {styles.checkBoxStyle}
         checked={
           this.state.selectedItem.method_id === this.state.shippingData.method_id }
         color = {ThemeConstant.ACCENT_COLOR}
         onPress = {()=> this.props.selectedShippingMethod(this.state.shippingData)}
       />
          }
        <Text style={styles.radioButtonTextStyle} 
          onPress = {()=> this.props.selectedShippingMethod(this.state.shippingData)}
          >
          {this.state.shippingData.method_title +
            " ( +" +
            this.state.shippingData.cost +
            " )"}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  radioViewStyle: {
    flexDirection: "row",
    margin: ThemeConstant.MARGIN_GENERIC
  },
  radioButtonTextStyle: {
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
    alignSelf: 'center',
    fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color : ThemeConstant.DEFAULT_CHECKBOX_COLOR,
    fontWeight:'600',
  },
  checkBoxStyle : {
    marginRight: ThemeConstant.MARGIN_NORMAL
  }

});

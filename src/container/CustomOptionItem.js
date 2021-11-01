import React from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { FlatList } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import _ from "lodash";
import { localeObject } from "../localize_constant/I18";

export default class CustomOptionItem extends React.Component {
  state = {
    attributeId: "",
    options: [],
    selecetedItem: ""
  };
   
  componentDidMount (){
      this.setState({
          options : this.props.options ? this.props.options : [],
          attributeId : this.props.attributeId ? this.props.attributeId : "",
          selecetedItem : this.props.selecetedItem 
      })
  }

  _onPressOption = option => {
    this.props.onPressOption(this.state.attributeId, option.slug);
    this.setState({
        selecetedItem : option.slug
    });
  };
  render() {
    return (
      <FlatList
        data={this.state.options}
        extraData = {this.state.selecetedItem}
        horizontal = {true}
        inverted = {localeObject.isRTL}
        renderItem={({ item }) => {
          return (
            <Text
              style={this.state.selecetedItem === item.slug ? styles.selectedStyle : styles.unSelectedStyle}
              onPress={_.debounce(this._onPressOption.bind(this, item), 300)}
            >
              {item.name}
            </Text>
          );
        }}
        keyExtractor = {(item, index)=> item.slug}
      />
    );
  }
}

const styles = StyleSheet.create({
  selectedStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR_2,
    textAlign: "center",
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    borderRadius: Platform.OS == 'android' ? 10 : 10 ,
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  },
  unSelectedStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    textAlign: "center",
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    borderRadius: Platform.OS == 'android' ? 10 : 10 ,
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  }
});

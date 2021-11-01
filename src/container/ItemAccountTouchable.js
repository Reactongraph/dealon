import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomIcon2 from "./CustomIcon2";
import ThemeConstant from "../app_constant/ThemeConstant";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";

export default class ItemAccountTouchable extends React.PureComponent {
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.eachItemstyle, globleViewStyle]}
        onPress={this.props.onPress}
      >
        <View style={[{ flex: 1, alignItems:"center" }, globleViewStyle]}>
          <CustomIcon2
            name={this.props.iconName}
            size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
            color={ThemeConstant.DEFAULT_ICON_COLOR}
          />
          <Text style={styles.eachItemTextStyle}>{this.props.title}</Text>
        </View>

        <CustomIcon2
          name={localeObject.isRTL ? "arrow-left" : "arrow-right"}
          size={ThemeConstant.DEFAULT_ICON_SIZE}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  eachItemstyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR_2,
    padding: ThemeConstant.MARGIN_NORMAL
  },
  eachItemTextStyle: {
    flex:1,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
  }
});

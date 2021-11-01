import React from "react";
import { Content,  } from "native-base";
import { Image, Text,StyleSheet } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { SCREEN_HEIGHT } from "../utility/UtilityConstant";
import _ from "lodash";
import PropTypes from "prop-types";

import { strings } from "../localize_constant/I18";

export default class EmptyLayoutComponent extends React.Component {
  onPressButton = () => {
    if (typeof this.props.onPress == "function") {
      this.props.onPress();
    }
  };
  render() {
    let iconName = this.props.iconName
      ? this.props.iconName
      : require("../../resources/images/ic_empty_bag.png");
    return (
      <Content
        scrollEnabled={true}
        contentContainerStyle={{
          height: SCREEN_HEIGHT - 100,
          flexDirection: "column",
          alignSelf: "stretch",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={iconName}
          style={{
            alignSelf: "center",
            width: ThemeConstant.EMPTY_ICON_SIZE,
            height: ThemeConstant.EMPTY_ICON_SIZE
          }}
        />

        <Text
          style={styles.titleText}
        >
          {this.props.title}
        </Text>

        <Text
          style={styles.messageText}
        >
          {this.props.message}
        </Text>
        {this.props.showButton ? (
          <Text
            style={styles.accentColorButtonStyle}
            onPress={_.debounce(this.onPressButton, 200)}
          >
            {this.props.buttonText}
          </Text>
        ) : null}
      </Content>
    );
  }
}
EmptyLayoutComponent.propTypes={
  title:PropTypes.string,
  buttonText:PropTypes.string,
  message:PropTypes.string.isRequired,
  showButton :PropTypes.bool
}
EmptyLayoutComponent.defaultProps={
  showButton:false,
  title:strings("OOPS")
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

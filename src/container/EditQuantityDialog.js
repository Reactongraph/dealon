import React from "react";
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
  TextInput
} from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";

import ViewStyle from "../app_constant/ViewStyle";
import { showErrorToast, showWarnToast } from "../utility/Helper";
import { strings, localeObject } from "../localize_constant/I18";
import { onlyDigitText } from "../utility/UtilityConstant";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export default class EditQuantityDialog extends React.Component {
  defaultQuantitySize = 5;
  state = {
    quantity: "1"
  };
  componentDidMount() {
    this.setState({
      quantity: this.props.quantity +""
    });
  }

  componentWillUpdate(newProps, newState) {
    if (this.props.quantity != newProps.quantity) {
      this.setState({
        quantity: newProps.quantity + ""
      });
    }
  }

  handleBackPress = () => {
    this.props.cancel();
  };
  _handleQuantity = () => {
    this.props.response(this.state.quantity);
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <Modal
        onRequestClose={() => {
          this.handleBackPress();
        }}
        visible={this.props.visible}
        animationType="slide"
        transparent={true}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPressOut={() => {
            this.handleBackPress();
          }}
        >
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <Text style={styles.headingTextColor} numberOfLines={2} ellipsizeMode="tail">{this.props.name}</Text>
              <TextInput
                style={[ViewStyle.inputTextStyle, { width: "75%", textAlign:localeObject.isRTL ? "right" : "left" }]}
                value={this.state.quantity}
                onChangeText={text => {
                  text = onlyDigitText(text).replace(".", "");
                    if(text.length < 4){
                        this.setState({
                            quantity: text
                          });
                    }else{
                        showWarnToast(strings("QUANTITY_EXCEED_ERROR"))
                    }
                }}
                placeholder="0"
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={styles.buttonContainer}
                activeOpacity={1}
                onPress={this._handleQuantity.bind(this)}
              >
                <Text
                  onPress={this._handleQuantity.bind(this)}
                  style={styles.buttonText}
                >
                  {strings("APPLY")}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    backgroundColor: "white",
    height: 220,
    width: 300,
    alignItems: "center",
    justifyContent: "space-between" ,
    padding: ThemeConstant.MARGIN_GENERIC
  },
  buttonContainer: {
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_LARGE,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    width: "75%"
  },
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold"
  },
  headingTextColor:{
    alignSelf:"stretch",
        textAlign:"center",
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
        fontWeight: "500",
        color: ThemeConstant.DEFAULT_TEXT_COLOR,
        margin: ThemeConstant.MARGIN_GENERIC,
        paddingBottom:ThemeConstant.MARGIN_GENERIC,
        borderBottomColor:ThemeConstant.LINE_COLOR_2,
        borderBottomWidth:0.5
  }
});

import React from "react";
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  Platform
} from "react-native";
import { View, Radio, CheckBox } from "native-base";
import { FlatList } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject } from "../localize_constant/I18";

export default class SortContainer extends React.Component {
  state = {
    sortData: [],
    sortedItem: {}
  };
  componentDidMount() {
    this.setState({
      sortData: this.props.data
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data != nextProps.data) {
      this.setState({
        sortData: nextProps.data,

      });
    }
  }

  _onPressSort = item => {
    this.props.onBack(item);
    this.setState({
      sortedItem : item
    })
  };
  handleBackPress = () => {
    this.props.onBack();
  };
  render() {
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
              {/* <ScrollView> */}
              <FlatList
                data={this.state.sortData}
                extraData={this.state.sortedItem}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                  activeOpacity={1}
                    style={[styles.radioViewStyle, globleViewStyle]}
                  >
                    {Platform.OS == "android" ? (
                      <Radio
                        selected={
                          (!this.state.sortedItem.value && index == 0) ||
                          this.state.sortedItem.value ==
                          item.value
                        }
                        style={styles.checkBoxStyle}
                        selectedColor={ThemeConstant.ACCENT_COLOR}
                        color={ThemeConstant.DEFAULT_CHECKBOX_COLOR}
                        onPress={this._onPressSort.bind(this, item)}
                      />
                    ) : (
                      <CheckBox
                        style={styles.checkBoxStyle}
                        checked={
                          (!this.state.sortedItem.value && index == 0) ||
                          this.state.sortedItem.value ==
                          item.value
                        }
                        color={ThemeConstant.ACCENT_COLOR}
                        onPress={this._onPressSort.bind(this, item)}
                      />
                    )}
                    <Text
                      style={styles.radioButtonTextStyle}
                      onPress={this._onPressSort.bind(this, item)}
                    >
                      {item.display}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.display}
              />
              {/* </ScrollView> */}
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
    justifyContent: "flex-end"
  },
  content: {
    backgroundColor: "white",
    alignItems: "stretch",
    alignSelf: "center",
    width: "100%",
    height: "60%",
    padding: ThemeConstant.MARGIN_GENERIC
  },
  checkBoxStyle : {
    marginHorizontal: ThemeConstant.MARGIN_NORMAL
  },
  radioViewStyle: {
    flex:1,
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
});

import React from "react";
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text
} from "react-native";
import { View, CheckBox } from "native-base";
import { ScrollView, FlatList } from "react-native";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { SCREEN_WIDTH } from "../../utility/UtilityConstant";

export default class SelectCategoryDialog extends React.Component {
  state = {
    categories: [],
    selectedCategories : [],
    isSelected : false
  };
  componentDidMount() {
    this.setState({
      categories: this.props.categories,
    });
  }
  componentWillUpdate(nextProps) {
    if (this.props.categories != nextProps.categories) {
      this.setState({
        categories: nextProps.categories,
      });
    }
  }
  onPressCheckBox = category => {
    this.setState({
      isSelected: !this.state.isSelected
    });
    category["isSelected"] =  !category["isSelected"];
    this.props.updateSelectedCategory(category);
  };
  handleBackPress = () => {
    this.props.onBack();
  };
  render() {
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
              <ScrollView>
                <FlatList
                  data={this.state.categories}
                  extraData={this.state.isSelected}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        style={styles.checkBoxViewStyle}
                        onPress={this.onPressCheckBox.bind(this, item)}
                      >
                        <Text style={styles.checkboxTitleStyle}>
                          {item.title}
                        </Text>
                        <CheckBox
                          checked={item.isSelected}
                          onPress={this.onPressCheckBox.bind(this, item)}
                          color={ThemeConstant.ACCENT_COLOR}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={item => item.id.toString()}
                />
              </ScrollView>
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
    height: "80%",
    width: SCREEN_WIDTH,
    borderRadius: 5,
    padding: 5
  },
  checkBoxViewStyle: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    marginTop: ThemeConstant.MARGIN_GENERIC,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    marginRight: ThemeConstant.MARGIN_GENERIC,
    padding: ThemeConstant.MARGIN_GENERIC,
    borderBottomColor: ThemeConstant.LINE_COLOR,
    borderBottomWidth: 0.5
  },
  checkboxTitleStyle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginRight: ThemeConstant.MARGIN_GENERIC
  }
});

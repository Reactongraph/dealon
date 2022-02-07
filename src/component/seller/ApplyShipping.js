import React from "react";
import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import { Picker, Icon } from "native-base";
import ThemeConstant from "../../app_constant/ThemeConstant";
import ViewStyle from "../../app_constant/ViewStyle";
import { strings } from "../../localize_constant/I18";
import { onlyDigitText } from "../../utility/UtilityConstant";

export default class ApplyShipping extends React.Component {
  state = {
    weight: "",
    height: "",
    width: "",
    length: "",
    shippingClasses: [{ id: "0", title: strings("NO_SHIPPING_CALSS") }],
    selectedShippingClass: {},
    dispatchedIn: "",
    selectedShippingMethod: "",
    shippingMethod: [{ id: "0", title: strings("SELECT_SHIPPING_METHOD") }],
  };

  updateinfoData = () => {
    this.props.getInfoProductData({ response: this.state });
  };

  componentDidMount() {
    this.setState(
      {
        shippingClasses:
          this.props.shippingInfo && this.props.shippingInfo.length > 0
            ? this.props.shippingInfo
            : [{ id: "0", title: strings("NO_SHIPPING_CALSS") }],
        weight: this.props.weight ? this.props.weight : "",
        width: this.props.width ? this.props.width : "",
        length: this.props.length ? this.props.length : "",
        height: this.props.height ? this.props.height : "",
      },
      () => this.updateinfoData()
    );
    this.updateShippingClass(
      this.props.shippingInfo,
      this.props.shipping_class_id
    );
  }

  componentWillUpdate(newProps) {
    if (newProps != this.props) {
      this.setState(
        {
          shippingClasses:
            newProps.shippingInfo && newProps.shippingInfo.length > 0
              ? newProps.shippingInfo
              : [{ id: "0", title: strings("NO_SHIPPING_CALSS") }],
          weight: newProps.weight ? newProps.weight : "",
          width: newProps.width ? newProps.width : "",
          length: newProps.length ? newProps.length : "",
          height: newProps.height ? newProps.height : "",
        },
        () => this.updateinfoData()
      );
      this.updateShippingClass(
        newProps.shippingInfo,
        newProps.shipping_class_id
      );
    }
  }

  updateShippingClass = (options, value) => {
    options = options ? options : [];
    options.forEach((element) => {
      if (element.id == value) {
        this._selectShippingClass(element);
      }
    });
  };

  _selectShippingClass = (selectedClass) => {
    this.setState(
      {
        selectedShippingClass: selectedClass,
      },
      () => this.updateinfoData()
    );
  };

  render() {
  	console.log("dispatchedIndispatchedIn",this.state.dispatchedIn)
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headingTextStyle}>{strings("WEIGHT")}</Text>
        <TextInput
          style={ViewStyle.inputTextStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.weight}
          onChangeText={(text) => {
            this.setState({ weight: onlyDigitText(text) }, () =>
              this.updateinfoData()
            );
          }}
          maxLength={5}
          keyboardType="number-pad"
          returnKeyType="next"
          placeholder={"0"}
        />
        <Text style={styles.headingTextStyle}>{strings("DIMENTIONS")}</Text>
        <Text style={styles.subHeadingTextStyle}>{strings("LENGTH")}</Text>
        <TextInput
          style={ViewStyle.inputTextStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.length}
          onChangeText={(text) => {
            this.setState({ length: onlyDigitText(text) }, () =>
              this.updateinfoData()
            );
          }}
          maxLength={5}
          keyboardType="number-pad"
          returnKeyType="next"
          placeholder={"0"}
        />
        <Text style={styles.subHeadingTextStyle}>{strings("WIDTH")}</Text>
        <TextInput
          style={ViewStyle.inputTextStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.width}
          onChangeText={(text) => {
            this.setState({ width: onlyDigitText(text) }, () =>
              this.updateinfoData()
            );
          }}
          maxLength={5}
          keyboardType="number-pad"
          returnKeyType="next"
          placeholder={"0"}
        />
        <Text style={styles.subHeadingTextStyle}>{strings("HEIGHT")}</Text>
        <TextInput
          style={ViewStyle.inputTextStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.height}
          onChangeText={(text) => {
            this.setState({ height: onlyDigitText(text) }, () =>
              this.updateinfoData()
            );
          }}
          maxLength={5}
          keyboardType="number-pad"
          returnKeyType="next"
          placeholder={"0"}
        />
        <Text style={styles.headingTextStyle}>{strings("SHIPPING_CLASS")}</Text>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          placeholder={strings("SHIPPING_CLASS")}
          selectedValue={this.state.selectedShippingClass}
          onValueChange={this._selectShippingClass.bind(this)}
          style={styles.pickerStyle}
        >
          {this.state.shippingClasses.map((shippingClass, i) => {
            return (
              <Picker.Item
                key={i}
                value={shippingClass}
                label={shippingClass.title}
              />
            );
          })}
        </Picker>

        <Text style={styles.headingTextStyle}>{strings("DISPATCHED_IN")}</Text>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          selectedValue={this.state.dispatchedIn}
          onValueChange={(value) =>
            this.setState({
              dispatchedIn: value,
            })
          }
          style={styles.pickerStyle}
        >
          <Picker.Item
            label="Select Dispatch Days"
            value="Select Dispatch Days"
          />
          <Picker.Item label="1 Days" value="1" />
          <Picker.Item label="2 Days" value="2" />
          <Picker.Item label="3 Days" value="3" />
          <Picker.Item label="4 Days" value="4" />
          <Picker.Item label="5 Days" value="5" />
          <Picker.Item label="6 Days" value="6" />
          <Picker.Item label="7 Days" value="7" />
          <Picker.Item label="8 Days" value="8" />
          <Picker.Item label="9 Days" value="9" />
          <Picker.Item label="10 Days" value="10" />
        </Picker>

        <Text style={styles.headingTextStyle}>
          {strings("SHIPPING_METHOD")}
        </Text>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          placeholder={strings("SHIPPING_METHOD")}
          selectedValue={this.state.selectedShippingMethod}
          // onValueChange={this._selectShippingClass.bind(this)}
          style={styles.pickerStyle}
        >
          {this.state.shippingMethod.map((shippingMethod, i) => {
            return (
              <Picker.Item
                key={i}
                value={shippingMethod}
                label={shippingMethod.title}
              />
            );
          })}
        </Picker>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: ThemeConstant.MARGIN_GENERIC,
    borderWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR,
  },
  headingTextStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
  },
  subHeadingTextStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
  },
  inputTextStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    margin: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_GENERIC,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
  },
  pickerStyle: {
    marginTop: 0,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
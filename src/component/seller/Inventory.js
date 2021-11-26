import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import StringConstant from "../../app_constant/StringConstant";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { CheckBox, Picker, Icon } from "native-base";
import _ from "lodash";
import { ScrollView } from "react-native";
import { strings } from "../../localize_constant/I18";
import { onlyDigitText } from "../../utility/UtilityConstant";

export default class Inventory extends React.Component {
  state = {
    isEnableBackOrder: false,
    stockQuantity: "",
    backorderOptions: [],
    selectedBackorder: {},
    stockStatusOptions: [],
    selectedStatus: {},
    isFirst: false,
  };
  componentDidMount() {
    this.setState(
      {
        backorderOptions: this.props.backorderOptions,
        stockStatusOptions: this.props.stockStatusOptions
          ? this.props.stockStatusOptions
          : [],
        isEnableBackOrder: this.props.manage_stock,
        stockQuantity: this.props.stock_quantity ? this.props.stock_quantity + "" : ""
      },
      () => this.updateinfoData()
    );

    this.updateStockStatusOption(
      this.props.stockStatusOptions,
      this.props.stock_status
    );
    this.updateBackOrderOption(
      this.props.backorderOptions,
      this.props.backorders
    );
  }
  componentWillUpdate(newProps) {
    if (this.props != newProps) {
      this.setState({
        backorderOptions: newProps.backorderOptions,
        stockStatusOptions: newProps.stockStatusOptions
          ? newProps.stockStatusOptions
          : [],
        isEnableBackOrder: newProps.manage_stock,
        stockQuantity: newProps.stock_quantity + ""
      });
      this.updateStockStatusOption(
        newProps.stockStatusOptions,
        newProps.stock_status
      );
      this.updateBackOrderOption(
        newProps.backorderOptions,
        newProps.backorders
      );
    }

    if (newProps.isGetProductInfoData) {
      this.props.getInfoProductData({ response: this.state });
    }
  }

  updateinfoData = () => {
    this.props.getInfoProductData({ response: this.state });

  };

  updateStockStatusOption = (options, value) => {
    options = options ? options : [];
    options.forEach(element => {
      if (element.id == value) {
        this._selectStatus(element);
      }
    });
  };

  updateBackOrderOption = (options, value) => {
    options = options ? options : [];
    options.forEach(element => {
      if (element.id == value) {
        this._selectBackOrder(element);
      }
    });
  };



  _selectStatus = status => {

    if (status.title == "In Stock") {

      console.log("check first value >>>> "+ this.state.isFirst)

      if(this.state.isFirst){
        this.setState({ stockQuantity: "1",isFirst:true })
      }

    }

    if(status.title=="Out Of Stock"){
      this.setState({ stockQuantity: "0" ,isFirst:true})
    }

    this.setState(
      {
        selectedStatus: status
      },

      () => this.updateinfoData()
    );
  };

  _selectBackOrder = backOrder => {
    this.setState(
      {
        selectedBackorder: backOrder
      },
      () => this.updateinfoData()
    );
  };

  _onPressEnableBackOrder = () => {
    this.setState(
      {
        isEnableBackOrder: !this.state.isEnableBackOrder
      },
      () => this.updateinfoData()
    );
  };


  setValueSelected(status) {
    console.log("check value status >>>> " + JSON.stringify(status))
    if (status.title == "Out Of Stock") {
      this.setState({ stockQuantity: "0" })
    } else {
      this.setState({ stockQuantity: "1" })
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headingTextStyle}>
          {strings("MANAGE_STOCK")}
        </Text>
        <TouchableOpacity
          style={styles.checkBoxViewStyle}
          onPress={_.debounce(this._onPressEnableBackOrder, 300)}
        >
          <CheckBox
            checked={this.state.isEnableBackOrder}
            color={ThemeConstant.ACCENT_COLOR}
            onPress={_.debounce(this._onPressEnableBackOrder, 300)}
          />
          <Text style={styles.checkboxTitleStyle}>
            {strings("ENABLE_STOCK_LABEL_MSG")}
          </Text>
        </TouchableOpacity>
        {this.state.isEnableBackOrder ? (
          <View>
            <Text style={styles.headingTextStyle}>
              {strings("STOCK_QTY")}
            </Text>
            <TextInput
              style={styles.inputTextStyle}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.stockQuantity}
              onChangeText={text => {
                text = onlyDigitText(text).replace(".", "");
                this.setState({ stockQuantity: text }, () =>
                  this.updateinfoData()
                );
              }}
              maxLength={5}
              keyboardType="number-pad"
              returnKeyType="next"
              placeholder={"0"}
            />

            <Text style={styles.headingTextStyle}>
              {strings("ALLOW_BACK_ORDER")}
            </Text>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholder={strings("ALLOW_BACK_ORDER")}
              selectedValue={this.state.selectedBackorder}
              onValueChange={this._selectBackOrder.bind(this)}
              style={styles.pickerStyle}
            >
              {this.state.backorderOptions.map((option, i) => {

                return (
                  <Picker.Item key={i} value={option} label={option.title} />
                );
              })}
            </Picker>
          </View>
        ) : null}

        <Text style={styles.headingTextStyle}>
          {strings("STOCK_STATUS")}
        </Text>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          placeholder={strings("ALLOW_BACK_ORDER")}
          selectedValue={this.state.selectedStatus}
          onValueChange={this._selectStatus.bind(this)}
          style={styles.pickerStyle}>



          {this.state.stockStatusOptions.map((stock, i) => {



            return <Picker.Item key={i} value={stock} label={stock.title} />;
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
    borderColor: ThemeConstant.LINE_COLOR
  },
  headingTextStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC
  },
  checkBoxViewStyle: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    // justifyContent: 'space-between',
    marginTop: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_GENERIC
  },
  checkboxTitleStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_LARGE
  },
  inputTextStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    margin: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_GENERIC,
    marginLeft: ThemeConstant.MARGIN_GENERIC
  },
  pickerStyle: {
    marginTop: 0,
    paddingTop: 5,
    paddingBottom: 5
  }
});

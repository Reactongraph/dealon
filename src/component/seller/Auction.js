import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import StringConstant from "../../app_constant/StringConstant";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { CheckBox, Picker, Icon } from "native-base";
import _ from "lodash";
import { ScrollView } from "react-native";
import { strings } from "../../localize_constant/I18";
import { onlyDigitText } from "../../utility/UtilityConstant";
import DatePicker from "react-native-datepicker";
// import { TimePicker } from "react-native-simple-time-picker";

export default class Auction extends React.Component {
  state = {
    auctionStatus: "",
    productName: "",
    startingPrice: "",
    reservePrice: "",
    startAuctionTime: "",
    stopAuctionTime: "",
    numberOfDays: "",
    minimumQuantity: "",
    maximumQuantity: "",
    date: "",
    incrementStatus: "",
    automaticeStatus: "",

   	//unused
    selectedMinutes: 0,
    selectedHours: 0,

    isEnableBackOrder: false,
    stockQuantity: "",
    backorderOptions: [],
    selectedBackorder: {},
    stockStatusOptions: [],
    selectedStatus: {},
  };

  componentDidMount() {
    this.setState(
      {
        backorderOptions: this.props.backorderOptions,
        stockStatusOptions: this.props.stockStatusOptions
          ? this.props.stockStatusOptions
          : [],
        isEnableBackOrder: this.props.manage_stock,
        stockQuantity: this.props.stock_quantity
          ? this.props.stock_quantity + ""
          : "",

        productName: this.props.productName
          ? this.props.productName
          : "",
        auctionStatus: this.props.auctionStatus
          ? this.props.auctionStatus
          : "",
        startingPrice: this.props.startingPrice
          ? this.props.startingPrice
          : "",
        reservePrice: this.props.reservePrice
          ? this.props.reservePrice
          : "",
        startAuctionTime: this.props.startAuctionTime
          ? this.props.startAuctionTime
          : "",
        stopAuctionTime: this.props.stopAuctionTime
          ? this.props.stopAuctionTime
          : "",
        numberOfDays: this.props.numberOfDays
          ? this.props.numberOfDays
          : "",
        minimumQuantity: this.props.minimumQuantity
          ? this.props.minimumQuantity
          : "",
        maximumQuantity: this.props.maximumQuantity
          ? this.props.maximumQuantity
          : "",
        incrementStatus: this.props.incrementStatus
          ? this.props.incrementStatus
          : "",
        automaticeStatus: this.props.automaticeStatus
          ? this.props.automaticeStatus
          : "",
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
        stockQuantity: newProps.stock_quantity + "",

        productName: newProps.productName
          ? newProps.productName
          : "",
        auctionStatus: newProps.auctionStatus
          ? newProps.auctionStatus
          : "",
        startingPrice: newProps.startingPrice
          ? newProps.startingPrice
          : "",
        reservePrice: newProps.reservePrice
          ? newProps.reservePrice
          : "",
        startAuctionTime: newProps.startAuctionTime
          ? newProps.startAuctionTime
          : "",
        stopAuctionTime: newProps.stopAuctionTime
          ? newProps.stopAuctionTime
          : "",
        numberOfDays: newProps.numberOfDays
          ? newProps.numberOfDays
          : "",
        minimumQuantity: newProps.minimumQuantity
          ? newProps.minimumQuantity
          : "",
        maximumQuantity: newProps.maximumQuantity
          ? newProps.maximumQuantity
          : "",
        incrementStatus: newProps.incrementStatus
          ? newProps.incrementStatus
          : "",
        automaticeStatus: newProps.automaticeStatus
          ? newProps.automaticeStatus
          : "",
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
      this.props.getInfoProductData({
        response: this.state,
      });
    }
  }

  updateinfoData = () => {
    this.props.getInfoProductData({
      response: this.state,
    });
  };

  updateStockStatusOption = (options, value) => {
    options = options ? options : [];
    options.forEach((element) => {
      if (element.id == value) {
        this._selectStatus(element);
      }
    });
  };

  updateBackOrderOption = (options, value) => {
    options = options ? options : [];
    options.forEach((element) => {
      if (element.id == value) {
        this._selectBackOrder(element);
      }
    });
  };

  _selectStatus = (status) => {
    if (status.title == "Enabled") {
      console.log("check first value >>>> " + this.state.isFirst);

      if (this.state.isFirst) {
        this.set_selectBackOrderState({
          stockQuantity: "1",
          isFirst: true,
        });
      }
    }

    if (status.title == "Disabled") {
      this.setState({
        stockQuantity: "0",
        isFirst: true,
      });
    }

    this.setState(
      {
        selectedStatus: status,
      },

      () => this.updateinfoData()
    );
  };

  _selectBackOrder = (backOrder) => {
    this.setState(
      {
        selectedBackorder: backOrder,
      },
      () => this.updateinfoData()
    );
  };

  render() {
    const { date } = this.state;
    // console.log("this.state.startingPrice>>>",this.state.startingPrice)
    // console.log("this.state.reservePrice>>>",this.state.reservePrice)
    // console.log("this.state.startAuctionTime>>>",this.state.startAuctionTime)
    // console.log("this.state.stopAuctionTime>>>",this.state.stopAuctionTime)
    // console.log("this.state.numberOfDays>>>",this.state.numberOfDays)
    // console.log("this.state.minimumQuantity>>>",this.state.minimumQuantity)
    // console.log("this.state.maximumQuantity>>>",this.state.maximumQuantity)
    // console.log("this.state.incrementStatus>>>",this.state.incrementStatus)
    // console.log("this.state.automaticeStatus>>>",this.state.automaticeStatus)
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headingTextStyle}>{strings("AUCTION_STATUS")}</Text>
        <Picker
          mode="dropdown"
          iosIcon={<Icon name="arrow-down" />}
          selectedValue={this.state.auctionStatus}
          onValueChange={(value) =>{
            this.setState({
              auctionStatus: value,
            },
      			() => this.updateinfoData())
          }}
          style={styles.pickerStyle}
        >
          <Picker.Item label="Select" value="Unknown" />
          <Picker.Item label="Enabled" value="Enabled" />
          <Picker.Item label="Disabled" value="Disabled" />
        </Picker>
        {this.state.auctionStatus =="Enabled" ?<>
        <View>
          <Text style={styles.headingTextStyle}>
            {strings("PRODUCTT_NAME")}
          </Text>
          <TextInput
            style={ViewStyle.inputTextStyle}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.productName}
            // onChangeText={(text) => {
            //   this.setState({ productName: text }, () => this.updateinfoData());
            // }}
            editable={false}
            keyboardType="default"
            returnKeyType="next"
          />

          <Text style={styles.headingTextStyle}>
            {strings("STARTING_PRICE")}
          </Text>
          <TextInput
            style={ViewStyle.inputTextStyle}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.startingPrice}
            onChangeText={(text) => {
              this.setState({ startingPrice: text }, () =>
                this.updateinfoData()
              );
            }}
            keyboardType="number-pad"
            returnKeyType="next"
            placeholder={"Enter auction starting Price"}
          />

          <Text style={styles.headingTextStyle}>
            {strings("RESERVE_PRICE")}
          </Text>
          <TextInput
            style={ViewStyle.inputTextStyle}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.reservePrice}
            onChangeText={(text) => {
              this.setState({ reservePrice: text }, () =>
                this.updateinfoData()
              );
            }}
            keyboardType="number-pad"
            returnKeyType="next"
            placeholder={"Enter auction reserve Price"}
          />

          <Text style={styles.headingTextStyle}>
            {strings("START_AUCTION_TIME")}
          </Text>

          <DatePicker
            // style={ViewStyle.date}
            style={{ width: 400 }}
            date={this.state.startAuctionTime}
            mode="datetime"
            placeholder="Enter auction starting time"
            format="YYYY-MM-DD, h:mm:ss"
            minDate="2001-05-01"
            maxDate="2050-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            customStyles={{
              dateIcon: {
                // position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(value) => {
              this.setState({
                startAuctionTime: value,
              },
      				() => this.updateinfoData());
            }}
          />

          <Text style={styles.headingTextStyle}>
            {strings("STOP_AUCTION_TIME")}
          </Text>
          <DatePicker
            // style={ViewStyle.date}
            style={{ width: 400 }}
            date={this.state.stopAuctionTime}
            mode="datetime"
            placeholder="Enter auction stop time"
            format="YYYY-MM-DD, h:mm:ss"
            minDate="2001-05-01"
            maxDate="2050-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showTimeSelect
            //dateFormat="MMMM d, yyyy h:mm aa"
            customStyles={{
              dateIcon: {
                // position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(value) => {
              this.setState({
                stopAuctionTime: value,
              },
      				() => this.updateinfoData());
            }}
          />
          <View>
            {/*<TimePicker
              selectedHours={this.state.selectedHours}
              //initial Hourse value
              selectedMinutes={this.state.selectedMinutes}
              //initial Minutes value
              onChange={(hours, minutes) => {
                this.setState({
                  selectedHours: hours,
                  selectedMinutes: minutes,
                });
              }}
            />*/}
          </View>

          {/* <TextInput
            style={ViewStyle.inputTextStyle}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.stopAuctionTime}
            onChangeText={(text) => {
              this.setState({ stopAuctionTime: text }, () =>
                this.updateinfoData()
              );
            }}
            keyboardType="default"
            returnKeyType="next"
            placeholder={"Enter auction stop time"}
          /> */}

          <Text style={styles.headingTextStyle}>
            {strings("NUMBER_OF_DAYS_TILL_WINNER_CAN_BUY")}
          </Text>
          <TextInput
            style={ViewStyle.inputTextStyle}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.numberOfDays}
            onChangeText={(text) => {
              text = onlyDigitText(text).replace(".", "");
              this.setState({ numberOfDays: text }, () =>
                this.updateinfoData()
              );
            }}
            maxLength={5}
            keyboardType="number-pad"
            returnKeyType="next"
          />

          <Text style={styles.headingTextStyle}>
            {strings("MAXIMUM_QUANTITY")}
          </Text>
          <TextInput
            style={ViewStyle.inputTextStyle}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.maximumQuantity}
            onChangeText={(text) => {
              text = onlyDigitText(text).replace(".", "");
              this.setState({ maximumQuantity: text }, () =>
                this.updateinfoData()
              );
            }}
            maxLength={5}
            keyboardType="number-pad"
            returnKeyType="next"
            placeholder={"Miximum product quantity winner can buy."}
          />

          <Text style={styles.headingTextStyle}>
            {strings("MINIMUM_QUANTITY")}
          </Text>
          <TextInput
            style={ViewStyle.inputTextStyle}
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.minimumQuantity}
            onChangeText={(text) => {
              text = onlyDigitText(text).replace(".", "");
              this.setState({ minimumQuantity: text }, () =>
                this.updateinfoData()
              );
            }}
            maxLength={5}
            keyboardType="number-pad"
            returnKeyType="next"
            placeholder={"Minimum product quantity winner can buy."}
          />

          <Text style={styles.headingTextStyle}>
            {strings("INCREMENT_OPTION")}
          </Text>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            selectedValue={this.state.incrementStatus}
            onValueChange={(value) =>
              this.setState({
                incrementStatus: value,
              },
      				() => this.updateinfoData())
            }
            style={styles.pickerStyle}
          >
            <Picker.Item label="Select" value="Unknown" />
            <Picker.Item label="Enabled" value="Enabled" />
            <Picker.Item label="Disabled" value="Disabled" />
          </Picker>

          <Text style={styles.headingTextStyle}>
            {strings("AUTOMATICE_OPTION")}
          </Text>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            selectedValue={this.state.automaticeStatus}
            onValueChange={(value) =>
              this.setState({
                automaticeStatus: value,
              },
      				() => this.updateinfoData())
            }
            style={styles.pickerStyle}
          >
            <Picker.Item label="Select" value="Unknown" />
            <Picker.Item label="Enabled" value="Enabled" />
            <Picker.Item label="Disabled" value="Disabled" />
          </Picker>
        </View>
        </> : null
      	}
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
  checkBoxViewStyle: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    // justifyContent: 'space-between',
    marginTop: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_GENERIC,
  },
  checkboxTitleStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_LARGE,
  },
  inputTextStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    margin: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_GENERIC,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
  },
  date: {
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
  buttonContainer: {
    alignSelf: "stretch",
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_LARGE,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    marginRight: ThemeConstant.MARGIN_TINNY,
    borderRadius: ThemeConstant.MARGIN_TINNY,
  },
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold",
  },
});

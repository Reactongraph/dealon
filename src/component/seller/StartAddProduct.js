import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import CustomActionbar from "../../container/CustomActionbar";
import StringConstant from "../../app_constant/StringConstant";
import ThemeConstant from "../../app_constant/ThemeConstant";
import {
  Picker,
  Header,
  Button,
  Icon,
  Body,
  Title,
  CheckBox,
  Right,
  Left
} from "native-base";
import { FlatList, ScrollView } from "react-native";
import Loading from "../../container/LoadingComponent";
import MaintenanceLayout from "../../container/MaintenanceLayout";
import { showSuccessToast, showErrorToast } from "../../utility/Helper";
import { strings } from "../../localize_constant/I18";

export default class StartAddProduct extends React.Component {
  sellerId = 0;
  isComponentActive = true;
  state = {
    isServerMaintenance: false,
    isLoading: true,
    categories: [],
    productTypes: [],
    selectedProductType: {},
    isSelected: false
  };
  componentWillUnmount() {
    this.isComponentActive = false;
  }
  componentDidMount() {
    this.sellerId = this.props.navigation.getParam("sellerId", 0);
    this.isComponentActive = true;
    this.callAPI();
  }
  callAPI = () => {
    this.setState({
      isLoading: true
    });
    let url =
      AppConstant.BASE_URL + "seller/product/add?seller_id=" + this.sellerId;
    fetchDataFromAPI(url, "GET", "", null).then(response => {
      if (this.isComponentActive) {
        this.setState({
          isLoading: false
        });
        if (response && response.success) {
          let categories = response.categories;
          categories.forEach(element => {
            element["isSelected"] = false;
          });
          console.log("Category", categories);

          this.setState({
            categories: categories,
            productTypes: response.productTypes,
            selectedProductType: response.productTypes[0],
            isServerMaintenance: false
          });
        } else {
          this.setState({
            isServerMaintenance: true
          });
        }
      }
    });
  };
  _selectProductType = productType => {
    this.setState({
      selectedProductType: productType
    });
  };
  onPressCheckBox = category => {
    this.setState({
      isSelected: !this.state.isSelected
    });
    category["isSelected"] = !category["isSelected"];
  };
  onPressAddNewProduct = () => {
    let isValid = false;
    this.state.categories.forEach(element => {
      if (element["isSelected"] != false) {
        isValid = true;
      }
    });
    if (isValid) {
      this.props.navigation.navigate("NewProductInformationEdit", {
        sellerId: this.sellerId,
        categories: this.state.categories,
        productType: this.state.selectedProductType
      });
    } else {
      showErrorToast(strings("ERROR_NOT_SELECTED_CATEGORY"));
    }
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          backwordTitle={strings("BACK")}
          title={strings("ADD_NEW_PRODUCT")}
          iconName={"next"}
          _onBackPress={this._onBackPress}
          _onForwordPress={this.onPressAddNewProduct.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View>
            {this.state.isServerMaintenance ? (
              <MaintenanceLayout
                onPress={this.callAPI.bind(this)}
                message={strings("SERVER_MAINTENANCE")}
              />
            ) : (
              <ScrollView contentContainerStyle={styles.containerStyle}>
                <Text style={styles.headingTextStyle}>
                  {strings("SELECT_SELLER_PRODUCT_TYPE")}
                </Text>
                <Picker
                  mode="dropdown"
                  placeholder="Country"
                  iosIcon={<Icon name="arrow-down" />}
                  // renderHeader={backAction => (
                  //   <Header
                  //     style={{ backgroundColor: ThemeConstant.PRIMARY_COLOR }}
                  //   >
                  //     <Left>
                  //       <Button transparent onPress={backAction}>
                  //         <Icon name="arrow-back" />
                  //       </Button>
                  //     </Left>
                  //     <Body style={{ flex: 3 }}>
                  //       <Title>
                  //         {strings("")SELECT_SELLER_PRODUCT_TYPE}
                  //       </Title>
                  //     </Body>
                  //     <Right />
                  //   </Header>
                  // )}
                  selectedValue={this.state.selectedProductType}
                  onValueChange={this._selectProductType.bind(this)}
                  style={styles.pickerStyle}
                >
                  {this.state.productTypes.map((productType, i) => {
                    return (
                      <Picker.Item
                        key={i}
                        value={productType}
                        label={productType.title}
                      />
                    );
                  })}
                </Picker>
                <Text style={styles.headingTextStyle}>
                  {strings("SELECET_CATEGORY")}
                </Text>
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
            )}
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    padding: ThemeConstant.MARGIN_GENERIC
  },
  pickerStyle: {
    marginTop: 0,
    paddingTop: 5,
    paddingBottom: 5
  },
  headingTextStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC
  },
  checkBoxViewStyle: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
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
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  }
});

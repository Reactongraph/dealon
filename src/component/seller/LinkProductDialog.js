import React from "react";
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text
} from "react-native";
import { View, CheckBox, Header, Item, Icon, Input } from "native-base";
import { ScrollView, FlatList } from "react-native";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { SCREEN_WIDTH, isStringEmpty } from "../../utility/UtilityConstant";
import StringConstant from "../../app_constant/StringConstant";
import _ from "lodash";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { strings } from "../../localize_constant/I18";

export default class LinkedProductDialog extends React.Component {
  searchText = "";
  state = {
    products: [],
    selectedProducts: [],
    isSelected: false,
    searchType: 0,
    message: strings("SEARCH_START_EMPTY_TEXT"),
  };
  componentDidMount() {
    this.setState({
      selectedProducts: this.props.selectedProducts,
      searchType: this.props.searchType
    });
  }
  componentWillUpdate(nextProps) {
    if (this.props.selectedProducts != nextProps.selectedProducts) {
      this.setState({
        selectedProducts: nextProps.selectedProducts,
        searchType: nextProps.searchType,
        products: []
      });
    }
  }
  updateSelection = (selectedProducts, products) => {
    selectedProducts = selectedProducts ? selectedProducts : [];
    let selectedIds = selectedProducts.map(item => {
      return typeof item.id == "string" ? parseInt(item.id) : item.id;
    });
    selectedIds = selectedIds ? selectedIds : [];
    console.log(selectedIds);
    products.forEach(element => {
      element.id =
        typeof element.id == "string" ? parseInt(element.id) : element.id;
      if (selectedIds.includes(element.id)) {
        element["isSelected"] = true;
      } else {
        element["isSelected"] = false;
      }
    });
  };

  searchFilterFunction = text => {
    if(!isStringEmpty(this.searchText) && this.searchText.length > 2 && text.length < 3){
        text = "";
      }
    if (isStringEmpty(text) || text.length > 2) {
      let url =
        AppConstant.BASE_URL +
        "seller/product/search?seller_id=" +
        this.props.sellerId +
        "&s=" +
        text;
      this.searchText = text;
      fetchDataFromAPI(url, "GET", "", null).then(response => {
        if (response.success) {
          this.updateSelection(this.state.selectedProducts, response.products);
          this.setState({
            products: response.products
          });
        } else {
          this.setState({
            products: [],
              message: strings("NO_PRODUCT_FOUND_MSG"),
          });
        }
      });
    }
  };

  onPressCheckBox = product => {
    product["isSelected"] = !product["isSelected"];
    this.setState({
      isSelected: !this.state.isSelected
    });
    this.props.updateSelectedProducts(product, this.state.searchType);
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
              <Header
                searchBar
                rounded
                style={{
                  backgroundColor: ThemeConstant.PRIMARY_COLOR,
                  alignSelf: "stretch",
                  margin: 5
                }}
                androidStatusBarColor={ThemeConstant.DARK_PRIMARY_COLOR}
              >
                <Item>
                  <Icon
                    name="ios-search"
                    size={ThemeConstant.DEFAULT_ICON_SIZE}
                  />
                  <Input
                    placeholder={strings("SEARCH_PLACEHOLDER_TEXT")}
                    onChangeText={_.debounce(this.searchFilterFunction, 800)}
                    style={{
                      fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                      fontWeight: "normal",
                      color: ThemeConstant.HEADING_TEXT_TITLE_COLOR
                    }}
                    // onEndEditing = {this._onPressSearchALL.bind(this)}
                  />
                </Item>
              </Header>
              <ScrollView>
                <FlatList
                  data={this.state.products}
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
                  ListEmptyComponent={
                    
                    <Text style={styles.emptyStyle}>{this.state.message} 
                     <Text style={styles.emptySubTextStyle} >{ "\n"+ strings("SEARCH_3_MORE_CHAR_MSG")}</Text>
                    </Text>
                  }
                  keyExtractor={(item, index) => index + ""}
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
    height: "90%",
    width: SCREEN_WIDTH,
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
  },
  emptyStyle: {
    flex: 1,
    alignSelf: "center",
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_NORMAL
  },
  emptySubTextStyle: {
    flex: 1,
    alignSelf: "center",
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY
  }
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import StringConstant from "../../app_constant/StringConstant";
import { FlatList, ScrollView } from "react-native";
import LinkedProductDialog from "./LinkProductDialog";
import AppConstant from "../../app_constant/AppConstant";
import _ from "lodash";
import ThemeConstant from "../../app_constant/ThemeConstant";
import CustomIcon2 from "../../container/CustomIcon2";
import { strings } from "../../localize_constant/I18";

export default class SellerLinkedProduct extends React.Component {
  state = {
    upselles: [],
    crossSelles: [],
    groupedProduct: [],
    searchDialogVisible: false,
    selectedProducts: {},
    sellerId: 0
  };
  componentDidMount() {
    this.setState({
      sellerId: this.props.sellerId,
      upselles: this.props.upselles ? this.props.upselles : [],
      crossSelles: this.props.crossSelles ? this.props.crossSelles : [],
      groupedProduct: this.props.groupedProduct
        ? this.props.groupedProduct
        : [],
      productType: this.props.productType
    });
  }
  componentWillUpdate(nextProps) {
    if (nextProps != this.props) {
      this.setState({
        upselles: nextProps.upselles ? nextProps.upselles : [],
        crossSelles: nextProps.crossSelles ? nextProps.crossSelles : [],
        groupedProduct: nextProps.groupedProduct
          ? nextProps.groupedProduct
          : [],
        productType: this.props.productType
      });
    }
  }

  updateSelectedProducts = (product, type) => {
    console.log("Selected=>>>", typeof product.id);
    product.id =
      typeof product.id == "string" ? parent(product.id) : product.id;
    switch (type) {
      case AppConstant.TYPE_UP_SELL:
        if (product["isSelected"]) {
          this.state.upselles.push({ id: product.id, title: product.title });
        } else {
          let selectedIndex = 0;
          this.state.upselles.forEach((element, index) => {
            if (element.id == product.id) {
              selectedIndex = index;
            }
          });
          this.state.upselles.splice(selectedIndex, 1);
        }
        this.setState(
          {
            upselles: this.state.upselles
          },
          () => {
            this.props.getLinkProductInfo(this.state);
          }
        );
        break;
      case AppConstant.TYPE_CROSS_SELL:
        if (product["isSelected"]) {
          this.state.crossSelles.push({ id: product.id, title: product.title });
        } else {
          let selectedIndex = 0;
          this.state.crossSelles.forEach((element, index) => {
            if (element.id == product.id) {
              selectedIndex = index;
            }
          });
          this.state.crossSelles.splice(selectedIndex, 1);
        }
        this.setState(
          {
            crossSelles: this.state.crossSelles
          },
          () => {
            this.props.getLinkProductInfo(this.state);
          }
        );
        break;
      case AppConstant.TYPE_GROUP:
        if (product["isSelected"]) {
          this.state.groupedProduct.push({
            id: product.id,
            title: product.title
          });
        } else {
          let selectedIndex = 0;
          this.state.groupedProduct.forEach((element, index) => {
            if (element.id == product.id) {
              selectedIndex = index;
            }
          });
          this.state.groupedProduct.splice(selectedIndex, 1);
        }
        this.setState(
          {
            groupedProduct: this.state.groupedProduct
          },
          () => {
            this.props.getLinkProductInfo(this.state);
          }
        );
        break;
      default:
        break;
    }
  };
  onPressAddMoreProduct = type => {
    switch (type) {
      case AppConstant.TYPE_UP_SELL:
        this.setState({
          searchDialogVisible: true,
          selectedProducts: this.state.upselles,
          searchType: AppConstant.TYPE_UP_SELL
        });
        break;
      case AppConstant.TYPE_CROSS_SELL:
        this.setState({
          searchDialogVisible: true,
          selectedProducts: this.state.crossSelles,
          searchType: AppConstant.TYPE_CROSS_SELL
        });
        break;
      case AppConstant.TYPE_GROUP:
        this.setState({
          searchDialogVisible: true,
          selectedProducts: this.state.groupedProduct,
          searchType: AppConstant.TYPE_GROUP
        });
        break;

      default:
        break;
    }
  };

  deleteSelected = (product, type) => {
    product["isSelected"] = false;
    this.updateSelectedProducts(product, type);
  };
  onBackSearchDialog = () => {
    this.setState({
      searchDialogVisible: false
    });
  };
  render() {
    return (
      <ScrollView>
        <View style={styles.categoryContainer}>
          <View style={styles.rowContainer}>
            <Text style={styles.headingTextStyle}>
              {strings("UP_SELLES")}
            </Text>
            <Text
              style={styles.buttonRect}
              onPress={this.onPressAddMoreProduct.bind(
                this,
                AppConstant.TYPE_UP_SELL
              )}
            >
              {strings("ADD_MORE")}
            </Text>
          </View>
          <FlatList
            contentContainerStyle={{ flex: 1 }}
            // numColumns={2}
            data={this.state.upselles}
            keyExtractor={(item, index) => index + ""}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={this.deleteSelected.bind(
                    this,
                    item,
                    AppConstant.TYPE_UP_SELL
                  )}
                >
                  <Text style={styles.headtingStyleMedium}>{item.title}</Text>
                  <CustomIcon2
                    name="delete"
                    size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                    color={ThemeConstant.ACCENT_COLOR}
                  />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyStyle}>
                {strings("NO_PRODUCT_MSG")}
              </Text>
            }
          />
        </View>
        {this.state.productType == "external" ? null : (
          <View>
            {this.state.productType == "grouped" ? (
              <View style={styles.categoryContainer}>
                <View style={styles.rowContainer}>
                  <Text style={styles.headingTextStyle}>
                    {strings("GROUPED_PRODUCT")}
                  </Text>
                  <Text
                    style={styles.buttonRect}
                    onPress={this.onPressAddMoreProduct.bind(
                      this,
                      AppConstant.TYPE_GROUP
                    )}
                  >
                    {strings("ADD_MORE")}
                  </Text>
                </View>
                <FlatList
                  // numColumns={2}
                  data={this.state.groupedProduct}
                  keyExtractor={(item, index) => index + ""}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={this.deleteSelected.bind(
                          this,
                          item,
                          AppConstant.TYPE_GROUP
                        )}
                      >
                        <Text style={styles.headtingStyleMedium}>
                          {item.title}
                        </Text>
                        <CustomIcon2
                          name="delete"
                          size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                          color={ThemeConstant.ACCENT_COLOR}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <Text style={styles.emptyStyle}>
                      {strings("NO_PRODUCT_MSG")}
                    </Text>
                  }
                />
              </View>
            ) : (
              <View style={styles.categoryContainer}>
                <View style={styles.rowContainer}>
                  <Text style={styles.headingTextStyle}>
                    {strings("CROSS_SELLES")}
                  </Text>
                  <Text
                    style={styles.buttonRect}
                    onPress={this.onPressAddMoreProduct.bind(
                      this,
                      AppConstant.TYPE_CROSS_SELL
                    )}
                  >
                    {strings("ADD_MORE")}
                  </Text>
                </View>
                <FlatList
                  // numColumns={2}
                  data={this.state.crossSelles}
                  keyExtractor={(item, index) => index + ""}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={this.deleteSelected.bind(
                          this,
                          item,
                          AppConstant.TYPE_CROSS_SELL
                        )}
                      >
                        <Text style={styles.headtingStyleMedium}>
                          {item.title}
                        </Text>
                        <CustomIcon2
                          name="delete"
                          size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                          color={ThemeConstant.ACCENT_COLOR}
                        />
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <Text style={styles.emptyStyle}>
                      {strings("NO_PRODUCT_MSG")}
                    </Text>
                  }
                />
              </View>
            )}
          </View>
        )}
        <LinkedProductDialog
          updateSelectedProducts={this.updateSelectedProducts.bind(this)}
          visible={this.state.searchDialogVisible}
          selectedProducts={this.state.selectedProducts}
          searchType={this.state.searchType}
          onBack={this.onBackSearchDialog.bind(this)}
          sellerId={this.state.sellerId}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  categoryContainer: {
    padding: ThemeConstant.MARGIN_GENERIC,
    // paddingBottom : ThemeConstant.MARGIN_GENERIC,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    borderWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR,
    borderRadius: 5
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headingTextStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC
  },
  buttonRect: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    alignSelf: "flex-end",
    textAlign: "center",
    fontWeight: "bold",
    color: ThemeConstant.ACCENT_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    padding: ThemeConstant.MARGIN_GENERIC,
    marginRight: ThemeConstant.MARGIN_GENERIC
  },
  headtingStyleMedium: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold",
    marginRight: ThemeConstant.MARGIN_NORMAL
  },
  buttonStyle: {
    flex: 1,
    borderColor: ThemeConstant.LINE_COLOR,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    padding: ThemeConstant.MARGIN_GENERIC,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center"
  }
});

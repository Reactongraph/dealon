import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Tabs, ScrollableTab, Tab, Container } from "native-base";
import CustomActionbar from "../../container/CustomActionbar";
import StringConstant from "../../app_constant/StringConstant";
import ProductGeneralInfoEdit from "./ProductGeneralInfoEdit";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import Loading from "../../container/LoadingComponent";
import MaintenanceLayout from "../../container/MaintenanceLayout";
import Inventory from "./Inventory";
import ApplyShipping from "./ApplyShipping";
import ProductStatus from "./ProductStatus";
import ExternalAffiliate from "./ExternalAffiliate";
import ProgressDialog from "../../container/ProgressDialog";
import { showErrorToast, showSuccessToast } from "../../utility/Helper";
import SellerLinkedProduct from "./SellerLinkedProduct";
import { strings } from "../../localize_constant/I18";
import SellerAttribute from "./SellerAttributes";

export default class AddEditProduct extends React.Component {
  sellerId = 0;
  productId = 0;
  isInComponent = true; // Check for updating state data from API

  productInfomation = null;
  inventoryInformation = null;
  shippingInfomation = null;
  externalInfomation = null;
  productStatusInformation = null;
  linkedProductInfomation = null;
  attributeInfomation = null;

  state = {
    isMaintenance: false,
    isLoading: true,
    isProgress: false,
    productInfo: {},
    isGetProductInfoData: false,
  };
  componentWillUnmount() {
    isInComponent = false;
  }
  componentDidMount() {
    this.sellerId = this.props.navigation.getParam("sellerId", 0);
    this.productId = this.props.navigation.getParam("productId", 0);
    isInComponent = true;
    this.getProductDataFromAPI();
  }
  getProductDataFromAPI = () => {
    this.setState({
      isLoading: true,
    });
    let url =
      AppConstant.BASE_URL +
      "seller/product/edit/" +
      this.productId +
      "/?seller_id=" +
      this.sellerId;
    fetchDataFromAPI(url, "GET", "", null).then((response) => {
      if (isInComponent) {
        if (response && response.success != false) {
          this.setState({
            isLoading: false,
            response: response,
            isMaintenance: false,
          });

          console.log(
            "check selected attri >>>>> " +
              JSON.stringify(this.state.response.attributes)
          );
        } else {
          this.setState({
            isLoading: false,
            isMaintenance: true,
          });
        }
      }
    });
  };
  _getProductInformation = (productInfo) => {
    this.productInfomation = productInfo;
    // console.log("productInfo", productInfo);
  };
  _getInvetoryInformation = (inventoryInfo) => {
    this.inventoryInformation = inventoryInfo;
    // console.log("inventoryInfo", inventoryInfo);
  };
  _getExternalLinkInformation = (externalInfo) => {
    this.externalInfomation = externalInfo;
    // console.log("externalInfo", externalInfo);
  };
  _getproductStatusInformation = (statusInfo) => {
    this.productStatusInformation = statusInfo;
    // console.log("statusInfo", statusInfo);
  };
  _getproductShippingInfo = (shippingInfo) => {
    this.shippingInfomation = shippingInfo;
    // console.log("shippingInfomation", shippingInfo);
  };
  _getLinkProductInfo = (linkProductInfo) => {
    this.linkedProductInfomation = linkProductInfo;
  };

  _getAttributProjectInfo = (attributProductInfo) => {
    this.attributeProductInfomation = attributProductInfo;
  };

  _onPressSaveProduct = () => {
    console.log("shippingInfomation test", this.shippingInfomation);
    console.log("statusInfo", this.productStatusInformation);
    console.log("externalInfo", this.externalInfomation);
    console.log("inventoryInfo", this.inventoryInformation);
    console.log("productInfo", this.productInfomation);
    console.log("linkedInfo", this.linkedProductInfomation);
    console.log("Attribute", this.attributeProductInfomation);

    let product = this.state.response;

    /////// Product Info Data //////////
    let productInfomation = this.productInfomation
      ? this.productInfomation.response
      : null;
    let productName = productInfomation
      ? productInfomation.productName
      : product.name;
    let productDescription = productInfomation
      ? productInfomation.aboutProduct
      : product.description;
    let shortDescription = productInfomation
      ? productInfomation.shortDescription
      : product.short_description;
    let thumbnailId = productInfomation
      ? productInfomation.productImageId
      : product.image_id;
    let regularPrice = productInfomation
      ? productInfomation.regularPrice
      : product.regular_price;
    let salePrice = productInfomation
      ? productInfomation.salePrice
      : product.sale_price;
    let productType = productInfomation
      ? productInfomation.selectedProductType.id
      : product.product_type;
    let productBrand = productInfomation
      ? productInfomation.selectedProductBrand.slug
      : product.productInfo.product_brand[0].slug;
    let productCondition = productInfomation
      ? productInfomation.selectedProductCondition.slug
      : product.productInfo.product_condition[0].slug;
    let categoryIds =
      productInfomation && productInfomation.selectedCategories.length > 0
        ? productInfomation.selectedCategories.map((item) => {
            return item.id;
          })
        : product.category_ids;
    let sku = productInfomation ? productInfomation.productSKU : product.sku;

    ///// Status Data ///////
    let statusInfo = this.productStatusInformation
      ? this.productStatusInformation.response
      : null;
    let productStatus =
      statusInfo && statusInfo.selectedStatus && statusInfo.selectedStatus.id
        ? statusInfo.selectedStatus.id
        : product.status; ////

    let newImages =
      statusInfo && statusInfo.newImages
        ? statusInfo.newImages.map((item) => {
            return item.imageId;
          })
        : [];

    let galleryImage =
      statusInfo && statusInfo.images
        ? statusInfo.images.map((item) => {
            return item.id;
          })
        : product.gallery_images.map((item) => {
            return item.id;
          });
    galleryImage = galleryImage ? galleryImage : [];
    newImages = newImages ? newImages : [];
    let product_image_gallery = newImages.concat(galleryImage); //

    ////      Inventory Data    ///////////////
    let inventoryInfo = this.inventoryInformation
      ? this.inventoryInformation.response
      : null;
    let manage_stock =
      inventoryInfo && typeof inventoryInfo.isEnableBackOrder != "undefined"
        ? inventoryInfo.isEnableBackOrder
        : product.manage_stock;
    let stock_status = inventoryInfo
      ? inventoryInfo.selectedStatus.id
      : product.stock_status;
    let stock_quantity = inventoryInfo
      ? inventoryInfo.stockQuantity
      : product.stock_quantity;
    let backorders = inventoryInfo
      ? inventoryInfo.selectedBackorder.id
      : product.backorders;

    ////////  Shiiping Data ////
    let shippingInfo = this.shippingInfomation
      ? this.shippingInfomation.response
      : null;
    let weight = shippingInfo ? shippingInfo.weight : product.weight;
    let length = shippingInfo ? shippingInfo.length : product.length;
    let width = shippingInfo ? shippingInfo.width : product.width;
    let height = shippingInfo ? shippingInfo.height : product.height;
    let shippingClass =
      shippingInfo && shippingInfo.selectedShippingClass
        ? shippingInfo.selectedShippingClass.id
        : product.shipping_class_id;

    //// External Data /////
    let externalInfo = this.externalInfomation
      ? this.externalInfomation.response
      : null;
    let button_text = externalInfo
      ? externalInfo.buttonText
      : product.button_text;
    let product_url = externalInfo
      ? externalInfo.productUrl
      : product.product_url;

    //// Linked Product Information ////////
    let linkProductInfo = this.linkedProductInfomation
      ? this.linkedProductInfomation
      : null;
    let crosssell_ids = linkProductInfo
      ? linkProductInfo.crossSelles.map((item) => {
          return item.id;
        })
      : product.crosssell_ids;
    let upsell_ids = linkProductInfo
      ? linkProductInfo.upselles.map((item) => {
          return item.id;
        })
      : product.upsell_ids;
    let grouped_products = linkProductInfo
      ? linkProductInfo.groupedProduct.map((item) => {
          return item.id;
        })
      : product.grouped_products;
    this.setState(
      {
        // isGetProductInfoData: true,
        isProgress: true,
      },
      () => {
        let data = JSON.stringify({
          product_name: productName,
          description: productDescription,
          short_description: shortDescription,
          thumbnail_id: thumbnailId,
          regular_price: regularPrice,
          sale_price: salePrice,
          product_type: productType,
          product_condition: productCondition,
          store: productBrand,
          category: categoryIds,

          product_image_gallery: product_image_gallery,
          product_status: productStatus,

          manage_stock: manage_stock,
          stock_status: stock_status,
          stock_quantity: stock_quantity,
          backorders: backorders,

          download_limit: "",
          download_expiry: "",
          downloadable_files: [],
          weight: weight,
          length: length,
          width: width,
          height: height,
          shipping_class_id: shippingClass,
          upsell_ids: upsell_ids,
          crosssell_ids: crosssell_ids,
          product_url: product_url,
          button_text: button_text,
          grouped_products: grouped_products,
        });
        let url =
          AppConstant.BASE_URL +
          "seller/product/edit/" +
          this.productId +
          "/?seller_id=" +
          this.sellerId;
        fetchDataFromAPI(url, "POST", data, null).then((response) => {
          this.setState({
            isProgress: false,
          });
          if (response && response.success) {
            this.componentDidMount();
            showSuccessToast(strings("PRODUCT_SUCCESS_FULLY_UPDATED_MSG"));
          } else {
            showErrorToast(response.message);
          }
        });
      }
    );
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  render() {
    return (
      <Container>
        <CustomActionbar
          title={strings("ADD_NEW_PRODUCT")}
          backwordTitle={strings("BACK")}
          iconName={"baseline-save"}
          _onBackPress={this._onBackPress.bind(this)}
          _onForwordPress={this._onPressSaveProduct.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: "stretch",
            }}
          >
            {this.state.isMaintenance ? (
              <MaintenanceLayout
                onPress={this.getProductDataFromAPI.bind(this)}
                message={strings("SERVER_MAINTENANCE")}
              />
            ) : (
              <Tabs
                renderTabBar={() => <ScrollableTab />}
                tabBarUnderlineStyle={{
                  backgroundColor: ThemeConstant.ACCENT_COLOR,
                }}
              >
                <Tab
                  heading={strings("EDIT_TITLE")}
                  tabStyle={styles.tabStyle}
                  activeTabStyle={styles.activeTabStyle}
                  textStyle={styles.textStyle}
                  activeTextStyle={styles.activeTextStyle}
                >
                  <ProductGeneralInfoEdit
                    navigation={this.props.navigation}
                    productInfo={this.state.response}
                    getInfoProductData={this._getProductInformation.bind(this)}
                    isGetProductInfoData={this.state.isGetProductInfoData}
                  />
                </Tab>
                {this.state.response.product_type != "external" &&
                this.state.response.product_type != "grouped" ? (
                  <Tab
                    heading={strings("INVENTORY")}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    textStyle={styles.textStyle}
                    activeTextStyle={styles.activeTextStyle}
                  >
                    <Inventory
                      backorderOptions={this.state.response.backorder_options}
                      stockStatusOptions={this.state.response.stock_options}
                      getInfoProductData={this._getInvetoryInformation.bind(
                        this
                      )}
                      stock_quantity={this.state.response.stock_quantity}
                      backorders={this.state.response.backorders}
                      stock_status={this.state.response.stock_status}
                      manage_stock={this.state.response.manage_stock}
                      isGetProductInfoData={this.state.isGetProductInfoData}
                    />
                  </Tab>
                ) : null}
                {this.state.response.product_type == "external" ? (
                  <Tab
                    heading={strings("EXTERNAL_LINK_AFFILIATE")}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    textStyle={styles.textStyle}
                    activeTextStyle={styles.activeTextStyle}
                  >
                    <ExternalAffiliate
                      productUrl={this.state.response.product_url}
                      buttonText={this.state.response.button_text}
                      getInfoProductData={this._getExternalLinkInformation.bind(
                        this
                      )}
                      isGetProductInfoData={this.state.isGetProductInfoData}
                    />
                  </Tab>
                ) : null}
                {this.state.response.product_type != "external" &&
                this.state.response.product_type != "grouped" ? (
                  <Tab
                    heading={strings("SHIPPING")}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    textStyle={styles.textStyle}
                    activeTextStyle={styles.activeTextStyle}
                  >
                    <ApplyShipping
                      shippingInfo={this.state.response.shipping_classes}
                      weight={this.state.response.weight}
                      width={this.state.response.width}
                      length={this.state.response.length}
                      height={this.state.response.height}
                      shipping_class_id={this.state.response.shipping_class_id}
                      getInfoProductData={this._getproductShippingInfo.bind(
                        this
                      )}
                      isGetProductInfoData={this.state.isGetProductInfoData}
                    />
                  </Tab>
                ) : null}
                <Tab
                  heading={strings("LINKED_PRODUCT")}
                  tabStyle={styles.tabStyle}
                  activeTabStyle={styles.activeTabStyle}
                  textStyle={styles.textStyle}
                  activeTextStyle={styles.activeTextStyle}
                >
                  <SellerLinkedProduct
                    sellerId={this.props.navigation.getParam("sellerId", 0)}
                    upselles={this.state.response.upsell_ids}
                    crossSelles={this.state.response.crosssell_ids}
                    groupedProduct={this.state.response.grouped_products}
                    productType={this.state.response.product_type}
                    getLinkProductInfo={this._getLinkProductInfo.bind(this)}
                  />
                </Tab>
                {/* <Tab
                  heading={strings("")ATTRIBUTE}
                  tabStyle={styles.tabStyle}
                  activeTabStyle={styles.activeTabStyle}
                  textStyle={styles.textStyle}
                  activeTextStyle={styles.activeTextStyle}
                >
                  <Text> Tab2 </Text>
                </Tab> */}

                <Tab
                  heading={strings("ATTRIBUTE")}
                  tabStyle={styles.tabStyle}
                  activeTabStyle={styles.activeTabStyle}
                  textStyle={styles.textStyle}
                  activeTextStyle={styles.activeTextStyle}
                >
                  <SellerAttribute
                    statusOption={this.state.response.status_options}
                    statusValue={this.state.response.status}
                    prodcutAttribut={this.state.response.product_attributes}
                    selectedAttribute={this.state.response.attributes}
                    productId={this.state.response.id}
                    _getattributproductInformation={this._getAttributProjectInfo.bind(
                      this
                    )}
                    isGetProductInfoData={this.state.isGetProductInfoData}
                  />
                </Tab>
                <Tab
                  heading={strings("PRODUCT_STATUS")}
                  tabStyle={styles.tabStyle}
                  activeTabStyle={styles.activeTabStyle}
                  textStyle={styles.textStyle}
                  activeTextStyle={styles.activeTextStyle}
                >
                  <ProductStatus
                    galleryImages={this.state.response.gallery_images}
                    statusOption={this.state.response.status_options}
                    _getproductStatusInformation={this._getproductStatusInformation.bind(
                      this
                    )}
                    statusValue={this.state.response.status}
                    isGetProductInfoData={this.state.isGetProductInfoData}
                  />
                </Tab>

                <Tab
                  heading={strings("PRODUCT_AUCTION")}
                  tabStyle={styles.tabStyle}
                  activeTabStyle={styles.activeTabStyle}
                  textStyle={styles.textStyle}
                  activeTextStyle={styles.activeTextStyle}
                >
                  <Text>Auction</Text>
                </Tab>
              </Tabs>
            )}
          </View>
        )}
        <ProgressDialog visible={this.state.isProgress} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  tabStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabStyle: {
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: { color: ThemeConstant.ACCENT_COLOR },
  activeTextStyle: { color: ThemeConstant.BACKGROUND_COLOR },
});

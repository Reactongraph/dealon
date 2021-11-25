import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform
} from "react-native";
import {
  Form,
  Textarea,
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
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import ProgressDialog from "../../container/ProgressDialog";
import {
  fetchDataFromAPI,
  fetchDataFromAPIMultipart
} from "../../utility/APIConnection";
import { showSuccessToast, showErrorToast } from "../../utility/Helper";
import StringConstant from "../../app_constant/StringConstant";
import { CustomImage } from "../../container/CustomImage";
import { isStringEmpty, SCREEN_WIDTH, onlyDigitText } from "../../utility/UtilityConstant";
import AskCameraGalleryDialog from "../../container/AskCameraGalleryDialog";
import _ from "lodash";
import SelectCategoryDialog from "./SelectCategoryDialog";
import ViewStyle from "../../app_constant/ViewStyle";
import { strings } from "../../localize_constant/I18";

export default class ProductGeneralInfoEdit extends React.Component {
  sellerId = 0;
  state = {
    productName: "",
    productSKU: "",
    aboutProduct: "",
    productImageId: 0,
    productImage: "",
    regularPrice: "",
    salePrice: "",
    shortDescription: "",
    showError: false,
    skuError: "",
    salePriceError: "",
    isSKUAvailable: true,

    categories: [],
    productTypes: [],
    selectedCategories: [],
    selectedProductType: {},
    isSelected: false,
    isCategaryVisible: false,

    uploadProductImage: null,
    updateImageType: 0,
    openImageGallery: false,
    imagewidth: 0,
    imageHeight: 0,
    isCropping: false,
    isProgress: false
  };
  componentDidMount() {
    this.sellerId = this.props.navigation.getParam("sellerId", 0);
    console.log("SellerId=>>", this.sellerId);
    let productInfo = this.props.productInfo;
    let category = this.updateSelectedCategories(
      productInfo.category_ids,
      productInfo.categories
    );
    this.updateProductType(productInfo.product_type, productInfo.productTypes);
    this.setState(
      {
        categories: category,
        productTypes: productInfo.productTypes ? productInfo.productTypes : [],
        productName: productInfo.name ? productInfo.name : "",
        productSKU: productInfo.sku ? productInfo.sku : "",
        aboutProduct: productInfo.description ? productInfo.description : "",
        productImageId: productInfo.image_id ? productInfo.image_id : "",
        productImage: productInfo.image,
        regularPrice: productInfo.regular_price
          ? productInfo.regular_price
          : "",
        salePrice: productInfo.sale_price ? productInfo.sale_price : "",
        shortDescription: productInfo.short_description
          ? productInfo.short_description
          : ""
      },
      () => this.updateinfoData()
    );
  }

  componentWillUpdate(nextProps) {
    if (this.props.productInfo != nextProps.productInfo) {
      let productInfo = nextProps.productInfo;
      let category = this.updateSelectedCategories(
        productInfo.category_ids,
        productInfo.categories
      );
      this.updateProductType(
        productInfo.product_type,
        productInfo.productTypes
      );
      this.setState(
        {
          categories: category,
          productTypes: productInfo.productTypes,
          productName: productInfo.name,
          productSKU: productInfo.sku,
          aboutProduct: productInfo.description,
          productImageId: productInfo.image_id,
          productImage: productInfo.image,
          regularPrice: productInfo.regular_price,
          salePrice: productInfo.sale_price,
          shortDescription: productInfo.short_description
        },
        () => this.updateinfoData()
      );
    }
    if (nextProps.isGetProductInfoData) {
      this.props.getInfoProductData({ response: this.state });
    }
  }
  updateinfoData = () => {
    this.props.getInfoProductData({ response: this.state });
  };
  updateSelectedCategories = (categoryIds, categories) => {
    let selectedCategory = [];
    categories.forEach(category => {
      category["isSelected"] = false;

      categoryIds.forEach(id => {
        if (id == category.id) {
          category["isSelected"] = true;
          selectedCategory.push(category);
        }
      });
    });
    this.setState(
      {
        selectedCategories: selectedCategory
      },
      () => this.updateinfoData()
    );
    return categories;
  };

  _openGalleryDialog = updateImageType => {
    this.setState({
      openImageGallery: true,
      imagewidth: ThemeConstant.UPLOAD_IMAGE_SIZE,
      imageHeight: ThemeConstant.UPLOAD_IMAGE_SIZE,
      isCropping: true
    });
  };
  _handleGalleryDialog = (image, updateImageType) => {
    this.setState({
      uploadProductImage: image,
      openImageGallery: false
    });
    this.callMultiPartAPI(image, AppConstant.SAVE_PROFILE_IMAGE);
  };
  getFileName = uri => {
    return uri.substring(uri.lastIndexOf("/") + 1, uri.length);
  };
  _onBackGalleryDialog = () => {
    this.setState({
      openImageGallery: false
    });
  };

  callMultiPartAPI = (uploadImageData, updateImageType) => {
    if (uploadImageData) {
      let formData = new FormData();
      formData.append("profile_Image", {
        uri: uploadImageData.path,
        type: uploadImageData.mime,
        name: this.getFileName(uploadImageData.path)
      });
      let url = AppConstant.BASE_URL + "media/upload";
      fetchDataFromAPIMultipart(url, "POST", formData, null).then(response => {
        this.setState({
          isProgress: false,
          isButtonClicked: false
        });
        if (response && response.success) {
          this.setState(
            {
              productImageId: response.image_id
            },
            () => this.updateinfoData()
          );
        } else {
          showErrorToast(response.message);
        }
      });
    }
  };

  _onPressCheckSKUAvailable = () => {
    if (!this.state.isSKUAvailable) {
      this.setState({ isProgress: true });
      let url = AppConstant.BASE_URL + "seller/product/sku";
      let body = JSON.stringify({
        sku: this.state.productSKU,
        seller_id: this.sellerId,
        sellerId: this.sellerId
      });
      console.log("SellerId=>>", this.sellerId);
      fetchDataFromAPI(url, "POST", body, null).then(response => {
        if (response && response.success) {
          this.setState(
            {
              isSKUAvailable: true,
              isProgress: false,
              skuError: ""
            },
            () => this.updateinfoData()
          )
          showSuccessToast(response.message);
        } else {
          showErrorToast(response.message);
          this.setState(
            {
              isProgress: false,
              isSKUAvailable: false,
              skuError: response.message
            },
            () => this.updateinfoData()
          );
        }
      });
    }
  };
  updateProductType = (productType, productTypes) => {
    productTypes = productTypes ? productTypes : [];
    productTypes.forEach(element => {
      if (element.id === productType) {
        this._selectProductType(element);
      }
    });
  };
  _selectProductType = productType => {
    this.setState(
      {
        selectedProductType: productType
      },
      () => this.updateinfoData()
    );
  };

  _onPressCategoryDialog = () => {
    this.setState({
      isCategaryVisible: true
    });
  };
  _onBackCategoryDialog = () => {
    this.setState({
      isCategaryVisible: false
    });
  };
  updateSelectedCategory = category => {
    this.state.categories.forEach(element => {
      if (element.id === category.id) {
        element["isSelected"] = category["isSelected"];
      }
    });
    if (category.isSelected) {
      this.state.selectedCategories.push(category);
    } else {
      this.state.selectedCategories.pop(category);
    }
    this.setState(
      {
        isSelected: !this.state.isSelected,
        selectedCategories: this.state.selectedCategories
      },
      () => this.updateinfoData()
    );
  };
  _onBackPress = () => {
    this.props.naviagtion.pop();
  };

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <ScrollView keyboardShouldPersistTaps={"always"}>
          <KeyboardAvoidingView
            style={{ padding: ThemeConstant.MARGIN_GENERIC }}
          >
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
              //       <Title>{strings("")SELECT_SELLER_PRODUCT_TYPE}</Title>
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
              {strings("PRODUCT_NAME")}
            </Text>
            <TextInput
              style={ViewStyle.inputTextStyle}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.productName}
              onChangeText={text => {
                this.setState({ productName: text }, () =>
                  this.updateinfoData()
                );
              }}
              keyboardType="default"
              returnKeyType="next"
              placeholder={strings("PRODUCT_NAME")}
            />
            <Text style={styles.textError}>
              {this.state.showError && isStringEmpty(this.state.productName)
                ? strings("REQUIRED_FIELD")
                : ""}
            </Text>

            <Text style={styles.headingTextStyle}>
              {strings("ABOUT_PRODUCT")}
            </Text>
            <Form>
              <Textarea
                value={this.state.aboutProduct}
                rowSpan={6}
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                keyboardType="default"
                placeholder={strings("ABOUT_PRODUCT")}
                onChangeText={text => {
                  this.setState({ aboutProduct: text }, () =>
                    this.updateinfoData()
                  );
                }}
                multiline={true}
              />
            </Form>
            {/* <Text style={styles.textError}>
              {this.state.showError && isStringEmpty(this.state.aboutProduct)
                ? strings("")REQUIRED_FIELD
                : ""}
            </Text> */}

            <View style={styles.categoryContainer}>
              <View style={styles.rowContainer}>
                <Text style={styles.headingTextStyle}>
                  {strings("SELECETED_CATEGORY")}
                </Text>
                <Text
                  style={styles.buttonRect}
                  onPress={this._onPressCategoryDialog}
                >
                  {strings("ADD_MORE")}
                </Text>
              </View>
              <SelectCategoryDialog
                visible={this.state.isCategaryVisible}
                categories={this.state.categories}
                selectedCategory={this.state.selectedCategories}
                onBack={this._onBackCategoryDialog}
                updateSelectedCategory={this.updateSelectedCategory.bind(this)}
              />

              <FlatList
                data={this.state.selectedCategories}
                extraData={this.state.isSelected}
                // numColumns={2}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.checkBoxViewStyle}>
                      <Text style={styles.checkboxTitleStyle}>
                        {item.title}
                      </Text>
                      <CheckBox
                        checked={item.isSelected}
                        color={ThemeConstant.ACCENT_COLOR}
                      />
                    </View>
                  );
                }}
                keyExtractor={item => item.id + ""}
              />
            </View>

            <View style={styles.uploadImageContainer}>
              <CustomImage
                image={
                  !this.state.uploadProductImage
                    ? this.state.productImage
                    : this.state.uploadProductImage.path
                }
                imagestyle={styles.imagestyle}
              />
              <View style={styles.imageDescriptionstyle}>
                <Text style={styles.headingTitleStyle}>
                  {strings("PRODUCT_THUMBNAIL")}
                </Text>

                <Text>
                  {this.state.uploadProductImage
                    ? this.getFileName(this.state.uploadProductImage.path)
                    : strings("NO_FILE_SELECTED")}
                </Text>

                <TouchableOpacity
                  style={styles.uploadButtonContainer}
                  onPress={this._openGalleryDialog.bind(
                    this,
                    AppConstant.SAVE_PROFILE_IMAGE
                  )}
                >
                  <Text style={styles.buttonText}>
                    {strings("UPLOAD_IMAGE")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.headingTextStyle}>
                {strings("PRODUCT_VIDEO")}
            </Text>
            <TextInput
                style={ViewStyle.inputTextStyle}
                autoCapitalize="none"
                returnKeyType="next"
                placeholder={strings("PRODUCT_VIDEO")}
            />
            <Text style={styles.headingTextStyle}>
              {strings("PRODUCT_SKU")}
            </Text>
            <View style={ViewStyle.passInputViewStyle}>
              <TextInput
                style={ViewStyle.passInputTextStyle}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.productSKU}
                onChangeText={text => {
                  this.setState(
                    { productSKU: text, isSKUAvailable: false },
                    () => this.updateinfoData()
                  );
                }}
                keyboardType="default"
                returnKeyType="next"
                placeholder={strings("PRODUCT_SKU")}
                onSubmitEditing={() => {
                  this._onPressCheckSKUAvailable.bind(this);
                }}
              />
              <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={_.debounce(this._onPressCheckSKUAvailable, 300)}
              >
                <Text
                  style={
                    !this.state.isSKUAvailable
                      ? styles.validateButton
                      : styles.validatedButton
                  }
                >
                  {strings("VALIDATE")}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.textError}>{this.state.skuError}</Text>

            {this.state.selectedProductType.id !== "grouped" ? (
              <View>
                <Text style={styles.headingTextStyle}>
                  {strings("REGULAR_PRICE")}
                </Text>
                <TextInput
                  style={ViewStyle.inputTextStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={this.state.selectedProductType.id !== "grouped"}
                  value={this.state.regularPrice}
                  onChangeText={text => {
                   
                    this.setState({ regularPrice: onlyDigitText(text) }, () =>
                      this.updateinfoData()
                    );
                  }}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  placeholder={strings("REGULAR_PRICE")}
                />
                <Text style={styles.textError}>
                  {this.state.showError &&
                  isStringEmpty(this.state.regularPrice)
                    ? strings("REQUIRED_FIELD")
                    : ""}
                </Text>

                <Text style={styles.headingTextStyle}>
                  {strings("SALE_PRICE")}
                </Text>
                <TextInput
                  style={ViewStyle.inputTextStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={this.state.selectedProductType.id !== "grouped"}
                  value={this.state.salePrice}
                  onChangeText={text => {
                    this.setState({ salePrice: onlyDigitText(text) }, () =>
                      this.updateinfoData()
                    );
                  }}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  placeholder={strings("SALE_PRICE")}
                />
                <Text style={styles.textError}>
                  {this.state.salePriceError}
                </Text>

                <Text style={styles.headingTextStyle}>
                  {strings("PRODUCT_SHORT_DESCRIPTION")}
                </Text>
              </View>
            ) : null}

            <Form>
              <Textarea
                value={this.state.shortDescription}
                rowSpan={6}
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                keyboardType="default"
                placeholder={strings("PRODUCT_SHORT_DESCRIPTION")}
                onChangeText={text => {
                  this.setState({ shortDescription: text }, () =>
                    this.updateinfoData()
                  );
                }}
                multiline={true}
              />
            </Form>
            {/* <Text style={styles.textError}>
              {this.state.showError && isStringEmpty(this.state.regularPrice)
                ? strings("")REQUIRED_FIELD
                : ""}
            </Text> */}
          </KeyboardAvoidingView>
        </ScrollView>
        <AskCameraGalleryDialog
          visible={this.state.openImageGallery}
          _handleUploadImage={this._handleGalleryDialog.bind(this)}
          updateType={this.state.updateImageType}
          width={this.state.imagewidth}
          height={this.state.imageHeight}
          isCropping={this.state.isCropping}
          onBack={this._onBackGalleryDialog.bind(this)}
        />
        <ProgressDialog visible={this.state.isProgress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  categoryContainer: {
    padding: ThemeConstant.MARGIN_GENERIC,
    // paddingBottom : ThemeConstant.MARGIN_GENERIC,
    margin:ThemeConstant.MARGIN_TINNY,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    borderWidth: 0.5,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderRadius: 5
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainer: {
    alignSelf: "stretch",
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: 10,
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  headingTextStyle: {
    fontWeight: "500",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
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
  //   headingTextStyleAccent: {
  //     fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
  //     marginTop: ThemeConstant.MARGIN_GENERIC,
  //     color: ThemeConstant.ACCENT_COLOR
  //   },
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold"
  },
  inputTextStyle: {
  backgroundColor: ThemeConstant.BACKGROUND_COLOR,
  borderColor: ThemeConstant.ACCENT_COLOR,
  borderWidth: 1,
  color:ThemeConstant.DEFAULT_TEXT_COLOR,
  margin: ThemeConstant.MARGIN_TINNY,
  fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
  padding: ThemeConstant.MARGIN_GENERIC
  },
  textError: {
    color: "red",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE
  },

  uploadImageContainer: {
    flexDirection: "row",
    padding: ThemeConstant.MARGIN_TINNY,
    borderWidth: 1,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    margin:ThemeConstant.MARGIN_TINNY,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_GENERIC
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3
  },
  imageDescriptionstyle: {
    flex: 1,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    justifyContent: "space-between"
  },
  uploadButtonContainer: {
    width: 100,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_LARGE,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    marginRight: ThemeConstant.MARGIN_TINNY,
    borderRadius: ThemeConstant.MARGIN_TINNY
  },
  passInputViewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    margin: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_TINNY
  },
  passInputTextStyle: {
    flex: 1,
    alignSelf: "stretch",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginRight: ThemeConstant.MARGIN_TINNY
  },
  validateButton: {
    color: ThemeConstant.ACCENT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_TINNY,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    ...Platform.select({
      ios: { borderRadius: 10,},
      android : {borderRadius:10}
    }),
  },
  validatedButton: {
    color: ThemeConstant.LINE_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_TINNY,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    ...Platform.select({
      ios: { borderRadius: 10,},
      android : {borderRadius:10}
    }),
  },
  pickerStyle: {
    marginTop: 0,
    paddingTop: 5,
    paddingBottom: 5
  },
  checkBoxViewStyle: {
    flexDirection: "row",
    alignContent: "center",
    alignSelf: "flex-start",
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    marginRight: ThemeConstant.MARGIN_GENERIC,
    padding: ThemeConstant.MARGIN_GENERIC
  },
  checkboxTitleStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginRight: ThemeConstant.MARGIN_GENERIC
  }
});

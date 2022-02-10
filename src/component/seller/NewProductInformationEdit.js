import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Form, Textarea } from "native-base";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import ProgressDialog from "../../container/ProgressDialog";
import {
  fetchDataFromAPI,
  fetchDataFromAPIMultipart,
} from "../../utility/APIConnection";
import { showSuccessToast, showErrorToast } from "../../utility/Helper";
import StringConstant from "../../app_constant/StringConstant";
import { CustomImage } from "../../container/CustomImage";
import {
  isStringEmpty,
  SCREEN_WIDTH,
  onlyDigitText,
} from "../../utility/UtilityConstant";
import AskCameraGalleryDialog from "../../container/AskCameraGalleryDialog";
import _ from "lodash";
import CustomActionbar from "../../container/CustomActionbar";
import ViewStyle from "../../app_constant/ViewStyle";
import { strings } from "../../localize_constant/I18";

export default class NewProductInformationEdit extends React.Component {
  scrollView = null;
  SIZE_OF_EACH_ITEM = 85;
  sellerId = 0;
  state = {
    productName: "",
    productSKU: "",
    aboutProduct: "",
    productImageId: 0,
    regularPrice: "",
    salePrice: "",
    shortDescription: "",
    showError: false,
    skuError: "",
    salePriceError: "",
    isSKUAvailable: false,

    uploadProductImage: null,
    updateImageType: 0,
    openImageGallery: false,
    imagewidth: 0,
    imageHeight: 0,
    isCropping: false,
    isProgress: false,
  };

  componentDidMount() {
    this.sellerId = this.props.navigation.getParam("sellerId", 0);
    console.log("SellerId=>>", this.sellerId);
  }

  _openGalleryDialog = (updateImageType) => {
    this.setState({
      openImageGallery: true,
      imagewidth: ThemeConstant.UPLOAD_IMAGE_SIZE,
      imageHeight: ThemeConstant.UPLOAD_IMAGE_SIZE,
      isCropping: true,
    });
  };
  _handleGalleryDialog = (image, updateImageType) => {
    this.setState({
      uploadProductImage: image,
      openImageGallery: false,
    });
    this.callMultiPartAPI(image, AppConstant.SAVE_PROFILE_IMAGE);
  };
  getFileName = (uri) => {
    return uri.substring(uri.lastIndexOf("/") + 1, uri.length);
  };
  _onBackGalleryDialog = () => {
    this.setState({
      openImageGallery: false,
    });
  };

  callMultiPartAPI = (uploadImageData, updateImageType) => {
    if (uploadImageData) {
      let formData = new FormData();
      formData.append("profile_Image", {
        uri: uploadImageData.path,
        type: uploadImageData.mime,
        name: this.getFileName(uploadImageData.path),
      });
      let url = AppConstant.BASE_URL + "media/upload";
      fetchDataFromAPIMultipart(url, "POST", formData, null).then(
        (response) => {
          this.setState({
            isProgress: false,
            isButtonClicked: false,
          });
          if (response && response.success) {
            this.setState({
              productImageId: response.image_id,
            });
          } else {
            showErrorToast(response.message);
          }
        }
      );
    }
  };

  _onPressCheckSKUAvailable = () => {
    if (!this.state.isSKUAvailable) {
      this.setState({ isProgress: true });
      let url = AppConstant.BASE_URL + "seller/product/sku";
      let body = JSON.stringify({
        sku: this.state.productSKU,
        seller_id: this.sellerId,
        sellerId: this.sellerId,
      });
      console.log("SellerId=>>", this.sellerId);
      fetchDataFromAPI(url, "POST", body, null).then((response) => {
        if (response && response.success) {
          this.setState({
            isSKUAvailable: true,
            isProgress: false,
            skuError: "",
          });
          showSuccessToast(response.message);
        } else {
          showErrorToast(response.message);
          this.setState({
            isProgress: false,
            isSKUAvailable: false,
            skuError: response.message,
          });
        }
      });
    }
  };

  _onSaveButtonPress = () => {
    let isFieldComplete = true;
    this.setState({
      showError: true,
    });
    let productType = this.props.navigation.getParam("productType", {
      id: "simple",
      title: "Simple product",
    }).id;

    let productBrand = this.props.navigation.getParam("productBrand", {
      id: "49",
      title: "Apple",
      slug: "apple",
    }).slug;

    let productCondition = this.props.navigation.getParam("productCondition", {
      id: "167",
      title: "For Parts",
      slug: "for-parts",
    }).slug;

    if (isStringEmpty(this.state.productName)) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: this.SIZE_OF_EACH_ITEM - 50 });
      }
      isFieldComplete = false;
    }
    if (productType !== "grouped") {
      if (isStringEmpty(this.state.regularPrice)) {
        if (isFieldComplete) {
          this.scrollView.scrollTo({ y: 4 * this.SIZE_OF_EACH_ITEM });
        }
        isFieldComplete = false;
      } else if (
        !isStringEmpty(this.state.salePrice) &&
        parseFloat(this.state.salePrice) >= parseFloat(this.state.regularPrice)
      ) {
        if (isFieldComplete) {
          this.scrollView.scrollTo({ y: 3 * this.SIZE_OF_EACH_ITEM });
        }
        isFieldComplete = false;
        this.setState({
          salePriceError: strings("ERROR_SALE_PRICE"),
        });
      } else {
        this.setState({
          salePriceError: "",
        });
      }
    }
    if (!this.state.isSKUAvailable) {
      if (isFieldComplete) {
        this.scrollView.scrollTo({ y: 3 * this.SIZE_OF_EACH_ITEM });
      }
      isFieldComplete = false;
      this.setState({
        skuError: isStringEmpty(this.state.skuError)
          ? strings("SKU_VALIDATION_ERROR")
          : this.state.skuError,
      });
    } else {
      this.setState({
        skuError: "",
      });
    }
    if (isFieldComplete) {
      this.setState({
        isProgress: true,
      });
      let category = this.props.navigation.getParam("categories", []);
      category = category
        .filter((item) => {
          return item["isSelected"];
        })
        .map((item) => {
          return item.id;
        });
      console.log("Category", category);

      let url = AppConstant.BASE_URL + "seller/product/add/";
      let body = JSON.stringify({
        product_type: productType,
        product_condition: productCondition,
        store: productBrand,
        category: category,
        product_name: this.state.productName,
        description: this.state.aboutProduct,
        short_description: this.state.shortDescription,
        thumbnail_id: this.state.productImageId,
        sku: this.state.productSKU,
        regular_price: this.state.regularPrice,
        sale_price: this.state.salePrice,
        seller_id: this.sellerId,
      });
      fetchDataFromAPI(url, "POST", body, null).then((response) => {
        this.setState({
          isProgress: false,
        });
        if (response && response.success) {
          this.props.navigation.navigate("SellerProduct", { isUpdate: true });
        } else {
          showErrorToast(response.message);
        }
      });
    }
  };

  _onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
    const productType = this.props.navigation.getParam("productType", {
      id: "simple",
      title: "Simple product",
    }).id;

    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          backwordTitle={strings("BACK")}
          title={strings("ADD_NEW_PRODUCT")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        <ScrollView
          ref={(view) => (this.scrollView = view)}
          keyboardShouldPersistTaps={"always"}
        >
          <KeyboardAvoidingView
            style={{ padding: ThemeConstant.MARGIN_GENERIC }}
          >
            <Text style={styles.headingTextStyle}>
              {strings("PRODUCT_NAME")}
            </Text>
            <TextInput
              style={ViewStyle.inputTextStyle}
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.productName}
              onChangeText={(text) => {
                this.setState({ productName: text });
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
                onChangeText={(text) => {
                  this.setState({ aboutProduct: text });
                }}
                multiline={true}
              />
            </Form>
            {/* <Text style={styles.textError}>
              {this.state.showError && isStringEmpty(this.state.aboutProduct)
                ? strings("")REQUIRED_FIELD
                : ""}
            </Text> */}

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

            {/*<Text style={styles.headingTextStyle}>
              {strings("PRODUCT_VIDEO")}
            </Text>*/}
            {/*<TextInput
              style={ViewStyle.inputTextStyle}
              autoCapitalize="none"
              value={this.state.productVideo}
              // onChangeText={(text) => {
              //   this.setState({
              //     productVideo: onlyDigitText(text),
              //   });
              // }}
              returnKeyType="next"
              placeholder={strings("PRODUCT_VIDEO")}
            />*/}

            <Text style={styles.headingTextStyle}>
              {strings("PRODUCT_SKU")}
            </Text>
            <View style={ViewStyle.passInputViewStyle}>
              <TextInput
                style={ViewStyle.passInputTextStyle}
                autoCapitalize="none"
                autoCorrect={false}
                value={this.state.productSKU}
                onChangeText={(text) => {
                  this.setState({
                    productSKU: text,
                    isSKUAvailable: false,
                  });
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
            {productType != "grouped" ? (
              <View>
                <Text style={styles.headingTextStyle}>
                  {strings("REGULAR_PRICE")}
                </Text>
                <TextInput
                  style={ViewStyle.inputTextStyle}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={this.state.regularPrice}
                  onChangeText={(text) => {
                    this.setState({ regularPrice: onlyDigitText(text) });
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
                  value={this.state.salePrice}
                  onChangeText={(text) => {
                    this.setState({ salePrice: onlyDigitText(text) });
                  }}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  placeholder={strings("SALE_PRICE")}
                />
                <Text style={styles.textError}>
                  {this.state.salePriceError}
                </Text>
              </View>
            ) : null}

            <Text style={styles.headingTextStyle}>
              {strings("PRODUCT_DESCRIPTION_SELLER")}
            </Text>
            <Form>
              <Textarea
                value={this.state.shortDescription}
                rowSpan={6}
                style={ViewStyle.inputTextStyle}
                returnKeyType="next"
                keyboardType="default"
                placeholder={strings("PRODUCT_DESCRIPTION_SELLER")}
                onChangeText={(text) => {
                  this.setState({ shortDescription: text });
                }}
                multiline={true}
              />
            </Form>
            {/* <Text style={styles.textError}>
              {this.state.showError && isStringEmpty(this.state.regularPrice)
                ? strings("")REQUIRED_FIELD
                : ""}
            </Text> */}

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this._onSaveButtonPress()}
            >
              <Text style={styles.buttonText}>{strings("SAVE")}</Text>
            </TouchableOpacity>
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
  buttonContainer: {
    alignSelf: "stretch",
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: 10,
    marginBottom: 15,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  headingTextStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC,
  },
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputTextStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    margin: ThemeConstant.MARGIN_TINNY,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    padding: ThemeConstant.MARGIN_GENERIC,
  },
  textError: {
    color: "red",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
  },
  signUpButtonStyle: {
    alignSelf: "center",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    color: ThemeConstant.ACCENT_COLOR,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
  },
  uploadImageContainer: {
    flexDirection: "row",
    padding: ThemeConstant.MARGIN_TINNY,
    borderWidth: 1,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    margin: ThemeConstant.MARGIN_TINNY,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_GENERIC,
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3,
  },
  imageDescriptionstyle: {
    flex: 1,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    justifyContent: "space-between",
  },
  uploadButtonContainer: {
    width: 100,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    paddingVertical: ThemeConstant.MARGIN_NORMAL,
    marginBottom: ThemeConstant.MARGIN_LARGE,
    marginTop: ThemeConstant.MARGIN_NORMAL,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    marginRight: ThemeConstant.MARGIN_TINNY,
    borderRadius: ThemeConstant.MARGIN_TINNY,
  },
  passInputViewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    borderColor: ThemeConstant.LINE_COLOR,
    borderWidth: 1,
    margin: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_TINNY,
  },
  passInputTextStyle: {
    flex: 1,
    alignSelf: "stretch",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginRight: ThemeConstant.MARGIN_TINNY,
  },
  validateButton: {
    color: ThemeConstant.ACCENT_COLOR,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_TINNY,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    ...Platform.select({
      ios: { borderRadius: 10 },
      android: { borderRadius: 10 },
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
      ios: { borderRadius: 10 },
      android: { borderRadius: 10 },
    }),
  },
});

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Picker, CheckBox, Icon } from "native-base";
import StringConstant from "../../app_constant/StringConstant";
import _ from "lodash";
import { FlatList } from "react-native";
import { CustomImage } from "../../container/CustomImage";
import CustomIcon2 from "../../container/CustomIcon2";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import AskCameraGalleryDialog from "../../container/AskCameraGalleryDialog";
import ProgressDialog from "../../container/ProgressDialog";
import { SCREEN_WIDTH, isStringEmpty } from "../../utility/UtilityConstant";
import { fetchDataFromAPIMultipart } from "../../utility/APIConnection";
import { strings } from "../../localize_constant/I18";

export default class ProductStatus extends React.Component {
  state = {
    downLoadable: false,
    openImageGallery: false,
    isNewImageUpdate: false,
    isProgress: false,
    selectedStatus: {},
    imageType: 0,
    status: [],
    images: [],
    newImages: [],
    productVideo:"",
  };
  componentDidMount() {
    this.setState(
      {
        images: this.props.galleryImages,
        status: this.props.statusOption,
        productVideo: this.props.productVideo,
      },
      () => this.updateinfoData()
    );
    this.updateStatus(this.props.statusOption, this.props.statusValue);
  }
  componentWillUpdate(newProps) {
    if (newProps.isGetProductInfoData) {
      this.props._getproductStatusInformation({ response: this.state });
    }
    if (newProps != this.props) {
      this.setState(
        {
          images: this.props.galleryImages,
          status: this.props.statusOption,
          productVideo: this.props.productVideo,
        },
        () => this.updateinfoData()
      );
      this.updateStatus(newProps.statusOption, newProps.statusValue);
    }
  }
  updateinfoData = () => {
    this.props._getproductStatusInformation({ response: this.state });
  };

  updateStatus = (options, value) => {
    if(options && typeof options != "string"){
      options.forEach(element => {
        if (element.id == value) {
          this._selectStatus(element);
        }
      });
    }   
  };

  _selectStatus = status => {
    this.setState(
      {
        selectedStatus: status
      },
      () => this.updateinfoData()
    );
  };

  _onPressIsDownLaodable = () => {
    this.setState(
      {
        downLoadable: !this.state.downLoadable
      },
      () => this.updateinfoData()
    );
  };

  _openGalleryDialog = (index, imageType) => {
    this.setState({
      openImageGallery: true,
      imagewidth: ThemeConstant.UPLOAD_IMAGE_SIZE,
      imageHeight: ThemeConstant.UPLOAD_IMAGE_SIZE,
      newImageIndex: index,
      imageType: imageType,
      isCropping: true
    });
  };

  _handleGalleryDialog = (image, index) => {
    let images = this.state.newImages;
    images[index]["image"] = image;
    this.setState({
      openImageGallery: false,
      isNewImageUpdate: !this.state.isNewImageUpdate
    });
    this.callMultiPartAPI(image, index);
  };
  getFileName = uri => {
    if (!isStringEmpty(uri)) {
      return uri.substring(uri.lastIndexOf("/") + 1, uri.length);
    } else {
      return "";
    }
  };

  callMultiPartAPI = (uploadImageData, index) => {
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
          this.state.newImages[index]["imageId"] = response.image_id;
          this.setState(
            {
              isNewImageUpdate: !this.state.isNewImageUpdate
            },
            () => this.updateinfoData()
          );
        } else {
          showErrorToast(response.message);
        }
      });
    }
  };

  _onBackGalleryDialog = () => {
    this.setState({
      openImageGallery: false
    });
  };
  _onPressNewImage = () => {
    let newImage = {
      id: this.state.newImages.length,
      image: "",
      imageId: -1
    };
    let images = this.state.newImages;
    images.push(newImage);
    this.setState({
      newImages: images
    });
  };
  _onPressDeleteGalleryImage = index => {
    this.state.images.splice(index, 1);
    console.log("Index=>>" + index, this.state.images);

    this.setState(
      {
        images: this.state.images
      },
      () => this.updateinfoData()
    );
  };
  _onPressDeleteNewImage = index => {
    this.state.newImages.splice(index, 1);
    console.log("Index=>>" + index, this.state.newImages);
    this.setState(
      {
        isNewImageUpdate: !this.state.isNewImageUpdate
      },
      () => this.updateinfoData()
    );
  };
  render() {
  	console.log("this.state.productVideothis.state.productVideo",this.state.productVideo)
    return (
      <View style={styles.container}>
        <ScrollView>
        {this.state.status && typeof this.state.status != 'string' && this.state.status.length > 0
          ?
          <Text style={styles.headingTextStyle}>
            {strings("PRODUCT_STATUS")}
          </Text>
          : null }
          {this.state.status && typeof this.state.status != 'string' && this.state.status.length > 0
          ?
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            placeholder={strings("SHIPPING_CLASS")}
            selectedValue={this.state.selectedStatus}
            onValueChange={this._selectStatus.bind(this)}
            style={styles.pickerStyle}
          >
            {this.state.status.map((status, i) => {
              return (
                <Picker.Item key={i} value={status} label={status.title} />
              );
            })}
          </Picker>
          : null
          }
          {/* <TouchableOpacity
            style={styles.checkBoxViewStyle}
            onPress={_.debounce(this._onPressIsDownLaodable, 300)}
          >
            <CheckBox
              checked={this.state.downLoadable}
              color={ThemeConstant.ACCENT_COLOR}
              onPress={_.debounce(this._onPressIsDownLaodable, 300)}
            />
            <Text style={styles.checkboxTitleStyle}>
              {strings("")DOWNLOADABLE_PRODUCT}
            </Text>
          </TouchableOpacity> */}

          <View style={[styles.container2, {borderTopWidth : this.state.status && typeof this.state.status != 'string' && this.state.status.length ? 1 : 0 }]}>
            <Text style={styles.headingTextStyle}>
              {strings("IMAGE_GALLERY")}
            </Text>
            <FlatList
              data={this.state.images}
              contentContainerStyle={{
                alignSelf:
                  this.state.images && this.state.images.length > 2
                    ? "center"
                    : "flex-start"
              }}
              numColumns={3}
              keyExtractor={item => item.id + ""}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.imageContainer}>
                    <CustomImage
                      image={item.image}
                      imagestyle={styles.imagestyle}
                    />
                    <TouchableOpacity
                      style={styles.deleteButtonStyle}
                      onPress={this._onPressDeleteGalleryImage.bind(
                        this,
                        item,
                        index
                      )}
                    >
                      <CustomIcon2
                        name="delete"
                        size={ThemeConstant.DEFAULT_ICON_SIZE}
                        color={ThemeConstant.ACCENT_COLOR}
                        style={{ alignSelf: "center" }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
              ListEmptyComponent={
                <Text>{strings("NO_IMAGES_ADD_YET")}</Text>
              }
            />
            <View style={styles.rowStyle}>
              <Text style={styles.headingTextStyle}>
                {strings("NEW_IMAGES")}
              </Text>
              <Text
                style={styles.buttonRect}
                onPress={this._onPressNewImage.bind(this)}
              >
                {strings("ADD")}
              </Text>
            </View>
            <FlatList
              data={this.state.newImages}
              extraData={this.state.isNewImageUpdate}
              renderItem={({ item, index }) => {
                return (
                  <View style={styles.uploadImageContainer}>
                    <CustomImage
                      image={
                        typeof item.image == "object"
                          ? item.image.path
                          : item.image
                      }
                      imagestyle={styles.newImagestyle}
                    />
                    <View style={styles.imageDescriptionstyle}>
                      <Text>
                        {typeof item.image == "object"
                          ? this.getFileName(item.image.path)
                          : strings("NO_FILE_SELECTED")}
                      </Text>

                      <TouchableOpacity
                        style={styles.uploadButtonContainer}
                        onPress={this._openGalleryDialog.bind(this, index)}
                      >
                        <Text style={styles.buttonText}>
                          {strings("UPLOAD_IMAGE")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButtonStyle}
                      onPress={this._onPressDeleteNewImage.bind(this, index)}
                    >
                      <CustomIcon2
                        name="delete"
                        size={ThemeConstant.DEFAULT_ICON_SIZE}
                        color={ThemeConstant.ACCENT_COLOR}
                        style={{ alignSelf: "flex-end" }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index + ""}
              ListEmptyComponent={
                <Text>{strings("NO_IMAGES_ADD_YET")}</Text>
              }
            />
            <Text style={styles.headingTextStyle}>
              Youtube video
            </Text>
            <TextInput
              style={ViewStyle.inputTextStyle}
              autoCapitalize="none"
              value={this.state.productVideo}
              onChangeText={(text) => {
                this.setState({productVideo: text },
      					() => this.updateinfoData()
                );
              }}
              returnKeyType="next"
              placeholder={strings("PRODUCT_VIDEO")}
            />
          </View>
        </ScrollView>
        <AskCameraGalleryDialog
          visible={this.state.openImageGallery}
          _handleUploadImage={this._handleGalleryDialog.bind(this)}
          updateType={this.state.newImageIndex}
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
  container: {
    flex: 1,
    padding: ThemeConstant.MARGIN_GENERIC,
    borderWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR
  },
  container2: {
    borderTopWidth: 1,
    borderBottomWidth: 0.5,
    borderColor: ThemeConstant.LINE_COLOR,
    marginTop: ThemeConstant.MARGIN_GENERIC,
    paddingBottom: ThemeConstant.MARGIN_GENERIC
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
    padding: ThemeConstant.MARGIN_GENERIC,
    marginRight: ThemeConstant.MARGIN_GENERIC
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
  },
  rowStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  checkBoxViewStyle: {
    flexDirection: "row",
    marginTop: ThemeConstant.MARGIN_GENERIC,
    padding: ThemeConstant.MARGIN_GENERIC
  },
  checkboxTitleStyle: {
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_LARGE
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 4,
    height: SCREEN_WIDTH / 4
  },
  deleteButtonStyle: { flex: 1, margin: ThemeConstant.MARGIN_TINNY },
  imageContainer: {
    flexDirection: "column",
    borderWidth: 1,
    alignContent: "center",
    justifyContent: "center",
    borderColor: ThemeConstant.LINE_COLOR,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_TINNY
  },
  uploadImageContainer: {
    flexDirection: "row",
    padding: ThemeConstant.MARGIN_TINNY,
    borderWidth: 1,
    borderColor: ThemeConstant.LINE_COLOR,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_GENERIC
  },
  newImagestyle: {
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
  buttonText: {
    color: "#fff",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    textAlign: "center",
    fontWeight: "bold"
  }
});

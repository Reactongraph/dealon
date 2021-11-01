import React from "react";
import {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView
} from "react-native";

// import vision from '@react-native-firebase/ml-vision';
// import { firebase } from '@react-native-firebase/ml-vision'
import StringConstant from "../../app_constant/StringConstant";
import CustomIcon2 from "../CustomIcon2";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { height, width } from "../../utility/UtilityConstant";
import CustomActionbar from "../CustomActionbar";
import {RNCamera} from 'react-native-camera'
import { strings } from "../../localize_constant/I18";
const wbOrder = {
  auto: "sunny",
  sunny: "cloudy",
  cloudy: "shadow",
  shadow: "fluorescent",
  fluorescent: "incandescent",
  incandescent: "auto"
};

export default class OpenMLCamera extends React.Component {
  visible = false;
  camera = false;
  state = {
    textBlocks: [],
    message: strings("SEARCH_START_EMPTY_TEXT"),
    whiteBalance: "auto",  
  };

  onBackPress = () => {
    this.props.onBackResponse(false);
  };
  _requestPermissions = async () => {
    if (Platform.OS === "android") {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return result === PermissionsAndroid.RESULTS.GRANTED || result === true;
    }
    return true;
  };
  componentDidMount() {
    ({ _, status }) => {
      if (status !== "PERMISSION_GRANTED") {
        console.log("PERMISSION_GRANTED");
        this._requestPermissions();
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return this.props.isReferesh == nextProps.isReferesh
    if (nextProps.visible != this.visible || nextState != this.state) {
      this.visible = nextProps.visible;
      return true;
    }
    return false;
  }

  async takePicture() {
    if (this.camera) {
      console.log("takePicture=>>>>a");
      const options = {
        quality: 0.5,
        base64: true,
        skipProcessing: true,
        forceUpOrientation: true
      };
      console.log("takePicture=>>>>s");
      const data = await this.camera.takePictureAsync(options);
      console.log("takePicture=>>>>fff", data);
      // let labels =  await firebase.vision().imageLabelerProcessImage(data.uri);

      // console.log("TEST->>>", labels);
      

      // // for on-device (Supports Android and iOS)
      // const deviceTextRecognition = await RNMlKit.deviceTextRecognition(
      //   data.uri
      // );

      // console.log("Text Recognition On-Device", deviceTextRecognition);
      // // for cloud (At the moment supports only Android)
      // const cloudTextRecognition = await RNMlKit.cloudTextRecognition(data.uri);
      // console.log("Text Recognition Cloud", cloudTextRecognition);
    }
  }

  textRecognized = object => {
    const { textBlocks } = object;
    this.setState({ textBlocks });
  };

  _onPressSearchItem = text => {
    this.props.onBackResponse(text);
  };

  renderSearchText = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.eachSearchView} onPress={this._onPressSearchItem.bind(this, item.value)} >
        <CustomIcon2
          name="camera"
          size={ThemeConstant.DEFAULT_ICON_SMALL_SIZE}
        />
        <Text
          style={styles.eachSearchText}
          onPress={this._onPressSearchItem.bind(this, item.value)}
        >
          {item.value}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Modal
        onRequestClose={this.onBackPress.bind(this, false)}
        visible={this.props.visible}
        animationType="slide"
        transparent={true}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.onBackPress.bind(this, false)}
          style={styles.container}
        >
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <RNCamera
                ref={ref => {
                  this.camera = ref;
                }}
                whiteBalance={"auto"}
                onTextRecognized={this.textRecognized.bind(this)}
                style={[styles.preview]}
                permissionDialogTitle={"Permission to use camera"}
                permissionDialogMessage={
                  "We need your permission to use your camera phone"
                }
              >
                <SafeAreaView
                  style={[
                    {
                      alignSelf: "stretch",
                      height: "100%" ,
                      backgroundColor: "transparent",
                      justifyContent: "space-between"
                    }
                  ]}
                >
                  <CustomActionbar
                    title={strings("SEARCH")}
                    backwordTitle={strings("BACK")}
                    _onBackPress={this.onBackPress.bind(this, false)}
                    backwordImage="close-cross"
                    iconName={"camera"}
                    _onForwordPress={this.takePicture.bind(this)}
                  />

                  <View style ={{alignSelf:"flex-end", backgroundColor: "trasparent",width:width, flex:1,}}>
                  <FlatList
                  inverted
                    data={this.state.textBlocks}
                    keyExtractor = {(index)=> index + ""}
                    renderItem={this.renderSearchText.bind(this)}
                  />
                   <Text style={styles.emptyStyle}>
                        {this.state.textBlocks.length + " "  + strings("RESULT_FOUND")}
                      </Text>
                  </View>
                 
                </SafeAreaView>
              </RNCamera>
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
    backgroundColor: "rgba(0, 0, 0, .5)",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    backgroundColor: "transparent",
    alignItems: "stretch",
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: 5
  },
  preview: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch"
  },
  emptyStyle: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "white",
    backgroundColor:"rgba(255, 255, 255, 0.4)",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginBottom: ThemeConstant.MARGIN_TINNY,
    marginTop: ThemeConstant.MARGIN_TINNY,
    padding: ThemeConstant.MARGIN_GENERIC,
  },
  eachSearchView: {
    flexDirection: "row",
    alignSelf: "stretch",
    padding: ThemeConstant.MARGIN_GENERIC,
    borderBottomColor: ThemeConstant.LINE_COLOR,
    borderBottomWidth: 1,
    alignItems: "center",
    backgroundColor:"rgba(255, 255, 255, 0.4)",
  },
  eachSearchText: {
    marginLeft: ThemeConstant.MARGIN_NORMAL,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "normal",   
  }
});

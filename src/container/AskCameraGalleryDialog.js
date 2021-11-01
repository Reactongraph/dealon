import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import CustomActionbar from "../container/CustomActionbar";

import ThemeConstant from "../app_constant/ThemeConstant";
import ImagePicker from "react-native-image-crop-picker";
import { strings } from "../localize_constant/I18";


export default class AskCameraGalleryDialog extends React.Component {
    state={
        visible : false,
        width : 800,
        height : 800,
        isCropping : false,
        updateType : 1,
    }
    componentDidMount (){
        this.setState({
            visible : this.props.visible,
        })
    }
    componentWillReceiveProps(newProps){
        if(this.props.updateType != newProps.updateType || this.props.visible != newProps.visible){
            this.setState({
                visible : newProps.visible,
                width : newProps.width,
                height : newProps.height,
                isCropping : false,
                updateType : newProps.updateType
            })
        }
    }

  _onPressGellery = () => {
    ImagePicker.openPicker({
        width: this.state.width,
        height: this.state.height,
        // cropping: this.state.isCropping,
        compressImageQuality:1
        }).then(image => {
        console.log(image);
        this.props._handleUploadImage(image, this.state.updateType);
        }).catch(error => {
            console.log(error)
            this.props.onBack();
        });  
  };
  _onPressCammera = () => {
    ImagePicker.openCamera({
        width: this.state.width,
        height: this.state.height,
        cropping: false,
        compressImageQuality:1
        }).then(image => {
        console.log(image);
        this.props._handleUploadImage(image, this.state.updateType);
        }).catch(error => {
           console.log(error)
            this.props.onBack();
          });   
  };


  handleBackPress = () => {
      this.setState({
          visible : false
      })
    this.props.onBack();
  };
  render() {
    return (
      <Modal
        onRequestClose={() => {
          this.handleBackPress();
        }}
        visible={this.state.visible}
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
            <View style={styles.content} >
              <CustomActionbar
                _onBackPress={this.handleBackPress}
                backwordTitle={strings("BACK")}
                title={strings("SELECT_CHOICE")}
              />
              <Text style={styles.buttonRect}  onPress= {this._onPressGellery.bind(this)}>
                {strings("GALLERY")}
              </Text>
              <Text style={styles.buttonRectAccent}  onPress= {this._onPressCammera.bind(this)}>
                {strings("CAMERA")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  buttonRect: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    alignSelf: "stretch",
    textAlign: "center",
    color: ThemeConstant.ACCENT_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 10,
    fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight:"700",
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  },
  buttonRectAccent: {
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    alignSelf: "stretch",
    textAlign: "center",
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 10,
    fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight:"700",
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  },
  buttonRectAccentRadious: {
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    alignSelf: "stretch",
    textAlign: "center",
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, .3)",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "white",
    alignItems: "stretch",
    alignSelf: "center",
    width: "100%",
    padding: 5,
    paddingBottom : 28,
  }
});

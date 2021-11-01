import React from "react";
import { View, StyleSheet, Modal,  Platform } from "react-native";
import CustomActionbar from "./CustomActionbar";

import ThemeConstant from "../app_constant/ThemeConstant";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../utility/UtilityConstant";
import ImageViewer from "react-native-image-zoom-viewer";
import DeviceInfo from 'react-native-device-info';
import ViewStyle from "../app_constant/ViewStyle";
import { strings } from "../localize_constant/I18";

export default class ZoomImageContainer extends React.Component {
  state = {
    ModalVisibleStatus: true
  };

  componentDidMount() {}

  componentWillReceiveProps(newProps) {
    console.log("componentWillReceiveProps", newProps);
  }

  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: false });
    this._onBackPress();
  }
  _onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
    let images = this.props.navigation.getParam("images", []);
    let likeImage = [];
    images.forEach(element => {
      likeImage.push({
        url: element.src
      });
    });
    let index = this.props.navigation.getParam("index", 0);
    return (
      <View
        style={[{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR, marginTop:Platform.OS == "ios" ? DeviceInfo.hasNotch() ? 36 : 18 : 0 }, ViewStyle.mainContainer]} 
      >
        <Modal
          visible={this.state.ModalVisibleStatus}
          transparent={true}
          onRequestClose={() => this.ShowModalFunction()}
          presentationStyle = "overFullScreen"
        >
          <View  style={{backgroundColor: ThemeConstant.BACKGROUND_COLOR, marginTop:Platform.OS == "ios" ? DeviceInfo.hasNotch() ? 36 : 18 : 0 }} >
          <CustomActionbar
            backwordTitle={strings("BACK")}
            title={this.props.navigation.getParam("productName", "")}
            _onBackPress={this._onBackPress}
          />
          </View>
         
          <ImageViewer
            // renderIndicator={(currentIndex, allSize) =>
            //     <Text styles={styles.textStyle}>
            //       {currentIndex + " : " + allSize}
            //     </Text>
            // }
            index={index}
            backgroundColor={ThemeConstant.BACKGROUND_COLOR}
            imageUrls={likeImage}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bannerStyle: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  },
  textStyle: {
    color: ThemeConstant.ACCENT_COLOR,
    alignSelf: 'stretch',
    textAlign :"center",
    backgroundColor: 'transparent'
  }
});

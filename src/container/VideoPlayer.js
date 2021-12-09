import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Slider,
  TouchableNativeFeedback,
} from "react-native";
// import Video from "react-native-video"; /// alreadyimported this
// import Icon from "react-native-vector-icons/FontAwesome5"; // and this
// import Orientation from "react-native-orientation";
import YouTube from "react-native-youtube";

const { width } = Dimensions.get("window");
// const samplevideo = require("./sample.mp4");
//commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4

export default class VideoPlayer extends React.Component {
  constructor(p) {
    super(p);
    this.state = {
      currentTime: 0,
      duration: 0.1,
      paused: false,
      overlay: false,
      fullscreen: false,
    };
  }

  render() {
    return (
      <YouTube
        videoId="KVZ-P-ZI6W4" // The YouTube video ID
        apiKey="AIzaSyArdjIDLN8Est7xa6p2NwFrOqnMZ9X9gjw"
        play // control playback of video with true/false
        fullscreen // control whether the video should play in fullscreen or inline
        loop // control whether the video should loop when ended
        onReady={(e) => this.setState({ isReady: true })}
        onChangeState={(e) => this.setState({ status: e.state })}
        onChangeQuality={(e) => this.setState({ quality: e.quality })}
        onError={(e) => this.setState({ error: e.error })}
        style={{ alignSelf: "stretch", height: 300 }}
      />
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlaySet: {
    flex: 1,
    flexDirection: "row",
  },
  icon: {
    color: "white",
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 25,
  },
  sliderCont: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  timer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  // video: { width, height: width * 0.6, backgroundColor: "black" },
  // fullscreenVideo: {
  //   backgroundColor: "black",
  //   ...StyleSheet.absoluteFill,
  //   elevation: 1,
  // },
});

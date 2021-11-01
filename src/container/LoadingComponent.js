import React from "react";
import {Dimensions, StyleSheet} from 'react-native'
import {Spinner, View } from "native-base";
import ThemeConstant from "../app_constant/ThemeConstant";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class Loading extends React.Component {
  render() {
    return (
      <View style ={this.props.style ? this.props.style : styles.containerStyle}>
          <Spinner style={{ alignSelf: "center", justifyContent:"center", width:20, height:20}} color= { this.props.color? this.props.color : ThemeConstant.ACCENT_COLOR} />
      </View>      
    );
  }
}
const styles = StyleSheet.create({
  containerStyle :{height:SCREEN_HEIGHT ,flexDirection:"column", alignSelf: "stretch", justifyContent:"center", alignItems:"center",}
})

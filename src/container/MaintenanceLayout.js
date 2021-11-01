import React from "react";
import { Content,} from "native-base";
import { Image, StyleSheet, Text} from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { SCREEN_HEIGHT } from "../utility/UtilityConstant";

import { strings } from "../localize_constant/I18";

export default class MaintenanceLayout extends React.Component {
  render() {
    return (
      <Content scrollEnabled={true} contentContainerStyle = {{height : SCREEN_HEIGHT - 100, backgroundColor:ThemeConstant.BACKGROUND_COLOR , flexDirection:"column" ,alignSelf: "stretch", justifyContent:"center", alignItems:"center"}} >      
          <Image
            source={require("../../resources/images/ic_maintenance.png")}
            style={{ alignSelf: "center", height:"50%", width:"70%" }}/>

          <Text
            style={{ alignSelf: "center", textAlign :"center", fontWeight:"bold"}}
            color={ThemeConstant.DEFAULT_SECOND_TEXT_COLOR} 
          >
            {this.props.message}
          </Text>
          <Text  style={styles.buttonRect}  onPress = {this.props.onPress} >
            {strings("RETRY")}
          </Text>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  buttonRect: {
    width:"70%" ,
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    alignSelf: "center" ,
    textAlign: "center",
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    borderColor: ThemeConstant.ACCENT_COLOR,
    borderWidth: 1,
    borderRadius: 5,
    padding: ThemeConstant.MARGIN_GENERIC,
    margin: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_LARGE ,
  },
})
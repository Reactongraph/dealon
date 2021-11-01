import { StyleSheet, Platform } from "react-native";
import ThemeConstant from "./ThemeConstant";
import { SCREEN_WIDTH } from "../utility/UtilityConstant";
import DeviceInfo from 'react-native-device-info';

export default (ViewStyle = StyleSheet.create({
  mainContainer : {flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR ,  paddingBottom: DeviceInfo.hasNotch()? 14 : 0,},
  bannerStyle: {
    height: SCREEN_WIDTH / 1.5,
    width: SCREEN_WIDTH,
    paddingBottom:ThemeConstant.MARGIN_GENERIC,
    borderBottomColor: ThemeConstant.LINE_COLOR_2,
    borderBottomWidth: 0.5,
  },
  ratingViewStyle : {     
      flexDirection: 'row',
      // justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'center',
      backgroundColor: ThemeConstant.ACCENT_COLOR ,
      marginTop:ThemeConstant.MARGIN_TINNY,
      paddingTop: ThemeConstant.MARGIN_TINNY,
      paddingBottom:ThemeConstant.MARGIN_TINNY,
      paddingLeft: ThemeConstant.MARGIN_GENERIC,
      paddingRight: ThemeConstant.MARGIN_GENERIC,
  },
  viewAllStyle : {
    // flex : 1,
     borderColor : ThemeConstant.ACCENT_COLOR,
     borderWidth : 2,
     fontSize : ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
     fontWeight : "bold",
     fontStyle:"normal",
     alignContent :"center",
     textAlign : "center",
     textAlignVertical:"center",
     padding :ThemeConstant.MARGIN_NORMAL,
     margin: ThemeConstant.MARGIN_GENERIC,
     marginBottom: ThemeConstant.MARGIN_LARGE,
     marginTop: ThemeConstant.MARGIN_NORMAL,
     color : ThemeConstant.ACCENT_COLOR,
 },
 reviewStyle :{
  flex: 1,
  flexDirection: "row",
  padding: ThemeConstant.MARGIN_NORMAL,
  alignItems: "center",
  backgroundColor: ThemeConstant.BACKGROUND_COLOR
},
 reviewDescriptionStyle : {
  flex: 1,
  alignSelf: 'stretch',
  marginLeft: ThemeConstant.MARGIN_NORMAL,
  marginRight: ThemeConstant.MARGIN_NORMAL,
  paddingLeft: ThemeConstant.MARGIN_NORMAL,
  borderLeftColor:ThemeConstant.LINE_COLOR,
  borderLeftWidth :0.5,
  justifyContent:"center",
  alignItems:"flex-start"
},
statusView : {
  fontSize : ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
  fontWeight : "600",
  textAlign : "center",
  textAlignVertical:"center", 
  padding :ThemeConstant.MARGIN_GENERIC,
  // margin: ThemeConstant.MARGIN_TINNY,
  color : ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
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
passInputTextStyle: {
  alignSelf:"stretch",
  flex:1,
  fontSize:ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
  // marginRight:ThemeConstant.MARGIN_TINNY,
  // padding: ThemeConstant.MARGIN_GENERIC
  marginHorizontal:ThemeConstant.MARGIN_TINNY,
},
passInputViewStyle: {
  flexDirection:"row",
  alignSelf:"stretch",
  justifyContent: "space-between" ,
  backgroundColor: ThemeConstant.BACKGROUND_COLOR,
  borderColor: ThemeConstant.ACCENT_COLOR,
  borderWidth: 1,
  ...Platform.select({
    ios: { height: 35,padding: 5}
  }),
  margin: ThemeConstant.MARGIN_TINNY,
  paddingRight: ThemeConstant.MARGIN_TINNY,
},
textError: {
  color: "red",
  fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
  alignSelf:"stretch",
  // textAlign:"end"
},
}));

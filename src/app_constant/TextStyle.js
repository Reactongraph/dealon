import { StyleSheet } from "react-native";
import ThemeConstant from "./ThemeConstant";

export default (TextStyle = StyleSheet.create({
  smallTextStyle: {
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "normal"
  },
  normalTextStyle: {
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
  },
  priceTextStyle: {
    fontSize: ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    fontWeight:"bold",
    color : ThemeConstant.DEFAULT_TEXT_COLOR
  }, 
  emptyTextStyle :{
    alignSelf: "stretch",
    textAlign: "left",
    textAlignVertical:"center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color : ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontWeight : "500"
  },
  regularPriceTextStyle: {
    textDecorationLine: "line-through",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_TINNY,
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
  },
  noReviewTextStyle :{
    textAlign: "left",
    textAlignVertical:"center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color : ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontWeight : "500"
  },
  noReviewViewStyle :{
    alignSelf: "stretch",
    justifyContent:"center",
    // justifyContent:"flex-end",
    alignItems:"flex-start",
  },
  discountText : {
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_TINNY_TEXT_SIZE,
    fontWeight : "bold",
    color : ThemeConstant.DISCOUNT_TEXT_COLOR,
    borderColor: ThemeConstant.DISCOUNT_TEXT_COLOR,
    borderWidth: 1,
    borderRadius: ThemeConstant.MARGIN_TINNY,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom:ThemeConstant.MARGIN_TINNY,
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_GENERIC,
    marginLeft :ThemeConstant.MARGIN_GENERIC
  }
}));

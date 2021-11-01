import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";

import { Picker, Icon} from "native-base";
import { Button } from "react-native-elements";
import CustomIcon2 from "./CustomIcon2";
import { FlatList } from "react-native";
import {CustomImage } from "./CustomImage";
import { strings, localeObject } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class ItemCheckoutProduct  extends React.Component {
  state = {
    product: {},
  };
  componentDidMount() {
    let product = this.props.productData;
    this.setState({
      product: product
    });
  }

  componentWillUpdate(nextProps) {
    if (this.props.productData != nextProps.productData) {
      this.setState({
        subtotal : nextProps.productData.line_subtotal,
      });
    }
  }
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View style= {{marginBottom:ThemeConstant.MARGIN_NORMAL}}>
        <View 
          touchableHighlightStyle={{
            backfaceVisibility: "hidden"
          }}
          style={[styles.product_container, globleViewStyle]}
        >
           <CustomImage
            image = {this.state.product.image}
            imagestyle = {styles.imagestyle}
            dominantColor =  {this.state.product.dominantColor}
            /> 
          <View style={[styles.productInfoTheme, {alignItems: localeObject.isRTL ? "flex-end" : "flex-start",}]}>
            <Text style={[styles.firstTextTheme, globalTextStyle]} lineBreakMode = {true} ellipsizeMode="tail" allowFontScaling={false} numberOfLines={2}>
              {this.state.product.name}
            </Text>
            <FlatList 
             data = {this.state.product.variation}
             renderItem = {({item})=>{
               return (
                 <View style={[styles.variationContainer, globleViewStyle]} > 
                   <Text style = {styles.variationTitleStyle}>{item.title}</Text>
                   <Text style ={styles.variationValueStyle} >{item.option}</Text>
                 </View>
               )
             }}
             keyExtractor = {(item)=> item.name}
            />
            <Text style={[styles.secondaryTextTheme, globalTextStyle]} numberOfLines={1} allowFontScaling={false} >
               <Text style={styles.headingStyle} >{strings("QTY") + ": "}</Text>  {this.state.product.quantity}
            </Text>
            <Text style={[styles.secondaryTextTheme, globalTextStyle]} numberOfLines={1} allowFontScaling={false} >
            <Text style={styles.headingStyle} >{strings("PRICE")+  ": "}</Text> {this.state.product.unit_price}
            </Text>
           
            <Text style={[styles.secondaryTextTheme, globalTextStyle]} numberOfLines={1} allowFontScaling={false} >
              <Text  style={styles.headingStyle}>{strings("SUBTOTAL").toLocaleUpperCase() + ": "}</Text> {this.state.product.line_subtotal}
            </Text>
            
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 0.3,
    borderBottomColor: ThemeConstant.LINE_COLOR_2,
    borderTopColor: ThemeConstant.LINE_COLOR,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom : ThemeConstant.MARGIN_GENERIC,
    paddingLeft:ThemeConstant.MARGIN_GENERIC,
    paddingRight:ThemeConstant.MARGIN_GENERIC ,
  },
  variationContainer:{
    flexDirection:'row',
    justifyContent:'flex-start',
    borderColor:ThemeConstant.LINE_COLOR,
    borderWidth: 0.5,
    width:"100%"
  },
  variationTitleStyle:{
    backgroundColor:ThemeConstant.INPUT_TEXT_BACKGROUND_COLOR,
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    padding: ThemeConstant.MARGIN_TINNY,
    width : "40%",
  },
  variationValueStyle:{
    // alignSelf:"stretch",
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    padding: ThemeConstant.MARGIN_TINNY,
    borderColor:ThemeConstant.LINE_COLOR,
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 4,
    height: SCREEN_WIDTH / 4,
    backgroundColor:"yellow"
  },
  productInfoTheme: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_GENERIC,
    width: SCREEN_WIDTH -(SCREEN_WIDTH / 3.5),
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    color:ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight:'200',
    paddingBottom:ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
  },
  secondaryTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight:"400",
    color:ThemeConstant.DEFAULT_TEXT_COLOR,
    paddingBottom:ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  headingStyle:{ alignSelf: "center", fontWeight:"600", color:ThemeConstant.DEFAULT_SECOND_TEXT_COLOR, fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE},
 
});

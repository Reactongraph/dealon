import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { CustomImage } from "./CustomImage";
import CustomIcon2 from "./CustomIcon2";
import RatingView from "../component/RatingView";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class ItemDashboardReview extends React.PureComponent {

  onPressProduct = () => {
      if(this.props.onPressProduct){
        this.props.onPressProduct(this.props.productData);
      }
  }
  onPressReviewsDesc = ()=>{
    if(this.props.onPressReviewsDesc){
        this.props.onPressReviewsDesc(this.props.productData);
      }
  }
  render() {
    let productData = this.props.productData ? this.props.productData : {};
    return (
      <View style={styles.product_container}>
      <View style={{flexDirection:"row", flex:9}}>
      <CustomImage
          image={productData.image}
          imagestyle={styles.imagestyle}
          onPress={this.onPressProduct.bind(this)}
          dominantColor = {productData.dominantColor}
        />
        <TouchableOpacity
          style={styles.productInfoTheme}
          activeOpacity ={1}
        >
          <Text style={styles.firstTextTheme} numberOfLines={2}>
            {productData.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems:"center" }}>
          <RatingView
            ratingValue={productData.average_rating}
            iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
          />
          <Text style = {styles.secondaryTextTheme} >{productData.rating_count}</Text>
        </View>
        </TouchableOpacity>
      </View>

        <TouchableOpacity
            activeOpacity={1}
            onPress={this.onPressReviewsDesc.bind(this)}
            style = {{alignSelf:"center", flex:1, padding:ThemeConstant.MARGIN_NORMAL}}
          >
            <CustomIcon2
              name="arrow-right"
              size={ThemeConstant.DEFAULT_ICON_SIZE}
              color = {ThemeConstant.DEFAULT_SECOND_ICON_COLOR}
            />
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems:"center" ,
    justifyContent:"space-between",
    marginTop:ThemeConstant.MARGIN_NORMAL
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: 80,
    height: 80
  },
  productInfoTheme: {
    alignSelf: "stretch",
    justifyContent:"center",
    alignItems:"flex-start",
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_TINNY,
    width:SCREEN_WIDTH-160
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: "200",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginBottom: ThemeConstant.MARGIN_GENERIC
  },
  secondaryTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    marginLeft: ThemeConstant.MARGIN_GENERIC,
  },
  secondaryTextHeadingTheme: {
    marginLeft: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    fontWeight: "bold"
  }
});

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Pie from "react-native-pie";
import CustomIcon2 from "./CustomIcon2";
import ThemeConstant from "../app_constant/ThemeConstant";
import PropTypes from 'prop-types'
import { SCREEN_WIDTH, isStringEmpty } from "../utility/UtilityConstant";

const RADIOUS = SCREEN_WIDTH / 4 - ( SCREEN_WIDTH > 500 ? 40 : 20);
const INNER_RADIOUS = RADIOUS - 10;
const COLOR = ["rgba(229,26,26,1)", "rgba(255,72,72,1)", "rgba(255,161,0,1)", "rgba(255,204,0,1)", "rgba(107,199,0,1)"];
const STAR_SIZE = 18;

export default class ReviewChart extends React.Component {
  series = [];
  rating = [1, 2, 3, 4, 5];

  getPercentage = (total, value)=>{
      if(!value || (typeof value == 'string' && isStringEmpty(value)) ){
          value = 0;
      }else if(typeof value == 'string'){
        value = parseFloat(value)
      } 
      if(total == 0 || total == ""){
        total = 1;
      }
      return (value * 100 / total);
  }

  componentDidMount(){
      console.log("componentDidMount.SERIES", this.series );
  }

  render() {
    let total = this.props.reviewCount;
    let series = [];
    if( typeof this.props.reviewGraph == 'object' && !Array.isArray(this.props.reviewGraph)){
        let graph = this.props.reviewGraph ;
       series = [this.getPercentage(total, graph.start_one), this.getPercentage(total, graph.start_two), this.getPercentage(total, graph.start_three), this.getPercentage(total, graph.start_four), this.getPercentage(total, graph.start_five)]
    }
    return (
      <View >
        <Pie
          radius={RADIOUS}
          innerRadius={INNER_RADIOUS}
          series={series}
          colors={COLOR}
        />
        <View
          style={{
            position: "absolute",
            width: RADIOUS * 2,
            height: RADIOUS * 2,
            alignItems: "center",
            justifyContent: "center",
            // backgroundColor:"#d0d0d0"
          }}
        >

        {/*  Steps 1st */}

        <View
            style={styles.firstLabel}
        >
          <View style={styles.internalView}>
            <CustomIcon2 name="star-fill" color={COLOR[0]} size={STAR_SIZE} />
            <Text style = {styles.textStyle}>{this.rating[0]}</Text>
          </View>
          <View style={styles.internalView}>
            <CustomIcon2 name="star-fill" color={COLOR[1]} size={STAR_SIZE} />
            <Text style = {styles.textStyle}>{this.rating[1]}</Text>
          </View>
          <View style={styles.internalView}>
            <CustomIcon2 name="star-fill" color={COLOR[2]} size={STAR_SIZE} />
            <Text style = {styles.textStyle}> {this.rating[2]}</Text>
          </View>
         
        </View>
          {/*  Steps 2nd */}
          <View
          style={styles.secondLabel}
        >
          <View style={styles.internalView}>
            <CustomIcon2 name="star-fill" color={COLOR[3]} size={STAR_SIZE} />
            <Text style = {styles.textStyle}>{this.rating[3]}</Text>
          </View>
          <View style={{  flexDirection: "row", alignItems: "center" }}>
            <CustomIcon2 name="star-fill" color={COLOR[4]} size={STAR_SIZE} />
            <Text style = {styles.textStyle}>{this.rating[4]}</Text>
          </View>
         
        </View>
        </View>

      </View>
    );
  }
}

ReviewChart.propsTypes ={
    reviewCount: PropTypes.number,
    reviewGraph : PropTypes.object
}
ReviewChart.defaultProps = {
    reviewCount : 1,
    reviewGraph : {}
}

export const styles = StyleSheet.create({
    ratingLabel : {
        position: "absolute",
        width: RADIOUS * 2,
        height: RADIOUS * 2,
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor:"#d0d0d0"
      },
    firstLabel : {
        flexDirection: "row",
        width: RADIOUS * 1.25,
        justifyContent: "space-between"
      },
      secondLabel :{
        flexDirection: "row",
        width: RADIOUS * 0.75,
        justifyContent: "space-between",
        marginTop : ThemeConstant.MARGIN_GENERIC,

      },
      internalView: {flexDirection:"row"},
      textStyle : {fontSize : ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE, fontWeight: '700', }
});
 
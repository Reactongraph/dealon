import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Pie from "react-native-pie";
import PropTypes from 'prop-types'
import { SCREEN_WIDTH } from "../../utility/UtilityConstant";
import ThemeConstant from "../../app_constant/ThemeConstant";

const RADIOUS = SCREEN_WIDTH / 4 - ( SCREEN_WIDTH > 500 ? 40 : 20);
const INNER_RADIOUS = 0;
const COLOR = ["rgb(200,215,225)", "rgba(0,107,188,0.5)","rgb(198,225,199)","rgba(255,161,0,0.5)","rgb(229,229,229)", "rgba(255,204,0,1)", "rgb(235,163,163)"];
const STAR_SIZE = 18;

export default class SellerOrderChart extends React.Component {
  series = [];
  orderStatus = ["completed", "pending", "processing", "on-hold", "cancelled", "refunded", "failed"];

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
    let total = this.props.orderCount;
    let series = [];
    let graph = {};
    if( typeof this.props.orderGraph == 'object' && !Array.isArray(this.props.orderGraph)){
        graph = this.props.orderGraph ;
       series = [this.getPercentage(total, graph.completed), this.getPercentage(total, graph.pending), this.getPercentage(total, graph.processing), this.getPercentage(total, graph["on-hold"]), this.getPercentage(total, graph.cancelled), this.getPercentage(total, graph.refunded), this.getPercentage(total, graph.failed)]
    }
    return (
      <View style={{flexDirection:"row", padding:ThemeConstant.MARGIN_NORMAL, borderBottomColor:ThemeConstant.LINE_COLOR_2, borderBottomWidth:0.5, marginBottom:ThemeConstant.MARGIN_GENERIC }} >
        <Pie
          radius={RADIOUS}
          innerRadius={INNER_RADIOUS}
          series={series}
          colors={COLOR}
        />
        <View
            style={styles.firstLabel}
        >
          <View style={styles.internalView}>
            <View  style={[styles.squareView,{backgroundColor : COLOR[0]}]}/>
            <Text style = {styles.textStyle}>{this.orderStatus[0]} ({graph.completed}) </Text>
          </View>
          <View style={styles.internalView}>
          <View  style={[styles.squareView,{backgroundColor : COLOR[1]}]}/>
            <Text style = {styles.textStyle}>{this.orderStatus[1]} ({graph.pending}) </Text>
          </View>
          <View style={styles.internalView}>
          <View  style={[styles.squareView,{backgroundColor : COLOR[2]}]}/>
            <Text style = {styles.textStyle}>{this.orderStatus[2]} ({graph.processing})</Text>
          </View>
          <View style={styles.internalView}>
          <View  style={[styles.squareView,{backgroundColor : COLOR[3]}]}/>
            <Text style = {styles.textStyle}>{this.orderStatus[3]} ({ graph["on-hold"]})</Text>
          </View>
          <View style={{  flexDirection: "row", alignItems: "center" }}>
          <View  style={[styles.squareView,{backgroundColor : COLOR[4]}]}/>
            <Text style = {styles.textStyle}>{this.orderStatus[4]} ({graph.cancelled}) </Text>
          </View>
          <View style={{  flexDirection: "row", alignItems: "center" }}>
          <View  style={[styles.squareView,{backgroundColor : COLOR[5]}]}/>
            <Text style = {styles.textStyle}>{this.orderStatus[5]} ({graph.refunded}) </Text>
          </View>
          <View style={{  flexDirection: "row", alignItems: "center" }}>
          <View  style={[styles.squareView,{backgroundColor : COLOR[6]}]}/>
            <Text style = {styles.textStyle}>{this.orderStatus[6]} ({graph.failed}) </Text>
          </View>
         
       </View>
      </View>
    );
  }
}

SellerOrderChart.propsTypes ={
    orderCount: PropTypes.number,
    orderGraph : PropTypes.object
}
SellerOrderChart.defaultProps = {
    orderCount : 1,
    orderGraph : {}
}

export const styles = StyleSheet.create({
    ratingLabel : {
        position: "absolute",
        width: RADIOUS * 2,
        height: RADIOUS * 2,
        alignItems: "center",
        justifyContent: "center",
      },
    firstLabel : {
        flex:1,
        alignSelf:"stretch",
        alignItems:"stretch",
        justifyContent:"center",
        marginLeft:ThemeConstant.MARGIN_NORMAL
      },
      squareView : {
          width:STAR_SIZE,
          height :STAR_SIZE,
          marginRight:ThemeConstant.MARGIN_TINNY,
          borderRadius:4
      },
      internalView: {flexDirection:"row"},
      textStyle : {fontSize : ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE, fontWeight: '700', }
});
 
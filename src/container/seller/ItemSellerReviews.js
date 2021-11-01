import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { Rating } from 'react-native-elements';
import StringConstant from '../../app_constant/StringConstant';
import ThemeConstant from '../../app_constant/ThemeConstant';
import { strings, localeObject } from '../../localize_constant/I18';
import StarRating from 'react-native-star-rating';

export default class ItemSellerReview extends React.Component {
    rating = {}

    render(){
         let ratingData = this.props.ratingData;
        return (
            <View style = {styles.itemView} >
            <View style={styles.ratingTopViewStyle} >
                 <View style={styles.ratingViewStyle} >  
                 <Text style={styles.ratingTitleHeading} >{strings("PRICE")}</Text>                   
                <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={ThemeConstant.RATING_SIZE_MEDIUM}
                  rating={parseFloat(ratingData.review.price)}
                  reversed={localeObject.isRTL}
                  fullStarColor={ThemeConstant.RATING_COLOR}
                  emptyStarColor="gray"
                /> 
                 </View>
                 <View style={styles.ratingViewStyle} >  
                 <Text style={styles.ratingTitleHeading} >{strings("VALUE")}</Text>                   
                 <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={ThemeConstant.RATING_SIZE_MEDIUM}
                  rating={parseFloat(ratingData.review.value)}
                  reversed={localeObject.isRTL}
                  fullStarColor={ThemeConstant.RATING_COLOR}
                  emptyStarColor="gray"
                />
                 </View>
                 <View style={styles.ratingRightViewStyle} > 
                 <Text style={styles.ratingTitleHeading}>{strings("QUALIY")}</Text> 
                 <StarRating
                  disabled={true}
                  maxStars={5}
                  starSize={ThemeConstant.RATING_SIZE_MEDIUM}
                  rating={parseFloat(ratingData.review.quality)}
                  reversed={localeObject.isRTL}
                  fullStarColor={ThemeConstant.RATING_COLOR}
                  emptyStarColor="gray"
                />
                 </View>
              </View>

            <Text style={styles.headingTextstyle} >{ratingData.title}</Text>

              <Text style={styles.normalTextstyle}>
                {strings("BY")} {ratingData.author}, {ratingData.date}
              </Text>
              <Text style={[styles.normalTextstyle, {fontSize:ThemeConstant.DEFAULT_SMALL_TEXT_SIZE}]}>
                {ratingData.description}
              </Text>
            </View>
          );
    }
}

const styles = StyleSheet.create({
    ratingTopViewStyle : {
        flex:1,
        backgroundColor : ThemeConstant.BACKGROUND_COLOR,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:"center",
        borderColor: ThemeConstant.LINE_COLOR_2,
        padding:ThemeConstant.MARGIN_GENERIC,
        paddingTop:0
    },
    ratingViewStyle :{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        borderRightColor:ThemeConstant.LINE_COLOR_2,
        borderRightWidth: 1,
        paddingTop:ThemeConstant.MARGIN_NORMAL,
        paddingBottom:ThemeConstant.MARGIN_GENERIC,
      },
      ratingRightViewStyle :{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        paddingTop:ThemeConstant.MARGIN_NORMAL,
        paddingBottom:ThemeConstant.MARGIN_GENERIC,
      },
      ratingTitleHeading :{
          fontWeight :"bold",
          margin: ThemeConstant.MARGIN_TINNY,
          fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
          color:ThemeConstant.DEFAULT_TEXT_COLOR
      },
      normalTextstyle: {
        marginTop: ThemeConstant.MARGIN_TINNY,
        color:ThemeConstant.DEFAULT_TEXT_COLOR,
        fontWeight: "200",
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
      },
      headingTextstyle: {
        marginTop: ThemeConstant.MARGIN_TINNY,
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        fontWeight: "bold",
        color:ThemeConstant.DEFAULT_TEXT_COLOR
      },
      itemView: {
          borderColor: ThemeConstant.LINE_COLOR_2,
          borderTopWidth: 1,
          paddingBottom: ThemeConstant.MARGIN_GENERIC,
          marginTop:ThemeConstant.MARGIN_GENERIC,
          alignItems:'flex-start',
      }
})
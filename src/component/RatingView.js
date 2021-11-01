import React from 'react';
import {View, Text} from 'react-native';
import CustomIcon2 from '../container/CustomIcon2';
import ThemeConstant from '../app_constant/ThemeConstant';
import ViewStyle from '../app_constant/ViewStyle';
import TextStyle from '../app_constant/TextStyle';
import { localizeStyle } from '../localize_constant/LocalizeViewConstant';
import { localeObject, strings } from '../localize_constant/I18';

export default class RatingView extends React.PureComponent {
    render(){
        const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
        const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
        if(this.props.ratingValue == ""){
            return null
        }else
        if( this.props.ratingViewVisible || (this.props.ratingValue && this.props.ratingValue != 0.0 )){
        return(
            <View style={[ViewStyle.ratingViewStyle, globleViewStyle]} >
                <Text style={[TextStyle.smallTextStyle,{color:ThemeConstant.BACKGROUND_COLOR, marginRight: localeObject.isRTL ? 0 : ThemeConstant.MARGIN_NORMAL, marginLeft: localeObject.isRTL ? ThemeConstant.MARGIN_NORMAL : 0}]}>
                    {typeof this.props.ratingValue == 'string' ? parseFloat(this.props.ratingValue).toFixed(2) : typeof this.props.ratingValue == "number" ? this.props.ratingValue.toFixed(2) : this.props.ratingValue }
                </Text>
                <CustomIcon2
                 name = {"star-fill"}
                 size = { this.props.iconSize ? this.props.iconSize: ThemeConstant.DEFAULT_ICON_SMALL_SIZE}
                 color = {ThemeConstant.BACKGROUND_COLOR}
                />
            </View>
        )
        }else{
            return(
                <View style={[TextStyle.noReviewViewStyle,{alignItems:localeObject.isRTL ? "flex-end" : "flex-start"}]}>
                <Text style={[TextStyle.noReviewTextStyle, globalTextStyle]} >{strings("NO_REVIEW_ADDED_YET")}</Text> 
               </View>
            )
        }
    }
}
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import CustomIcon2 from './CustomIcon2';
import ThemeConstant from '../app_constant/ThemeConstant';
import StringConstant from '../app_constant/StringConstant';
import { strings } from '../localize_constant/I18';

export default class CouponCodeItem extends React.Component {
    onDeleteCoupon = null;
    state = {
        couponData : {}    
    }

 componentDidMount (){
     console.log("Coupon",this.props.couponData,);     
        this.setState({
            couponData : this.props.couponData,
        })
    }
 componentWillUpdate (newProps){
    console.log("componentWillUpdate",newProps.couponData,); 
     if( newProps && newProps.couponData != this.props.couponData){
        this.setState({
            couponData : newProps.couponData,
        })
     }
 }


    render (){
        return(
            <View style ={styles.container} >
                <Text style={styles.couponCodeTextStyle}>{ this.state.couponData.coupon_code}</Text>
                <Text style={styles.couponCodeTextStyle}>{this.state.couponData.coupon_amount}</Text>
            <TouchableOpacity style={styles.buttonStyle} onPress={ ()=> this.props.onDeleteCoupon(this.state.couponData)} >
                 <CustomIcon2 name = "delete" size = {ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM} color = {ThemeConstant.ACCENT_COLOR} />
               <Text style= {styles.deleteButtonTextStyle} >{strings("REMOVE")}</Text>
          </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: ThemeConstant.MARGIN_TINNY,
        marginTop: ThemeConstant.MARGIN_TINNY
      },
      couponCodeTextStyle: {
        alignSelf: 'center',
        marginLeft: ThemeConstant.MARGIN_GENERIC ,
        color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
      },
      deleteButtonTextStyle: {        
        color: ThemeConstant.ACCENT_COLOR,
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
      },
      buttonStyle: {
        borderColor: ThemeConstant.ACCENT_COLOR ,
        borderWidth: 1,
        marginLeft:ThemeConstant.MARGIN_TINNY,
        padding: ThemeConstant.MARGIN_GENERIC,
        borderRadius: 8,
        flexDirection: 'row',
        alignSelf: "flex-start", 
        alignItems:"center"
      }
})

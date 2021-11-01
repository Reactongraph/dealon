import React from 'react'
import {View, TouchableOpacity, Linking, StyleSheet} from "react-native";
import CustomIcon2 from '../CustomIcon2';
import ThemeConstant from '../../app_constant/ThemeConstant';

export default class SocialLinkImage extends React.Component{

    onPressLink = (link)=>{
        Linking.openURL(link);
    }

   render(){
       
       return(
           <TouchableOpacity activeOpacity={1} onPress = {this.onPressLink.bind(this, this.props.link)} style={{padding:ThemeConstant.MARGIN_GENERIC,  }} >
               <CustomIcon2 
                  name = {this.props.iconName}
                  size = {45}
                  color = {this.props.iconColor}
               />
           </TouchableOpacity>
       )
   }
}

const styles = StyleSheet.create({
    
})
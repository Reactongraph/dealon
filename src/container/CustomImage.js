import React from "react";
import { TouchableOpacity, Image, View} from "react-native";
import FastImage from "react-native-fast-image";
import PropTypes from 'prop-types'
import { isStringEmpty } from "../utility/UtilityConstant";
import CustomIcon2 from "./CustomIcon2";
import ThemeConstant from "../app_constant/ThemeConstant";
import AppConstant from "../app_constant/AppConstant";
export class CustomImage extends React.Component {
  state = {
    image: "",
    isChangeDominentColor : true
  };
  componentDidMount() {
    this.setState({
      image: this.props.image,
      isChangeDominentColor : true
    });
  }
  componentWillUpdate(newProps) {
    if (this.props.image !== newProps.image) {
      this.setState({
        image: newProps.image,
        isChangeDominentColor : true
      });
    }
  }
  onLoadFinish = ()=>{
    this.setState({
      isChangeDominentColor : false
    })
  }
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} activeOpacity = {1} >
        {!isStringEmpty(this.state.image) ? (
          <FastImage
            source={{ uri: this.state.image }}
            style={[this.props.imagestyle,{backgroundColor: this.props.dominantColor && this.state.isChangeDominentColor ? this.props.dominantColor  : "white" }]}
            resizeMode={"cover"}
            onLoadEnd = {this.onLoadFinish.bind(this)}
          />
         ) : (
          <View style={[this.props.imagestyle, {justifyContent:"center", alignItems:"center", backgroundColor:ThemeConstant.LINE_COLOR_2}]} > 
             {AppConstant.ISDEMO ? 
           <CustomIcon2
            name={"mobikul-logo"}
            size = {this.props.size}
            color = "black"            
           /> :
           <FastImage
           source={require("../../resources/images/placeholder.png")}
           style={[this.props.imagestyle,{backgroundColor: this.props.dominantColor && this.state.isChangeDominentColor ? this.props.dominantColor  : "white" }]}
           resizeMode={"cover"}
         />}   
           </View>
        )} 
      </TouchableOpacity>
    );
  }
}

CustomImage.propsType = {
  image : PropTypes.string.isRequired,
  imagestyle : PropTypes.object.isRequired,
  dominantColor : PropTypes.string,
  size :PropTypes.number
}
CustomImage.defaultProps = {
  dominantColor : 'white',
  size : 120
}

export default CustomImage;

import React from 'react'
import {
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Text,
    View,
  } from "react-native";
import ThemeConstant from '../app_constant/ThemeConstant';
import StringConstant from '../app_constant/StringConstant';
import { strings } from '../localize_constant/I18';

  export default class QuantityDialog extends React.Component{
    defaultQuantitySize = 5
    handleBackPress = ()=>{
        this.props.cancel();
    }
    onPressQuantity =(qty)=>{
        this.props.response(qty);
    }
    onPressMore = ()=>{
        this.props.viewMore();
    }

    render(){
        return(
            <Modal
             onRequestClose={() => {
                this.handleBackPress();
              }}
              visible={this.props.visible}
              animationType="slide"
              transparent={true}
            >
            <TouchableOpacity
              style={styles.container}
              activeOpacity={1}
              onPressOut={() => {
                this.handleBackPress();
              }}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.content} >
                        <Text style={styles.headingTextColor} numberOfLines={2} ellipsizeMode="tail" >{this.props.name}</Text>
                        <Text style={styles.eachItemText} onPress = {this.onPressQuantity.bind(this, 1)} >1</Text>
                        <Text style={styles.eachItemText} onPress = {this.onPressQuantity.bind(this, 2)}>2</Text>
                        <Text style={styles.eachItemText} onPress = {this.onPressQuantity.bind(this, 3)}>3</Text>
                        <Text style={styles.eachItemText} onPress = {this.onPressQuantity.bind(this, 4)}>4</Text>
                        <Text style={styles.eachItemText} onPress = {this.onPressQuantity.bind(this, 5)}>5</Text>
                        <Text style={[styles.eachItemText, {fontWeight:"300"}]} onPress = {this.onPressMore.bind(this, 1)}>
                          {strings("VIEW_MORE")}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>

            </Modal>
        )
    }
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, .3)",
        alignItems: "center",
        justifyContent: "center"
      },
      content: {
        backgroundColor: "white",
        height: 280,
        width: 150,
        alignItems: "center",
        padding: ThemeConstant.MARGIN_GENERIC
      },
      eachItemText : {
        alignSelf:"stretch",
        textAlign:"center",
        fontSize:ThemeConstant.DEFAULT_LARGE_TEXT_SIZE, 
        fontWeight:"bold",
        color:ThemeConstant.DEFAULT_TEXT_COLOR,
        margin: ThemeConstant.MARGIN_TINNY
      },

      headingTextColor:{
        alignSelf:"stretch",
        textAlign:"center",
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
        fontWeight: "500",
        color: ThemeConstant.DEFAULT_TEXT_COLOR,
        margin: ThemeConstant.MARGIN_GENERIC,
        paddingBottom:ThemeConstant.MARGIN_GENERIC,
        borderBottomColor:ThemeConstant.LINE_COLOR_2,
        borderBottomWidth:0.5
      }
  })
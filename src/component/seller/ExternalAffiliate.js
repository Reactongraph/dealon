import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import StringConstant from "../../app_constant/StringConstant";
import ThemeConstant from "../../app_constant/ThemeConstant";
import { strings } from "../../localize_constant/I18";

export default class ExternalAffiliate extends React.Component {
    state = {
        productUrl : "",
        buttonText : "",
    }
    componentDidMount (){
        this.setState({
            productUrl : this.props.productUrl,
            buttonText :  this.props.buttonText,
        }, ()=> this.updateinfoData() )
    }
    componentWillUpdate(newProps){
        if(newProps.isGetProductInfoData){
          this.props.getInfoProductData({response: this.state})
        }
        if(newProps != this.props){
          this.setState({
            productUrl : this.props.productUrl,
            buttonText :  this.props.buttonText,
        }, ()=> this.updateinfoData() )
        }
      }
      updateinfoData = ()=>{
        this.props.getInfoProductData({response: this.state})
      }
  render() {
    return (
      <View style = {styles.container}>
        <Text style={styles.headingTextStyle}>{strings("PRODUCT_URL")}</Text>
        <TextInput
          style={styles.inputTextStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.productUrl}
          onChangeText={text => {
            this.setState({ productUrl: text }, ()=> this.updateinfoData() );
          }}
        //   keyboardType="url"
          keyboardType="default"
          returnKeyType="next"
          placeholder={strings("PRODUCT_URL")}
        />
        <Text style={styles.headingTextStyle}>{strings("BUTTON_TEXT")}</Text>
        <TextInput
          style={styles.inputTextStyle}
          autoCapitalize="none"
          autoCorrect={false}
          value={this.state.buttonText}
          onChangeText={text => {
            this.setState({ buttonText: text }, ()=> this.updateinfoData() );
          }}
          keyboardType="default"
          returnKeyType="next"
          placeholder={strings("BUTTON_TEXT")}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
    container: {
        padding: ThemeConstant.MARGIN_GENERIC,
        borderWidth: 0.5,
        borderColor: ThemeConstant.LINE_COLOR,
      },
    headingTextStyle: {
        fontWeight: "bold",
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
        marginTop: ThemeConstant.MARGIN_GENERIC
      },
      inputTextStyle: {
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
        borderColor: ThemeConstant.LINE_COLOR,
        borderWidth: 1,
        margin: ThemeConstant.MARGIN_TINNY,
        padding: ThemeConstant.MARGIN_GENERIC,
        marginLeft: ThemeConstant.MARGIN_GENERIC,
      },
})

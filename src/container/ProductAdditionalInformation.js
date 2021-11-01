import React from "react";
import { View, Text, StyleSheet} from "react-native";
import CustomActionbar from "./CustomActionbar";

import { ScrollView, FlatList } from "react-native";
import { Container } from "native-base";
import ThemeConstant from "../app_constant/ThemeConstant";
import { strings } from "../localize_constant/I18";

export default class ProductAdditionalInformation extends React.Component {
    state ={
        attributesList : [],
    }

    componentDidMount(){
        this.setState({
            attributesList : this.props.navigation.getParam("attributes", [])
        })
    }
    _onBackPress = () => {
        this.props.navigation.pop();
      };
  render() {
    return (
      <View style={{flex:1, backgroundColor:ThemeConstant.BACKGROUND_COLOR}}>
        <CustomActionbar
          title={strings("ADDITIONAL_INFORMATION")}
          backwordTitle={strings("BACK")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        <View style={styles.containerStyle}>
        <ScrollView>
        <FlatList
            data={this.state.attributesList}
            renderItem={({ item }) => {
                let viewItem = item;
                return (
                <View>
                    <Text style={styles.titleStyle}>{item.title}</Text>
                    <FlatList
                       data = {item.options}
                       numColumns = {4}
                       renderItem={({ item, index }) => {
                        return (
                          <Text
                          style = {styles.normalTextStyle}
                          >
                            {item.name + (viewItem.options.length -1 > index ? "," : "" )}
                          </Text>
                        );
                      }}
                      keyExtractor = {(item, index)=> index + ""}
                    />
                </View>
                );
            }}
            keyExtractor = {(item, index)=> index + ""}
            />
        </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    containerStyle : {
        padding:ThemeConstant.MARGIN_GENERIC ,
    },
    titleStyle:{
        alignSelf: "stretch",
        fontWeight:'bold',
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
        marginTop:ThemeConstant.MARGIN_GENERIC
        },
     normalTextStyle : {
        alignSelf: "stretch",
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
        marginTop: ThemeConstant.MARGIN_TINNY ,
        marginLeft: ThemeConstant.MARGIN_GENERIC,
     }
  });
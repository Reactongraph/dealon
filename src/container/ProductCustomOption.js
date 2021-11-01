import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import CustomOptionItem from "./CustomOptionItem";
import ThemeConstant from "../app_constant/ThemeConstant";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject } from "../localize_constant/I18";

export class ProductCustomOption extends React.PureComponent {
state = {
    attributesList: [],
    variationList: [],
    selectedAttributeList: {}
};

componentDidMount() {
    this.setState({
    attributesList: this.props.attributesList
        ? this.props.attributesList
        : [],
    variationList: this.props.variationList ? this.props.variationList : [],
    selectedAttributeList: this.props.selectedAttributeList
        ? this.props.selectedAttributeList
        : {}
    });
}

componentWillReceiveProps(nextProps){
    if(this.props.attributesList != nextProps.attributesList){
        this.setState({
            attributesList: nextProps.attributesList
            ? nextProps.attributesList
            : [],
            variationList: nextProps.variationList ? nextProps.variationList : [],
            selectedAttributeList: nextProps.selectedAttributeList
            ? nextProps.selectedAttributeList
            : {}
        });
    }
}

_onPressOption = (selectedAttributeId, optionId) => {
    this.state.selectedAttributeList[selectedAttributeId] = optionId;
    if(Object.keys(this.state.selectedAttributeList).length === this.state.attributesList.length){
        console.log("Selected Attribute=>>", this.state.selectedAttributeList);
    this.props.selectedVariation( this.getVariationData(), this.state.selectedAttributeList);
    }
    // else{
    //     this.props.selectedVariation( null, this.state.selectedAttributeList);
    // }
};

getVariationData = ()=> {
    let variationData = null; 
    this.state.variationList.forEach(variation=>{ 
        let value = 0;
        console.log("For Each Variation=>", variation);
        
        Object.keys(this.state.selectedAttributeList).forEach((key, index )=>{
            console.log("For Each KEY=>", key);
            console.log("For Each =>", variation.attributes[index].option + "      " + this.state.selectedAttributeList[key] );
            if (variation.attributes[index].option == '' || variation.attributes[index].option === this.state.selectedAttributeList[key]){
                value = value +1;
                if(value === Object.keys(this.state.selectedAttributeList).length ){
                    if(variationData == null || variation.attributes[index].option === this.state.selectedAttributeList[key]){
                         variationData = variation;
                    }
                }
            }else{

            }
        })
    })
    return  variationData;   

}

render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    return (
    <View>
        <FlatList
        data={this.state.attributesList}
        renderItem={({ item }) => {
            return (
            <View >
                <Text style={[styles.titleStyle, globalTextStyle]}>{item.title}</Text>
                <CustomOptionItem
                attributeId={item.name}
                options={item.options}
                selecetedItem={""}
                onPressOption={this._onPressOption.bind(this)}
                />
            </View>
            );
        }}
        keyExtractor = {(item=> item.name)}
        />
    </View>
    );
}
}
const styles = StyleSheet.create({
titleStyle:{
alignSelf: "stretch",
fontWeight:'bold',
fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE ,
}
})
import React from "react";
import { View } from "react-native";
import CustomActionbar from "../../container/CustomActionbar";
import StringConstant from "../../app_constant/StringConstant";
import { FlatList, ScrollView } from "react-native";
import SellerListItem from "../../container/seller/SellerListItem";
import AppConstant from "../../app_constant/AppConstant";
import { SCREEN_WIDTH } from "../../container/ProductView";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import Loading from "../../container/LoadingComponent";
import EmptyLayoutComponent from "../../container/EmptyLayoutComponent";
import ThemeConstant from "../../app_constant/ThemeConstant";
import ViewStyle from "../../app_constant/ViewStyle";
import { strings } from "../../localize_constant/I18";

export default class SellerList extends React.Component {
    screenProps = {}
 state = {
     sellerList :[],
     isLoading : true,
 }

 componentDidMount (){
    let { navigation, screenProps } = this.props;    
    // screenProps.navigate("CategoryNavigation" , {categoryId:2, categoryName:"test"})    
      
     let url  = AppConstant.BASE_URL + "seller/list?width="  +  SCREEN_WIDTH;
     fetchDataFromAPI (url, 'GET', "", null).then(response=>{
         if(response && response.success){
             this.setState({
                 sellerList : response.seller ? response.seller :[],
                 isLoading : false
             })
         }else{
             this.setState({isLoading:false})
         }         
     })
 }
 _onPressBack = ()=>{
     this.props.navigation.pop();     
 }
 onPressSeller = (seller)=>{
     console.log("Seller", seller);
     this.props.navigation.navigate("SellerProfileView", {
        sellerId: seller.id
      });    
 }

  render() {
    return (
      <View style={ViewStyle.mainContainer}>
        <CustomActionbar
          _onBackPress={this._onPressBack}
          backwordTitle={strings("ACCOUNT_TITLE")}
          title={strings("SELLER_LIST_TITLE")}
        />
        { this.state.isLoading ? <Loading/> : 
        <ScrollView>
        <FlatList
         data = {this.state.sellerList}
         renderItem = {(item) => {
             return (
                 <SellerListItem sellerData ={item.item} onPressSeller = {this.onPressSeller.bind(this)} ></SellerListItem>
             );
         }}
         ListEmptyComponent = { <EmptyLayoutComponent message = {strings("EMPTY_SELLER_MSG")} ></EmptyLayoutComponent> }
         keyExtractor = {(item)=> item.id}
        ></FlatList>
        </ScrollView> 
        }
      </View>
    );
  }
}

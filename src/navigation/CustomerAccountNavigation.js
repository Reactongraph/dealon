import React from 'react'
import {createStackNavigator,} from 'react-navigation';
import CustomerAccountPage from '../component/CustomerAccountPage';
import LoginPage from '../component/LoginPage';
import SignUp from '../component/SignUpPage';
import SellerDashboardProduct from '../component/seller/SellerDashboardProduct';
import SellerOrders from '../component/seller/SellerOrders';
import SellerTransaction from '../component/seller/SellerTransaction';
import OrderDetails from '../component/seller/OrderDetails';
import CustomerOrders from '../component/CustomerOrders';
import UpdateAddress from '../component/UpdateAddress';
import CustomerOrderDetails from '../component/CustomerOrderDeatails';
import CustomerProfile from '../container/CustomerProfile';
import AskQueryToAdminList from '../component/seller/AskQueryToAdminList';
import AskToAdminQuery from '../container/seller/AskToAdminQuery';
import SellerProfilePage from '../component/seller/SellerProfilePage';
import SellerProfileView from '../component/seller/SellerProfileView';
import SellerList from '../component/seller/SellerList';
import AddEditProduct from '../component/seller/AddEditProduct';
import StartAddProduct from '../component/seller/StartAddProduct';
import NewProductInformationEdit from '../component/seller/NewProductInformationEdit';
import DownloadsList from '../component/DownloadsList';
import TransactionDetail from '../component/seller/TransactionDetail';
import Marketplace from '../component/seller/Marketplace';
import ChatRoom from '../component/ChatRoom';
import ChatListing from '../component/seller/ChatListing';

/** 
* Webkul Software. 
* 
* @category Webkul 
* @package Webkul_Mobikul_React_WooCommerce
* @author Webkul
* @copyright Copyright (c) 2010-2018 WebkulSoftware Private Limited (https://webkul.com) 
* @license https://store.webkul.com/license.html 
* 
*/
export default class CustomerNavigation extends React.Component {
    render (){
        return (
            <StackNavigatorCustomer screenProps = {this.props.navigation}/>
        )
    }
}

export const StackNavigatorCustomer = createStackNavigator (
    {
        CustomerDetail : {
        screen:CustomerAccountPage,
        navigationOptions:({navigation})=>({
            header:null
        })
    },
    Login :{
        screen : LoginPage,
        navigationOptions:({navigation})=>({
           header : null   
        })
    },
    SignUp : {
        screen : SignUp,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    Marketplace : {
        screen : Marketplace,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    SellerProduct : {
        screen : SellerDashboardProduct,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    SellerOrders : {
        screen : SellerOrders,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    SellerTransaction : {
        screen : SellerTransaction,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    TransactionDetail : {
        screen : TransactionDetail,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    SellerProfilePage :{
        screen :SellerProfilePage,
        navigationOptions : ({navigation})=>({
            header: null
        })
    },
    OrderDetails : {
        screen : OrderDetails,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    CustomerOrders : {
        screen : CustomerOrders,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    CustomerOrderDetails : {
        screen : CustomerOrderDetails,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    UpdateAddress : {
        screen : UpdateAddress,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    CustomerProfile : {
        screen : CustomerProfile,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    AskQueryToAdminList : {
        screen : AskQueryToAdminList,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    AskToAdminQuery : {
        screen : AskToAdminQuery,
        navigationOptions : ({navigation})=>({
            header : null  
        })
    },
    SellerProfileView : {
        screen :SellerProfileView,
        navigationOptions : ({navigation})=>({
            header:null
        })
    },
    SellerList : {
        screen : SellerList,
        navigationOptions : ({navigation})=>({
            header:null
        })
    },
    StartAddProduct : {
        screen: StartAddProduct,
        navigationOptions : ({naviagtion})=>({
            header :null
        })
    },
    AddEditProduct :{
        screen : AddEditProduct,
        navigationOptions : ({navigation})=>({
            header:null
        })
    },
    NewProductInformationEdit :{
        screen : NewProductInformationEdit,
        navigationOptions : ({navigation})=>({
            header:null
        })
    },
    DownloadsList :{
        screen : DownloadsList,
        navigationOptions : ({navigation})=>({
            header:null
        })
    },ChatListing: {
        screen : ChatListing,
        navigationOptions : ({navigation})=>({
            header:null
        })
    },
    ChatRoom: {
        screen : ChatRoom,
        navigationOptions : ({navigation})=>({
            header:null
        })}
},{
    initialRouteName : "CustomerDetail"
}
);
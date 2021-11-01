import React from 'react'
import StackNavigator from './NavigationConst';
import CategoryListPage from '../component/CatagoryListPage';
import ProductPage from '../component/ProductPage';
import {createStackNavigator,} from 'react-navigation';
import AppConstant from '../app_constant/AppConstant';
import CategoryProductPage from '../component/CategoryProductPage';

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

export default class CategoryNavigation extends React.Component {    
    render (){
        return (
            <StackNavigatorCategory screenProps = {this.props.navigation}></StackNavigatorCategory>
        )
    }
}

export const StackNavigatorCategory = createStackNavigator (
    {
        CategoryListPage : {
        screen:CategoryListPage,
        navigationOptions:({navigation})=>({
           header:null,         
        })
    },
},{
     headerMode: 'screen' ,
    initialRouteName : "CategoryListPage"
}
);
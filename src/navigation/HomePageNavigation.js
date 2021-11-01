import React from 'react'
import HomePage from '../component/HomePage';
import ProductPage from '../component/ProductPage';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';
import AppConstant from '../app_constant/AppConstant';

export default class HomePageNavigation extends React.Component{
    // componentDidMount() {
    //     this.subs = [
    //     //   this.props.navigation.addListener("didFocus", () => this.isFocused())
    //       // this.props.navigation.addListener("willFocus", () => this.isFocused2())
    //     ];
    //     console.log("Home isFocused after");
    //   }
    //   isFocused() {          
    //       this.props.navigation.navigate("HomePage"); // not applying
    //   }

    render() {
        // console.log("HomePageNavigation", this.props);
      return (
        <StackNavigatorHome screenProps = {this.props.navigation}/>
      )
    };
}

const StackNavigatorHome = createStackNavigator (
    {
    HomePage : {
        screen:HomePage,
        navigationOptions:({navigation})=>({
            header :null
        })
    },
},{
    headerMode: 'screen' ,
    initialRouteName : "HomePage"
}
);
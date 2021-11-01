import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import { getRandomNumberFrom1to3 } from '../utility/UtilityConstant';
import HomeProductLayout from './HomeProductLayout';
import { strings, localeObject } from '../localize_constant/I18';
import ViewStyle from '../app_constant/ViewStyle';
import ThemeConstant from '../app_constant/ThemeConstant';
import { localizeStyle } from '../localize_constant/LocalizeViewConstant';
import AppConstant from '../app_constant/AppConstant';

export default class HomePageProducts extends React.Component{
  initialTime = 0;
  randomNumber =[];
    componentDidMount(){
      // console.log('HomePageProducts =>>> ',  "componentDidMount");
    }
   
    shouldComponentUpdate(nextProps, nextState){
      // console.log('HomePageProducts =>>> ',  'shouldComponentUpdate');
      if (nextProps.homeProduct != this.props.homeProduct) {
        console.log('HomePageProducts =>>> ',  this.initialTime);
         this.initialTime += 1;
        return true;
      }
      return false;
    }

    UNSAFE_componentWillReceiveProps(nextProps){
      // console.log('HomePageProducts =>>> ',  'UNSAFE_componentWillReceiveProps');
    }

    componentDidUpdate(previousProps, previosState){
      // console.log('HomePageProducts =>>> ',  "componentDidUpdate");
    }

    calculateHomeProductData = (data, randomNum) => {
        switch (randomNum) {
          case 1:
          case 3:
            return data;
          case 4:
            return data.length > 4 ? data.slice(0, 4) : data;
          default:
            return data.length % 2 == 1 ? data.slice(0, data.length - 1) : data;
        }
      };

      onPressViewAllProduct = (name, title)=>{
          this.props.onPressViewAllProduct(name, title);
      }


    render(){
        const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
        // console.log('HomePageProducts =>>> ',  "render");
        return(
            <FlatList
            data={this.props.homeProduct}
            renderItem={({ item, index }) => {
              let randomNum = 1;
              if(this.initialTime > 2 || this.randomNumber.length <= index){
                randomNum = getRandomNumberFrom1to3();
                this.randomNumber [index] = randomNum; 
              }else{
                randomNum = this.randomNumber[index];
              }
              randomNum =
                item.products.length < 4
                  ? 1
                  : typeof randomNum != "undefined"
                  ? randomNum
                  : index / 3 + 1;
              let data = this.calculateHomeProductData(item.products, randomNum);
              return (
                <View
                  style={{
                    // marginTop: ThemeConstant.MARGIN_LARGE,
                    marginBottom: ThemeConstant.MARGIN_NORMAL,
                    backgroundColor: ThemeConstant.BACKGROUND_COLOR
                  }}
                >
                  <View
                    style={[{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }, globleViewStyle]}
                  >
                    <Text style={styles.headingTextSize}>{item.title}</Text> 
                    {randomNum == 3 || randomNum == 4 ? (
                      <Text
                        onPress={this.onPressViewAllProduct.bind(
                          this,
                          item.name,
                          item.title
                        )}
                        style={styles.viewAll} 
                      >
                        {strings("VIEW_ALL").toUpperCase()}
                      </Text>
                    ) : null}
                  </View>

                  <View>
                    <HomeProductLayout
                      data={data}
                      onPressOut={this.props.onPressProduct}
                      index={index}
                      randomNum={randomNum}
                    />
                    {randomNum != 4 && randomNum != 3 ? (
                      <Text
                        style={[ViewStyle.viewAllStyle]}
                        onPress={this.onPressViewAllProduct.bind(
                          this,
                          item.name,
                          item.title
                        )}
                      >
                        {(
                          strings("VIEW_ALL") +
                          " " +
                          item.title
                        ).toUpperCase()}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            }}
            keyExtractor={(item, index) => index + ""}
          />
        )
    }
}

const styles = StyleSheet.create({
  headingTextSize: {
    paddingHorizontal: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    fontWeight: "bold",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR
  },
  viewAll: {
    padding: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_NORMAL,
    paddingLeft: ThemeConstant.MARGIN_NORMAL,
    marginTop: ThemeConstant.MARGIN_LARGE,
    marginBottom: ThemeConstant.MARGIN_NORMAL,
    marginHorizontal: ThemeConstant.MARGIN_GENERIC,
    fontWeight: "100",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR_2
  }
})
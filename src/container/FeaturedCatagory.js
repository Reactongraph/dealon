import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import { localeObject } from '../localize_constant/I18';
import ThemeConstant from '../app_constant/ThemeConstant';
import CardView from 'react-native-cardview';
import CustomImage from './CustomImage';

export default class FeaturedCatagory extends React.Component{

    shouldComponentUpdate(nextProps, nextState){
        // console.log('HomePageProducts =>>> ',  'shouldComponentUpdate');
        if (nextProps.featuredCategory != this.props.featuredCategory) {
          return true;
        }
        return false;
      }

      onPressFeatureCategory = (item)=>{
        this.props.onPressFeatureCategory(item);
      }

    render(){
        return(
            <FlatList
            data={this.props.featuredCategory}
            inverted ={localeObject.isRTL}
            contentContainerStyle={{
              paddingTop: ThemeConstant.MARGIN_GENERIC,
              paddingBottom: ThemeConstant.MARGIN_GENERIC,
              backgroundColor: ThemeConstant.BACKGROUND_COLOR
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <CardView
                  cardElevation={6}
                  cardMaxElevation={8}
                  cornerRadius={2}
                  style={{
                    width: ThemeConstant.FEATURED_CATEGORY_SIZE,
                    margin: ThemeConstant.MARGIN_GENERIC,
                    backgroundColor: ThemeConstant.BACKGROUND_COLOR
                  }}
                  // onPress={this.onPressFeatureCategory.bind(this, item)}
                >
                  <CustomImage
                    image={item.image}
                    dominantColor={item.dominantColor}
                    imagestyle={{
                      width: ThemeConstant.FEATURED_CATEGORY_SIZE,
                      height: ThemeConstant.FEATURED_CATEGORY_SIZE
                    }}
                    onPress={this.onPressFeatureCategory.bind(this, item)}
                  />
                  <View
                    style={{
                      width: ThemeConstant.FEATURED_CATEGORY_SIZE,
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      padding: ThemeConstant.MARGIN_GENERIC
                    }}
                  >
                    <Text
                      style={{
                        fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
                        color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
                        fontWeight: "600",
                        textAlign: "center",
                        textAlignVertical: "center"
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                  </View>
                </CardView>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        )
    }
}
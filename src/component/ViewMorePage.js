import React from "react";
import { View, Text, TouchableOpacity,StyleSheet, BackHandler} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import CustomActionbar from "../container/CustomActionbar";
import { FlatList, ScrollView } from "react-native";
import CustomIcon2 from "../container/CustomIcon2";
import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import Loading from "../container/LoadingComponent";
import ThemeConstant from "../app_constant/ThemeConstant";
import { ListItem, Left, Body, Right } from "native-base";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";

export default class ViewMorePage extends React.Component {
  isInComponent = false;
  state ={
      isLoading : true,
      externalLinks : []
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this.isInComponent = false;
    BackHandler.removeEventListener("hardwareBackPress", this._handleBackPress);
  }
  _handleBackPress = ()=>{
    return false;
  }

  isFocused = () => {
    AsyncStorage.getItem(AppConstant.PREF_CART_COUNT).then(cartCount => {
      this.setState({
        cartCount: cartCount ? cartCount : "0"
      });
    });
    BackHandler.addEventListener("hardwareBackPress", this._handleBackPress);
    this.getExternalLinks();
  }
  
  componentDidMount() {      
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused())
    ];
  }
  
  getExternalLinks(){
      let url = AppConstant.BASE_URL + "external-links"
      fetchDataFromAPI(url, "GET", "", null).then(response=>{
          if(response.success){
              this.setState({
                  externalLinks : response.data,
                  isLoading:false
              })
          }else{
            this.setState({
              isLoading:false
            })
          }
      })
  }

  _onBackPress = () => {
        this.props.navigation.navigate("HomePageNavigation");
  };
  _onPressCart = () => {
      this.props.navigation.navigate("CartPage");
  };
  onPressLinks(links){
    this.props.navigation.navigate("ExternalLinks", {
          url : links.link,
          title:links.title
      })
  }
  _onPressSellerList = () => {
    this.props.navigation.navigate("SellerList");
  };

  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View style={{ flex: 1, backgroundColor:ThemeConstant.BACKGROUND_COLOR }}>
        <CustomActionbar
          _onBackPress={this._onBackPress.bind(this)}
          backwordTitle={strings("HOME_TITLE")}
          title={strings("MORE_TITLE")}
          navigation={ this.props.navigation}
          iconName={"cart"}
          cartCount={this.state.cartCount}
          _onForwordPress={this._onPressCart.bind(this)}
        />
         {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView>
             {AppConstant.IS_MARKETPLACE ? (
                    <ListItem
                      noIndent
                      noBorder
                      style={[styles.eachItemstyle, globleViewStyle]}
                      onPress={this._onPressSellerList.bind(this)}
                    >
                      <CustomIcon2
                        name="baseline-group"
                        size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                        color={ThemeConstant.DEFAULT_ICON_COLOR}
                      />
                      <Text style={styles.eachItemTextStyle}>
                        {strings("SELLER_LIST_TITLE")}
                      </Text>
                      <Left />
                      <Body />
                      <Right>
                        <CustomIcon2
                          name={localeObject.isRTL ? "arrow-left" : "arrow-right"}
                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                        />
                      </Right>
                    </ListItem>
                  ) : null}
            <View>
            <Text style={[styles.headingTitle, globalTextStyle]} >{strings("EXTERNAL_LINKS")}</Text>
              <FlatList
              data={this.state.externalLinks}
              keyExtractor={(item, index) => index +""}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.eachLinkItem, globleViewStyle]}
                  activeOpacity={0.6}
                  onPress={this.onPressLinks.bind(this, item)}
                >
                  <View style={[{ flexDirection: "row", alignItems: "center" }, globleViewStyle]}>
                    <Text
                      style={{
                        paddingLeft: ThemeConstant.MARGIN_NORMAL,
                        textAlignVertical: "center",
                        color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
                        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                        fontWeight: "400"
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <CustomIcon2
                    name={localeObject.isRTL ? "arrow-left" : "arrow-right"}
                    size={ThemeConstant.DEFAULT_ICON_SIZE}
                  />
                </TouchableOpacity>
              )}
            />
              </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles =StyleSheet.create({
    headingTitle: {
        color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        fontWeight: "bold",
        padding: ThemeConstant.MARGIN_NORMAL,
        borderBottomWidth: 0.5,
        borderColor: ThemeConstant.LINE_COLOR_2
      },
      eachLinkItem:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: ThemeConstant.MARGIN_NORMAL,
        borderBottomColor: ThemeConstant.LINE_COLOR,
        borderBottomWidth: 1
      },
      eachItemstyle: {
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderColor: ThemeConstant.LINE_COLOR_2,
        padding: ThemeConstant.MARGIN_NORMAL
      },
      eachItemTextStyle: {
        alignSelf: "center",
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        fontWeight: "bold",
        paddingHorizontal: ThemeConstant.MARGIN_GENERIC,
        color: ThemeConstant.DEFAULT_TEXT_COLOR
      }
})
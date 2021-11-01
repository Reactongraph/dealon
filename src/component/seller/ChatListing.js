import React from "react";
import { Alert, View, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import { fetchDataFromAPI } from "../../utility/APIConnection";
import { ScrollView, FlatList } from "react-native";
import CustomActionbar from "../../container/CustomActionbar";
import EmptyLayoutComponent from "../../container/EmptyLayoutComponent";
import Loading from "../../container/LoadingComponent";
import ProgressDialog from "../../container/ProgressDialog";
import { showErrorToast, showSuccessToast } from "../../utility/Helper";
import { strings, localeObject } from "../../localize_constant/I18";
import { localizeStyle } from "../../localize_constant/LocalizeViewConstant";
import { Text } from "native-base";
import FastImage from "react-native-fast-image";

export default class ChatListing extends React.Component {
  page = 1;
  userId = 0;
  buyersList = [];
  isInComponent = false;
  screenProps = {};
  state = {
    products: [],
    buyersList: [],
    isLoading: true,
    isProgress: false,
  };
  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
    this.isInComponent = false;
  }

  componentDidMount() {
    let { navigation, screenProps } = this.props;
    this.isInComponent = true;
    this.screenProps = screenProps;
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused())
    ];
  }
  isFocused() {
    this.page = 1;
    if (this.props.navigation.getParam("isUpdate", false)) {
      this.setState({ isLoading: true });
      this.props.navigation.setParams({ isUpdate: false });
    }
    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
      this.userId = userID;
      if (userID) {
        let url =
          AppConstant.BASE_URL +
          "seller/chat/list?seller_id=" +
          userID;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (this.isInComponent) {
            if (response) {
              this.buyersList = response.buyer;
              this.setState({
                buyersList: response.buyer ? response.buyer : [],
                isLoading: false
              });
            } else {
              this.setState({
                isLoading: false
              });
            }
          }
        });
      }
    });
  }

  fetchResult = () => {
    if (this.total > this.state.products.length) {
      this.page = this.page + 1;
      AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
        let url =
          AppConstant.BASE_URL +
          "seller/auction/list?seller_id=" +
          userId +
          "&page=" +
          this.page;
        fetchDataFromAPI(url, "GET", "", null).then(response => {
          if (this.isInComponent) {
            if (response) {
              this.setState({
                buyersList: response.buyer ? response.buyer : [],
                isLoading: false
              });
            }
          }
        });
      })
    };
  }

  onPressAddNewAuction = () => {
    this.props.navigation.navigate("ProductAuction", {
      sellerId: this.userId,
      isEdit: false
    });
  };
  _onBackPress = () => {
    this.props.navigation.pop();
  };
  _onPressViewProduct = product => {
    if (this.screenProps && product.status.toLowerCase() == "publish".toLowerCase()) {
      this.screenProps.navigate("ProductPage", {
        productId: product.id,
        productName: product.title,
        productImage: product.image,
      });
    }
  };
  _onPressDeleteProduct = (product) => {
    Alert.alert(
      strings("WARNING"),
      strings("DELETE_SELLER_PRODUCT_WARNING"),
      [{ text: strings("CANCEL"), style: "cancel" },
      {
        text: strings("YES"), style: "cancel", onPress: () => {

          this.setState({
            isProgress: true
          })
          let url = AppConstant.BASE_URL + "seller/product/delete/?seller_id=" + this.userId;
          let body = JSON.stringify({
            product_id: product.id
          })
          fetchDataFromAPI(url, "POST", body, null).then(response => {
            this.setState({
              isProgress: false
            })
            if (response && response.success) {
              showSuccessToast(response.message);
              this.setState({ isLoading: true });
              this.isFocused();
            } else {
              showErrorToast(response.message);
            }
          })
        }
      }]
    )
  }
  _onChatOpen = (data) => {

    AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userId => {
      console.log("anand_chatroom ==>" + JSON.stringify(data));
      this.props.navigation.navigate('ChatRoom', { userID: userId, sellerId: data.customerId, title: data.name });
    });
  }

  _onPressEditAuction = product => {
    this.props.navigation.navigate("ProductAuction", { sellerId: this.userId, auctionProductId: product.auction_product_id, isEdit: true });
  };
  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          title={strings("CHAT")}
          backwordTitle={strings("ACCOUNT_TITLE")}
          _onBackPress={this._onBackPress.bind(this)}
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
            <ScrollView>
              <FlatList
                style={{ alignSelf: "stretch" }}
                data={this.state.buyersList}
                renderItem={({ item, index }) => {
                  return (<TouchableOpacity onPress={this._onChatOpen.bind(this, item)}>
                    <View style={{
                      flex: 1, flexDirection: 'row', borderBottomWidth: 0.5,
                      borderColor: ThemeConstant.LINE_COLOR_2, padding: 20
                    }}>
                      <FastImage
                        source={{ uri: item.src }}
                        style={{ backgroundColor: 'white', borderRadius: 5,height:50,width:50,marginEnd: 12}}
                        resizeMode={"cover"}
                      />
                      <View>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, marginTop: 5 }}>{item.email}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index + ''}
                ListEmptyComponent={
                  <EmptyLayoutComponent
                    message={strings("EMPTY_CHAT_LIST")}
                  />
                }
              />
            </ScrollView>
          )}
        <ProgressDialog visible={this.state.isProgress}></ProgressDialog>
      </View>
    );
  }
}

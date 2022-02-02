import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import { Container, Header, Item, Input, Icon } from "native-base";
import _ from "lodash";
import ThemeConstant from "../app_constant/ThemeConstant";
import { FlatList } from "react-native";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { SCREEN_WIDTH } from "./CategoryProductPage";
import AppConstant from "../app_constant/AppConstant";
import { isStringEmpty } from "../utility/UtilityConstant";
import { showErrorToast } from "../utility/Helper";
import CustomIcon2 from "../container/CustomIcon2";
import OpenMLCamera from "../container/ml/OpenMLCamera";
import { strings } from "../localize_constant/I18";
// import CameraScreen from "../container/ml/CameraScreen";
// import Voice from 'react-native-voice';

export default class SearchProductPage extends React.Component {
  page = 1;
  searchText = "";
  total = 10;
  IS_API_CALL_ENABLE = false;
  VIEW_IN_COMPONENT = true;
  state = {
    recognized: "",
    started: "",
    searchText: "",
    searchItems: [],
    isRecord: false,
    isOpenCamera: false,
    message: strings("SEARCH_START_EMPTY_TEXT"),
  };

  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
    // Voice.destroy().then(Voice.removeAllListeners);
    this.VIEW_IN_COMPONENT = false;
  }

  // shouldComponentUpdate(newProps, newState){
  //   return false;
  // }

  async componentDidMount() {
    this.VIEW_IN_COMPONENT = true;
    this.subs = [
      this.props.navigation.addListener("willFocus", () => this.isFocused()),
    ];
  }
  isFocused() {
    this.VIEW_IN_COMPONENT = true;
  }

  onOpenCamera = () => {
    this.setState({
      isOpenCamera: true,
    });
  };

  onResponseCamera = (response) => {
    this.setState({
      isOpenCamera: false,
    });
    if (response) {
      this.searchText = response;
      this._onPressSearchALL();
    }
  };

  searchFilterFunction = (text) => {
    this.setState({
      searchText: text,
    });
    if (this.searchText != text) {
      this.callAPI(text);
    }
  };

  callAPI = _.debounce((text) => {
    this.searchText = text;
    this.page = 1;
    let url =
      AppConstant.BASE_URL +
      "products/search/suggestions/" +
      "?width=" +
      SCREEN_WIDTH +
      "&page=" +
      this.page +
      "&s=" +
      text.replace(/ /g, "%20");

    fetchDataFromAPI(url, "GET", "", null).then((response) => {
      this.IS_API_CALL_ENABLE = false;
      if (response.success == 1) {
        this.setState({
          searchItems: response.products,
        });
        this.total = response.total;
      } else {
        this.setState({
          searchItems: [],
          message: isStringEmpty(this.searchText)
            ? strings("SEARCH_START_EMPTY_TEXT")
            : response.message,
        });
      }
    });
  }, 500);

  _onEndReached = () => {
    if (
      this.total > this.state.searchItems.length &&
      !this.IS_API_CALL_ENABLE &&
      this.VIEW_IN_COMPONENT
    ) {
      this.IS_API_CALL_ENABLE = true;
      this.page = this.page + 1;
      let url =
        AppConstant.BASE_URL +
        "products/search/suggestions/" +
        "?width=" +
        SCREEN_WIDTH +
        "&page=" +
        this.page +
        "&s=" +
        this.searchText.replace(/ /g, "%20");
      fetchDataFromAPI(url, "GET", "", null).then((response) => {
        this.IS_API_CALL_ENABLE = false;
        if (response.success == 1) {
          this.setState({
            searchItems: this.state.searchItems.concat(response.products),
          });
        }
      });
    }
  };
  _onPressSearchItem = (item) => {
    this.props.navigation.navigate("ProductPage", {
      productId: item.id,
      productName: item.title,
      // productImage : item.banner_image
    });
  };
  //  _onPressSearchALL = () => {
  //    if (!isStringEmpty(this.searchText)) {
  //      this.props.navigation.navigate(
  //        "CategoryProductPage",
  //        {
  //          searchKey: this.searchText,
  //          CATAGORY_PAGE: AppConstant.IS_SEARCH,
  //          search_refresh: false,
  //        }
  //      );
  //    } else {
  //      showErrorToast(
  //        strings("SEARCH_EMPTY_TEXT_ERROR")
  //      );
  //    }
  //  };

  _onPressSearchALL = () => {
    if (!isStringEmpty(this.searchText)) {
      this.props.navigation.navigate("ProductPage", {
        productId: this.state.searchItems[0]?.id,
        productName: this.state.searchItems[0]?.title,
      });
      this.setState({
        searchItems: [],
      });
    } else {
      showErrorToast(strings("SEARCH_EMPTY_TEXT_ERROR"));
    }
  };

  onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
  	console.log("dgfdgdfg>>>>>",this.state.searchItems)
    return (
      <View style={{ paddingTop: -22 }} keyboardShouldPersistTaps="always">
        <Header
          searchBar
          rounded
          style={{
            backgroundColor: ThemeConstant.PRIMARY_COLOR,
            alignSelf: "stretch",
            padding: 0.00001,
          }}
          androidStatusBarColor={ThemeConstant.DARK_PRIMARY_COLOR}
          keyboardShouldPersistTaps="always"
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "stretch",
            }}
            onPress={this.onBackPress}
          >
            <CustomIcon2
              name="back"
              size={28}
              color={ThemeConstant.ACTION_BAR_ICON_COLOR}
            />
          </TouchableOpacity>
          <Item>
            <Input
              value={this.state.searchText}
              placeholder={strings("SEARCH_PLACEHOLDER_TEXT")}
              // onChangeText={_.debounce(this.searchFilterFunction, 800)}
              onChangeText={this.searchFilterFunction.bind(this)}
              style={{
                fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                fontWeight: "normal",
                color: ThemeConstant.HEADING_TEXT_TITLE_COLOR,
              }}
              returnKeyType="search"
              onSubmitEditing={this._onPressSearchALL.bind(this)}
            />
          </Item>
        </Header>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={this.state.searchItems.splice(0,3)}
          renderItem={(item) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flexDirection: "row",
                  padding: ThemeConstant.MARGIN_GENERIC,
                  borderBottomColor: ThemeConstant.LINE_COLOR,
                  borderBottomWidth: 1,
                  alignItems: "center",
                }}
                onPress={this._onPressSearchItem.bind(this, item.item)}
              >
                <Icon
                  name="ios-search"
                  size={ThemeConstant.DEFAULT_ICON_SMALL_SIZE}
                />
                <Text
                  style={{
                    marginLeft: ThemeConstant.MARGIN_NORMAL,
                    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
                    fontWeight: "normal",
                  }}
                  onPress={this._onPressSearchItem.bind(this, item.item)}
                >
                  {item.item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyStyle}>{this.state.message} </Text>
          }
          keyExtractor={(item) => {
            return item.id + "";
          }}
          onEndReached={this._onEndReached.bind(this)}
          onEndReachedThreshold={0.8}
        />
        <OpenMLCamera
          visible={this.state.isOpenCamera}
          onBackResponse={this.onResponseCamera.bind(this)}
        />
        {/* {this.state.isOpenCamera && <CameraScreen/>} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyStyle: {
    flex: 1,
    alignSelf: "center",
    textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
    marginBottom: ThemeConstant.MARGIN_GENERIC,
    marginTop: ThemeConstant.MARGIN_NORMAL,
  },
  buttonStyle: {
    color: ThemeConstant.ACCENT_COLOR,
    textAlign: "center",
    fontWeight: "bold",
    padding: ThemeConstant.MARGIN_GENERIC,
    alignSelf: "center",
  },
});

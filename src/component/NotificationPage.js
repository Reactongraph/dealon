import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import CustomActionbar from "../container/CustomActionbar";
import { ScrollView, FlatList } from "react-native";
import Loading from "../container/LoadingComponent";
import EmptyLayoutComponent from "../container/EmptyLayoutComponent";
import { CustomImage } from "../container/CustomImage";
import { SCREEN_WIDTH, getNotificationRoot } from "../utility/UtilityConstant";
import AppConstant from "../app_constant/AppConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
import { showErrorToast } from "../utility/Helper";
import EmptyIconConstant from "../app_constant/EmptyIconConstant";
import CardView from "react-native-cardview";
import { strings } from "../localize_constant/I18";

export default class NotificationPage extends React.Component {
  viewInComponent = false;
  state = {
    notifications: [],
    isLoading: true
  };
  componentWillUnmount() {
    this.viewInComponent = false;
  }
  componentDidMount() {
    this.viewInComponent = true;

    let url = AppConstant.BASE_URL + "notifications" + "?width=" + SCREEN_WIDTH;
    let dbId = 1;

    fetchDataFromAPI(url, "GET", "", null, dbId).then(response => {
      if (this.viewInComponent) {
        this.setState({
          loading: false
        });
        if (response.success) {
          this.setState({
            isLoading: false,
            notifications: response.data
          });
        } else {
          showErrorToast(response.message);
        }
      }
    });
  }

  _OnPressOut = (notification) => {
      notification.id_page = notification.term_id;
      let routeData = getNotificationRoot(notification);
      this.props.navigation.navigate(routeData.root, routeData.data);
  };

  onBackPress = () => {
    this.props.navigation.pop();
  };

  render() {
    return (
      <View
        style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
      >
        <CustomActionbar
          title={strings("NOTIFICATION")}
          backwordTitle={strings("BACK")}
          _onBackPress={this.onBackPress}
          backwordImage="close-cross"
        />
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <ScrollView>
            <FlatList
              data={this.state.notifications}
              renderItem={({ item, index }) => {
                return (
                  <CardView
                    cardElevation={3}
                    cardMaxElevation={4}
                    cornerRadius={2}
                    style={styles.product_container}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={this._OnPressOut.bind(this, item)}
                    >
                      <View style={styles.productInfoTheme}>
                        <Text
                          style={styles.firstTextTheme}
                          ellipsizeMode="tail"
                          numberOfLines={2}
                        >
                          {item.title}
                        </Text>

                        <Text style={styles.secondaryTextTheme}>
                          {item.content}
                        </Text>
                      </View>
                      <CustomImage
                        image={item.image}
                        imagestyle={styles.imagestyle}
                        onPress={this._OnPressOut.bind(this,item)}
                        dominantColor={item.dominantColor}
                      />
                    </TouchableOpacity>
                  </CardView>
                );
              }}
              keyExtractor={(item, index) => index + ""}
              ListEmptyComponent={
                <EmptyLayoutComponent
                  message={strings("NO_NOTIFICATION")}
                  iconName={EmptyIconConstant.emptyCategory}
                />
              }
            />
          </ScrollView>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  product_container: {
    flexWrap: "wrap",
    flexDirection: "column",
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    margin: ThemeConstant.MARGIN_GENERIC,
    marginLeft: ThemeConstant.MARGIN_GENERIC * 1.7,
    marginRight: ThemeConstant.MARGIN_GENERIC * 1.7
  },
  imagestyle: {
    alignSelf: "center",
    width: SCREEN_WIDTH - ThemeConstant.MARGIN_GENERIC * 3.5,
    height: SCREEN_WIDTH / 1.8
  },
  productInfoTheme: {
    flex: 1,
    alignItems: "stretch",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    padding: ThemeConstant.MARGIN_GENERIC,
    width: SCREEN_WIDTH - ThemeConstant.MARGIN_GENERIC * 3.5
  },
  firstTextTheme: {
    textAlign: "left",
    fontWeight: '500',
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    marginTop: ThemeConstant.MARGIN_GENERIC
  },
  secondaryTextTheme: {
    textAlign: "left",
    marginTop: ThemeConstant.MARGIN_GENERIC,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  regularPriceTextTheme: {
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_TINNY_TEXT_SIZE,
    marginLeft: ThemeConstant.MARGIN_TINNY
  }
});

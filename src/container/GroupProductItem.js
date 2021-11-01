import React from "react";
import { View, Text, StyleSheet, Dimensions,TouchableOpacity } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import { Picker } from "native-base";
import QuantityDialog from "./QuantityDialog";
import EditQuantityDialog from "./EditQuantityDialog";
import { CustomImage } from "./CustomImage";
import { Button } from "react-native-elements";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";
import CustomIcon2 from "./CustomIcon2";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class GroupProductItem extends React.PureComponent {
  defaultQuantitySize = 20;
  state = {
    quantityList: [],
    quantity: 0,
    product: {},
    isQuantityDialogVisible: false,
    isEditQuantityDialogVisible: false,
  };
  componentDidMount() {
    let product = this.props.productData;
    let quantity = [];
    let quantitySize =
      product.quantity > this.defaultQuantitySize
        ? product.quantity
        : this.defaultQuantitySize;
        let i;
    for (i = 0; i <= quantitySize; i++) {
      quantity.push(i);
    }
    if (product.image === false) {
      product.image = "";
    }
    this.setState({
      quantityList: quantity,
      quantity: 0,
      product: product
    });
  }

  componentWillUpdate(nextProps) {
    if (this.props.productData.quantity != nextProps.productData.quantity) {
      console.log(nextProps);

      this.setState({
        quantity: nextProps.productData.quantity,
        product: nextProps.productData
      });
    }
  }
  _onPressViewProduct = () => {
    this.props.onPressViewProduct(this.props.productData);
  };

  // _selectQuantity = qty => {
  //   this.setState({
  //     quantity: qty
  //   });
  //   this.props.updateQuantity(this.props.productData, qty);
  // };
   // Quantity Dialog Methods /////////

   onPressQuantity = () => {
    if(this.state.quantity > 4){
      this.setState({
        isEditQuantityDialogVisible: true
      });
    }else{
      this.setState({
        isQuantityDialogVisible: true
      });
    }
  };
  cancelQuantityDialog = () => {
    this.setState({
      isQuantityDialogVisible: false
    });
  };
  responseQuantityDialog = qty => {
    this.setState({
      quantity: qty,
      isQuantityDialogVisible: false,
      isEditQuantityDialogVisible : false
    });
    this.props.updateQuantity(this.props.productData, qty);
  };
  viewMoreQuantityDialog = () => {
    this.setState({
      isQuantityDialogVisible: false,
      isEditQuantityDialogVisible : true
    });
  };

  cancelEditQuantityDialog = ()=>{
    this.setState({
      isEditQuantityDialogVisible : false
    })
  }


  render() {
    const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
    const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
    return (
      <View>
        <View
          touchableHighlightStyle={{
            backfaceVisibility: "hidden"
          }}
          style={[styles.product_container, globleViewStyle]}
        >
          <View>
            <CustomImage
              image={this.state.product.image}
              imagestyle={styles.imagestyle}
              onPress={this._onPressViewProduct.bind(this)}
              dominantColor = {this.state.product.dominantColor}
            />
          </View>
          <View style={[styles.productInfoTheme]}>
            <Text style={[styles.firstTextTheme, globalTextStyle]} numberOfLines={2} ellipsizeMode="tail" >
              {this.state.product.name}
            </Text>

            <Text style={[styles.secondaryTextTheme, globalTextStyle]} numberOfLines={1}>
              {this.state.product.price}
            </Text>
            
            <Text style={[styles.regularPriceStyle, globalTextStyle]} numberOfLines={1}>
              {this.state.product.regular_price}
            </Text>

            {this.state.product.product_type == "simple" ? (
              <View
                style={[{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }, globleViewStyle]}
              >
                <Text
                  style={{
                    marginTop: -4,
                    fontWeight: "bold",
                    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE
                  }}
                  onPress ={this.onPressQuantity.bind(this)}
                >
                  {strings("QTY")}
                </Text>
                <Text>{strings("COLLON")}</Text>
              <TouchableOpacity
                activeOpacity ={1}
                onPress={this.onPressQuantity.bind(this)}
                style={{
                  alignSelf: "stretch",
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: ThemeConstant.MARGIN_GENERIC
                }}
              >
                <Text
                  onPress={this.onPressQuantity.bind(this)}
                  style={{
                    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
                    fontWeight: "bold",
                    color: ThemeConstant.DEFAULT_TEXT_COLOR,
                    marginRight: ThemeConstant.MARGIN_TINNY
                  }}
                >
                  {this.state.quantity}
                </Text>
                <CustomIcon2
                  name={"dropdown"}
                  size={ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM}
                  color={ThemeConstant.DEFAULT_SECOND_ICON_COLOR}
                />
              </TouchableOpacity>


                {/* <Picker
                  inlineLabel={true}
                  mode="dropdown"
                  placeholder={strings("QTY")}
                  selectedValue={this.state.quantity}
                  onValueChange={this._selectQuantity.bind(this)}
                  style={styles.pickerStyle}
                  itemTextStyle={{
                    alignSelf: "center",
                    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE
                  }}
                  itemStyle={{ height: 100 }}
                >
                  {this.state.quantityList.map((quantity, i) => {
                    return (
                      <Picker.Item
                        key={i}
                        value={quantity}
                        label={quantity + ""}
                      />
                    );
                  })}
                </Picker> */}
                <QuantityDialog
          visible={this.state.isQuantityDialogVisible}
          cancel={this.cancelQuantityDialog.bind(this)}
          response={this.responseQuantityDialog.bind(this)}
          viewMore={this.viewMoreQuantityDialog.bind(this)}
          name = {this.state.product.name}
        />
        <EditQuantityDialog
         visible={this.state.isEditQuantityDialogVisible}
         cancel={this.cancelEditQuantityDialog.bind(this)}
         response={this.responseQuantityDialog.bind(this)}
         name = {this.state.product.name}
         quantity = {this.state.quantity}
        />
              </View>
            ) : (
              <Button
                title={strings("VIEW_PRODUCT")}
                titleStyle={styles.buttonTextStyle}
                buttonStyle={styles.buttonStyle}
                onPress={this._onPressViewProduct.bind(this)}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor : ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: ThemeConstant.LINE_COLOR,
    borderTopColor: ThemeConstant.LINE_COLOR,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_GENERIC,
    paddingLeft: ThemeConstant.MARGIN_TINNY,
    paddingRight: ThemeConstant.MARGIN_GENERIC
  },
  regularPriceStyle: {
    alignSelf: "stretch",
    textDecorationLine: "line-through",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 4,
    height: SCREEN_WIDTH / 4
  },
  productInfoTheme: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    justifyContent: "flex-start",
    paddingHorizontal: ThemeConstant.MARGIN_GENERIC,
    width: SCREEN_WIDTH -(SCREEN_WIDTH / 4) - 30,
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE
  },
  secondaryTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  pickerStyle: {
    marginTop: 0,
    paddingTop: 5,
    paddingBottom: 5,
    width: 80
  },
  buttonStyle: {
    width: 120,
    alignSelf: "flex-end",
    backgroundColor: ThemeConstant.ACCENT_COLOR,
    marginTop: ThemeConstant.MARGIN_TINNY
  },
  buttonTextStyle: {
    color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
    borderRadius: ThemeConstant.MARGIN_TINNY
  }
});

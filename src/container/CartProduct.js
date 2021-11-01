import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity
} from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";

import { Button } from "react-native-elements";
import CustomIcon2 from "./CustomIcon2";
import { FlatList } from "react-native";
import { CustomImage } from "./CustomImage";
import QuantityDialog from "./QuantityDialog";
import EditQuantityDialog from "./EditQuantityDialog";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { localeObject, strings } from "../localize_constant/I18";
import { showWarnToast } from "../utility/Helper";

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);
export default class CartProduct extends React.Component {
  defaultQuantitySize = 20;
  state = {
    quantityList: [],
    quantity: 1,
    product: {},
    subtotal: 0,
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
    for (i = 1; i <= quantitySize; i++) {
      quantity.push(i);
    }
    if (product.image === false) {
      product.image = "";
    }
    product.quantity =
      typeof product.quantity == "string"
        ? parseInt(product.quantity)
        : product.quantity;
    this.setState({
      quantityList: quantity,
      quantity: product.quantity,
      subtotal: product.line_subtotal,
      product: product
    });
  }

  componentWillUpdate(nextProps) {
    if (this.props.productData != nextProps.productData) {
      let product = nextProps.productData;
      product.quantity =
        typeof product.quantity == "string"
          ? parseInt(product.quantity)
          : product.quantity;
      let quantity = [];
      let quantitySize =
        product.quantity > this.defaultQuantitySize
          ? product.quantity
          : this.defaultQuantitySize;
          let i;

      for (i = 1; i <= quantitySize; i++) {
        quantity.push(i);
      }

      this.setState({
        quantityList: quantity,
        quantity: nextProps.productData.quantity,
        product: nextProps.productData,
        subtotal: nextProps.productData.line_subtotal
      });
    }
  }
  _onPressViewProduct = () => {
    this.props.onPressViewProduct(this.props.productData);
  };
  _selectQuantity = qty => {
    this.setState({
      quantity: qty
    });
    this.props.updateQuantity(this.props.productData, qty);
  };

  _onPressDeleteItem = product => {
    Alert.alert(
      strings("WARNING"),
      strings("DELETE_CART_ITEM_WARNING"),
      [ {text:strings("CANCEL"), style: "cancel"},
        {text:strings("YES"),  style: "cancel", onPress:()=>{
        this.props.deleteProduct(this.props.productData);
      }}]
    )    
  };

  // Quantity Dialog Methods /////////

  onPressQuantity = () => {
    if(!this.props.productData.sold_individually){
    if(this.state.quantity > 4){
      this.setState({
        isEditQuantityDialogVisible: true
      });
    }else{
      this.setState({
        isQuantityDialogVisible: true
      });
    }
  }else{
    showWarnToast(strings("YOU_CAN_NOT_ADD_INDIVIDUAL_PRODUCT_CART", {product:this.props.productData.name}))
  }
  }
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
      <View style={{ marginBottom: ThemeConstant.MARGIN_NORMAL }}>
        <View style={[styles.product_container, globleViewStyle]}>
          <View>
            <CustomImage
              image={this.state.product.image}
              imagestyle={styles.imagestyle}
              onPress={this._onPressViewProduct.bind(this)}
              dominantColor={this.state.product.dominantColor}
            />
            <View
              style={[{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: ThemeConstant.MARGIN_TINNY
              }, globleViewStyle]}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
                  color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
                }}
                onPress={this.onPressQuantity.bind(this)}
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

            </View>
          </View>
          <View style={[styles.productInfoTheme, {alignItems:localeObject.isRTL ? "flex-end" : "flex-start"}]}>
            <Text
              style={[styles.firstTextTheme, globalTextStyle]}
              lineBreakMode={true}
              ellipsizeMode="tail"
              allowFontScaling={false}
              numberOfLines={2}
            >
              {this.state.product.name}
            </Text>

            <FlatList
              data={this.state.product.variation}
              renderItem={({ item }) => {
                return (
                  <View style={[styles.variationContainer, globleViewStyle]}>
                    <Text style={styles.variationTitleStyle}>{item.title}</Text>
                <Text>{strings("COLLON")}</Text>
                    <Text style={styles.variationValueStyle}>
                      {item.option}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={item => item.name}
            />

            <Text
              style={[styles.secondaryTextTheme, globalTextStyle]}
              numberOfLines={1}
              allowFontScaling={false}
            >
              {this.state.product.unit_price}
            </Text>
            <View style={globleViewStyle}>

            <Text style={[styles.secondaryTextTheme, styles.headingStyle, globalTextStyle]}>
                {strings("SUBTOTAL")} 
              </Text>
                <Text>{strings("COLLON")}</Text>
            <Text
              style={[styles.secondaryTextTheme, globalTextStyle]}
              numberOfLines={1}
              allowFontScaling={false}
            >
              {this.state.subtotal}
            </Text>  
            </View>         
          </View>
        </View>
        <View style={[styles.buttonContanerStyle, globleViewStyle]}>
          <Button
            clear
            title={strings("REMOVE_ITEM")}
            icon={
              <CustomIcon2
                name="delete"
                size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                color={ThemeConstant.DEFAULT_SECOND_ICON_COLOR}
              />
            }
            titleStyle={{
              color: ThemeConstant.DEFAULT_TEXT_COLOR,
              fontWeight: "400",
              fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
              marginLeft:ThemeConstant.MARGIN_TINNY
            }}
            buttonStyle={{flex: 1, backgroundColor:ThemeConstant.BACKGROUND_COLOR }}
            onPress={this._onPressDeleteItem.bind(this)}
          />
        </View>
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
    );
  }
}

const styles = StyleSheet.create({
  product_container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 0.5,
    borderBottomColor: ThemeConstant.LINE_COLOR_2,
    borderTopColor: ThemeConstant.LINE_COLOR,
    paddingTop: ThemeConstant.MARGIN_TINNY,
    paddingBottom: ThemeConstant.MARGIN_GENERIC,
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_GENERIC
  },
  variationContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // borderColor: ThemeConstant.LINE_COLOR,
    // borderWidth: 0.5,
    width: "100%"
  },
  variationTitleStyle: {
    // backgroundColor: ThemeConstant.INPUT_TEXT_BACKGROUND_COLOR,
    // textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    // padding: ThemeConstant.MARGIN_TINNY,
    color : ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontWeight : "bold" ,
    // width: "40%"
  },
  variationValueStyle: {
    // alignSelf:"stretch",
    // textAlign: "center",
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    fontWeight : "bold",
    marginLeft :ThemeConstant.MARGIN_GENERIC
    // padding: ThemeConstant.MARGIN_TINNY,
    // borderColor: ThemeConstant.LINE_COLOR
  },
  buttonContanerStyle: {
    backgroundColor: ThemeConstant.BACKGROUND_COLOR,
    flexDirection: "row",
    alignItems: "stretch",
    padding: ThemeConstant.MARGIN_GENERIC
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
    paddingLeft: ThemeConstant.MARGIN_GENERIC,
    paddingRight: ThemeConstant.MARGIN_TINNY,
    width: SCREEN_WIDTH - SCREEN_WIDTH / 3.5 //- 50,
  },
  firstTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: "200",
    paddingBottom: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE
  },
  secondaryTextTheme: {
    alignSelf: "stretch",
    textAlign: "left",
    fontWeight: "600",
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    paddingBottom: ThemeConstant.MARGIN_GENERIC,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  headingStyle: {
    alignSelf: "center",
    fontWeight: "400",
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
  },
  pickerStyle: {
    marginTop: 0,
    paddingTop: 5,
    paddingBottom: 5,
    width: 110
  },
  editIconViewStyle: {
    alignSelf: "flex-start",
    width: ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM,
    height: ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM,
    padding: 2,
    margin: ThemeConstant.MARGIN_GENERIC,
    borderRadius: ThemeConstant.DEFAULT_ICON_SIZE_MIDIUM,
    borderColor: ThemeConstant.DEFAULT_SECOND_ICON_COLOR,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center"
  }
});

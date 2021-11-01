import React from 'react';
import { View } from "native-base"
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomImage from '../container/CustomImage';
import { SCREEN_WIDTH } from '../utility/UtilityConstant';
import ThemeConstant from '../app_constant/ThemeConstant';
import CustomIcon2 from '../container/CustomIcon2';
import { strings } from '../localize_constant/I18';

export default class WishListItemView extends React.Component {

  onPressRemoveItem = (item) => {
    this.props.onPressRemoveProduct(item);
  }

  onPressProductView = (item)=>{
    this.props.onPressProductView(item)
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPressProductView.bind(this, this.props.product)}>
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <CustomImage
            image={this.props.product.image}
            imagestyle={styles.imagestyle}
          />
          <View style={{ flexDirection: 'column', marginStart: 10, marginTop: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>{this.props.product.name}</Text>
            <Text style={{ marginTop: 10 }}>{this.props.product.stock_status}</Text>
            <Text>{this.props.product.price}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', elevation: 5 }}>
          <View style={styles.shareAndWishlistConatinerStyle}>
            <TouchableOpacity style={{ flex: 1 }} onPress={this.onPressRemoveItem.bind(this, this.props.product)}>
              <View style={styles.shareBtnStyle}>
                <CustomIcon2
                  name="remove"
                  style={{ marginStart: 10, marginEnd: 10 }}
                  size={ThemeConstant.DEFAULT_ICON_SIZE_NORMAL}
                  color={ThemeConstant.DEFAULT_ICON_COLOR}
                />
                <Text style={styles.shareAndFavTextStyle}>{strings("REMOVE")}</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 5,
    flexDirection: "column"
  },
  imagestyle: {
    alignSelf: "flex-start",
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3
  },
  mainContainer: {
    flexDirection: 'row'
  },
  shareAndWishlistConatinerStyle: { flex: 1, flexDirection: 'row', justifyContent: 'center', borderWidth: 1, alignContent: 'center', paddingTop: 2, paddingBottom: 2 },
  shareBtnStyle: { flex: 1, flexDirection: 'row', justifyContent: 'center' }
})
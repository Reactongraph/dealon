import { View, FlatList } from "react-native";
import React from 'react';
import { fetchDataFromAPI } from "../utility/APIConnection";
import AppConstant from "../app_constant/AppConstant";
import ProgressDialog from "../container/ProgressDialog";
import { strings } from "../localize_constant/I18";
import EmptyLayoutComponent from "../container/EmptyLayoutComponent";
import EmptyIconConstant from "../app_constant/EmptyIconConstant";
import WishListItemView from "./WishListItemView";
import ViewStyle from "../app_constant/ViewStyle";
import CustomActionbar from "../container/CustomActionbar";


export default class Wishlist extends React.Component {

    state = {
        isProgressLoading: false,
        isGrid: false,
        product_list: []
    }


    componentDidMount() {
        this.callAPI()
    }

    _onBackPress = () => {
        this.props.navigation.pop();
    };

    callAPI() {
        this.setState({
            isProgressLoading: true
        })
        let url = AppConstant.BASE_URL + "wishlist/?width=1.5"
        fetchDataFromAPI(url, "GET", "", null).then((response) => {
            this.setState({
                isProgressLoading: false
            })
            if (response.success) {
                this.setState({
                    product_list: response.product_list ? response.product_list : []
                })
            }
        })
    }
    _onPressRemoveProduct = product => {
        this.setState({
            isProgressLoading: true
        })
        let url = AppConstant.BASE_URL + "wishlist-remove-product";
        let body = { product_id: product.id }
        fetchDataFromAPI(url, "POST", JSON.stringify(body), null).then((response) => {
            this.setState({
                isProgressLoading: false
            })
            if (response.success) {
                this.callAPI();
            } else {
                showToast(response.message);
            }
        })
    }
    _onPressProductView = product =>{
        this.props.navigation.navigate('ProductPage', {
            productId: product.id,
            productName: product.name,
            productImage: product.image,
          });
    }

    renderCategoryPage = (item) => {
        return <WishListItemView product={item.item}
            onPressProductView={this._onPressProductView}
            onPressRemoveProduct={this._onPressRemoveProduct} />

    };
    render() {
        return (
            <View
                style={ViewStyle.mainContainer}>
                <CustomActionbar
                    backwordTitle={strings("BACK")}
                    title={strings("WISHLIST_TITLE")}
                    navigation={this.props.navigation}
                    _onBackPress={this._onBackPress}
                />
                <FlatList
                    refreshing={this.state.isProgressLoading}
                    data={this.state.product_list}
                    renderItem={this.renderCategoryPage.bind(this)}
                    windowSize={27}
                    scrollsToTop={this.state.isProgressLoading}
                    initialNumToRender={5}
                    keyExtractor={(item, index) => {
                        return item.id + "";
                    }}
                    ListEmptyComponent={
                        this.state.product_list.length == 0 ?
                            <EmptyLayoutComponent
                                message={strings("EMPTY_SELLER_PRODUCT")}
                                iconName={EmptyIconConstant.emptyCategory}
                            /> : null
                    }
                />


                <ProgressDialog
                    visible={this.state.isProgressLoading}
                    pleaseWaitVisible={false}
                />
            </View>
        )
    }
}
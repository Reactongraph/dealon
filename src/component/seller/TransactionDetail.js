import React from 'react';
import { View, Text, ScrollView, StyleSheet } from "react-native";
import CustomActionbar from '../../container/CustomActionbar';
import ViewStyle from '../../app_constant/ViewStyle';
import ThemeConstant from '../../app_constant/ThemeConstant';
import { fetchDataFromAPI } from '../../utility/APIConnection';
import { showErrorToast } from '../../utility/Helper';
import Loading from '../../container/LoadingComponent';
import AppConstant from '../../app_constant/AppConstant';
import { strings, localeObject } from '../../localize_constant/I18';
import { localizeStyle } from '../../localize_constant/LocalizeViewConstant';

export default class TransactionDetail extends React.Component {

    screenProps = {}
    state = {
        isLoading: true,
        transactionDetail: {},
        orderDetail: {}
    }

    componentDidMount() {
        let { navigation, screenProps } = this.props;
        this.screenProps = screenProps;

        let url = AppConstant.BASE_URL + "seller/transaction/" + this.props.navigation.getParam("transactionId", "") + "?seller_id=" + AppConstant.USER_KEY + "&page=1";
        fetchDataFromAPI(url, "GET", "", null).then(response => {
            if (response && response.success) {
                this.setState({
                    isLoading: false,
                    transactionDetail: response,
                    orderDetail: response.details ? response.details : {},
                });
            } else {
                this.setState({
                    isLoading: false,
                })
                showErrorToast(response.message);
            }
        });
    }

    _onBackPress = () => {
        this.props.navigation.pop();
    };

    render() {
        const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
        const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
        return (
            <View style={ViewStyle.mainContainer} >
                <CustomActionbar
                    _onBackPress={this._onBackPress.bind(this)}
                    backwordTitle={strings("BACK")}
                    title={strings("TRANSACTION_DETAIL")}
                    borderBottomWidth={0}
                />
                {this.state.isLoading ? (
                    <Loading />
                ) : (
                        <View style={{ flex: 1, }}>
                            <Text
                                style={[
                                    { padding: ThemeConstant.MARGIN_NORMAL, paddingBottom: ThemeConstant.MARGIN_EXTRA_LARGE, fontWeight: "normal", borderColor: ThemeConstant.LINE_COLOR_2, borderWidth: 0.8, borderTopLeftRadius: 20, borderTopRightRadius: 20, fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE, color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR }
                                ]}
                            >
                                {strings("TRANSACTION_ID_TITLE") }
                                <Text style={[styles.priceDetailValue, {fontWeight:"bold"}]} >{this.state.transactionDetail.transaction_id}</Text>
                            </Text>
                            <ScrollView>
                                <View>
                                    <View style={styles.contentstyle}>
                                        <Text style={styles.headingTitle}>
                                            {strings("TRANSACTION_INFORMATION")}
                                        </Text>

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("DATE")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.transactionDetail.transaction_date}
                                            </Text>
                                        </View>

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("TOTAL_PAYMENT")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.transactionDetail.amount}
                                            </Text>
                                        </View>

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("TRANSACTION_TYPE")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.transactionDetail.type}
                                            </Text>
                                        </View>

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("TRANSACTION_METHOD")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.transactionDetail.method}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.contentstyle}>
                                        <Text style={styles.headingTitle}>
                                            {strings("DETAIL")}
                                        </Text>

                                        <Text style={[styles.priceDetailValue,{marginTop:ThemeConstant.MARGIN_GENERIC, fontWeight:"bold"}]}>
                                                {this.state.orderDetail.product_name}
                                            </Text>

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("ORDER_ID_NORMAL")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.orderDetail.order_id}
                                            </Text>
                                        </View>                                     

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("QUANTITY")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.orderDetail.quantity}
                                            </Text>
                                        </View>

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("TOTAL_PRICE")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.orderDetail.total_price}
                                            </Text>
                                        </View>

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("COMMISSION")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.orderDetail.commission}
                                            </Text>
                                        </View>

                                        <View style={[styles.viewRowStyle, globleViewStyle ]}>
                                            <Text style={styles.priceDetailTitle}>
                                                {strings("SUBTOTAL")}
                                            </Text>
                                            <Text style={styles.priceDetailValue}>
                                                {this.state.orderDetail.subtotal}
                                            </Text>
                                        </View>

                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentstyle: {
        flex: 1,
        padding: ThemeConstant.MARGIN_NORMAL,
        alignItems: "stretch",
        marginTop: ThemeConstant.MARGIN_NORMAL,
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
        borderBottomWidth:1,
        borderBottomColor:ThemeConstant.LINE_COLOR
    },
    headingTitle: {
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        fontWeight: "600",
        paddingBottom: ThemeConstant.MARGIN_NORMAL,
        paddingTop: ThemeConstant.MARGIN_NORMAL,
        color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
        borderBottomWidth: 0.5,
        borderColor: ThemeConstant.LINE_COLOR_2
    },
    viewRowStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
        paddingBottom: ThemeConstant.MARGIN_TINNY,
        paddingTop: ThemeConstant.MARGIN_GENERIC,
    },
    priceDetailTitle: {
        fontWeight: "200",
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        fontWeight: "normal",
        color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
    },
    priceDetailValue: {
        fontWeight: "200",
        color: ThemeConstant.DEFAULT_TEXT_COLOR,
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        fontWeight: "normal",
    },
})
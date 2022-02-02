import AsyncStorage from "@react-native-community/async-storage";
import _ from 'lodash';
import { Button } from 'native-base';
import React from 'react';
import { Alert, Dimensions, FlatList, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight, Share, Modal } from 'react-native';
import { showErrorToast, showSuccessToast, showToast } from '../utility/Helper';
import { isStringEmpty, stringToNumber, _getconnection } from '../utility/UtilityConstant';
import FastImage from 'react-native-fast-image';
import firebase from 'react-native-firebase';
import AnalylticsConstant from '../app_constant/AnalylticsConstant';
import AppConstant from '../app_constant/AppConstant';
import { setCartCount, setGuestId } from '../app_constant/AppSharedPref';
import TextStyle from '../app_constant/TextStyle';
import ThemeConstant from '../app_constant/ThemeConstant';
import ViewStyle from '../app_constant/ViewStyle';
import CustomActionbar from '../container/CustomActionbar';
import CustomIcon2 from '../container/CustomIcon2';
import { CustomImage } from '../container/CustomImage';
import GridProduct from '../container/GridProduct';
import GroupProductItem from '../container/GroupProductItem';
import ItemProductReview from '../container/ItemProductReview';
import Loading from '../container/LoadingComponent';
import MaintenanceLayout from '../container/MaintenanceLayout';
import { fetchDataFromAPI } from '../utility/APIConnection';
import { localeObject, strings } from '../localize_constant/I18';
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { Container, Header, Item, Input, Icon, CheckBox, } from "native-base";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
    'window',
);


export default class FilterProduct extends React.Component {
    componentVisible = true;
    productId = '';
    state = {
        isLoading: true,
        product: [],
        product_cat: [],
        store: [],
        product_condition: [],
        color: [],
        size: [],
        display: [],
        material: [],
        memory: [],
        operation_system: [],
        selectedVariation: null,
        isProgressLoading: false,
        isMaintenance: false,
        selectedAtrribute: null,
        viewReviews: true,
        children: [],
        showDominant: 1,
        auction: "",
        quote: "",
        isSelected: false,
        Alert_Visibility: false,
        showCategories: false,
        showBrand: false,
        showProductCondition: false,
        showColor: false,
        showSize: false,
        showDisplay: false,
        showMaterial: false,
        showMemory: false,
        showOperationSystem: false,
    };

    componentDidMount() {
        this.componentVisible = true;
        this.loadProduct(false);
    }

    onBackPress = () => {
        this.props.navigation.pop();
    };

    onFilterOption = () => {
        this.loadFilter();

    }

    _onPressProduct = product => {
     
          this.props.navigation.navigate("ProductPage", {
            productId: product.id,
            productName: product.name,
            productImage: product.banner_image
          });
       
      };



    loadProduct = isRetry => {
        this.setState({
            isLoading: true,
        });
        let url =
            AppConstant.BASE_URL +
            'products/search/filter';

        fetchDataFromAPI(url, 'GET', '', "", "").then(
            response => {
                this.setState({
                    isLoading: false,
                });
                console.log("Check Viral Response  " + JSON.stringify(response))
                if (response && response.success !== false) {
                    let product = response.products;
                    this.setState({
                        product: product,
                        isMaintenance: false,

                    });
                } else {
                    this.setState({
                        isMaintenance: true,
                    });
                }
            },
        );
    };


    FilterOptionApi = isRetry => {

        let productcat = "";
        let brand = "";
        let productcondition = "";
        let color = "";
        let size = "";
        let display = "";
        let material = "";
        let memory = "";
        let operation_system = "";
        let auction = "";
        let Quote = "";

        this.state.product_cat.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                productcat = element["slug"];
            }
        });

        this.state.store.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                brand = element["slug"];
            }
        });

        this.state.product_condition.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                productcondition = element["slug"];
            }
        });


        this.state.color.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                color = element["slug"];
            }
        });


        this.state.size.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                size = element["slug"];
            }
        });


        this.state.display.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                display = element["slug"];
            }
        });


        this.state.material.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                material = element["slug"];
            }
        });


        this.state.memory.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                memory = element["slug"];
            }
        });

        this.state.operation_system.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
                operation_system = element["slug"];
            }
        });


        console.log("Category", productcat);

        this.setState({
            isLoading: true,
            Alert_Visibility: false
        });
        let url =
            AppConstant.BASE_URL +
            'products/search/filter/?category=' + productcat +
            "&product_condition=" + productcondition +
            "&store=" + brand +
            "&color=" + color +
            "&size=" + size +
            "&display=" + display +
            "&material=" + material +
            "&memory=" + memory +
            "&operation-system=" + operation_system +
            "&auction=" + auction +
            "&enable_quote=" + Quote;

        fetchDataFromAPI(url, 'GET', '', "", "").then(
            response => {
                this.setState({
                    isLoading: false,
                    product: [],
                });
                console.log("Check Viral Response  " + JSON.stringify(response))
                if (response && response.success !== false) {
                    let product = response.products;
                    this.setState({
                        product: product,
                        isMaintenance: false,
                    });
                } else {
                    this.setState({
                        isMaintenance: true,
                    });
                }
            },
        );

    }


    loadFilter = isRetry => {
        this.setState({
            isLoading: true,
        });
        let url =
            AppConstant.BASE_URL +
            'products/search/filterAttrData';

        fetchDataFromAPI(url, 'GET', '', "", "").then(
            response => {

                console.log("Check Viral Response  " + JSON.stringify(response))
                if (response && response.success !== false) {

                    let categories = response.product_cat;
                    categories.forEach(element => {
                        element["isSelected"] = false;
                    });

                    let stores = response.store;
                    stores.forEach(element => {
                        element["isSelected"] = false;
                    });


                    let productcondition = response.product_condition;
                    productcondition.forEach(element => {
                        element["isSelected"] = false;
                    });


                    let colors = response.color;
                    colors.forEach(element => {
                        element["isSelected"] = false;
                    });


                    let sizes = response.size;
                    sizes.forEach(element => {
                        element["isSelected"] = false;
                    });

                    let displays = response.display;
                    displays.forEach(element => {
                        element["isSelected"] = false;
                    });

                    let materials = response.material;
                    materials.forEach(element => {
                        element["isSelected"] = false;
                    });

                    let memorys = response.memory;
                    memorys.forEach(element => {
                        element["isSelected"] = false;
                    });

                    let operationsystem = response.operation_system;
                    operationsystem.forEach(element => {
                        element["isSelected"] = false;
                    });

                    this.setState({
                        Alert_Visibility: true,
                        isLoading: false,
                        product_cat: categories,
                        store: stores,
                        product_condition: productcondition,
                        color: colors,
                        size: sizes,
                        display: displays,
                        material: materials,
                        memory: memorys,
                        operation_system: operationsystem,
                        quote: response.quote,
                        auction: response.auction

                    });
                    this.setState({

                        isMaintenance: false,
                    });
                } else {
                    this.setState({
                        isMaintenance: true,
                    });
                }
            },
        );
    };

    _onPressCart = () => {
        this.screenProps.navigate('CartPage');
    };

    _onPressFilter = () => {
        this.screenProps.navigate('FiltersProduct');
    };

    onPressNotification = () => {
        this.screenProps.navigate('NotificationPage');
    };

    onPressSearch = () => {
        this.screenProps.navigate('SearchProductPage');
    };


    onPressCheckBox = category => {
        this.setState({
            isSelected: !this.state.isSelected
        });
        category["isSelected"] = !category["isSelected"];
    };


    onPressCheckBoxCat = category => {


       
        this.state.product_cat.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });

        console.log("check category >>>> " + JSON.stringify(category))

        category["isSelected"] = !category["isSelected"];

    };

    onPressCheckBoxBrand = store => {

        this.state.store.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });
        store["isSelected"] = !store["isSelected"];
    };

    onPressCheckBoxProductCondition = product_condition => {

        this.state.product_condition.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });
        product_condition["isSelected"] = !product_condition["isSelected"];
    };


    onPressCheckBoxColor = color => {

        this.state.color.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });
        color["isSelected"] = !color["isSelected"];
    };

    onPressCheckBoxSize = size => {

        this.state.size.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });
        size["isSelected"] = !size["isSelected"];
    };

    onPressCheckBoxDisplay = display => {

        this.state.display.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });
        display["isSelected"] = !display["isSelected"];
    };

    onPressCheckBoxMaterial = material => {

        this.state.material.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });
        material["isSelected"] = !material["isSelected"];
    };


    onPressCheckBoxMemory = memory => {

        this.state.memory.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });
        memory["isSelected"] = !memory["isSelected"];
    };

    onPressCheckBoxOperationsystem = operation_system => {

        this.state.operation_system.forEach(element => {
            if (element["isSelected"] != false) {
                element["isSelected"] = false;
            }
        });

        this.setState({
            isSelected: !this.state.isSelected
        });
        operation_system["isSelected"] = !operation_system["isSelected"];
    };


    render() {

        const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
        const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: ThemeConstant.BACKGROUND_COLOR_1,
                    position: 'relative'
                }}>
                <Header

                    style={{
                        backgroundColor: ThemeConstant.PRIMARY_COLOR,
                        alignSelf: "flex-start",
                        padding: 0.00001
                    }}
                    androidStatusBarColor={ThemeConstant.DARK_PRIMARY_COLOR}
                    keyboardShouldPersistTaps="always"
                >
                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", alignSelf: "stretch" }} onPress={this.onBackPress}>
                        <CustomIcon2
                            name="back"
                            size={28}
                            color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                        />
                    </TouchableOpacity>

                    <Text
                        style={styles.titleTextStyle}
                        ellipsizeMode="tail"
                        allowFontScaling={false}
                        numberOfLines={2}
                    >
                        {AppConstant.APP_NAME}
                    </Text>

                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", alignSelf: "stretch" }} onPress={this.onFilterOption}>
                        <CustomIcon2
                            name="filter"
                            size={28}
                            color={ThemeConstant.ACTION_BAR_ICON_COLOR}
                        />
                    </TouchableOpacity>
                </Header>

                {this.state.isLoading ? (
                    <Loading />
                ) : (
                        <ScrollView>

                            <FlatList
                                data={this.state.product}
                                extraData={this.state}
                                renderItem={this.listItem}
                                numColumns={2}
                                keyExtractor={(item, index) => index.toString()}
                                nestedScrollEnabled={true}
                                removeClippedSubviews={true}
                                renderItem={({ item, index }) =>
                                (

                                    <TouchableOpacity

                                        onPress={()=>this._onPressProduct(item)}
                                        style={styles.product_container}>
                                        <View>
                                            <CustomImage
                                                image={item.image}
                                                imagestyle={styles.imagestyle}
                                                onPress={()=>this._onPressProduct(item)}
                                            />
                                            <View style={[styles.productInfoTheme, { alignItems: localeObject.isRTL ? "flex-end" : "flex-start" }]}>
                                                <View style={[{ flexDirection: 'row', alignItems: "center" }, globleViewStyle]} >
                                                    <Text style={styles.secondaryTextTheme} numberOfLines={2}>
                                                        {item.sale_price + "  "}
                                                        <Text style={styles.regularPriceTextTheme} numberOfLines={2}>
                                                            {item.regular_price}
                                                        </Text>
                                                    </Text>

                                                </View>

                                                <Text style={[styles.firstTextTheme, globalTextStyle]} numberOfLines={2}>
                                                    {item.title}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>



                                )}
                            />


                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignSelf: 'center' }}>

                                <Modal
                                    visible={this.state.Alert_Visibility}
                                    animationType="slide"
                                    transparent={true}
                                >

                                    <View style={{
                                        flex: 1,
                                        // alignItems: "center",
                                        // justifyContent: "center",
                                        backgroundColor: ThemeConstant.BACKGROUND_COLOR_1,
                                    }}>

                                        <View style={{ width: '100%', padding: 20, borderRadius: 10, }}>

                                            <TouchableOpacity style={{ alignSelf: 'flex-end', alignItems: "flex-end", justifyContent: "center", alignSelf: "stretch", marginBottom: 30 }} onPress={() => this.setState({ Alert_Visibility: false })}>
                                                <CustomIcon2
                                                    name="close"
                                                    size={28}
                                                    color={ThemeConstant.DEFAULT_ICON_COLOR}
                                                />
                                            </TouchableOpacity>

                                            <ScrollView>
                                                <TouchableOpacity onPress={() => this.setState({ showCategories: !this.state.showCategories })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Categories
                                                    </Text>
                                                    { this.state.showCategories ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                                                        </View>
                                                </TouchableOpacity>
                                                { this.state.showCategories ? <FlatList
                                                  data={this.state.product_cat}
                                                  extraData={this.state.isSelected}
                                                  renderItem={({ item }) => {
                                                      return (
                                                          <TouchableOpacity
                                                              style={styles.checkBoxViewStyle}
                                                              onPress={this.onPressCheckBoxCat.bind(this, item)}
                                                          >
                                                              <Text style={styles.checkboxTitleStyle}>
                                                                  {item.name}
                                                              </Text>
                                                              <CheckBox
                                                                  checked={item.isSelected}
                                                                  onPress={this.onPressCheckBoxCat.bind(this, item)}
                                                                  color={ThemeConstant.ACCENT_COLOR}
                                                              />
                                                          </TouchableOpacity>
                                                      );
                                                  }}

                                                /> : null}
                                              <TouchableOpacity onPress={() => this.setState({ showBrand: !this.state.showBrand })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Brand
                                                    </Text>
                                                    { this.state.showBrand ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                    </View>
                                                </TouchableOpacity>
                                                { this.state.showBrand ? <FlatList
                                                    data={this.state.store}
                                                    extraData={this.state.isSelected}
                                                    renderItem={({ item }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.checkBoxViewStyle}
                                                                onPress={this.onPressCheckBoxBrand.bind(this, item)}
                                                            >
                                                                <Text style={styles.checkboxTitleStyle}>
                                                                    {item.name}
                                                                </Text>
                                                                <CheckBox
                                                                    checked={item.isSelected}
                                                                    onPress={this.onPressCheckBoxBrand.bind(this, item)}
                                                                    color={ThemeConstant.ACCENT_COLOR}
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    }}

                                                /> : null}

                                                <TouchableOpacity onPress={() => this.setState({ showProductCondition: !this.state.showProductCondition })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Product Condition
                                                    </Text>
                                                    { this.state.showProductCondition ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                    </View>
                                                    </TouchableOpacity>
                                                {this.state.showProductCondition ?<FlatList
                                                      data={this.state.product_condition}
                                                      extraData={this.state.isSelected}
                                                      renderItem={({ item }) => {
                                                          return (
                                                              <TouchableOpacity
                                                                  style={styles.checkBoxViewStyle}
                                                                  onPress={this.onPressCheckBoxProductCondition.bind(this, item)}
                                                              >
                                                                  <Text style={styles.checkboxTitleStyle}>
                                                                      {item.name}
                                                                  </Text>
                                                                  <CheckBox
                                                                      checked={item.isSelected}
                                                                      onPress={this.onPressCheckBoxProductCondition.bind(this, item)}
                                                                      color={ThemeConstant.ACCENT_COLOR}
                                                                  />
                                                              </TouchableOpacity>
                                                          );
                                                      }}

                                                  /> : null}

                                                  <TouchableOpacity onPress={() => this.setState({ showColor: !this.state.showColor })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Color
                                                </Text>
                                                { this.state.showColor ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                </View>
                                                </TouchableOpacity>
                                                { this.state.showColor ? <FlatList
                                                    data={this.state.color}
                                                    extraData={this.state.isSelected}
                                                    renderItem={({ item }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.checkBoxViewStyle}
                                                                onPress={this.onPressCheckBoxColor.bind(this, item)}
                                                            >
                                                                <Text style={styles.checkboxTitleStyle}>
                                                                    {item.name}
                                                                </Text>
                                                                <CheckBox
                                                                    checked={item.isSelected}
                                                                    onPress={this.onPressCheckBoxColor.bind(this, item)}
                                                                    color={ThemeConstant.ACCENT_COLOR}
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    }}

                                                /> : null}

                                                <TouchableOpacity onPress={() => this.setState({ showSize: !this.state.showSize })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Size
                                                </Text>
                                                { this.state.showSize ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                </View>
                                                </TouchableOpacity>
                                                { this.state.showSize ? <FlatList
                                                    data={this.state.size}
                                                    extraData={this.state.isSelected}
                                                    renderItem={({ item }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.checkBoxViewStyle}
                                                                onPress={this.onPressCheckBoxSize.bind(this, item)}
                                                            >
                                                                <Text style={styles.checkboxTitleStyle}>
                                                                    {item.name}
                                                                </Text>
                                                                <CheckBox
                                                                    checked={item.isSelected}
                                                                    onPress={this.onPressCheckBoxSize.bind(this, item)}
                                                                    color={ThemeConstant.ACCENT_COLOR}
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    }}

                                                /> : null}

                                                <TouchableOpacity onPress={() => this.setState({ showDisplay: !this.state.showDisplay })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Display
                                                </Text>
                                                { this.state.showDisplay ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                </View>
                                                </TouchableOpacity>
                                                {this.state.showDisplay ? <FlatList
                                                    data={this.state.display}
                                                    extraData={this.state.isSelected}
                                                    renderItem={({ item }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.checkBoxViewStyle}
                                                                onPress={this.onPressCheckBoxDisplay.bind(this, item)}
                                                            >
                                                                <Text style={styles.checkboxTitleStyle}>
                                                                    {item.name}
                                                                </Text>
                                                                <CheckBox
                                                                    checked={item.isSelected}
                                                                    onPress={this.onPressCheckBoxDisplay.bind(this, item)}
                                                                    color={ThemeConstant.ACCENT_COLOR}
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    }}

                                                /> : null}
                                                <TouchableOpacity onPress={() => this.setState({ showMaterial: !this.state.showMaterial })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Material
                                                </Text>
                                                { this.state.showMaterial ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                </View>
                                                </TouchableOpacity>
                                                {this.state.showMaterial ? <FlatList
                                                    data={this.state.material}
                                                    extraData={this.state.isSelected}
                                                    renderItem={({ item }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.checkBoxViewStyle}
                                                                onPress={this.onPressCheckBoxMaterial.bind(this, item)}
                                                            >
                                                                <Text style={styles.checkboxTitleStyle}>
                                                                    {item.name}
                                                                </Text>
                                                                <CheckBox
                                                                    checked={item.isSelected}
                                                                    onPress={this.onPressCheckBoxMaterial.bind(this, item)}
                                                                    color={ThemeConstant.ACCENT_COLOR}
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    }}

                                                /> : null}
                                                <TouchableOpacity onPress={() => this.setState({ showMemory: !this.state.showMemory })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Memory
                                                </Text>
                                                { this.state.showMemory ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                </View>
                                                </TouchableOpacity>
                                                {this.state.showMemory ? <FlatList
                                                    data={this.state.memory}
                                                    extraData={this.state.isSelected}
                                                    renderItem={({ item }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.checkBoxViewStyle}
                                                                onPress={this.onPressCheckBoxMemory.bind(this, item)}
                                                            >
                                                                <Text style={styles.checkboxTitleStyle}>
                                                                    {item.name}
                                                                </Text>
                                                                <CheckBox
                                                                    checked={item.isSelected}
                                                                    onPress={this.onPressCheckBoxMemory.bind(this, item)}
                                                                    color={ThemeConstant.ACCENT_COLOR}
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    }}

                                                /> : null}
                                                <TouchableOpacity onPress={() => this.setState({ showOperationSystem: !this.state.showOperationSystem })}>
                                                <View style={styles.filterheading}>
                                                <Text style={styles.headingTextStyle}>
                                                    Operation system
                                                </Text>
                                                { this.state.showOperationSystem ?
                                                        <CustomIcon2
                                                                                          name={"arrow-down"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />
                                                        :
                                                        <CustomIcon2
                                                                                          name={"arrow-right"}
                                                                                          size={ThemeConstant.DEFAULT_ICON_SIZE}
                                                                                        />}
                                                </View>
                                                </TouchableOpacity>
                                                {this.state.showOperationSystem ? <FlatList
                                                    data={this.state.operation_system}
                                                    extraData={this.state.isSelected}
                                                    renderItem={({ item }) => {
                                                        return (
                                                            <TouchableOpacity
                                                                style={styles.checkBoxViewStyle}
                                                                onPress={this.onPressCheckBoxOperationsystem.bind(this, item)}
                                                            >
                                                                <Text style={styles.checkboxTitleStyle}>
                                                                    {item.name}
                                                                </Text>
                                                                <CheckBox
                                                                    checked={item.isSelected}
                                                                    onPress={this.onPressCheckBoxOperationsystem.bind(this, item)}
                                                                    color={ThemeConstant.ACCENT_COLOR}
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    }}

                                                /> : null}
                                                <View style={{ flexDirection: 'row', marginBottom: 50 }}>

                                                    <TouchableOpacity
                                                        style={styles.uploadButtonContainercan}
                                                        onPress={() => this.setState({ Alert_Visibility: false })}
                                                    >
                                                        <Text style={styles.buttonText}>
                                                            Cancle
                                                        </Text>
                                                    </TouchableOpacity>


                                                    <TouchableOpacity
                                                        style={styles.uploadButtonContainer}
                                                        onPress={() => this.FilterOptionApi()}
                                                    >
                                                        <Text style={styles.buttonText}>
                                                            Filter
                                                        </Text>
                                                    </TouchableOpacity>



                                                </View>

                                            </ScrollView>



                                        </View>

                                    </View>

                                </Modal>

                            </View>


                        </ScrollView>
                    )}




            </View>
        )
    }

}



const styles = StyleSheet.create({
    product_container: {
        width: SCREEN_WIDTH / 2,
        backgroundColor: ThemeConstant.BACKGROUND_COLOR,
        flexDirection: "column",
        borderWidth: 0.5,
        borderColor: ThemeConstant.LINE_COLOR,
        padding: ThemeConstant.MARGIN_TINNY,
    },
    imagestyle: {
        alignSelf: "center",
        // width: SCREEN_WIDTH / 2.1,
        // height: SCREEN_WIDTH / 3
        width: SCREEN_WIDTH / 2 - (2 * ThemeConstant.MARGIN_TINNY),
        height: SCREEN_WIDTH / 2 - 2 * ThemeConstant.MARGIN_TINNY
    },
    productInfoTheme: {
        flex: 6,
        alignSelf: "stretch",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingTop: ThemeConstant.MARGIN_GENERIC,
        paddingBottom: ThemeConstant.MARGIN_GENERIC,
        width: SCREEN_WIDTH / 2 - (2 * ThemeConstant.MARGIN_TINNY)
    },
    firstTextTheme: {
        alignSelf: "stretch",
        textAlign: "left",
        fontWeight: "400",
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        color: ThemeConstant.DEFAULT_TEXT_COLOR,
        marginTop: ThemeConstant.MARGIN_TINNY,
        marginBottom: ThemeConstant.MARGIN_TINNY,
    },
    secondaryTextTheme: {
        color: ThemeConstant.DEFAULT_TEXT_COLOR,
        fontWeight: "bold",
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE
    },
    regularPriceTextTheme: {
        textDecorationLine: "line-through",
        color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR,
        fontSize: ThemeConstant.DEFAULT_TINNY_TEXT_SIZE,
        marginHorizontal: ThemeConstant.MARGIN_TINNY,
    },
    buttonStyle: {
        width: 120,
        backgroundColor: ThemeConstant.ACCENT_COLOR,
        marginTop: ThemeConstant.MARGIN_TINNY,
        alignSelf: "baseline"
    },
    buttonTextStyle: {
        color: ThemeConstant.ACCENT_BUTTON_TEXT_COLOR,
        fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
        borderRadius: 4
    },
    headingTextStyle: {
        fontWeight: "bold",
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
        marginTop: ThemeConstant.MARGIN_GENERIC,
        color: ThemeConstant.DEFAULT_TEXT_COLOR,
    },
    checkBoxViewStyle: {
        flex: 1,
        alignSelf: "stretch",
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        marginTop: ThemeConstant.MARGIN_GENERIC,
        marginLeft: ThemeConstant.MARGIN_GENERIC,
        marginRight: ThemeConstant.MARGIN_GENERIC,
        padding: ThemeConstant.MARGIN_GENERIC,
        borderBottomColor: ThemeConstant.LINE_COLOR,
        borderBottomWidth: 0.5
    },
    checkboxTitleStyle: {
        flex: 1,
        fontWeight: "100",
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        color: ThemeConstant.DEFAULT_TEXT_COLOR,
    },
    titleTextStyle: {
        // alignSelf: "stretch",
        flex: 1,
        textAlignVertical: "center",
        fontWeight: "800",
        fontSize: ThemeConstant.DEFAULT_LARGE_TEXT_SIZE,
        color: ThemeConstant.ACTION_BAR_TEXT_COLOR,
        marginLeft: 30,

        // flex: 3
    },
    buttonText: {
        color: "#fff",
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        textAlign: "center",
        fontWeight: "bold"
    },
    uploadButtonContainer: {
        width: 100,
        backgroundColor: ThemeConstant.ACCENT_COLOR,
        paddingVertical: ThemeConstant.MARGIN_NORMAL,
        marginBottom: ThemeConstant.MARGIN_LARGE,
        marginTop: ThemeConstant.MARGIN_NORMAL,
        marginLeft: ThemeConstant.MARGIN_TINNY,
        marginRight: ThemeConstant.MARGIN_TINNY,
        borderRadius: ThemeConstant.MARGIN_TINNY,
        flex: 1,
    },
    uploadButtonContainercan: {
        width: 100,
        backgroundColor: ThemeConstant.RED_COLOR,
        paddingVertical: ThemeConstant.MARGIN_NORMAL,
        marginBottom: ThemeConstant.MARGIN_LARGE,
        marginTop: ThemeConstant.MARGIN_NORMAL,
        marginLeft: ThemeConstant.MARGIN_TINNY,
        marginRight: ThemeConstant.MARGIN_TINNY,
        borderRadius: ThemeConstant.MARGIN_TINNY,
        flex: 1,
    },
    filterheading: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
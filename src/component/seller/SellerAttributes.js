import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    FlatList,
    Platform,
    Animated
} from "react-native";
import {
    Form,
    Textarea,
    Picker,
    Header,
    Button,
    Icon,
    Body,
    Title,
    CheckBox,
    Right,
    Left
} from "native-base";
import ThemeConstant from "../../app_constant/ThemeConstant";
import AppConstant from "../../app_constant/AppConstant";
import ProgressDialog from "../../container/ProgressDialog";
import {
    fetchDataFromAPI,
    fetchDataFromAPIMultipart
} from "../../utility/APIConnection";
import { showSuccessToast, showErrorToast } from "../../utility/Helper";
import StringConstant from "../../app_constant/StringConstant";
import { CustomImage } from "../../container/CustomImage";
import { isStringEmpty, SCREEN_WIDTH, onlyDigitText } from "../../utility/UtilityConstant";
import AskCameraGalleryDialog from "../../container/AskCameraGalleryDialog";
import _ from "lodash";
import SelectCategoryDialog from "./SelectCategoryDialog";
import ViewStyle from "../../app_constant/ViewStyle";
import { strings } from "../../localize_constant/I18";
import CustomIcon2 from "../../container/CustomIcon2";
import MultiSelect from '../../lib/react-native-multi-select';
import Loading from "../../container/LoadingComponent";
import axios from 'axios';



export default class SellerAttributes extends React.Component {
    productId = 0;
    constructor() {
        super();

        this.state = {
            valueArray: [], disabled: false, textInputs: [], dropdowns: [], selectedItems: [],
            selectattribut: [],
            selectparentname: [],
            selectparentchild: [],
            items: [],
            isMaintenance: false,
            isLoading: false,
            isProgress: false,
        }

        this.index = 0;

        this.animatedValue = new Animated.Value(0);
    }



    state = {
        downLoadable: false,
        openImageGallery: false,
        isNewImageUpdate: false,
        isProgress: false,
        product_id: 0,
        selectedStatus: {},
        imageType: 0,
        status: [],
        images: [],
        newImages: [],
        attributs_product: [],
        child_of_attributs: {},
        recipient: {}

    };
    componentDidMount() {

        this.setState(
            {
                images: this.props.galleryImages,
                status: this.props.statusOption,
                attributs_product: this.props.prodcutAttribut.parent,
                child_of_attributs: this.props.prodcutAttribut.child_of,
                product_id: this.props.productId
            },
            () => this.updateinfoData()
        );
        this.updateStatus(this.props.statusOption, this.props.statusValue, this.props.prodcutAttribut, this.props.productId);


        console.log("check product id >>>> " + this.state.product_id)

    }
    componentWillUpdate(newProps) {
        if (newProps.isGetProductInfoData) {
            this.props._getattributproductInformation({ response: this.state });
        }
        if (newProps != this.props) {
            this.setState(
                {
                    images: this.props.galleryImages,
                    status: this.props.statusOption,
                    attributs_product: this.props.prodcutAttribut.parent,
                    child_of_attributs: this.props.prodcutAttribut.child_of,
                    product_id: this.props.productId
                },
                () => this.updateinfoData()
            );
            this.updateStatus(newProps.statusOption, newProps.statusValue, newProps.prodcutAttribut, newProps.productId);
        }

        console.log("check product id >>>> " + this.state.product_id)

    }
    updateinfoData = () => {
        this.props._getattributproductInformation({ response: this.state });
    };

    updateStatus = (options, value) => {
        if (options && typeof options != "string") {
            options.forEach(element => {
                if (element.id == value) {
                    this._selectStatus(element);
                }
            });
        }
    };

    _selectStatus = status => {




        this.setState({ selectedStatus: status, disabled: true, }, () => {
            Animated.timing(
                this.animatedValue,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start(() => {

                this.setState({ disabled: false });
            });
        }, () => this.updateinfoData()


        );



    };

    _onPressIsDownLaodable = () => {
        this.setState(
            {
                downLoadable: !this.state.downLoadable
            },
            () => this.updateinfoData()
        );
    };


    addMore = () => {
        this.animatedValue.setValue(0);

        let newlyAddedValue = { index: this.index, }

        this.setState({ disabled: true, valueArray: [...this.state.valueArray, newlyAddedValue] }, () => {
            Animated.timing(
                this.animatedValue,
                {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start(() => {
                this.index = this.index + 1;
                this.setState({ disabled: false });
            });
        });




    }


    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });


    };

    getselected(selecteditems) {
        for (let i = 0; i < selecteditems.length; i++) {

            console.log("selected item   " + selecteditems[i])

        }
    }

    SubmitData() {


        var newStateArray = [];
        var newStateArray_ = {};

        var data = new FormData();

        var getdata = "";


        const groupedPeople = this.groupBy(this.state.selectattribut, "parent_name");
        console.log(groupedPeople);


        for (let i = 0; i < this.state.selectparentname.length; i++) {

            var childname = [];
            for (let j = 0; j < groupedPeople[this.state.selectparentname[i]].length; j++) {
                childname.push(groupedPeople[this.state.selectparentname[i]][j].name)
            }

            let newly_added_data = {
                "product_attr": this.state.selectparentname[i],
                ["product_attr[" + this.state.selectparentname[i] + "][name]"]: this.state.selectparentname[i],
                ["product_attr[" + this.state.selectparentname[i] + "][value]"]: childname.join("|"),
                ["product_attr[" + this.state.selectparentname[i] + "][position]"]: "",
                ["product_attr[" + this.state.selectparentname[i] + "][is_visible]"]: 1,
                ["product_attr[" + this.state.selectparentname[i] + "][is_taxonomy]"]: 0,
                ["product_attr[" + this.state.selectparentname[i] + "][is_variation]"]: 1,

            };
            newStateArray.push(newly_added_data);


            data.append("product_attr[" + this.state.selectparentname[i] + "][name]", this.state.selectparentname[i])
            data.append("product_attr[" + this.state.selectparentname[i] + "][value]", childname.join("|"))
            data.append("product_attr[" + this.state.selectparentname[i] + "][position]", "")
            data.append("product_attr[" + this.state.selectparentname[i] + "][is_visible]", 1)
            data.append("product_attr[" + this.state.selectparentname[i] + "][is_taxonomy]", 0)
            data.append("product_attr[" + this.state.selectparentname[i] + "][is_variation]", 1)

        }

        // console.log("check clid value >>>>>> " + JSON.stringify(newStateArray));

        // for (let i = 0; i < newStateArray.length; i++) {



        //     newStateArray_ = Object.assign(newStateArray_, newStateArray[i]);

        //     // this.setState({
        //     //     recipient: {...this.state.recipient, ...newStateArray[i]}
        //     // })

        // }


        // console.log("check clid value 111 >>>>>> " + JSON.stringify(newStateArray_));



        this.setState({ isProgress: true, isLoading: true });
        let url = AppConstant.BASE_URL + "products/" + this.state.product_id + "/attributes";

        // data.append("product_attr[advanced-features][name]","advanced-features")
        // data.append("product_attr[advanced-features][value]", "UPnP™ Support | WDS")
        // data.append("product_attr[advanced-features][position]","")
        // data.append("product_attr[advanced-features][is_visible]",1)
        // data.append("product_attr[advanced-features][is_taxonomy]",0)
        // data.append("product_attr[advanced-features][is_variation]",1)
        // data.append("product_attr[color][name]","color")
        // data.append("product_attr[color][value]", "Black | Blue")
        // data.append("product_attr[color][position]","")
        // data.append("product_attr[color][is_visible]",1)
        // data.append("product_attr[color][is_taxonomy]",0)
        // data.append("product_attr[color][is_variation]",1)



        axios.post(url, data)
            .then(res => {
                this.setState({ isProgress: false, isLoading: false });
                console.log(res.data);

                if (res.data && res.data.success) {
                    this.setState(
                        {
                            isProgress: false,
                        },
                        () => this.updateinfoData()
                    )
                    showSuccessToast(res.data.message);
                } else {
                    showErrorToast(res.data.message);
                    this.setState(
                        {
                            isProgress: false,
                            isLoading: false,
                            isSKUAvailable: false,
                            skuError: res.data.message
                        },
                        () => this.updateinfoData()
                    );
                }

            })
            .catch((error) => {
                //   this.setState({ isProgress: false, isLoading: false });
                console.log("catch error ", error);
            });




        // let body =
        //     JSON.stringify({
        //         product_attr:"advanced-features",
        //         product_attr:"color",
        //         ["product_attr[advanced-features][name]"]: "advanced-features",
        //         ["product_attr[advanced-features][value]"]: "UPnP™ Support | WDS",
        //         ["product_attr[advanced-features][position]"]: "",
        //         ["product_attr[advanced-features][is_visible]"]: 1,
        //         ["product_attr[advanced-features][is_taxonomy]"]: 0,
        //         ["product_attr[advanced-features][is_variation]:"]: 1,
        //         ["product_attr[color][name]"]: "color",
        //         ["product_attr[color][value]"]: "Black | Blue",
        //         ["product_attr[color][position]"]: "",
        //         ["product_attr[color][is_visible]"]: 1,
        //         ["product_attr[color][is_taxonomy]"]: 0,
        //         ["product_attr[color][is_variation]"]: 1,
        //     });
        // console.log("SellerId=>>", this.sellerId);
        // fetchDataFromAPI(url, "POST", body, null).then(response => {
        //     if (response && response.success) {
        //         this.setState(
        //             {
        //                 isProgress: false,
        //             },
        //             () => this.updateinfoData()
        //         )
        //         showSuccessToast(response.message);
        //     } else {
        //         showErrorToast(response.message);
        //         this.setState(
        //             {
        //                 isProgress: false,
        //                 isLoading: false,
        //                 isSKUAvailable: false,
        //                 skuError: response.message
        //             },
        //             () => this.updateinfoData()
        //         );
        //     }
        // });

    }



    groupBy(objectArray, property) {
        return objectArray.reduce((acc, obj) => {
            const key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            // Add object to list for given key's value
            acc[key].push(obj);
            return acc;
        }, {});
    }



    render() {

        const { selectedItems } = this.state;
        const animationValue = this.animatedValue.interpolate(
            {
                inputRange: [0, 1],
                outputRange: [-59, 0]
            });

        let newArray = this.state.valueArray.map((item, key) => {
            if ((key) == this.index) {
                return (
                    <Animated.View key={key} style={[{ opacity: this.animatedValue, transform: [{ translateY: animationValue }] }]}>
                        {/* <Text style={styles.text}>Row {item.index}</Text> */}
                        <View style={{ flexDirection: 'row' }}>

                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                placeholder={"Select Attribute"}
                                selectedValue={this.state.dropdowns[item.index]}
                                onValueChange={text => {
                                    let { dropdowns, items } = this.state;
                                    dropdowns[item.index] = text;
                                    this.setState({ items: [], textInputs: [] })

                                    console.log("check parent value >>>>> " + this.state.dropdowns[text])

                                    var newStateArray = [];
                                    for (let i = 0; i < this.state.child_of_attributs[text].length; i++) {

                                        let newly_added_data = { id: i + 1, name: this.state.child_of_attributs[text][i], parent_name: text };


                                        newStateArray.push(newly_added_data);
                                    }

                                    items[item.index] = newStateArray;


                                    this.setState({ items });

                                    this.setState({
                                        dropdowns

                                    });
                                }}
                                style={styles.pickerStyle}
                                headerStyle={styles.pickerStyle}
                            >
                                {this.state.attributs_product.map((status, i) => {
                                    return (
                                        <Picker.Item key={i} value={status} label={status} />
                                    );
                                })}
                            </Picker>

                            {/* <TextInput
                                style={{
                                    flex: 1,
                                    borderColor: ThemeConstant.ACCENT_COLOR,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    alignSelf: 'flex-start',
                                    padding: 10,
                                }}
                                onChangeText={text => {
                                    let { textInputs } = this.state;
                                    textInputs[item.index] = text;
                                    this.setState({
                                        textInputs,
                                    });
                                }}  
                                value={this.state.textInputs[item.index]}
                            /> */}

                            <View style={{ flex: 1 }}>
                                <MultiSelect
                                    hideTags
                                    items={this.state.items[item.index]}
                                    uniqueKey="id"
                                    ref={(component) => { this.multiSelect = component }}
                                    onSelectedItemsChange={text => {
                                        let { textInputs } = this.state;
                                        textInputs[item.index] = text;
                                        var newStateArray = [];

                                        for (let i = 0; i < this.state.items[item.index].length; i++) {

                                            for (let j = 0; j < textInputs[item.index].length; j++) {

                                                if (textInputs[item.index][j] == i + 1) {

                                                    if (!newStateArray.includes(this.state.items[item.index][i])) {

                                                        newStateArray.push(this.state.items[item.index][i]);
                                                    }

                                                }
                                            }

                                        }


                                        // var joined = this.state.selectattribut.concat(newStateArray);
                                        // this.setState({
                                        //     selectattribut: joined
                                        // });

                                        this.setState(prevState => ({
                                            selectattribut: [...prevState.selectattribut, newStateArray]
                                        }))

                                        this.setState({
                                            textInputs,
                                        });


                                        console.log("items array print >>>>>> " + JSON.stringify(this.state.selectattribut))
                                    }}
                                    selectedItems={this.state.textInputs[item.index]}
                                    selectText="Pick Items"
                                    searchInputPlaceholderText="Search Items..."
                                    onChangeInput={(text) => console.log(text)}
                                    altFontFamily="ProximaNova-Light"
                                    tagRemoveIconColor="#CCC"
                                    tagBorderColor="#CCC"
                                    tagTextColor="#CCC"
                                    selectedItemTextColor="#CCC"
                                    selectedItemIconColor="#CCC"
                                    itemTextColor="#000"
                                    displayKey="name"
                                    searchInputStyle={{ color: '#CCC' }}
                                    submitButtonColor="#CCC"
                                    submitButtonText="Submit"
                                />
                                <View>
                                    {/* <Text>{key+"  "+this.state.textInputs[item.index]}</Text>
                                    {this.multiSelect && this.multiSelect.getSelectedItemsExt(this.state.textInputs[item.index])} */}


                                </View>
                            </View>

                        </View>

                    </Animated.View>
                );
            }
            else {
                return (
                    <View key={key} >
                        {/* <Text style={styles.text}>Row  {item.index}</Text> */}
                        <View style={{ flexDirection: 'row' }}>


                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                placeholder={"Select Attribute"}
                                selectedValue={this.state.dropdowns[item.index]}
                                onValueChange={text => {
                                    let { dropdowns, items } = this.state;
                                    dropdowns[item.index] = text;

                                    this.setState({ items: [], textInputs: [] })

                                    console.log("check parent value >>>>> " + text)


                                    var newStateArray = [];
                                    for (let i = 0; i < this.state.child_of_attributs[text].length; i++) {
                                        let newly_added_data = { id: i + 1, name: this.state.child_of_attributs[text][i], parent_name: text };
                                        newStateArray.push(newly_added_data);
                                    }

                                    items[item.index] = newStateArray;

                                    this.setState({ items });

                                    this.setState({
                                        dropdowns,
                                    });
                                }}
                                headerStyle={styles.pickerStyle}
                                style={styles.pickerStyle}
                            >
                                {this.state.attributs_product.map((status, i) => {
                                    return (
                                        <Picker.Item key={i} value={status} label={status} />
                                    );
                                })}
                            </Picker>

                            <View style={{ flex: 1 }}>
                                <MultiSelect
                                    hideTags
                                    items={this.state.items[item.index]}
                                    uniqueKey="id"
                                    ref={(component) => { this.multiSelect = component }}
                                    onSelectedItemsChange={text => {
                                        let { textInputs } = this.state;
                                        textInputs[item.index] = text;


                                        console.log("check value >>>> " + text)

                                        var newStateArray = [];


                                        for (let i = 0; i < this.state.items[item.index].length; i++) {

                                            for (let j = 0; j < textInputs[item.index].length; j++) {

                                                if (textInputs[item.index][j] == i + 1) {

                                                    if (!this.state.selectattribut.includes(this.state.items[item.index][i])) {
                                                        newStateArray.push(this.state.items[item.index][i]);
                                                        if (!this.state.selectparentname.includes(this.state.items[item.index][i].parent_name)) {
                                                            this.state.selectparentname.push(this.state.items[item.index][i].parent_name)
                                                        }
                                                        this.state.selectattribut.push(this.state.items[item.index][i])
                                                    }

                                                }
                                            }

                                        }

                                        this.setState({
                                            textInputs,
                                        });




                                        // var joined = this.state.selectattribut.concat(newStateArray);
                                        // this.setState({
                                        //     selectattribut: joined
                                        // });






                                        console.log("items array print >>>>>> " + JSON.stringify(this.state.selectattribut))
                                    }}
                                    selectedItems={this.state.textInputs[item.index]}
                                    selectText="Pick Items"
                                    searchInputPlaceholderText="Search Items..."
                                    onChangeInput={(text) => console.log(text)}
                                    altFontFamily="ProximaNova-Light"
                                    tagRemoveIconColor="#CCC"
                                    tagBorderColor="#CCC"
                                    tagTextColor="#CCC"
                                    selectedItemTextColor="#CCC"
                                    selectedItemIconColor="#CCC"
                                    itemTextColor="#000"
                                    displayKey="name"
                                    searchInputStyle={{ color: '#CCC' }}
                                    submitButtonColor="#CCC"
                                    submitButtonText="Submit" />

                                <View>
                                    {/* <Text>{item.index+"  "+this.state.textInputs[item.index]}</Text>
                                    {this.multiSelect && this.multiSelect.getSelectedItemsExt(this.state.textInputs[item.index])} */}

                                </View>
                            </View>

                        </View>
                    </View>
                );
            }
        });



        return (
            <View style={styles.container}>

                {this.state.isLoading ? (
                    <Loading />
                ) : (

                        <View
                            style={{
                                flex: 1,
                                alignSelf: "stretch"
                            }}>

                            {this.state.isMaintenance ? (
                                <MaintenanceLayout
                                    onPress={this.getProductDataFromAPI.bind(this)}
                                    message={strings("SERVER_MAINTENANCE")}
                                />
                            ) : (

                                    <View>

                                        <TouchableOpacity activeOpacity={0.8} onPress={this.addMore}>
                                            <View style={styles.addattributesview}>
                                                <CustomIcon2
                                                    name="plus"
                                                    size={ThemeConstant.DEFAULT_ICON_SMALL_SIZE}
                                                    color={ThemeConstant.ACCENT_COLOR} />
                                                <Text style={styles.addattributestext}>Add Attribute</Text>

                                            </View>
                                        </TouchableOpacity>





                                        <ScrollView>
                                            <View style={{ flex: 1, padding: 4, marginTop: 10, }}>
                                                {
                                                    newArray
                                                }
                                            </View>
                                        </ScrollView>


                                        <TouchableOpacity
                                            style={styles.buttonContainer}
                                            onPress={() => this.SubmitData()}
                                            activeOpacity={1}
                                        >
                                            <Text style={styles.buttonText}>Update</Text>
                                        </TouchableOpacity>


                                    </View>

                                )}
                        </View>

                    )}



            </View >
        )
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: ThemeConstant.MARGIN_GENERIC,
        borderWidth: 0.5,
        borderColor: ThemeConstant.LINE_COLOR
    },
    addattributesview: {
        flexDirection: 'row',
        borderColor: ThemeConstant.ACCENT_COLOR,
        borderRadius: 20,
        borderWidth: 1,
        textAlign: 'center',
        alignSelf: 'center',
        padding: 10,
        marginTop: 10,

    },
    addattributestext: {
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        fontWeight: "bold",
        marginLeft: 10,
        color: ThemeConstant.ACCENT_COLOR,

    },
    viewHolder:
    {
        height: 55,
        backgroundColor: '#26A69A',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4
    },

    text:
    {
        color: 'white',
        fontSize: 25
    },
    pickerStyle: {
        borderColor: ThemeConstant.ACCENT_COLOR,
        borderRadius: 20,
        borderWidth: 1,
        alignSelf: 'flex-start',
        padding: 10,
        marginTop: 10,

    },
    buttonContainer: {
        alignSelf: "stretch",
        backgroundColor: ThemeConstant.ACCENT_COLOR,
        paddingVertical: ThemeConstant.MARGIN_NORMAL,
        marginBottom: ThemeConstant.MARGIN_LARGE,
        marginTop: ThemeConstant.MARGIN_NORMAL,
        marginLeft: ThemeConstant.MARGIN_TINNY,
        marginRight: ThemeConstant.MARGIN_TINNY,
        borderRadius: ThemeConstant.MARGIN_TINNY
    },
    buttonText: {
        color: "#fff",
        fontSize: ThemeConstant.DEFAULT_MEDIUM_TEXT_SIZE,
        textAlign: "center",
        fontWeight: "bold"
    },
})
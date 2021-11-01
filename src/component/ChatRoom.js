import AsyncStorage from "@react-native-community/async-storage";
import { Text } from "native-base";
import React from "react";
import { FlatList, ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AppConstant from "../app_constant/AppConstant";
import ThemeConstant from "../app_constant/ThemeConstant";
import CustomActionbar from "../container/CustomActionbar";
import ProgressDialog from "../container/ProgressDialog";
import { localeObject, strings } from "../localize_constant/I18";
import { localizeStyle } from "../localize_constant/LocalizeViewConstant";
import { fetchDataFromAPI } from "../utility/APIConnection";
// import SocketIO from 'react-native-socketio';

// var socketConfig = { path: '/socket' };
// var socket = new SocketIO('https://dealon.uk:3000', socketConfig);

export default class ChatRoom extends React.Component {
    page = 1;
    userId = 0;
    buyersList = [];
    isInComponent = false;
    FlatListRef = null;
    screenProps = {};
    timer = null;
    state = {
        isProgress: false,
        senderId: "",
        reciverId: "",
        title: "",
        message: '',
        loadTime: "1",
        chatHistory: [],
        timer: null,
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
        // this.socket = io("https://dealon.uk:3000");
        // socket.on("chat message", msg => {
        //     this.setState({
        //         chatMessages: [...this.state.chatHistory, msg]
        //     });
        // });
        this.timer = setInterval(
            this._getChatHistory
            , 5000);
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }


    isFocused() {
        this.page = 1;
        let senderId, reciverId, title = ""
        senderId = this.props.navigation.getParam("sellerId", "0");
        reciverId = this.props.navigation.getParam("userID", "0");
        title = this.props.navigation.getParam("title", "Chat");

        console.log('ChatRoom=>>> SellerID', this.props.navigation.getParam("sellerId", "0"));
        console.log('ChatRoom=>>> UserID', this.props.navigation.getParam("userID", "0"));
        console.log('ChatRoom=>>> Title', this.props.navigation.getParam("title", "0"));
        this.setState({
            // senderId: senderId,
            reciverId: senderId,
            title: title,
            message: "",
            isProgress: true
        })
        this._getChatHistory();

    }


    _getChatHistory = () => {
        AsyncStorage.getItem(AppConstant.PREF_USER_ID).then(userID => {
            if (userID) {
                this.setState({
                    senderId: userID
                })
                let url =
                    AppConstant.BASE_URL +
                    "user/chat/get/history"
                let body = {
                    receiverId: this.state.reciverId,
                    customerId: this.state.senderId,
                    loadTime: this.state.loadTime
                }
                body = JSON.stringify(body)
                fetchDataFromAPI(url, "POST", body, null).then(response => {
                    if (this.isInComponent) {
                        if (response && response.success) {
                            this.setState({
                                isProgress: false,
                                chatHistory: response.data.message
                            });
                        } else {
                            this.setState({
                                isProgress: false
                            });
                        }
                    }
                });
            }
        });
    }

    _onBackPress = () => {
        this.props.navigation.pop();
    };

    _onPressSendMessage = () => {
        let mess = this.state.message
        // socket.emit('chat message', mess);
        let year = new Date().getFullYear()
        let day = new Date().getDay()
        let month = new Date().getMonth() + 1
        let miliSec = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds().toString() : new Date().getSeconds().toString()
        let currentDateTime = year + "-" + month < 10 ? "0" + month : month + "-" + day < 10 ? "0" + day : day + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + miliSec.substr(0 - 2)
        this.setState({
            message: ''
        })
        let date = new Date();
        let url =
            AppConstant.BASE_URL +
            "user/chat/save"
        let body = {
            receiverId: this.state.reciverId,
            customerId: this.state.senderId,
            message: mess
            // dateTime: String(date) 
        }
        body = JSON.stringify(body)
        fetchDataFromAPI(url, "POST", body, null).then(response => {
            if (this.isInComponent) {
                this.setState({
                    isProgress: false
                });
                if (response && response.data.message) {
                    this.setState({
                        chatHistory: response.data.message
                    });
                } else {

                }
            }
        });

    };
    _handleMessageChange = message => {
        this.setState({ message: message });
    };
    render() {
        const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
        const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
        return (
            <View
                style={{ flex: 1, backgroundColor: ThemeConstant.BACKGROUND_COLOR }}
            >
                <CustomActionbar
                    title={this.state.title}
                    backwordTitle={strings("ACCOUNT_TITLE")}
                    _onBackPress={this._onBackPress.bind(this)}
                />
                <ScrollView>
                    <FlatList
                        style={{ alignSelf: "stretch"}}
                        ref={ref => (this.FlatListRef = ref)} // assign the flatlist's ref to your component's FlatListRef...
                        onContentSizeChange={() => this.FlatListRef.scrollToEnd()} // scroll it
                        data={this.state.chatHistory}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ marginTop: 3,flex:1 , marginBottom: 3, alignSelf: this.state.senderId === item.sender_id ? 'flex-end' : 'flex-start' }}>
                                    <View style={{ borderRadius: 12, backgroundColor: 'white', padding: 8, margin: 5, borderWidth: 1, alignSelf: 'baseline' }}>
                                        <Text>{item.message}</Text>
                                    </View>
                                    <Text style={{ alignItems: 'baseline', fontSize: 10, marginEnd: 5 }}>{item.datetime}</Text>
                                </View>
                            );
                        }}
                    />
                </ScrollView>
                <View style={{ backgroundColor: 'white', borderTopWidth: 1, flexDirection: 'row', justifyContent: "flex-end" }}>
                    <TextInput style={{ flex: 1 }} placeholder={strings("ENTER_MESSAGE")}
                        value={this.state.message}
                        onSubmitEditing={() => this._onPressSendMessage()}
                        onChangeText={this._handleMessageChange.bind(this)}
                        keyboardType="default"
                    />
                    <TouchableOpacity style={{ marginEnd: 15, marginStart: 15, justifyContent: 'center' }} onPress={this._onPressSendMessage.bind(this)}>
                        <Icon
                            name="send"
                            size={ThemeConstant.DEFAULT_ICON_SMALL_SIZE}
                        />
                    </TouchableOpacity>
                </View>
                <ProgressDialog visible={this.state.isProgress}></ProgressDialog>
            </View>
        );
    }
}

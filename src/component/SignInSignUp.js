import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import ThemeConstant from '../app_constant/ThemeConstant';
import ViewStyle from '../app_constant/ViewStyle';
import AppConstant from '../app_constant/AppConstant';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import firebase from 'react-native-firebase';
import FastImage from 'react-native-fast-image';
import { fetchDataFromAPI } from '../utility/APIConnection';
import { showSuccessToast, showErrorToast } from '../utility/Helper';
import ProgressDialog from '../container/ProgressDialog';
import { setIsLogin, setUserData } from '../app_constant/AppSharedPref';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { strings } from '../localize_constant/I18';

export default class SignInSignUp extends React.Component {
  state = {
    isProgress: false,
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          justifyContent: 'space-between',
          backgroundColor: ThemeConstant.BACKGROUND_COLOR,
        }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.headingMain}>{AppConstant.STORE_NAME}</Text>
          <Text style={styles.headingMain2}>
            for {AppConstant.APP_NAME.replace(/ /g, '\n')}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>{strings("SIGN_IN_OR_REGISTER")}</Text>
          <Text
            style={[ViewStyle.viewAllStyle, { alignSelf: 'stretch' }]}
            onPress={this.props.onPressSignIn.bind(this)}>
            {strings("SIGN_IN_WITH_EMAIL")}
          </Text>

          <Text
            style={[ViewStyle.viewAllStyle, { alignSelf: 'stretch' }]}
            onPress={this.props.onPressSignUp.bind(this)}>
            {strings("CREATE_AN_ACCOUNT")}
          </Text>
        </View>
        <ProgressDialog visible={this.state.isProgress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headingMain: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: '700',
    fontStyle: 'normal',
    textAlign: 'center',
    margin: ThemeConstant.MARGIN_GENERIC,
    fontSize: 30,
  },
  headingMain2: {
    color: ThemeConstant.DEFAULT_TEXT_COLOR,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'center',
    fontSize: ThemeConstant.DEFAULT_EXTRA_LARGE_TEXT_SIZE,
  },
});

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Text,
  ActivityIndicator
} from 'react-native';
import StringConstant from '../app_constant/StringConstant';
import { strings, localeObject } from '../localize_constant/I18';
import { localizeStyle } from '../localize_constant/LocalizeViewConstant';

const ProgressDialog = ({ visible, pleaseWaitVisible, removeLoading }) => {
  const globalTextStyle = localizeStyle(localeObject.isRTL).GlobalTextView;
  const globleViewStyle = localizeStyle(localeObject.isRTL).GlobalView;
  return (
  <Modal
    onRequestClose={() => null}
    animationType="fade"
    transparent={true}
    visible={visible}>
    <View style={styles.container}>
      <View style={styles.content}>
        {!removeLoading && <Text style={globalTextStyle} visible={pleaseWaitVisible}>{strings("PLEASE_WAIT")}</Text>  }
        
        <View style={[styles.loading, globleViewStyle]}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
          
          <View style={[styles.loadingContent, globalTextStyle]}>
            <Text>{removeLoading ? strings("PLEASE_WAIT") : strings("LOADING")}</Text>
          </View> 
        </View>
      </View>
    </View>
  </Modal>
)};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'stretch',
    width:200,
    borderRadius:10,
  },  
  loading: {
    marginTop:20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'stretch',  
  },
  loader: {
    flex: 1,
  },
  loadingContent: {
    flex: 3,   
    alignSelf:'center',
  }
})

export default ProgressDialog;
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AlertIOS } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import StringConstant from '../../app_constant/StringConstant';
import { strings } from '../../localize_constant/I18';

class FingerprintPopup extends Component {
// Touch ID
componentDidMount() {
  FingerprintScanner
    .authenticate({ description: (strings("SCAN_BIOMETRIC_TEXT", { "biometric" :this.props.biometric}))})
    .then(() => {
      this.handlePopupDismissed(true);
    })
    .catch((error) => {
      this.handlePopupDismissed(false);
    });
}
  handlePopupDismissed = (result)=>{
    this.props.handlePopupDismissed(this.props.REQUEST_TYPE, result)
  }
 
  render() {
    return false;
  }
}

FingerprintPopup.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;

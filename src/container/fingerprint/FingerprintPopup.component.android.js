import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import styles from './FingerprintPopup.component.styles';
import ShakingText from './ShakingText.component';
import CustomIcon2 from '../CustomIcon2';
import ThemeConstant from '../../app_constant/ThemeConstant';
import StringConstant from '../../app_constant/StringConstant';
import { strings } from '../../localize_constant/I18';

class FingerprintPopup extends Component {

  constructor(props) { 
    super(props);
    this.state = { errorMessage: undefined, biometric: undefined };
  }

  componentDidMount() {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttempted })
      .then(() => {
        // Alert.alert('Fingerprint Authentication', 'Authenticated successfully');
        this.handlePopupDismissed(true);
      })
      .catch((error) => {
        console.log("Error", error.message);        
        this.setState({ errorMessage: error.message, biometric: error.biometric });
        this.description.shake();
      });
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  handleAuthenticationAttempted = (error) => {
    this.setState({ errorMessage: error.message });
    this.description.shake();
  };

  handlePopupDismissed = (result)=>{
    this.props.handlePopupDismissed(this.props.REQUEST_TYPE, result)
  }

  render() {
    const { errorMessage} = this.state;
    const { style, biometric } = this.props;

    return (
      <View style={styles.container}>
        <View style={[styles.contentContainer, style]}>

          <CustomIcon2
            name = "baseline-fingerprint-24px"
            color = {ThemeConstant.ACCENT_COLOR}
            size = {ThemeConstant.DEFAULT_ICON_SIZE_LARGE}
          />

          <Text style={styles.heading}>
            
          </Text>
          <ShakingText
            ref={(instance) => { this.description = instance; }}
            style={styles.description(!!errorMessage)}>
            {errorMessage || (strings("SCAN_BIOMETRIC_TEXT", { "biometric":this.props.biometric}))}
          </ShakingText>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.handlePopupDismissed.bind(this, false)}
          >
            <Text style={styles.buttonText}>
              {strings("BACK")}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

FingerprintPopup.propTypes = {
  style: ViewPropTypes.style,
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default FingerprintPopup;

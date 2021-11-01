/** 
* Webkul Software. 
* 
* @category Webkul 
* @package Webkul_Mobikul_React_SupplierAPP
* @author Webkul
* @copyright Copyright (c) 2010-2018 WebkulSoftware Private Limited (https://webkul.com) 
* @license https://store.webkul.com/license.html 
* 
*/

import ReactNative from 'react-native';
import I18n from 'react-native-i18n';

// Import all locales
import en from './../locales/en.json';
import ar from './../locales/ar.json';
import AppConstant from '../app_constant/AppConstant.js';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  ar
};

export const localeObject = {
  currentLocale : AppConstant.CURRENT_LOCALE,
  isRTL : false,
}

const currentLocale = I18n.currentLocale();

/* setCurrentLocale define to set Locale on App,  
   I18n.locale -  assign Locale for String
   localeObject - local app object update Locale variable.
   ReactNative.I18nManager.allowRTL - Allow RTL alignment in RTL languages */
export const setCurrentLocale = (locale)=>{
    I18n.locale = locale;
    localeObject.currentLocale = locale;
    localeObject.isRTL = locale.indexOf('he') === 0 || locale.indexOf('ar') === 0;
    ReactNative.I18nManager.allowRTL(localeObject.isRTL);
}

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  // console.log('I18 =>>> ',  I18n.currentLocale());
  return I18n.t(name, params);
};

export default I18n;
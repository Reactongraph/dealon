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

import { StyleSheet } from 'react-native'
import { isRTL } from './I18';

export const localizeStyle = (isRTL) => {
    // console.log('LocalizeViewConstant =>>> ',  isRTL);
    return (StyleSheet.create({
        GlobalView: {
            flexDirection: isRTL ? "row-reverse" : "row"
        },
        GlobalTextView: {
            // flex:1,
            textAlign: isRTL ? "right" : "left"
        }
    }))
}
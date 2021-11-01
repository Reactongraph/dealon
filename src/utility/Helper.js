
import {Platform} from 'react-native'

import MobikulToast from 'react-native-mobikul-toast'

export const showAlert = (msg)=>{
    alert(msg)
}
export const showSuccessAlert = (msg)=>{
    alert(msg)
}
export const showErrorAlert = (msg)=>{
    alert(msg)
}

export const showSuccessToast = (msg)=>{
    MobikulToast.success(msg, MobikulToast.SHORT)
 }
 export const showErrorToast = (msg)=>{
     MobikulToast.error(msg, MobikulToast.LONG);
 }
 export const showWarnToast = (msg)=>{
     MobikulToast.warning(msg, MobikulToast.LONG);
 }
 export const showToast = (msg)=>{
     MobikulToast.info(msg, MobikulToast.SHORT);
 }
 
 const showSimpleToast=(msg, type)=>{
     MobikulToast.show(msg, type);
 }
 

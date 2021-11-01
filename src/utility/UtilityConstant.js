import { Dimensions, Platform, PixelRatio, Linking } from "react-native";

import NetInfo from "@react-native-community/netinfo";
import { showErrorToast } from "./Helper";
import { strings } from "../localize_constant/I18";
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get(
  "window"
);

// based on iphone 5s's scale
export const scale = SCREEN_WIDTH / 4;
export const width = SCREEN_WIDTH;
export const height = SCREEN_HEIGHT;
export const getPixelRatio = PixelRatio.get();

export function normalize(size) {
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(size));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(size)) - 2;
  }
}
export const getRandomNumberFrom1to3 = () => {
  return Math.floor(Math.random() * 4 + 1);
};
export function serializeJSON(data) {
  let rr = Object.keys(data)
    .map(function(keyName) {
      // return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
      return encodeURIComponent(keyName) + "=" + data[keyName];
    })
    .join("&");
  return rr;
}

export const _getconnection = () =>
  new Promise((resolve, reject) => {
    NetInfo.fetch().then((state) => {
      console.log("NetInfo, is " + (state.isConnected ? "online" : "offline"));
      resolve(state.isConnected);
    });
  });

export const isStringEmpty = (text) => {
  if (text && typeof text == "string" && text.trim() !== "") {
    return false;
  } else {
    return true;
  }
};
export const isValidEmail = (email) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(email);
};
export const isPhoneNumber = (phone) => {
  let reg = /^[0-9]+$/;
  return reg.test(phone);
};

export const getNotificationRoot = (data) => {
  if (data) {
    switch (data.type) {
      case "product":
        return {
          root: "ProductPage",
          data: { productId: data.id_page, productName: data.title },
        };
      case "category":
        return {
          root: "CategoryProductPage",
          data: { categoryId: data.id_page, productName: data.title },
        };

      default:
        return {
          root: "HomePage",
          data: { categoryId: data.id_page, productName: data.title },
        };
    }
  } else {
    return {
      root: "HomePage",
      data: { categoryId: data.id_page, productName: data.title },
    };
  }
};

export const capatilizeCharector = (text) => {
  if (!isStringEmpty(text)) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  } else {
    return text;
  }
};

export const stringToNumber = (text) => {
  if (typeof text == "string" && text != "") {
    return parseInt(text);
  } else {
    return text;
  }
};

export const onlyDigitText = (text) => {
  text = text.replace(/[, -]/g, "");
  text = text.replace(/^([^.]*\.)(.*)$/, function(a, b, c) {
    return b + c.replace(/\./g, "");
  });
  return text;
};

export const getOrderStatus = (status) => {
  status = isStringEmpty(status) ? "" : status.toLowerCase();
  switch (status) {
    case "completed":
      return "rgb(200,215,225)";

    case "pending":
      return "rgba(0,107,188,0.5)";

    case "processing":
      return "rgb(198,225,199)";

    case "on-hold":
      return "rgba(255,161,0,0.5)";

    case "cancelled":
      return "rgb(229,229,229)";

    case "refunded":
      return "rgba(255,204,0,1)";

    case "failed":
      return "rgb(235,163,163)";

    default:
      return "rgb(229,229,229)";
  }
};

export const callNumber = (phone) => {
  let phoneNumber = phone;
  if (Platform.OS !== "android") {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        showErrorToast(strings("SOMETHING_WENT_WRONG"));
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => console.log(err));
};

export async function sendEmail(to) {

  let url = `mailto:${to}`;

  // Create email link query
  // const query = qs.stringify({
  // subject: "",
  // body: "",
  // cc: cc,
  // });
  // if (query.length) {
  // url += `?${query}`;
  // }

  // check if we can use this link
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        showErrorToast(strings("SOMETHING_WENT_WRONG"));
      } else {
        return Linking.openURL(url);
      }
    })
    .catch((err) => console.log(err));
 }

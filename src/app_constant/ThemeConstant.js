import { width, height, SCREEN_WIDTH } from "../utility/UtilityConstant";
import { Platform } from "react-native";

export default {
    // MAIN ACTION BAR COLOR
    PRIMARY_COLOR: '#000000',
     // MAIN ACTION BAR COLOR
    DARK_PRIMARY_COLOR: "#000000" ,
    SECONDARY_COLOR: 'rgb(238, 167, 2)',
    ACCENT_COLOR: '#000000',
    /// Star Color use on Write Review
    RATING_COLOR : "#ECBF00",
    //red heart icon
    RED_COLOR:'rgb(250,0,0)',
    // ACCENT_COLOR: '#824171',
    LINK_COLOR : "rgba(63,96,218,1)",
    ACTION_BAR_ICON_COLOR : "#FFFFFF",
    ACTION_BAR_TEXT_COLOR : "#FFFFFF",
    BACKGROUND_COLOR : '#FFFFFF',
    BACKGROUND_COLOR_1 : '#F2F2F2',
    BACKGROUND_COLOR_2 : '#e3e3e3',
    DEFAULT_CHECKBOX_COLOR : '#707070',
    // Swach Color Border ON Product options
    INPUT_TEXT_BACKGROUND_COLOR : "#f1f1f1",
    // SEPERATOR
    LINE_COLOR : '#d0d0d0',
    LINE_COLOR_2 : '#e2e2e2',

    DEFAULT_TEXT_COLOR : "#000000",
    DEFAULT_SECOND_TEXT_COLOR : "#a0a0a0",
    // DEFAULT_SECOND_TEXT_COLOR : "#000000DE",
    HEADING_TEXT_TITLE_COLOR : '#000000' ,
    
    ACCENT_BUTTON_TEXT_COLOR :"#FFFFFF",
    DISCOUNT_TEXT_COLOR : "#59A600FF",
    DEFAULT_ICON_COLOR : "#000000",
    DEFAULT_SECOND_ICON_COLOR : "#a0a0a0",

    CATEGORY_ICON_SIZE : width > 500 ? 34 : 30,
    DEFAULT_ICON_SIZE : 30,
    DEFAULT_ICON_SIZE_Normal : 24,
    DEFAULT_ICON_SIZE_NORMAL : 24,
    DEFAULT_ICON_SIZE_MIDIUM : 20,
    DEFAULT_ICON_SMALL_SIZE : 15,
    DEFAULT_ICON_TINNY_SIZE : 12,
    DEFAULT_BOTTOM_NAV_ICON_SIZE : 28,
    DEFAULT_ICON_SIZE_LARGE : 40,

    DEFAULT_TINNY_TEXT_SIZE : width < 600 ? 10 :  width < 700 ?  14 : 12,
    DEFAULT_SMALL_TEXT_SIZE : width < 600 ? 12 : width < 700 ?  16 : 14,
    DEFAULT_MEDIUM_TEXT_SIZE : width < 600 ? 14 :width < 700 ?  18 :  16,
    DEFAULT_LARGE_TEXT_SIZE : width < 600 ? 16 : width < 700 ?  20 : 18,
    DEFAULT_EXTRA_LARGE_TEXT_SIZE : width < 600 ? 18 : width < 700 ? 22 : 20,
    DEFAULT_LARGE_TEXT_SIZE_22 : width < 600 ? 22 : width < 700 ?  26 :  24,
    DEFAULT_BADGE_TEXT_SIZE : Platform.OS == 'ios' ?  15 : 12,

    BANNER_SIZE : width/2, //height > 850 ? height > 1200 ? 320 : 270 : 200,
    FEATURED_CATEGORY_SIZE :height > 850 ? height > 1200 ? 170 : 150 : 130,
    FEATURED_CATEGORY_CARD_HEIGHT : 150,

    SELLER_IMAGE_WIDTH_HEIGHT : height > 850 ? height > 1200 ? 140: 130 : 120,
    SELLER_BANNER_HEIGHT : height > 850 ? height > 1200 ? 260: 240 : 200,
    CUSTOMER_PROFILE_BANNER_HEIGHT : SCREEN_WIDTH,
    UPLOAD_IMAGE_SIZE:800,

    DASHBOARD_PROFILE_IMAGE_SIZE : height > 850 ? height > 1200 ? 120: 100 : 80,
    DASHBOARD_BANNER_IMAGE_SIZE : height > 850 ? height > 1200 ? 240: 220 : 200,

    EMPTY_ICON_SIZE : 200,

    PADDING_ACTION_BAR : 20,

    MARGIN_NORMAL : 10,
    MARGIN_TINNY : 4,
    MARGIN_GENERIC : 8,
    MARGIN_LARGE : 14,
    MARGIN_EXTRA_LARGE : 20,

    RATING_SIZE_MEDIUM : 20,
    RATING_SIZE_LARGE : 30,
}
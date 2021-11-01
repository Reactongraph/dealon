import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import ThemeConstant from "../app_constant/ThemeConstant";
import RatingView from "../component/RatingView";

import { strings } from "../localize_constant/I18";

export default class ItemProductReview extends React.Component {
  shouldComponentUpdate(newProps, newstate) {
    if (newProps.reviewItem != this.props.reviewItem) {
      return true;
    } else {
      return false;
    }
  }
  render() {
    let reviewItem = this.props.reviewItem;
    return (
      <View style={styles.itemView}>
        <View style={{ flexDirection: "row" }}>
          <RatingView
            ratingValue={reviewItem.rating}
            iconSize={ThemeConstant.DEFAULT_ICON_TINNY_SIZE}
            isTextVisible = {false}
          />
        </View>

        <Text style={styles.normalTextstyle}>{reviewItem.review}</Text>

        <View style={{ flex:1, flexDirection: "row", justifyContent:"space-between", alignItems:"center" }}> 
        <Text style={styles.primaryTextstyle}>
          <Text style={styles.headingTextstyle}>
            {strings("REVIEWER_NAME")}-{" "}
          </Text>

          {reviewItem.reviewer_name}
        </Text>

        <Text style={[styles.headingTextstyle, {marginLeft:ThemeConstant.MARGIN_NORMAL }]}>
          {reviewItem.created_at}
        </Text>
        </View>
       

      </View>
    );
  }
}

ItemProductReview.propsType = {
    reviewItem : PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  normalTextstyle: {
    marginTop: ThemeConstant.MARGIN_TINNY,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
  },
  primaryTextstyle: {
    marginTop: ThemeConstant.MARGIN_TINNY,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_TEXT_COLOR
  },
  headingTextstyle: {
    marginTop: ThemeConstant.MARGIN_TINNY,
    fontSize: ThemeConstant.DEFAULT_SMALL_TEXT_SIZE,
    color: ThemeConstant.DEFAULT_SECOND_TEXT_COLOR
  },
  itemView: {
    flex:1,
    alignSelf: 'stretch',
    borderTopColor: ThemeConstant.LINE_COLOR,
    borderTopWidth: 0.5,
    padding: ThemeConstant.MARGIN_NORMAL,
    alignItems: "flex-start"
  }
});

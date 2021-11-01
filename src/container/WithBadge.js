import React from "react";
import { StyleSheet, View } from "react-native";
import { Badge } from "react-native-elements";

const styles = StyleSheet.create({
  badge: {
    borderRadius: 60,
    height: 15,
    minWidth: 0,
    width: 15,
    backgroundColor : 'blue'
  },
  badgeContainer: {
    position: "absolute",

  },
  badgeText: {
    fontSize: 10,
    color : 'white',
    alignSelf: 'center',
  }
});

const withBadge = (value, options = {}) => WrappedComponent =>
  class extends React.Component {
    render() {
      const { top = -5, right = 0, left = 0, bottom = 0, hidden = !value, ...badgeProps } = options;
      const badgeValue = typeof value === "function" ? value(this.props) : value;
      return (
        <View>
          <WrappedComponent {...this.props} style = {styles.badgeContainer} />
          {!hidden && (
            <Badge
              wrapperStyle={styles.badge}
              textStyle={styles.badgeText}
              value={value}
            //   containerStyle={[styles.badgeContainer, { top, right, left, bottom }]}
              {...badgeProps}
            />
          )}
        </View>
      );
    }
  };

export default withBadge;
import React from "react";
import { View, StyleSheet } from "react-native";

const SpacedView = ({ children, spacing }) => {
  return (
    <View style={[styles.container]}>
      {React.Children.map(children, (child, index) => (
        <View style={index === 0 ? {} : { marginTop: spacing }}>{child}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
});

export default SpacedView;

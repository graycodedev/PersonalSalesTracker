import React from "react";
import { View, StyleSheet } from "react-native";

const Circle = ({
  children,
  radius,
  backgroundColor,
  borderWidth,
  borderColor,
  containerStyle,
}) => {
  const styles = StyleSheet.create({
    container: {
      height: radius * 2,
      width: radius * 2,
      borderRadius: radius,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      borderColor: borderColor,
      borderWidth: borderWidth,
    },
  });
  return <View style={[styles.container, containerStyle]}>{children}</View>;
};

export default Circle;

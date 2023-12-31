import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Line = ({ orientataion, color, width }) => {
  return (
    <View
      style={{
        backgroundColor: color,
        width: orientataion == "horizontal" ? "100%" : width,
        height: orientataion == "vertical" ? "100%" : width,
      }}
    ></View>
  );
};

export default Line;

const styles = StyleSheet.create({});

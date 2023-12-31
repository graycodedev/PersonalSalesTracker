import { View, Text } from "react-native";
import React from "react";

const Warning = ({ text }) => {
  return <>{text && <Text style={{ color: "red" }}>{text}</Text>}</>;
};

export default Warning;

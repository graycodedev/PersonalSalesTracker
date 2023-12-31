import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { TopBackgroundIcon } from "./IconsAll";
import { Colors } from "../screens/style/Theme";
export const TopBackground = ({}) => {
  return (
    <View>
      <TopBackgroundIcon style={{ height: 100, color: Colors.primary }} />
    </View>
  );
};

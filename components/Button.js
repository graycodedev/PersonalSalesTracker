import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";

import { TouchableOpacity } from "react-native";
import { Button } from "galio-framework"; //remove galio framework button and use ButtonPrimary later
import {
  TextViewStyle,
  TextBoxStyle,
  ButtonViewStyle,
} from "../screens/style/index";
import { Colors } from "../screens/style/Theme";
class ArButton extends React.Component {
  render() {
    const { small, shadowless, children, color, style, ...props } = this.props;

    const colorStyle = color && Colors[color.toUpperCase()];

    const buttonStyles = [
      small && styles.smallButton,
      color && { backgroundColor: colorStyle },
      !shadowless && styles.shadow,
      { ...style },
    ];

    return (
      <Button
        style={buttonStyles}
        shadowless
        textStyle={{ fontSize: 12, fontWeight: "700" }}
        {...props}
      >
        {children}
      </Button>
    );
  }
}

ArButton.propTypes = {
  small: PropTypes.bool,
  shadowless: PropTypes.bool,
  color: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "default",
      "primary",
      "secondary",
      "info",
      "error",
      "success",
      "warning",
    ]),
  ]),
};

const styles = StyleSheet.create({
  smallButton: {
    width: 75,
    height: 28,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});

export const ButtonPrimary = ({ title, style, icon }) => {
  const btnStyles = [ButtonViewStyle.Primary, { ...style }];

  return <View style={btnStyles}>
    {icon && icon}
    <Text style={{
      fontFamily: "Regular",
      textAlign: "center",
      fontSize: 16, color: "#fff",
    }}>{title}</Text></View>;
};
export default ArButton;

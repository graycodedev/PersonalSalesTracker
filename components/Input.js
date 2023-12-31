import React from "react";
import PropTypes from "prop-types";
import { Input } from "galio-framework";
import Icon from "./Icon";
import { TextBoxStyle } from "../screens/style/index";
import { Colors } from "../screens/style/Theme";
export class ArInput extends React.Component {
  render() {
    const { shadowless, success, error, keyboardType } = this.props;

    return (
      <Input
        type={keyboardType}
        placeholder="write something here"
        placeholderTextColor={Colors.muted}
        style={TextBoxStyle.WithBorder}
        color={Colors.HeadingColor}
        iconContent={
          <Icon
            size={14}
            color={Colors.primary}
            name="link"
            family="AntDesign"
          />
        }
        {...this.props}
      />
    );
  }
}
//export default ArInput;

export class InputText extends React.Component {
  render() {
    const { shadowless, success, error, keyboardType, editable } = this.props;
    return (
      <Input
        editable={editable}
        type={keyboardType}
        placeholder="write something here"
        placeholderTextColor={Colors.muted}
        style={TextBoxStyle.WithBorder}
        // iconContent={
        //   <Icon
        //     size={14}
        //     color={Colors.primary}
        //     name="link"
        //     family="AntDesign"
        //   />
        // }
        {...this.props}
      />
    );
  }
}
export class RegularInputText extends React.Component {
  render() {
    const { shadowless, success, error, keyboardType } = this.props;
    const inputStyles = [{ ...this.props.style }, TextBoxStyle.BorderLess];
    return (
      <Input
        type={keyboardType}
        placeholder="write something here"
        placeholderTextColor={Colors.muted}
        style={inputStyles}
        {...this.props}
      />
    );
  }
}
export class AmountInputText extends React.Component {
  render() {
    const { shadowless, success, error, keyboardType } = this.props;

    return (
      <Input
        keyboardType="numeric"
        maxLength={6}
        fontSize={38}
        Keyboradty
        placeholder="write something here"
        placeholderTextColor={Colors.muted}
        style={{
          borderRadius: 10,
          height: 100,
          borderWidth: 0,
          backgroundColor: "#fff",
          color: "#AEB9CA",
          fontFamily: "Medium",
        }}
        {...this.props}
      />
    );
  }
}

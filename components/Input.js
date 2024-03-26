import React from "react";
import { TextBoxStyle } from "../screens/style/index";
import { Colors } from "../screens/style/Theme";
import { TextInput, View, Text } from "react-native";
export class ArInput extends React.Component {
  render() {
    const { shadowless, success, error, keyboardType } = this.props;

    return (
      <TextInput
        type={keyboardType}
        placeholder="write something here"
        placeholderTextColor={Colors.muted}
        style={TextBoxStyle.WithBorder}
        color={Colors.HeadingColor}
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
export default ArInput;

export class InputText extends React.Component {
  render() {
    const { shadowless, success, error, keyboardType, editable } = this.props;
    return (
      <ArInput
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
  constructor(props) {
    super(props);
    this.state = {
      isEmpty: false,
    };
  }

  handleInputChange = (text) => {
    this.setState({ isEmpty: text === "" });
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
  };

  render() {
    const { shadowless, success, error, keyboardType } = this.props;
    const inputStyles = [
      { ...this.props.style },
      TextBoxStyle.BorderLess,
      this.state.isEmpty || this.props.error ? { borderColor: "red" } : {},
    ];
    return (
      <View style={[{backgroundColor:"#ffffff", paddingHorizontal: 4,marginBottom: 8 }, { ...this.props.boxStyle }]}>
        <TextInput
          type={keyboardType}
          placeholder="write something here"
          placeholderTextColor={Colors.muted}
          style={inputStyles}
          onChangeText={this.handleInputChange}
          {...this.props}
        />
        {(this.state.isEmpty || this.props.error) && (
          <Text style={{ color: "red", fontSize: 12, backgroundColor: 'rgba(0, 0, 0, 0)' }}>
            Please fill the input field
          </Text>
        )}
      </View>
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


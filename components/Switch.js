import React from "react";
import { Switch, Platform } from "react-native";
import { Colors } from "../screens/style/Theme";

class MkSwitch extends React.Component {
  render() {
    const { value, ...props } = this.props;
    const thumbColor =
      Platform.OS === "ios"
        ? null
        : Platform.OS === "android" && value
        ? Colors.switchOn
        : Colors.switchOff;

    return (
      <Switch
        value={value}
        thumbColor={thumbColor}
        ios_backgroundColor={Colors.switchOff}
        trackColor={{
          false: Colors.switchOn,
          true: Colors.switchOff,
        }}
        {...props}
      />
    );
  }
}

export default MkSwitch;

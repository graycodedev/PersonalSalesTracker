import React from "react";
import { StyleSheet,Text,View,TouchableOpacity } from "react-native";
import { TextViewStyle, TextBoxStyle ,ButtonViewStyle} from "../screens/style/index";
export const ButtonPrimary =({title,style})=> {
    const btnStyles = [
        ButtonViewStyle.Primary,
        {...style}
      ];
  
    return (
      <Text 
        style={btnStyles}
      >
        {title}
      </Text>
    );
}

export const ButtonKey = ({ onPress, title, size, backgroundColor }) => {
   return <TouchableOpacity
        onPress={onPress}
        style={ButtonViewStyle.PinButtonContainer}
    >
        <Text style={ButtonViewStyle.PinButtnoStyle}>
            {title}
        </Text>
    </TouchableOpacity>
}
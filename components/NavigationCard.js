import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as SVG from "../components/BankingIcons";
import { Colors, TEXT } from "../screens/style/Theme";

const NavigationCard = ({ icon, title, body, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon}
        <View style={{ marginLeft: 16 }}>
          <Text style={TEXT.normal.regular.large}>{title}</Text>
          <Text style={TEXT.light.regular.small}>{body}</Text>
        </View>
      </View>
      <SVG.ArrowIcon fill={Colors.primary} />
    </TouchableOpacity>
  );
};

export default NavigationCard;

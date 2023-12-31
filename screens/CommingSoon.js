import React from "react";
import { StyleSheet, Text, View, TouchableOpacity ,ScrollView} from "react-native";
import { Colors } from "./style/Theme";
export const CommingSoon = ({ title, style, data, message }) => {
  const lableStyle = [styles.label, { ...style }];
  return (
    <ScrollView style={{ width: "100%", backgroundColor: "#eee" }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, justifyContent: "flex-start", margin: 0 }}>
        <View style={styles.headerBackGround} />
        <Text style={styles.text}>This service will be available soon.</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerBackGround: {
    width: "100%",
    height: 100,
    backgroundColor: Colors.primary,
    position: 'absolute',
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  ScrollView
} from "react-native";
import api from "../constants/Api";

const OfferScreen = (props) => {
  const item = props.route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.image} source={{ uri: api.BaseUrl + item.image }} />
      <View style={styles.textView}>
        <Text style={styles.text}> {item.desc}</Text>
      </View>
    </ScrollView>
  );
};
export default OfferScreen;
const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    paddingTop: 20,
  },
  textView: {
    width: "95%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  image: {
    minHeight: "30%",
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
  },
  text: {
    fontSize: 20,
    marginTop: 20,
    textAlign: "justify",
  },
});

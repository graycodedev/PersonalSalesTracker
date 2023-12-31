import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ServiceContainer from "../../components/ServiceContainer";
import Api from "../../constants/Api";

export default function Television(props) {
  const sourceNavigation = props.navigation;
  const tv = [
    {
      navigation: "DishHome",
      name: "DishHome",
      imgSource: {
        uri: Api.ServerImages.TV.DishHome,
      },
    },
    {
      navigation: "PrabhuTV",
      name: "Prabhu",
      imgSource: {
        uri: Api.ServerImages.TV.PrabhuTV,
      },
    },
    {
      navigation: "SkyTV",
      name: "Sky TV",
      imgSource: {
        uri: Api.ServerImages.TV.SkyTV,
      },
    },
    {
      navigation: "SimTV",
      name: "Sim TV",
      imgSource: {
        uri: Api.ServerImages.TV.SimTV,
      },
    },
    {
      navigation: "MeroTV",
      name: "Mero TV",
      imgSource: {
        uri: Api.ServerImages.TV.MeroTV,
      },
    },
    {
      navigation: "ClearTV",
      name: "Clear TV",
      imgSource: {
        uri: Api.ServerImages.TV.ClearTV,
      },
    },
    {
      navigation: "MaxTV",
      name: "Max TV",
      imgSource: {
        uri: Api.ServerImages.TV.MaxTV,
      },
    },
  ];
  return (
    <View style={styles.container}>
      {tv.map((item, index) => {
        return (
          <ServiceContainer
            key={index}
            navigation={item.navigation}
            name={item.name}
            imgSource={item.imgSource}
            sourceNavigation={sourceNavigation}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
});

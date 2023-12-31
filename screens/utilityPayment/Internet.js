import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ServiceContainer from "../../components/ServiceContainer";
import Api from "../../constants/Api";

export default function Internet(props) {
  const sourceNavigation = props.navigation;
  const internets = [
    {
      navigation: "WorldLink",
      name: "Worldlink",
      imgSource: {
        uri: Api.ServerImages.Internet.Worldlink,
      },
    },
    {
      navigation: "Vianet",
      name: "Vianet",
      imgSource: {
        uri: Api.ServerImages.Internet.Vianet,
      },
    },
    {
      navigation: "Pokhara Internet",
      name: "Pokhara Internet",
      imgSource: {
        uri: Api.ServerImages.Internet.PokharaInternet,
      },
    },
    {
      navigation: "Classic Tech",
      name: "Classic Tech",
      imgSource: {
        uri: Api.ServerImages.Internet.Classictech,
      },
    },
    {
      navigation: "Arrownet",
      name: "Arrownet",
      imgSource: {
        uri: Api.ServerImages.Internet.Arrownet,
      },
    },
    {
      navigation: "Royal Network",
      name: "Royal Network",
      imgSource: {
        uri: Api.ServerImages.Internet.RoyalNetwork,
      },
    },
  ];
  return (
    <View style={styles.container}>
      {internets.map((item, index) => {
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

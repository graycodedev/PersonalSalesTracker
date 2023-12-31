import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ServiceContainer from "../../components/ServiceContainer";
import Api from "../../constants/Api";

export default function Internet(props) {
  const sourceNavigation = props.navigation;
  const insurances = [
    {
      navigation: "Reliance",
      name: "Reliance Insurance",
      imgSource: {
        uri: Api.ServerImages.Insurance.Reliance,
      },
    },
    {
      navigation: "Nepal Life",
      name: "Nepal Life Insurance",
      imgSource: {
        uri: Api.ServerImages.Insurance.NepalLife,
      },
    },
    {
      navigation: "Prime Life",
      name: "Prime Life Insurance",
      imgSource: {
        uri: Api.ServerImages.Insurance.PrimeLife,
      },
    },
    {
      navigation: "Jyoti Life",
      name: "Jyoti Life Insurance",
      imgSource: {
        uri: Api.ServerImages.Insurance.JyotiLife,
      },
    },
    {
      navigation: "Surya Life",
      name: "Surya Life Insurance",
      imgSource: {
        uri: Api.ServerImages.Insurance.SuryaLife,
      },
    },
    {
      navigation: "Union Life",
      name: "Union Life Insurance",
      imgSource: {
        uri: Api.ServerImages.Insurance.UnionLife,
      },
    },
    {
      navigation: "Mahalaxmi Life",
      name: "Mahalaxmi Life Insurance",
      imgSource: {
        uri: Api.ServerImages.Insurance.MahalaxmiLife,
      },
    },
    {
      navigation: "Sagarmatha",
      name: "Sagarmatha Insurance",
      imgSource: {
        uri: Api.ServerImages.Insurance.Sagarmatha,
      },
    },
  ];
  return (
    <View style={styles.container}>
      {insurances.map((item, index) => {
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

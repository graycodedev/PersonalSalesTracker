import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import ServiceContainer from "../../components/ServiceContainer";
import Api from "../../constants/Api";

export default function ServiceList(props) {
// const items= [
//     {
//         navigation: "CommunityWaterPayment",
//         name: "Community Khanepani",
//         imgSource: {
//           uri: Api.ServerImages.Insurance.Reliance,
//         },
//       }
// ]

let {items, title}= props.route.params; 
useEffect(()=>{
    props.navigation.setOptions({
        title: title,
      });
}, [])
  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        return (
          <ServiceContainer
            key={index}
            navigation={item.navigation}
            name={item.name}
            imgSource={item?.imgSource}
            sourceNavigation={props.navigation}
            svg={item?.svg}
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

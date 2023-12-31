import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";

const ServiceContainer = ({
  sourceNavigation,
  navigation,
  name,
  imgSource,
  svg
}) => {
  return (
    <View style={styles.serviceContainer}>
      <TouchableOpacity
        onPress={() => {
          sourceNavigation.navigate(`${navigation}`);
        }}
        style={styles.touchableArea}
      >
        {svg ? svg :  <Image
          style={{ width: 90, height: 115 }}
          source={imgSource}
          resizeMode={"contain"}
        />}
       
      </TouchableOpacity>
      <Text style={[styles.serviceName, { textAlign: "center" }]}>{name}</Text>
    </View>
  );
};

export default ServiceContainer;

const styles = StyleSheet.create({
  serviceContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 105,
    height: 130,
    marginBottom: 20,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
  },
  touchableArea: {
    width: 105,
    height: 105,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});

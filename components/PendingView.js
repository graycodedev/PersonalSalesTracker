import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TopBackgroundIcon } from "./IconsAll";
export const PendingView = ({ title, style, data, message }) => {
  const lableStyle = [styles.label, { ...style }];

  return (
    <View>
      <View>
        <TopBackgroundIcon
          style={{ position: "absolute" }}
          preserveAspectRatio="none"
          width="100%"
        />
      </View>

      <Text
        style={[
          {
            fontWeight: "700",
            fontSize: 20,
            color: "#fff",
            marginLeft: 30,
            marginTop: 60,
          },
        ]}
      >
        {title}
      </Text>
      <View style={styles.card}>
        {data.map(function(item, index) {
          return (
            <View style={[styles.row, item.styleRow]}>
              <Text style={[styles.label, item.styleLabel]}>{item.label}</Text>
              <Text style={[styles.value, item.styleValue]}>{item.value}</Text>
            </View>
          );
        })}
        <View>
          <Text>{message}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingBottom: 5,
    margin: 20,
    paddingStart: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-between",
    padding: 10,
  },
  value: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
  label: {
    color: "#000",
  },
});

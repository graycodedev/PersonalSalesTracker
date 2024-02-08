import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  ImageStore,
  TouchableOpacity
} from "react-native";
import React from "react";
import { useState } from "react/cjs/react.development";
import IMAGES from "../../constants/newImages";
import { StackActions } from "@react-navigation/native";
import * as BankingIcons from "../../components/BankingIcons";
import { Colors } from "../style/Theme";

const Settings = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.options}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.navButtons}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BankingIcons.KeyIcon
                  style={styles.image}
                  fill={Colors.primary}
                />
                <Text style={styles.optionText}>Change Password</Text>
              </View>
              <Pressable>
               <BankingIcons.ArrowIcon style={{marginRight: 12}} />
              </Pressable>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Fingerprint")}>
            <View style={styles.navButtons}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BankingIcons.FingerPrintIcon
                  style={styles.image}
                  fill={Colors.primary}
                />
                <Text style={styles.optionText}>Setup Your Fingerprint</Text>
              </View>
              <Pressable>
               <BankingIcons.ArrowIcon style={{marginRight: 12}} />
              </Pressable>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  options: {
    justifyContent: "space-evenly",
    alignSelf: "center",
    width: "90%",
  },
  navButtons: {
    height: 48,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 4,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  anOption: { flexDirection: "row", alignItems: "center" },

  image: { marginLeft: 22.5, marginRight: 12 },

  optionText: { color: "#232323", fontSize: 16, fontWeight: "bold" },
  signOut: {
    backgroundColor: "red",
    height: 48,
    width: 312,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    alignSelf: "center",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    alignSelf: "center",
  },
});

export default Settings;

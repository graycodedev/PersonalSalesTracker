import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  ImageStore,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState } from "react/cjs/react.development";
import IMAGES from "../constants/newImages";
import * as BankingIcons from "../components/BankingIcons";
import ProfileHeader from "../components/profileHeader";
import { Colors } from "./style/Theme";
import Api from "../constants/Api";
import tokenManager from "../config/TokenManager";
import SignIn from "../screens/general/SignIn";
import { StackActions } from "@react-navigation/native";
import * as info from "../app.json";

const Profile = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <ProfileHeader navigation={navigation} />
        </View>
        <View style={styles.options}>
          <TouchableOpacity onPress={() => navigation.navigate("View Profile")}>
            <View style={styles.navButtons}>
              <View style={styles.anOption}>
                <BankingIcons.ChangeProfileIcon
                  style={styles.image}
                  fill={Colors.primary}
                />
                <Text style={styles.optionText}>View Profile</Text>
              </View>
              <Pressable style={{ marginRight: 18 }}>
                <BankingIcons.ArrowIcon />
              </Pressable>
            </View>
          </TouchableOpacity>
          {/* <View style={styles.navButtons}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BankingIcons.PromoCodeIcon style={styles.image} />
              <Text style={styles.optionText}>Promo code </Text>
            </View>
            <Pressable>
              <Image source={IMAGES.arrowIcon} style={{ marginRight: 18 }} />
            </Pressable>
          </View> */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.navButtons}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <Image source={IMAGES.securityCodeIcon} style={styles.image} /> */}
                <BankingIcons.KeyIcon
                  style={styles.image}
                  fill={Colors.primary}
                />
                <Text style={styles.optionText}>Change Password</Text>
              </View>
              <Pressable style={{ marginRight: 18 }}>
                <BankingIcons.ArrowIcon />
              </Pressable>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <View style={styles.navButtons}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <BankingIcons.SettingIcon
                  style={styles.image}
                  fill={Colors.primary}
                />
                <Text style={styles.optionText}>Settings</Text>
              </View>
              <Pressable style={{ marginRight: 18 }}>
                <BankingIcons.ArrowIcon />
              </Pressable>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButtons}
            onPress={() =>
              navigation.navigate("WebViewScreen", {
                Title: "Terms of Sevices",
                Url: Api.TermsOfServices,
              })
            }
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <BankingIcons.FileIcon
                style={styles.image}
                fill={Colors.primary}
              />
              <Text style={styles.optionText}>Terms of Services</Text>
            </View>
            <Pressable style={{ marginRight: 18 }}>
              <BankingIcons.ArrowIcon />
            </Pressable>
          </TouchableOpacity>
          <View style={styles.navButtons}>
            <View
              style={{
                marginHorizontal: 25,
              }}
            >
              <Text>App Version: {info.expo.version}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.signOut}
          onPress={async () => {
            tokenManager.clearAndRestoreNewToken().then(() => {
              navigation.dispatch(StackActions.replace("SignIn"));
              navigation.replace("SignIn");
            });
          }}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },
  options: {
    marginBottom: 24,
    alignSelf: "center",
    width: "85%",
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

  image: { marginLeft: 22.4, marginRight: 12 },

  optionText: { color: "#232323", fontSize: 16, fontFamily: "SemiBold" },
  signOut: {
    backgroundColor: "red",
    height: 48,
    width: "85%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 15,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: "Bold",
    color: "#FFFFFF",
    alignSelf: "center",
  },
});

export default Profile;

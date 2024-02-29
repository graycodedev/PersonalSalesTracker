import {
  View,
  Text,
  Linking,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import AppStyles from "../../assets/theme/AppStyles";
import { ButtonPrimary } from "../../components/Elements";
import * as Location from "expo-location";
import FavouriteStyles from "../style/favouriteStyle";
import { Colors } from "../style/Theme";

const PermissionScreen = (props) => {
  let permission = {
    title: "Enable Location Permission",
    subtitle:
      "To use the application you need to provide location permission. You can always change permission from settings.",
  };
  const onGivePermission = async () => {
    let permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      Linking.openSettings();
      return;
    }
    props.navigation.navigate("Home");
  };
  return (
    <View
      style={[
        FavouriteStyles.container,
        { backgroundColor: "white", justifyContent: "space-between", flex: 1 },
      ]}
    >
      <View></View>
      <View>
        <Image
          style={{
            width: 200,
            height: 200,
            alignSelf: "center",
            resizeMode: "center",
          }}
          source={require("../../assets/icon.png")}
        />
        <View style={{ marginTop: 8 }}>
          <Text
            style={[
              AppStyles.Text.BoldTitle,
              { alignSelf: "center", fontSize: 20 },
            ]}
          >
            {permission.title}
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 16,
              color: "gray",
              alignSelf: "center",
              textAlign: "center",
              marginTop: 6,
            }}
          >
            {permission.subtitle}
          </Text>
        </View>
      </View>

      <View>
        <TouchableOpacity
          onPress={async () => await onGivePermission()}
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
            backgroundColor: Colors.primary,
            borderRadius: 4,
          }}
        >
          <Text
            style={{ color: "white", fontSize: 18, fontFamily: "SemiBold" }}
          >
            Give Permissions{" "}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PermissionScreen;

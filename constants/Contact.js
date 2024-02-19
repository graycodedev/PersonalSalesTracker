import { Platform, Linking } from "react-native";

export const Contact={
    MakeCall:async function MakeCall(phoneNumber){
      if (Platform.OS === "android") {
        phoneNumber = "tel:${" + phoneNumber + "}";
      } else {
        phoneNumber = "telprompt:${" + phoneNumber + "}";
      }
      Linking.openURL(phoneNumber);
    }
}
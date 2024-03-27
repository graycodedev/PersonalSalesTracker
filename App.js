// import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef} from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Platform, 
  AppRegistry, SafeAreaView
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import Screens from "./navigation/Screens";
import DeviceStorage from "./config/DeviceStorage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import ToastMessage from "./components/Toast/Toast";
import helpers from "./constants/Helpers";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


export default function App() {
  // const LOCATION_TASK_NAME = "background-location-task";
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [navigation, setNavigation] = useState(null);
  const [devicePushToken, setDevicePushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const [firstTrip, setFirstTrip] = useState();
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const loadFonts = async () => {
    let customFonts = {
      Bold: require("./assets/font/opensans/OpenSans-Bold.ttf"),
      BoldItalic: require("./assets/font/opensans/OpenSans-BoldItalic.ttf"),
      ExtraBold: require("./assets/font/opensans/OpenSans-ExtraBold.ttf"),
      Italic: require("./assets/font/opensans/OpenSans-Italic.ttf"),
      Light: require("./assets/font/opensans/OpenSans-Light.ttf"),
      Medium: require("./assets/font/opensans/OpenSans-Medium.ttf"),
      Regular: require("./assets/font/opensans/OpenSans-Regular.ttf"),
      SemiBold: require("./assets/font/opensans/OpenSans-SemiBold.ttf"),
      SemiBoldItalic: require("./assets/font/opensans/OpenSans-SemiBoldItalic.ttf"),
    };

    await Font.loadAsync(customFonts);
    setAssetsLoaded(true);
  };

  const runOperationsInOrder = async () => {
    await loadFonts();
    //  registerForPushNotificationsAsync().then(async([deviceToken]) => {
    //    setDevicePushToken(deviceToken);
    //     await DeviceStorage.saveKey("FcmToken", deviceToken);
    //  });
    setNavigation(routeNameRef.current);
    
  };

  useEffect(() => {
    runOperationsInOrder()
      .then(() => {
      })
      .catch((error) => {
      });
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        navigationRef.current.navigate("Notifications");
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          if (response.notification.request.trigger != null) {
            await DeviceStorage.saveKey("navigateToNotification", "true");
            navigationRef.current.navigate("Notifications", {
              data: note,
            });
          } else {
            navigationRef.current.navigate("Notifications", {
              data: note,
            });
          }
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    
    };
  }, []);

  return assetsLoaded == true ? (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
        setNavigation(navigationRef.current);
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
        }
        // Save the current route name for later comparision
        routeNameRef.current = currentRouteName;
        DeviceStorage.saveKey("currentScreen", currentRouteName);
      }}
    >
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={"dark-content"}
      />
<Screens currentScreen={routeNameRef.current} />
    </NavigationContainer>
 
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <ActivityIndicator size={"large"} /> */}
      {/* <Text style={{ marginTop: 10 }}>Please Wait ...</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  //paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    backgroundColor: "#fff",
  },
});


const registerForPushNotificationsAsync = async () => {

  try{
  let token;
  let deviceToken;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert("Failed to get push token for push notification!");
      return [undefined, undefined];
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  return [token, deviceToken];}
  catch(error){
    await helpers.PostException(error)
    ToastMessage.Short(error)
  }
};


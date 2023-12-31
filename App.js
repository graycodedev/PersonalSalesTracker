// import { StatusBar } from 'expo-status-bar';
import React, { useImperativeHandle } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import Screens from "./navigation/Screens";
import DeviceStorage from "./config/DeviceStorage";
import * as Notifications from "expo-notifications";
import { Notification } from "expo-notifications";
import Constants from "expo-constants";
import IdleTimer from "./components/IdleTimer";
import IdleTimerPopUP from "./components/IdleTimerPopUp";
import helpers from "./constants/Helpers";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetsLoaded: false,
      devicePushToken: "",
      notification: null,
      expoPushToken: "",
      navigation: null,
      routeNameRef: {},
      navigationRef: {},
      idleTimerPop: false,
    };
    this.setState({ navigation: this.state.routeNameRef.current });
  }
  handleTimeout = async () => {
    if ((await DeviceStorage.getKey("currentScreen")) != "SignIn") {
      this.setState({ idleTimerPop: true });
    }
  };

  registerForPushNotificationsAsync = async () => {
    let token;
    let deviceToken;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
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
      deviceToken = await (await Notifications.getDevicePushTokenAsync()).data;
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

    return [token, deviceToken];
  };
  async componentDidMount() {
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

    this.setState({ assetsLoaded: true });
    // dont uncomment these
    // React.useImperativeHandle();
    // this.routeNameRef = React.createRef();
    // this.navigationRef = React.createRef();
    this.notificationListener = React.createRef();
    this.responseListener = React.createRef();

    this.registerForPushNotificationsAsync().then(([token, deviceToken]) => {
      this.setState({ expoPushToken: token });
      this.setState({ devicePushToken: deviceToken });
      DeviceStorage.saveKey("FcmToken", this.state.devicePushToken);
    });

    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        this.setState({ notification: notification });
      }
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        if (response) {
          var note = response.notification;
        }
        if (this.state.navigation.getCurrentRoute().name == "SignIn") {
          return;
        } else {
          this.state.navigation.navigate("Notifications", {
            data: note,
          });
        }
      }
    );
  }

  componentWillUnmount() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  render() {
    const { assetsLoaded } = this.state;

    if (assetsLoaded) {
      return (
        <NavigationContainer
          ref={this.state.navigationRef}
          onReady={() => {
            this.state.routeNameRef.current = this.state.navigationRef.current.getCurrentRoute().name;
            this.setState({
              navigation: this.state.navigationRef.current,
            });
          }}
          onStateChange={() => {
            const previousRouteName = this.state.routeNameRef.current;
            const currentRouteName = this.state.navigationRef.current.getCurrentRoute()
              .name;

            if (previousRouteName !== currentRouteName) {
            }
            // Save the current route name for later comparision
            this.state.routeNameRef.current = currentRouteName;
            DeviceStorage.saveKey("currentScreen", currentRouteName);
          }}
        >
          
          <Screens currentScreen={this.state.routeNameRef.current} />
        </NavigationContainer>
      );
    }
    if (!assetsLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator />
          <StatusBar barStyle="light-content" backgroundColor={"black"} />
        </View>
      );
    }
  }
}

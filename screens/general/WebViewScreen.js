import React, { useRef, useEffect } from "react";
import { View, BackHandler, StatusBar, ScrollView, Text } from "react-native";
import { WebView } from "react-native-webview";
import Api from "../../constants/Api";
import utils from "../../components/utils";
import { Colors } from "../style/Theme";
import DeviceStorage from "../../config/DeviceStorage";
const WebViewScreen = (props) => {
  const { Title, Url,Payment, OnBackNavigation } = props.route.params;
  const webViewRef = useRef(null);

  useEffect(() => {
    props.navigation.setOptions({
      title: Title,
      headerShown: !Payment ? true : false,
    });
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);

  const handleBackButton = async () => {
    if (Payment)
      await DeviceStorage.saveKey(
        utils.StorageConstants.IsPaymentPolling,
        "false"
      );
    if (OnBackNavigation) props.navigation.navigate(OnBackNavigation);
  };

  return (
    <ScrollView
    nestedScrollEnabled
    contentContainerStyle={{ flexGrow: 1 }}
    style={{ paddingTop: StatusBar.currentHeight }}
  >
      {Payment && (
        <View
          style={{
            marginTop: Platform.OS == "android" ? StatusBar.height : 0,
            paddingVertical: 8,
            backgroundColor: Colors.primary,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "white", fontFamily: "Bold" }}>
            {Title}
          </Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{
          uri: Url,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </ScrollView>
  );
};
export default WebViewScreen;

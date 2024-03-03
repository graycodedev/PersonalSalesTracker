import React, { useEffect, useState } from "react";
import { Button, Image, View } from "react-native";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import tokenManager from "../../config/TokenManager";
import DeviceStorage from "../../config/DeviceStorage";
import helpers from "../../constants/Helpers";
import * as SecureStore from "expo-secure-store";
import api from "../../constants/Api";
import qs from "qs";

const MainScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigate();
  }, []);

  const navigate = async () => {
    let data = {};
    try {
      var user = await helpers.GetUserInfo();
      var isChecked = await DeviceStorage.getKey("enableRememberMe");
      if (isChecked == "true" && user != undefined && user != null) {
        await tokenManager.clearAndRestoreNewToken();
        var userData = await secureStoreGet();
        data = {
          clientId: 1,
          CompanyId: 1,
          CompanyCode: userData.companyCode,
          SecretKey: 1,
          Username: userData.email,
          Password: userData.password,
        };
        await SignInRemembered(data);
      } else {
        props.navigation.navigate("SignIn");
      }
    } catch (error) {
      await helpers.PostException(error);
      ToastMessage.Short("Error Occurred. Contact Support");
    }
  };

  const SignInRemembered = async (data) => {
    setIsLoading(true);
    var response = await (await request())
      .post(api.Login, qs.stringify(data))
      .catch(function (error) {
        setIsLoading(false);
        console.log("kkk");
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined && response.data != undefined) {
      if (response.data.Code == 200) {
        var userInfo = {
          Id: response.data.Data.User.IdentityUserId,
          Email: response.data.Data.User.Email,
          UserName: response.data.Data.User.UserName,
          PhoneNumber: data.UserName,
          FullName:
            response.data.Data.User.FirstName +
            " " +
            response.data.Data.User.LastName,
          BranchId: response.data.Data.User.BranchId,
          CompanyId: response.data.Data.User.CompanyId,
          ProfilePicture: response.data.Data.User.ProfilePicture,
        };

        await DeviceStorage.saveKey("token", response.data.Data.User.Token);
        await DeviceStorage.saveKey(
          "refreshtoken",
          response.data.Data.User.RefreshToken
        );
        await DeviceStorage.saveKey("UserInfo", JSON.stringify(userInfo));
        props.navigation.navigate("Home");
      } else {
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const secureStoreGet = async () => {
    try {
      const credentials = await SecureStore.getItemAsync("mbuser");
      if (credentials) {
        const myJson = JSON.parse(credentials);
        return {
          email: myJson.email,
          password: myJson.password,
          companyCode: myJson.companyCode,
        };
      }
    } catch (e) {}
  };

  return (
    <View style={{ backgroundColor: "#ffffff", flex: 1 }}>
      <Image
        source={require("../../assets/loader2.gif")}
        style={[
          {
            resizeMode: "contain",
            flex: 1,
            alignSelf: "center",
          },
        ]}
      />
    </View>
  );
};

export default MainScreen;

import React from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
  View,
  ScrollView,
  Alert,
  BackHandler,
  TouchableHighlight,
  Platform,
  Image,
  Linking,
  StatusBar,
  Modal,
  TextInput,
  Button,
  Pressable,
  TouchableOpacity,
  Text, 
  Keyboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome5";
import qs from "qs";
import api from "../../constants/Api";
import {
  TopBackgroundIcon,
  WalkThoughBg,
  WalletImage,
  TransferMoneyImage,
  SecurityImage,
  MobileImage,
  FinanceImage,
} from "../../components/IconsAll";
const { width, height } = Dimensions.get("screen");
import { TextViewStyle, TextBoxStyle, ButtonViewStyle } from "../style/index";
import { StackActions } from "@react-navigation/native";
import AppIntroSlider from "react-native-app-intro-slider";
import tokenManager from "../../config/TokenManager";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import DeviceStorage from "../../config/DeviceStorage";
import { FingerPrint } from "../../components/IconsAll";
import * as LocalAuthentication from "expo-local-authentication";
import { Colors } from "../style/Theme";
import * as SecureStore from "expo-secure-store";
import helpers from "../../constants/Helpers";
import checkVersion from "react-native-store-version";
import IMAGES from "../../constants/newImages";
import Spinner from "react-native-loading-spinner-overlay";
import * as BankingIcons from "../../components/BankingIcons";
import AppConfig from "../../config/AppConfig";
import * as Device from "expo-device";
import * as info from "../../app.json";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";


class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: "",
      password: "",
      rememberMe: false,
      emailError: "",
      passwordError: "",
      showRealApp: true,
      showWalkThrough: false,
      authenticated: false,
      modalVisible: false,
      failedCount: 0,
      secureStoreExist: false,
      isBiometricEnabled: false,
      showPassword: false,
      isChecked: false,
      offers: [],
      logoPath: "",
      fcmToken: "",
      device: "",
      noticeModal: false,
      noticeImage: [],
      allowRegisterFromApp: false,
      companiesDetailList: [],
      showdropDown: false,
      selectedCooperativeDetail: null,
      savedCompanyDetail: false,
      companyChooseError: "",
      dropDownCompanySelected: false,
      alertMessage: "",
      companyCode: "",
      companyCodeError:"",
      loggingIn: true,
      keyboardVisible:false,
    };
  }
  getAppVersion = async () => {
    var info = require("../../app.json");
    var localVersion = info.expo.version;
    var appLink = AppConfig.CompanyConfig.AndroidAppUrl;
    try {
      const check = await checkVersion({
        version: localVersion, // app local version
        androidStoreURL: appLink, //app link
      });

      if (check.result === "new") {
        // if app store version is new
        Alert.alert(
          "Please Update Your App",
          "A newer version of the app is availabe in the Play Store, Please update your app.",
          [
            {
              text: "Update",
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(appLink);
              },
            },
            {
              text: "Cancel",
            },
          ]
        );
      }
    } catch (e) {}
  };

  static navigationOptions = (props) => {
    return {
      gesturesEnabled: false,
    };
  };

  componentDidMount = async () => {
    this.props.navigation.setOptions({
      title: "",
    });
    // this.getDeviceToken();
    let status = await AsyncStorage.getItem("WalkThrough");
    if (status === "done") {
      this.setState({ showRealApp: true });
    }
    var isBiometricEnabled = await DeviceStorage.getKey("BiometricEnabled");
    this.setState({
      isBiometricEnabled:
        isBiometricEnabled == null
          ? false
          : isBiometricEnabled == "true"
          ? true
          : false,
    });
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    (async () => await this.getLocationPermission())();
    var user = await helpers.GetUserInfo();
    var isChecked = await DeviceStorage.getKey("enableRememberMe");
    if (isChecked == "true" && user != undefined && user != null) {
      var userData = await this.secureStoreGet();
      this.setState({
        email: userData.email,
        password: userData.password,
        companyCode: userData.companyCode,
        isChecked: true,
      });
    }
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        this.setState({keyboardVisible: true});
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        this.setState({keyboardVisible: false});
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  };

  getLocationPermission = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      this.props.navigation.navigate("PermissionScreen", {showSignIn: true, type: "location"});
      return;
    }
  };

  getDeviceToken = async () => {
    var deviceToken = await DeviceStorage.getKey("FcmToken");
    var deviceInfo =
      Device?.brand +
      "-" +
      Device?.designName +
      "-" +
      Device?.manufacturer +
      "-" +
      Device?.modelName;
    this.setState({ device: deviceInfo, fcmToken: deviceToken });
  };
  getOffers = async () => {
    var response = await (await request())
      .get(api.Offers.SignIn)
      .catch(function(error) {
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ offers: response.data.Data });
      } else {
        ToastMessage.Short("Error Loading Offers");
      }
    } else {
      ToastMessage.Short("Error Loading Offers");
    }
  };
  getNotice = async () => {
    var response = await (await request())
      .get(api.Offers.Modal)
      .catch(function(error) {
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ noticeImage: response.data.Data });
        if (response.data.Data.length > 0) {
          this.setState({ noticeModal: true });
        }
      }
    } else {
    }
  };
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  secureStoreGet = async () => {
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

  secureStoreSave = async () => {
    const { email, password, companyCode } = this.state;
    const credentials = { email, password, companyCode };
    try {
      await SecureStore.setItemAsync("mbuser", JSON.stringify(credentials));

      this.setState({ email: "", password: "", companyCode: "" });
    } catch (e) {}
  };

  clearSecureStore = async () => {
    // try {
    //   await SecureStore.deleteItemAsync('mbuser');
    //   this.setState({ email: '', password: '' });
    // } catch (e) {
    // }
  };
  handleBackButton = async () => {
    var currentScreen = await DeviceStorage.getKey("currentScreen");
    if (currentScreen == "SignIn" || currentScreen == "Home") {
      Alert.alert(
        "Exit App",
        "Exiting the application?",

        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              tokenManager.clearAndRestoreNewToken().then(() => {
                BackHandler.exitApp();
              });
            },
          },
        ],
        {
          cancelable: false,
        }
      );
      return true;
    } else {
      if (this.props.navigation.canGoBack()) {
        this.props.navigation.dispatch(CommonActions.goBack());
        return true;
      }
    }
  };
  static navigationOptions = () => ({
    drawerLockMode: "locked-closed",
  });
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  clearState = () => {
    this.setState({ authenticated: false, failedCount: 0 });
  };

  scanFingerPrint = async () => {
    try {
      let results = await LocalAuthentication.authenticateAsync();
      if (results.success) {
        this.setState({
          modalVisible: false,
          authenticated: true,
          failedCount: 0,
        });
        var userData = await this.secureStoreGet();

        if (
          userData == undefined ||
          userData == null ||
          userData.email == "" ||
          userData.password == ""
        ) {
          this.setState({
            alertMessage:
              "Unable to login with biometrics.Please login with username/password.",
          });
        } else {
          this.loginFromFingerPrint(userData);
        }
      } else {
        this.setState({
          failedCount: this.state.failedCount + 1,
        });
      }
    } catch (e) {}
  };
  _onDone = async () => {
    await AsyncStorage.setItem("WalkThrough", "done");
    this.setState({ showRealApp: true });
  };
  _onSkip = () => {
    // After user skip the intro slides. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
  };
  validateForm() {
    let isvalid = true;
    if (this.state.companyCode.trim() === "") {
      isvalid = false;
      this.setState(() => ({ companyCodeError: "Company Code is required !" }));
    }
    if (this.state.email.trim() === "") {
      isvalid = false;
      this.setState(() => ({ emailError: "Username is required !" }));
    }
    if (this.state.password.trim() === "") {
      isvalid = false;
      this.setState(() => ({ passwordError: "Password is required !" }));
    } else {
      this.setState(() => ({ passwordError: "" }));
    }

    return isvalid;
  }
  //TransferMoneyImage,SecurityImage,MobileImage,FinanceImage
  slides = [
    {
      key: "one",
      title: "Wallet",
      description:
        "Turn you account as wallet right now,You can pay any utility bills from one place.",
      //image: require("../assets/imgs/wt1.png"),
      SVG: WalletImage,
      backgroundColor: "#2ABA00",
    },
    {
      key: "two",
      title: "Transer Money",
      description: "Tranfer money to anyone with one click of your button",
      //image: require("../assets/imgs/wt1.png"),
      SVG: TransferMoneyImage,
      backgroundColor: "#2ABA00",
    },
    {
      key: "three",
      title: "Mobile Pay",
      description: "Pay with your mobile.",
      //image: require("../assets/imgs/wt1.png"),
      SVG: MobileImage,
      backgroundColor: "#2ABA00",
    },
    {
      key: "four",
      title: "Secure",
      description:
        "Don't worry about the security.We have world class top notch security system to provide you secure transactions.",
      //image: require("../assets/imgs/wt1.png"),
      SVG: SecurityImage,
      backgroundColor: "#2ABA00",
    },
  ];
  _renderSlideItem = ({ item }) => {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 0.4 }}>
          {/* <Image source={item.image} /> */}
          <item.SVG height="100%" width="90%" />
        </View>
        <View style={{ flex: 0.6, backgroundColor: "#fff" }}>
          <WalkThoughBg preserveAspectRatio="none" height="100%" width="100%" />
          <View
            height="100%"
            width="100%"
            style={{
              alignItems: "center",
              position: "absolute",
            }}
          >
            <View style={{ marginTop: "15%" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Bold",
                  color: "#656565",
                }}
              >
                {item.title}
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                padding: 20,
                marginLeft: 50,
                marginRight: 50,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Light",
                  color: "#9A9A9A",
                  textAlign: "center",
                }}
              >
                {item.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  _renderSkipButton = () => {
    return <View></View>;
  };
  _renderNextButton = () => {
    return (
      <View style={[styles.buttonCircle, { backgroundColor: Colors.primary }]}>
        <Icon name="angle-right" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={[styles.buttonCircle, { backgroundColor: Colors.primary }]}>
        <Icon name="check" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };
  render() {
    if (this.state.showRealApp) {
      //Real Application
      return (
        <KeyboardAvoidingView
      style={[{flex: 1, backgroundColor:"#ffffff"}, { top: this.state.keyboardVisible ? -120 : 0 }]}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      enabled={Platform.OS === "ios" ? true : false}
    >
          <Spinner
            color={Colors.primary}
            visible={this.state.isLoading}
            textContent={"Signing In..."}
            textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
          />
          <View
            style={{
              width: "100%",
              backgroundColor: "#fff",
            }}
            contentContainerStyle={{ paddingBottom: 15 }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ height: 180, width: 180 }}>
                <Image
                  style={{
                    marginTop: 20,
                    alignSelf: "center",
                    resizeMode: "contain",
                    height: 180,
                    width: 180,
                  }}
                  source={require("../../assets/AppLogo.png")}
                />
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ fontSize: 24, marginTop: 10, fontFamily: "Bold" }}
                >
                  Welcome
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: 30,
                    fontFamily: "Regular",
                  }}
                >
                  Sign in to continue
                </Text>
              </View>
            </View>

            <View style={{ marginHorizontal: 24 }}>
              <Text style={{ fontSize: 13, fontFamily: "SemiBold", marginBottom: 2}}>
                Company Code
              </Text>
              <View style={{marginBottom: 6}}>
                <TextInput
                  placeholder=""
                  style={styles.input}
                  maxLength={10}
                  onChangeText={(text) => this.setState({ companyCode: text })}
                  value={this.state.companyCode}
                />
              </View>
              {this.state.companyCodeError != "" && (
                <Text style={{ color: "red" }}>{this.state.companyCodeError}</Text>
              )}
              <Text style={{ fontSize: 13, fontFamily: "SemiBold",marginBottom: 2 }}>
                Username
              </Text>
              <View style={{marginBottom: 6}}>
                <TextInput
                  placeholder=""
                  style={styles.input}
                  maxLength={10}
                  onChangeText={(email) => this.setState({ email })}
                  keyboardType="numeric"
                  value={this.state.email}
                />
              </View>
              {this.state.emailError != "" && (
                <Text style={{ color: "red" }}>{this.state.emailError}</Text>
              )}
              <Text style={{ fontSize: 13, fontFamily: "SemiBold",marginBottom: 2 }}>
                Password
              </Text>
              {!this.state.showPassword && (
                <View>
                  <TextInput
                    style={styles.input}
                    password
                    autoCapitalize="none"
                    placeholder=""
                    onChangeText={(password) => this.setState({ password })}
                    secureTextEntry={true}
                    value={this.state.password}
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingRight: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ showPassword: true });
                      }}
                    >
                      <Icon
                        style={{ color: "#CCCCCC" }}
                        name="eye"
                        size={20}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {this.state.showPassword && (
                <View>
                  <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingRight: 5,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ showPassword: false });
                      }}
                    >
                      <Icon
                        style={{ color: "#CCCCCC" }}
                        name="eye-slash"
                        size={20}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              <Text style={{ color: "red" }}>{this.state.passwordError}</Text>
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 24,
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginRight: 5,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    value={this.state.isChecked}
                    onPress={() => {
                      this.state.isChecked
                        ? this.setState({ isChecked: false })
                        : this.setState({ isChecked: true });
                    }}
                  >
                    <View style={styles.rememberUnCheck}></View>
                    {this.state.isChecked && (
                      <View
                        style={[
                          styles.rememberChecked,
                          { backgroundColor: Colors.primary },
                        ]}
                      >
                        <Image
                          source={IMAGES.VectortickMark}
                          style={{ tintColor: "white" }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    value={this.state.isChecked}
                    onPress={() => {
                      this.state.isChecked
                        ? this.setState({ isChecked: false })
                        : this.setState({ isChecked: true });
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>Remember Me</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ForgotPassword");
                  }}
                >
                  <Text style={{ fontSize: 12, color: Colors.primary }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: Colors.primary },
                ]}
                onPress={() => {
                  if (this.validateForm()) {
                    this.SignIn();
                  }
                }}
              >
                <Text style={{ color: "white", fontSize: 14 }}>LOGIN</Text>
              </TouchableOpacity>
              {this.state.isBiometricEnabled && (
                <View
                  style={{
                    alignSelf: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                    onPress={() => {
                      this.clearState();
                      this.scanFingerPrint();
                    }}
                  >
                    <BankingIcons.FingerPrintIcon fill={"black"} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "SemiBold",
                        marginLeft: 10,
                      }}
                    >
                      Use fingerprint to Sign in
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {this.state.failedCount > 0 && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 14,
                    fontFamily: "Regular",
                    marginTop: 5,
                    textAlign: "center",
                  }}
                >
                  Failed to Authenticate, Please Try Again!
                </Text>
              )}
            </View>
            <View>
              <View style={{ alignSelf: "center" }}>
                <TouchableOpacity
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onPress={() => this.props.navigation.navigate("Register")}
                >
                  <Text
                    style={{
                      color: Colors.primary,
                      marginVertical: 10,
                      fontSize: 14,
                      fontFamily: "SemiBold",
                    }}
                  >
                    Request a demo
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontSize: 12, marginRight: 5 }}>
                  version: {info.expo.version}
                </Text>
              </View>
            </View>
          </View>

          <Modal visible={this.state.noticeModal} transparent>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => this.setState({ noticeModal: false })}
            >
              <Pressable
                onPress={() => {
                  if (this.state.noticeImage.HasLink == true) {
                    Linking.openURL(this.state.noticeImage.LinkUrl);
                    this.setState({ noticeModal: false });
                  } else {
                    this.props.navigation.navigate("OfferScreen", {
                      title: this.state.noticeImage?.Title,
                      image: api.BaseUrl + this.state.noticeImage?.ImageUrl,
                      desc: this.state.noticeImage?.ShortDescription,
                    });
                    this.setState({ noticeModal: false });
                  }
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 10,
                  maxWidth: Dimensions.get("window").width - 10,
                  maxHeight: Dimensions.get("window").height - 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ noticeModal: false })}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    backgroundColor: "#fff",
                    position: "absolute",
                    right: 10,
                    top: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>X</Text>
                </TouchableOpacity>
              </Pressable>
            </Pressable>
          </Modal>
        </KeyboardAvoidingView>
      );
    } else {
      //Intro slides
      return (
        <AppIntroSlider
          // dotStyle={{backgroundColor:"#2FBB07",opacity:0.4}}
          activeDotStyle={{
            backgroundColor: Colors.primary,
            opacity: 1,
          }}
          renderItem={this._renderSlideItem}
          data={this.slides}
          renderDoneButton={this._renderDoneButton}
          renderNextButton={this._renderNextButton}
          renderSkipButton={this._renderSkipButton}
          //comming from the JsonArray below
          onDone={this._onDone}
          //Handler for the done On last slide
          showSkipButton={true}
          onSkip={this._onSkip}
        />
      );
    }
  }
  loginFromFingerPrint = async (userData) => {
    this.setState({ isLoading: true });
    var data = qs.stringify({
      CompanyCode: userData.companyCode,
      SecretKey: api.SecretKey,
      Username: userData.email,
      Password: userData.password,
      Device: this.state.device,
      FcmToken: this.state.fcmToken,
    });

    var response = await (await request())
      .post(api.Login, data)
      .catch(function(error) {
        this.setState({ alertMessage: "Error Ocurred Contact Support" });
      });

    if (response != undefined) {
      if (response.data.Code == 200) {
        var userInfo = {
          Id: response.data.Data.User.IdentityUserId,
          Email: response.data.Data.User.Email,
          UserName: response.data.Data.User.UserName,
          PhoneNumber: response.data.Data.User.PhoneNumber,
          FullName:
            response.data.Data.User.FirstName +
            " " +
            response.data.Data.User.LastName,
          BranchId: response.data.Data.User.BranchId,
          CompanyId: response.data.Data.User.CompanyId,
          ProfilePicture: response.data.Data.User.ProfilePicture,
        };
        //saving new user token on login
        await DeviceStorage.saveKey("token", response.data.Data.User.Token);
        await DeviceStorage.saveKey(
          "refreshtoken",
          response.data.Data.User.RefreshToken
        );
        // userInfo.PhoneNumber="9851031769";
        await DeviceStorage.saveKey("UserInfo", JSON.stringify(userInfo));
        this.props.navigation.replace("Home");
      } else {
        ToastMessage.Short("Could not login using fingerprint");
      }
    } else {
      this.setState({ isLoading: false });
      this.setState({ alertMessage: response.data.Message });
    }
    this.setState({ isLoading: false });
  };

  SignInRemembered = async (data) => {
    this.setState({ isLoading: true });
    var response = await (await request())
      .post(api.Login, qs.stringify(data))
      .catch(function(error) {
        this.setState({ isLoading: false });
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined && response.data != undefined) {
      if (response.data.Code == 200) {
        var userCache = await helpers.GetUserInfo();
        if (userCache != null && userCache.PhoneNumber != this.state.email) {
          DeviceStorage.deleteKey("UserAccountsInfo");
        }
        this.secureStoreSave();
        var userInfo = {
          Id: response.data.Data.User.IdentityUserId,
          Email: response.data.Data.User.Email,
          UserName: response.data.Data.User.UserName,
          PhoneNumber: this.state.email,
          FullName:
            response.data.Data.User.FirstName +
            " " +
            response.data.Data.User.LastName,
          BranchId: response.data.Data.User.BranchId,
          CompanyId: response.data.Data.User.CompanyId,
          ProfilePicture: response.data.Data.User.ProfilePicture,
        };

        //saving new user token on login

        await DeviceStorage.saveKey(
          "enableRememberMe",
          this.state.isChecked ? "true" : "false"
        );
        await DeviceStorage.saveKey("token", response.data.Data.User.Token);
        await DeviceStorage.saveKey(
          "refreshtoken",
          response.data.Data.User.RefreshToken
        );
        await DeviceStorage.saveKey("UserInfo", JSON.stringify(userInfo));
        if (!this.state.savedCompanyDetail) {
          await DeviceStorage.saveKey(
            "CompanyDetail",
            JSON.stringify(this.state.selectedCooperativeDetail)
          );
          await DeviceStorage.saveKey("SavedCompanyDetail", "true");
        }
        this.props.navigation.replace("Home");
      } else {
        this.setState({ alertMessage: response.data.Message });
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
      this.setState({ isLoading: false });
    }
    this.setState({ isLoading: false });
  };

  SignIn = async () => {
    this.setState({ isLoading: true });
    var data;
    data = qs.stringify({
      CompanyCode: this.state.companyCode,
      Username: this.state.email,
      Password: this.state.password,
      Device: this.state.device,
      FcmToken: this.state.fcmToken,
    });
  
    var response = await (await request())
      .post(api.Login, data)
      .catch(function(error) {
        this.setState({ isLoading: false });
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined && response.data != undefined) {
      if (response.data.Code == 200) {
        var userCache = await helpers.GetUserInfo();
        if (userCache != null && userCache.UserName != this.state.email) {
          DeviceStorage.deleteKey("UserAccountsInfo");
        }
        this.secureStoreSave();
        var userInfo = {
          Id: response.data.Data.User.IdentityUserId,
          Email: response.data.Data.User.Email,
          UserName: response.data.Data.User.UserName,
          PhoneNumber: this.state.email,
          FullName: response.data.Data.User.FirstName +" " +response.data.Data.User.LastName,
          BranchId: response.data.Data.User.BranchId,
          CompanyId: response.data.Data.User.CompanyId,
          ProfilePicture: response.data.Data.User.ProfilePicture,
        };


        await DeviceStorage.saveKey(
          "enableRememberMe",
          this.state.isChecked ? "true" : "false"
        );
        await DeviceStorage.saveKey("token", response.data.Data.User.Token);
        await DeviceStorage.saveKey(
          "refreshtoken",
          response.data.Data.User.RefreshToken
        );
        await DeviceStorage.saveKey("SignedOut", "false");
        await DeviceStorage.saveKey("UserInfo", JSON.stringify(userInfo));
        if (!this.state.savedCompanyDetail) {
          await DeviceStorage.saveKey(
            "CompanyDetail",
            JSON.stringify(this.state.selectedCooperativeDetail)
          );
          await DeviceStorage.saveKey("SavedCompanyDetail", "true");
        }
        this.props.navigation.replace("Home");
      } else {
        this.setState({ alertMessage: response.data.Message });
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
      this.setState({ isLoading: false });
    }
    this.setState({ isLoading: false });
  };
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
  },
  modal: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  buttonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  signInContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  socialConnect: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA",
  },
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  activityIndicator: {
    position: "absolute",
    left: 0,
    right: 25,
    top: 0,
    bottom: 0,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rememberUnCheck: {
    marginRight: 8,
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "grey",
    borderWidth: 0.5,
  },
  rememberChecked: {
    marginRight: 8,
    width: 20,
    height: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "grey",
    borderWidth: 0.5,
    position: "absolute",
  },
  input: {
    height: 40,
    borderColor: "#EEEEEE",
    borderRadius: 4,
    borderWidth: 2,
    padding: 5,
    fontSize: 13,
    fontFamily: "SemiBold",
  },
  loginButton: {
    marginButtom: 24,
    borderRadius: 4,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SignIn;

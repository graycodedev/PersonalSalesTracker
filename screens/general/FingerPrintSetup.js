import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Text,
  Switch,
} from "react-native";
import { TopBackgroundIcon } from "../../components/IconsAll";
import { TextViewStyle } from "../style/index";
import ToastMessage from "../../components/Toast/Toast";
const { width, height } = Dimensions.get("screen");
import { Colors } from "../style/Theme";
import DeviceStorage from "../../config/DeviceStorage";
import * as LocalAuthentication from "expo-local-authentication";
class FingerPrintSetup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      enableBiometrics: false,
      hasFp: false,
      deviceHasBiometrics: false,
    };
  }
  enableBiometrics = false;
  componentDidMount = async () => {
    let bb = await DeviceStorage.getKey("BiometricEnabled");
    this.setState({ enableBiometrics: bb == "true" ? true : false });
    let xx = await LocalAuthentication.hasHardwareAsync();
    this.setState({ deviceHasBiometrics: xx });
    if (xx) {
      let hasFp = await LocalAuthentication.isEnrolledAsync();
      this.setState({ hasFp: hasFp });
    }
  };
  changeEnableFPLogin = async (v) => {
    const { deviceHasBiometrics, hasFp } = this.state;
    if (deviceHasBiometrics == true && hasFp == true) {
      this.setState({ enableBiometrics: v });
      await DeviceStorage.saveKey("BiometricEnabled", v.toString());
      ToastMessage.Short("You can login using biometrics now onwards");
    }
    if (deviceHasBiometrics == false) {
      ToastMessage.Short("Your device doesn't support this feature.");
      return;
    }
    if (hasFp == false) {
      ToastMessage.Short("Add fingerprints to your device from settings.");
      return;
    }
  };
  render() {
    const isEnabled = true;
    const { enableBiometrics } = this.state;
    return (
      <ScrollView style={{ width: "100%", backgroundColor: Colors.backGround }}>
        {/* <View>
          <TopBackgroundIcon
            style={{ position: "absolute" }}
            preserveAspectRatio="none"
            width="100%"
          />
        </View> */}
        <View style={styles.headerBackGround} />
        {/* <Text
          style={[
            TextViewStyle.PageHeader,
            {
              marginLeft: 30,
              marginTop: 110,
            },
          ]}
        >
          Biometrics Settings
        </Text> */}
        <View 
        style={{
          margin: 20, 
          top: - 60, 
          flexDirection: "column",
          backgroundColor: 'white', 
          borderRadius: 4, 
          padding: 10 
        }}
        >
          
          <View>
            <Text
              style={{
                fontFamily: "Regular",
                fontSize: 15,
                color: "#2F2F2F",
              }}
            >
              Enabling fingerprint/biometrics login will allow to login anyone
              who has fingerprint/passcode/faceid registered within device.
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: Colors.HeadingColor,
                fontFamily: "Regular",
                fontSize: 16,
                alignSelf: 'center', 
                fontWeight: 'bold',
              }}
            >
              Fingerprint Login({enableBiometrics ? "Enabled" : "Disabled"})
            </Text>
            <Switch
              trackColor={{ false: "#eee", true: "#eee" }}
              thumbColor={isEnabled ? Colors.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.changeEnableFPLogin}
              value={enableBiometrics}
            />
          </View>
          <View style={{ backgroundColor: "#eee", marginTop:5 }}>
            {this.state.deviceHasBiometrics == false && (
              <Text
                style={{
                  fontFamily: "Light",
                  fontSize: 15,
                  color: "#4F4F4F"
                }}
              >
                your device doesn't support biometrics.
              </Text>
            )}
            {this.state.hasFp == false && (
              <Text
                style={{
                  fontFamily: "Light",
                  fontSize: 14,
                  color: "#4F4F4F"
                }}
              >
                Please enter fingerprints on your device from settings.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  headerBackGround:{
    width: "100%",
    height: 100, 
    backgroundColor:Colors.primary, 
  },
  inputIcons: {
    marginRight: 12,
    color: "#1194F4",
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
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
});

export default FingerPrintSetup;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import DeviceStorage from "../../config/DeviceStorage";
import { ButtonPrimary } from "../../components/Button";
import Icon from "react-native-vector-icons/FontAwesome5";
import { InputText, RegularInputText } from "../../components/Input";
import api, { endPoints } from "../../constants/Api";
import qs from "qs";
import { Colors } from "../style/Theme";
import IMAGES from "../../constants/newImages";
import * as BankingIcons from "../../components/BankingIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ChangePin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userId: 0,
      pinSetup: false,
      oldPin: "",
      pincode: "",
      repincode: "",
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Change Pin",
    });
    this.GetUserInfo();
  }
  GetUserInfo = async () => {
    const user = await AsyncStorage.getItem("UserInfo");
    if (user != null) {
      const u = JSON.parse(user);
      this.setState(
        {
          fullName: u.FullName,
          memberId: u.UserName,
          userId: u.Id,
          PhoneNumber: u.PhoneNumber,
        },
        () => {}
      );
    }
  };
  ChangeUserPin = async () => {
    if (this.state.pincode.length == 0) {
      ToastMessage.Short("Please enter pin code");
      return;
    }
    if (this.state.oldPin.length == 0) {
      ToastMessage.Short("Please enter current pin code");
      return;
    }
    if (this.state.repincode.length == 0) {
      ToastMessage.Short("Please enter re-pin code");
      return;
    }
    if (this.state.repincode.length != 4) {
      ToastMessage.Short("Please enter 4 digit code");
      return;
    }
    if (this.state.repincode != this.state.pincode) {
      ToastMessage.Short("retype pin code does not match");
      return;
    }
    if (this.state.oldPin == this.state.pincode) {
      ToastMessage.Short("old pin and new pin can't be same");
      return;
    }
    if (this.state.pincode == this.state.repincode) {
      var data = qs.stringify({
        UserId: this.state.userId,
        OldPin: this.state.oldPin,
        PinCode: this.state.pincode,
        PinCodeType: "transactional",
      });
      var response = await (await request()).post(
        endPoints.ChangeUserPin,
        data
      );
      if (response != undefined) {
        if (response.data.Code === 200) {
          if (response.data.Data) {
            ToastMessage.Short("Pincode changed successfully");
            this.props.navigation.replace("Home");
          } else {
            ToastMessage.Short(response.data.Message);
          }
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short("Server responded with error");
      }
    } else {
      ToastMessage.Short("Mis matched retyped pin");
    }
  };
  render() {
    return (
      <View style={styles.container}>
        {/* <Image source={IMAGES.registerEllipse} style={{ width: "100%" }} /> */}
        {/* <BankingIcons.ScreenHeaderRegisterIcon fill= {Colors.primary} width="100%" /> */}
        <View style={styles.headerBackGround} />
        <View style={styles.box}>
          <View style={styles.topText}>
            <Text style={{ fontSize: 24 }}>Change Pin</Text>
          </View>
          <View style={{ marginBottom: 31 }}>
            <View style={styles.imageBackground}></View>
            {/* <Image source={IMAGES.passwordSet} /> */}
            <BankingIcons.passwordIcon fill={Colors.primary} />
          </View>
          <View style={{ marginBottom: 24, marginHorizontal: 20 }}>
            <View style={styles.inputBox}>
              <TextInput
                password
                placeholder="Current pin code"
                keyboardType="numeric"
                maxLength={4}
                Keyboradty
                onChangeText={(oldPin) => this.setState({ oldPin: oldPin })}
                style={{ width: "110%" }}
              />
            </View>
            <View style={styles.inputBox}>
              <TextInput
                password
                placeholder="Type 4 digit pin"
                keyboardType="numeric"
                maxLength={4}
                Keyboradty
                onChangeText={(pin) => this.setState({ pincode: pin })}
                style={{ width: "110%" }}
              />
            </View>

            {/* <Text style={styles.alert}>{this.state.newPasswordError}</Text> */}
            <View style={[styles.inputBox, { marginBottom: -10 }]}>
              <TextInput
                password
                placeholder="ReType pin"
                keyboardType="numeric"
                maxLength={4}
                Keyboradty
                onChangeText={(repin) => this.setState({ repincode: repin })}
                style={{ width: "110%" }}
              />
            </View>
          </View>
          <View style={{ margin: 10, alignItems: "center" }}>
            <View>
              <Text>Remember your pin,you'll need it during transactions.</Text>
            </View>
            <View style={styles.submitButton}>
              <TouchableOpacity onPress={this.ChangeUserPin}>
                <Text style={styles.changePasswordText}>Change Pin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  headerBackGround: {
    width: "100%",
    height: "45%",
    backgroundColor: Colors.primary,
  },
  box: {
    width: "90%",
    backgroundColor: "white",
    position: "absolute",
    alignItems: "center",
    shadowColor: "red",
    shadowRadius: 5,
    padding: 20,
    height: 500,
    marginTop: "15%",
  },
  topText: {
    marginTop: 10,
    marginBottom: "10%",
  },
  imageBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F5F5F5",
    position: "absolute",
    marginTop: 23,
  },
  submitButton: {
    marginTop: 10,
    width: 240,
    height: 36,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignSelf: "center",
  },
  changePasswordText: {
    alignSelf: "center",
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  iconStyles: {
    color: "#CCCCCC",
  },
  inputBox: {
    height: 40,
    // width: Dimensions.get("window").width - 60,
    width: "90%",
    backgroundColor: "white",
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderRadius: 4,
    borderColor: "#e2e2e2",
    borderWidth: 2,
    marginBottom: 20,
  },
  alert: {
    color: "red",
    marginHorizontal: "10%",
  },
  inputBoxes: {
    height: "45%",
    justifyContent: "space-evenly",
  },
});

export default ChangePin;

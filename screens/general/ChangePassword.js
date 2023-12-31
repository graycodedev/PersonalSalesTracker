import React from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import qs from "qs";
import { Images } from "../../constants";
import api from "../../constants/Api";
import { TopBackgroundIcon } from "../../components/IconsAll";
import { TextViewStyle } from "../style/index";
import { ButtonPrimary } from "../../components/Elements";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import helpers from "../../constants/Helpers";
import { Colors } from "../style/Theme";
import IMAGES from "../../constants/newImages";
import * as BankingIcons from "../../components/BankingIcons";
const { width, height } = Dimensions.get("screen");

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      oldPassword: "",
      newPassword: "",
      confirmPassowrd: "",
      oldPasswordError: "",
      newPasswordError: "",
      confirmPasswordError: "",
      oldPasswordShown: false,
      newPasswordShown: false,
      confirmPasswordShown: false,
    };
  }
  validateForm() {
    let isvalid = true;
    if (this.state.oldPassword.trim() === "") {
      isvalid = false;
      this.setState(() => ({ oldPasswordError: "Old password is required !" }));
    } else {
      this.setState(() => ({ oldPasswordError: null }));
    }
    if (this.state.newPassword.trim() === "") {
      isvalid = false;
      this.setState(() => ({ newPasswordError: "New password is required !" }));
    } else {
      this.setState(() => ({ newPasswordError: null }));
    }
    if (this.state.confirmPassowrd.trim() === "") {
      isvalid = false;
      this.setState(() => ({
        confirmPasswordError: "Confirm password is required !",
      }));
    } else {
      if (this.state.newPassword != this.state.confirmPassowrd) {
        isvalid = false;
        this.setState(() => ({
          confirmPasswordError: "New password and confirm password must match",
        }));
      } else {
        this.setState(() => ({ confirmPasswordError: null }));
      }
    }
    return isvalid;
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Image source={IMAGES.registerEllipse} style={{ width: "100%" }} /> */}
        {/* <BankingIcons.ScreenHeaderRegisterIcon fill= {Colors.primary} width="100%" /> */}
        <View style={styles.headerBackGround} />
        <View style={styles.box}>
          <View style={styles.topText}>
            <Text style={{ fontSize: 24 }}>Change password</Text>
          </View>
          <View style={{ marginBottom: 31 }}>
            <View style={styles.imageBackground}></View>
            {/* <Image source={IMAGES.passwordSet} /> */}
            <BankingIcons.passwordIcon fill={Colors.primary} />
          </View>
          <View style={{ marginBottom: 24, marginHorizontal: 20 }}>
            <View style={styles.inputBox}>
              <TextInput
                secureTextEntry={!this.state.oldPasswordShown}
                autoCapitalize="none"
                placeholder="Old Password"
                onChangeText={(oldPassword) => this.setState({ oldPassword })}
                value={this.state.oldPassword}
                style={{ width: "80%" }}
              />

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    oldPasswordShown: !this.state.oldPasswordShown,
                  });
                }}
              >
                {this.state.oldPasswordShown == true ? (
                  <Ionicons
                    name="ios-eye"
                    size={20}
                    style={styles.iconStyles}
                  />
                ) : (
                  <Ionicons
                    name="ios-eye-off"
                    size={20}
                    style={styles.iconStyles}
                  />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.alert}>{this.state.oldPasswordError}</Text>
            <View style={styles.inputBox}>
              <TextInput
                secureTextEntry={!this.state.newPasswordShown}
                autoCapitalize="none"
                placeholder="New Password"
                onChangeText={(newPassword) => this.setState({ newPassword })}
                value={this.state.newPassword}
                style={{ width: "80%" }}
              />

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    newPasswordShown: !this.state.newPasswordShown,
                  });
                }}
              >
                {this.state.newPasswordShown == true ? (
                  <Ionicons
                    name="ios-eye"
                    size={20}
                    style={styles.iconStyles}
                  />
                ) : (
                  <Ionicons
                    name="ios-eye-off"
                    size={20}
                    style={styles.iconStyles}
                  />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.alert}>{this.state.newPasswordError}</Text>
            <View style={styles.inputBox}>
              <TextInput
                secureTextEntry={!this.state.confirmPasswordShown}
                autoCapitalize="none"
                placeholder="Confirm Password"
                onChangeText={(confirmPassowrd) =>
                  this.setState({ confirmPassowrd })
                }
                value={this.state.confirmPassowrd}
                style={{ width: "80%" }}
              />

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    confirmPasswordShown: !this.state.confirmPasswordShown,
                  });
                }}
              >
                {this.state.confirmPasswordShown == true ? (
                  <Ionicons
                    name="ios-eye"
                    size={20}
                    style={styles.iconStyles}
                  />
                ) : (
                  <Ionicons
                    name="ios-eye-off"
                    size={20}
                    style={styles.iconStyles}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.alert}>{this.state.confirmPasswordError}</Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (this.validateForm()) {
                this.setState({ isLoading: true });
                this.ChangePassword();
              }
            }}
          >
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>
          <ActivityIndicator
            animating={this.state.isLoading}
            color="#ffa500"
            style={styles.activityIndicator}
          ></ActivityIndicator>
        </View>
      </View>
    );
  }

  ChangePassword = async () => {
    const userId = (await helpers.GetUserInfo()).Id;
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      clientId: companyId,
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      UserId: userId,
      OldPassword: this.state.oldPassword,
      NewPassword: this.state.newPassword,
      ConfirmPassword: this.state.confirmPassowrd,
      DeviceId: 1,
      // Expo.Constants.deviceId,
    });

    var response = await (await request())
      .post(api.ChangePassword, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response.data.Code == 200) {
      this.setState({ isLoading: false });
      ToastMessage.Short(response.data.Message);
      this.props.navigation.navigate("SignIn");
    } else {
      ToastMessage.Short(response.data.Message);
    }
    this.setState({ isLoading: false });
  };
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
    height: 500,
    backgroundColor: "white",
    position: "absolute",
    marginTop: "20%",
    alignItems: "center",
    shadowColor: "red",
    shadowRadius: 5,
  },
  topText: {
    marginTop: 36,
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
    width: "90%",
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
    // width: "90%",
    backgroundColor: "white",
    marginLeft: "auto",
    // marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 4,
    borderColor: "#e2e2e2",
    borderWidth: 2,
  },
  alert: {
    color: "red",
    marginHorizontal: "10%",
  },
});

export default ChangePassword;

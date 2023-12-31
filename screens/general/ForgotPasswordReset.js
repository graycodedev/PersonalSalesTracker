import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ToastAndroid,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import qs from "qs";
import request from "../../config/RequestManager";
import api from "../../constants/Api";
import { InputText } from "../../components/Input";
import { ButtonPrimary } from "../../components/Elements";
import ToastMessage from "../../components/Toast/Toast";
import helpers from "../../constants/Helpers";
const { width, height } = Dimensions.get("screen");
class ForgotPasswordReset extends React.Component {
  constructor(props) {
    super(props);
    var { phoneNumber } = this.props.route.params;

    this.state = {
      isLoading: false,
      code: "",
      codeError: "",
      resendCodeCount: 0,
      phoneNumber: phoneNumber,
      phoneNumberError: "",
      password: "",
      passwordError: "",
      confirmPassword: "",
      confirmPasswordError: "",
    };
  }
  componentDidMount = async () => {
    this.props.navigation.setOptions({
      title: "Set New Password",
    });
  };
  validateForm() {
    let isvalid = true;
    if (this.state.phoneNumber.trim() === "") {
      isvalid = false;
      this.setState(() => ({ phoneNumberError: "Phone no is required !" }));
    } else {
      if (this.state.phoneNumber.length != 10) {
        isvalid = false;
        this.setState(() => ({ phoneNumberError: "Invalid Phone Number." }));
      }
    }
    if (this.state.code.trim() === "") {
      isvalid = false;
      this.setState(() => ({ codeError: "Input OTP Code !" }));
    } else {
      this.setState(() => ({ codeError: null }));
    }
    if (this.state.password.trim() == "") {
      isvalid = false;
      this.setState(() => ({ passwordError: "Password is required !" }));
    }
    if (this.state.confirmPassword.trim() == "") {
      isvalid = false;
      this.setState(() => ({
        confirmPasswordError: "Confirm Password is required !",
      }));
    }
    if (this.state.password.trim() != this.state.confirmPassword.trim()) {
      isvalid = false;
      this.setState(() => ({
        confirmPasswordError: "Passowrd and confirm password don't match !",
      }));
    }
    return isvalid;
  }

  render() {
    const display = this.props.route.params.phoneNumber == "" ? "flex" : "none";
    return (
      <ScrollView style={{ width: "100%", backgroundColor: "#fff" }}>
        <View style={{ marginTop: 10, margin: 30, flexDirection: "column" }}>
          <KeyboardAvoidingView>
            <View style={{ display }}>
              <InputText
                placeholder="phone number"
                keyboardType="numeric"
                onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                value={this.state.phoneNumber}
                iconContent={
                  <Icon size={16} name="phone" style={styles.inputIcons} />
                }
              />
              <Text style={{ color: "red" }}>
                {this.state.phoneNumberError}
              </Text>
            </View>
            <View style={{ marginBottom: 2 }}>
              <InputText
                keyboardType="numeric"
                placeholder="code"
                onChangeText={(code) => this.setState({ code })}
                value={this.state.code}
                iconContent={
                  <Icon size={16} name="eye" style={styles.inputIcons} />
                }
              />
              <Text style={{ color: "red" }}>{this.state.codeError}</Text>
            </View>
            <View style={{ marginBottom: 2 }}>
              <InputText
                password
                placeholder="password"
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                iconContent={
                  <Icon size={16} name="lock" style={styles.inputIcons} />
                }
              />
              <Text style={{ color: "red" }}>{this.state.passwordError}</Text>
            </View>
            <View style={{ marginBottom: 2 }}>
              <InputText
                password
                placeholder="confirm password"
                onChangeText={(confirmPassword) =>
                  this.setState({ confirmPassword })
                }
                value={this.state.confirmPassword}
                iconContent={
                  <Icon size={16} name="lock" style={styles.inputIcons} />
                }
              />
              <Text style={{ color: "red" }}>
                {this.state.confirmPasswordError}
              </Text>
            </View>
            <TouchableOpacity
              color="primary"
              onPress={() => {
                if (this.validateForm()) {
                  this.setState({ isLoading: true });
                  this.ResetPassword();
                }
              }}
            >
              <ButtonPrimary title={"Reset"} />
              {
                <ActivityIndicator
                  animating={this.state.isLoading}
                  color="#ffa500"
                  style={styles.activityIndicator}
                ></ActivityIndicator>
              }
            </TouchableOpacity>
          </KeyboardAvoidingView>
          <Text style={{ textAlign: "center", paddingTop: 10 }}>
            Didn't receive code yet ?
          </Text>
          <TouchableOpacity
            onPress={async () => {
              this.setState({
                resendCodeCount: this.state.resendCodeCount + 1,
              });
              if (this.state.resendCodeCount > 3) {
                ToastAndroid.show(
                  "Resend code exceeds max limit (3)",
                  ToastAndroid.SHORT
                );
              } else {
                await this.ResendCode();
              }
            }}
          >
            <Text
              style={{ color: "#2FBB07", textAlign: "center", paddingTop: 10 }}
            >
              {" "}
              Resend code
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
  ResetPassword = async () => {
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      ClientId: companyId,
      SecretKey: api.SecretKey,
      PhoneNumber: this.state.phoneNumber,
      Code: this.state.code,
      Password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      CompanyId: companyId
    });
    var response = await (await request())
      .post(api.ResetPassword, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    this.setState({ isLoading: false });
    if (response != undefined) {
      if (response.data.Code == 200) {
        ToastAndroid.show("Password reset successful ", ToastAndroid.SHORT);
        this.props.navigation.navigate("SignIn");
      } else {
        ToastAndroid.show(response.data.Message, ToastAndroid.SHORT);
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
    }
  };
  ResendCode = async () => {
    let companyId = await helpers.GetCompanyId();
    let companyCode = await helpers.GetCompanyCode();
    var data = qs.stringify({
      ClientId: companyId,
      CompanyId: companyId,
      CompanyCode: companyCode,
      SecretKey: api.SecretKey,
      PhoneNumber: this.state.phoneNumber,
    });
    if (this.state.phoneNumber.trim() === "") {
      this.setState(() => ({ phoneNumberError: "Phone no is required !" }));
      return;
    } else {
      if (this.state.phoneNumber.length != 10) {
        this.setState(() => ({ phoneNumberError: "Invalid Phone Number." }));
        return;
      }
    }
    var response = await (await request())
      .post(api.ResendOtp, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response.data.Code == 200) {
      ToastAndroid.show("OTP code sent to your mobile ", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(response.data.Message, ToastAndroid.SHORT);
    }
  };
}

const styles = StyleSheet.create({
  registerContainer: {
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
  inputIcons: {
    marginRight: 12,
    color: "#1194F4",
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
  },
});

export default ForgotPasswordReset;

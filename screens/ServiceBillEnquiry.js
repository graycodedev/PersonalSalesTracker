import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as Device from "expo-device";
import { Block, Text, theme } from "galio-framework";
import qs from "qs";
import axios from "axios";
import ValidationComponent from "react-native-form-validator";
import { Button, Input } from "../components";
import { Images } from "../constants";
import api from "../constants/Api";

const { width, height } = Dimensions.get("screen");
class ServiceBillEnquiry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      deviceId: "",
      fullNameError: "",
      phoneNumberError: "",
    };
  }
  validateForm() {
    let isvalid = true;
    if (this.state.fullName.trim() === "") {
      isvalid = false;
      this.setState(() => ({ fullNameError: "Name is required !" }));
    } else {
      this.setState(() => ({ fullNameError: null }));
    }

    if (this.state.phoneNumber.trim() === "") {
      isvalid = false;
      this.setState(() => ({ phoneNumberError: "Password is required !" }));
    } else {
      if (this.state.phoneNumber.length != 10) {
        isvalid = false;
        this.setState(() => ({ phoneNumberError: "Invalid Phone Number." }));
      }
    }
    return isvalid;
  }

  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex>
                <Block flex={0.17} middle>
                  <Text color="#8898AA" size={16}>
                    Register For Mobile Banking
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                      <Input
                        key="fullname"
                        ref="fullName"
                        borderless
                        placeholder="Full Name"
                        iconContent={
                          <Icon
                            size={16}
                            name="user-alt"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(fullName) => this.setState({ fullName })}
                        value={this.state.fullName}
                      />
                      <Text style={{ color: "red" }}>
                        {this.state.fullNameError}
                      </Text>
                    </Block>
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        key="phone"
                        ref="phoneNumber"
                        keyboardType="numeric"
                        borderless
                        placeholder="Phone Number"
                        iconContent={
                          <Icon
                            size={18}
                            color={Colors.primary}
                            name="phone"
                            family="FontAwesome"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(phoneNumber) =>
                          this.setState({ phoneNumber })
                        }
                        value={this.state.phoneNumber}
                      />
                      <Text style={{ color: "red" }}>
                        {this.state.phoneNumberError}
                      </Text>
                    </Block>
                    <Block row width={width * 0.75}>
                      {/* <Checkbox
                        checkboxStyle={{
                          borderWidth: 3
                        }}
                        color={Colors.primary}
                        label="I agree with the "
                      /> */}
                      <Text
                        style={{ width: 100 }}
                        color="blue"
                        paddingLeft="10"
                        textStyle={{
                          color: Colors.primary,
                          fontSize: 14,
                        }}
                      >
                        privacy policy
                      </Text>
                    </Block>
                    <Block middle>
                      <Button
                        color="primary"
                        style={styles.createButton}
                        onPress={() => {
                          if (this.validateForm()) {
                            this.RequestMobileBanking();
                          }
                        }}
                      >
                        <Text bold size={12} color={"#fff"}>
                          REQUEST MOBILE BANKING
                        </Text>
                      </Button>
                    </Block>
                    <Block middle>
                      <Button
                        color="success"
                        style={styles.createButton}
                        onPress={() => {
                          this.props.navigation.navigate("SignIn");
                        }}
                      >
                        <Text bold size={12} color={"#fff"}>
                          PROCEED TO LOGIN
                        </Text>
                      </Button>
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }

  RequestMobileBanking = async () => {
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      clientId: companyId,
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      DeviceId: Expo.Constants.deviceId,
    });
    var response = await axios({
      method: "POST",
      url: api.MobileBankingActivation,
      data: data,
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }).catch(function(error) {
      ToastAndroid.show("Error Contact Support", ToastAndroid.SHORT);
    });

    if (response.data.Code == 200) {
      ToastAndroid.show(response.data.Message, ToastAndroid.SHORT);
      this.props.navigation.navigate("RegisterSuccess");
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

export default ServiceBillEnquiry;

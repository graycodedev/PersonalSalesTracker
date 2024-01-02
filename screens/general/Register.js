import React from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  ImageBackground,
  TextInput,
  Pressable,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { CheckBox } from "react-native-elements";
import qs from "qs";
import api from "../../constants/Api";
import { TopBackgroundIcon } from "../../components/IconsAll";
import { TextViewStyle } from "../style/index";
import { InputText } from "../../components/Input";
import { ButtonPrimary } from "../../components/Elements";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import DeviceStorage from "../../config/DeviceStorage";
import IMAGES from "../../constants/newImages";
import { Colors } from "../../screens/style/Theme";
import * as BankingIcons from "../../components/BankingIcons";
import Api from "../../constants/Api";
import helpers from "../../constants/Helpers";

const { width, height } = Dimensions.get("screen");
class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fullName: "",
      phoneNumber: "",
      deviceId: "",
      fullNameError: "",
      phoneNumberError: "",
      termsAgreed: false,
      termsError: "",
      coopTermsAgreed: false,
    };
  }
  validateForm() {
    let isvalid = true;
    if (this.state.fullName.trim() === "") {
      isvalid = false;
      this.setState(() => ({ fullNameError: "Name is Required!" }));
    } else {
      this.setState(() => ({ fullNameError: "" }));
    }

    if (this.state.phoneNumber.trim() === "") {
      isvalid = false;
      this.setState(() => ({ phoneNumberError: "Phone Number is Required!" }));
    } else {
      if (this.state.phoneNumber.length != 10) {
        isvalid = false;
        this.setState(() => ({ phoneNumberError: "Invalid Phone Number!" }));
      }
    }
    if (this.state.termsAgreed == false) {
      isvalid = false;
      this.setState(() => ({ termsError: "You need to agree to both terms!" }));
    } else {
      this.setState(() => ({ termsError: "" }));
    }
    if (this.state.coopTermsAgreed == false) {
      isvalid = false;
      this.setState(() => ({ termsError: "You need to agree to both terms!" }));
    } else {
      this.setState(() => ({ termsError: "" }));
    }

    return isvalid;
  }
  validateNumber() {
    let isvalid = true;
    this.setState(() => ({ fullNameError: "" }));
    if (this.state.phoneNumber.trim() === "") {
      isvalid = false;
      this.setState(() => ({ phoneNumberError: "Phone Number is Required!" }));
    } else {
      if (this.state.phoneNumber.length != 10) {
        isvalid = false;
        this.setState(() => ({ phoneNumberError: "invalid phone number !" }));
      }
    }
    return isvalid;
  }
  goToOTP() {
    this.props.navigation.navigate("OTPVerification", {
      phoneNumber: this.state.phoneNumber,
    });
  }

  render() {
    return (
      // <ScrollView style={{ width: "100%", backgroundColor: "#fff" }}>
      //   <View>
      //     <TopBackgroundIcon
      //       style={{ position: "absolute" }}
      //       preserveAspectRatio="none"
      //       width="100%"
      //     />
      //   </View>
      //   <Text
      //     style={[
      //       TextViewStyle.PageHeader,
      //       {
      //         marginLeft: 30,
      //         marginTop: 110,
      //         fontFamily: "Bold",
      //       },
      //     ]}
      //   >
      //     Register
      //   </Text>
      //   <View style={{ marginTop: 50, margin: 30, flexDirection: "column" }}>
      //     <KeyboardAvoidingView>
      //       <View style={{ marginBottom: 2 }}>
      //         <InputText
      //           placeholder="Full Name"
      //           onChangeText={(fullName) => this.setState({ fullName })}
      //           value={this.state.fullName}
      //           iconContent={
      //             <Icon size={16} name="user" style={styles.inputIcons} />
      //           }
      //         />
      //         <Text style={{ color: "red" }}>{this.state.fullNameError}</Text>
      //       </View>
      //       <View style={{ marginBottom: 2 }}>
      //         <InputText
      //           keyboardType="numeric"
      //           autoCapitalize="none"
      //           placeholder="Phone Number"
      //           onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
      //           value={this.state.phoneNumber}
      //           iconContent={
      //             <Icon size={16} name="phone" style={styles.inputIcons} />
      //           }
      //         />

      //         <Text style={{ color: "red" }}>
      //           {this.state.phoneNumberError}
      //         </Text>
      //       </View>

      //       <TouchableOpacity
      //         color="primary"
      //         onPress={() => {
      //           if (this.validateForm()) {
      //             this.setState({ isLoading: true });
      //             this.RequestMobileBanking();
      //           }
      //         }}
      //       >
      //         <ButtonPrimary title={"Register"} />
      //         <ActivityIndicator
      //           animating={this.state.isLoading}
      //           color="#ffa500"
      //           style={styles.activityIndicator}
      //         ></ActivityIndicator>
      //       </TouchableOpacity>
      //     </KeyboardAvoidingView>
      //     <TouchableOpacity
      //       onPress={() =>
      //         this.props.navigation.navigate("OTPVerification", {
      //           phoneNumber: "",
      //         })
      //       }
      //     >
      //       <Text
      //         style={{
      //           fontFamily: "Regular",
      //           color: Colors.primary,
      //           textAlign: "center",
      //           paddingTop: 10,
      //         }}
      //       >
      //         Already have a code{" "}
      //       </Text>
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //       onPress={() => this.props.navigation.navigate("SignIn")}
      //     >
      //       <Text
      //         style={{
      //           fontFamily: "Regular",
      //           color: Colors.primary,
      //           textAlign: "center",
      //           paddingTop: 10,
      //         }}
      //       >
      //         Go to login{" "}
      //       </Text>
      //     </TouchableOpacity>
      //   </View>
      // </ScrollView>
      <View style={styles.container}>
        {/* <Image source={IMAGES.registerEllipse} style={{ width: "100%" }} /> */}
        {/* <BankingIcons.ScreenHeaderRegisterIcon
          width="100%"
          fill={Colors.primary}
        /> */}
        <View style={styles.headerBackGround} />
        <View style={styles.circle} />
        <View style={styles.box}>
         
          <View style={{ marginBottom: 31, marginTop: 20 }}>
            <View style={styles.ringingBackGround}></View>
            <BankingIcons.MobileIcon fill={Colors.primary} />
          </View>
          {/* <View style={{ marginBottom: 2 }}>
              <InputText
                placeholder="Full Name"
                onChangeText={(fullName) => this.setState({ fullName })}
                value={this.state.fullName}
                iconContent={
                  <Icon size={16} name="user" />
                }
              />
              <Text style={{ color: "red" }}>{this.state.fullNameError}</Text>
            </View> */}
         
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              justifyContent: "center",
            }}
          >
            {/* <View style={styles.flagContainer}>
                    <Image style = {{marginLeft: 7, width: 16, height: 16}} source={IMAGES.nepalFlagIcon} />
                    <Text style = {{marginLeft: 5, fontSize: 13}}>+977</Text>
                </View> */}
            <TextInput
              style={styles.fullNameContainer}
              placeholder="Company Name"
              onChangeText={(fullName) => this.setState({ fullName })}
              value={this.state.fullName}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              justifyContent: "center",
            }}
          >
            {/* <View style={styles.flagContainer}>
                    <Image style = {{marginLeft: 7, width: 16, height: 16}} source={IMAGES.nepalFlagIcon} />
                    <Text style = {{marginLeft: 5, fontSize: 13}}>+977</Text>
                </View> */}
            <TextInput
              style={styles.fullNameContainer}
              placeholder="Contact Person Name"
              onChangeText={(fullName) => this.setState({ fullName })}
              value={this.state.fullName}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 10,
              justifyContent: "center",
            }}
          >
            {/* <View style={styles.flagContainer}>
                    <Image style = {{marginLeft: 7, width: 16, height: 16}} source={IMAGES.nepalFlagIcon} />
                    <Text style = {{marginLeft: 5, fontSize: 13}}>+977</Text>
                </View> */}
            <TextInput
              style={styles.fullNameContainer}
              placeholder="Email"
              onChangeText={(fullName) => this.setState({ fullName })}
              value={this.state.fullName}
            />
          </View>
          {this.state.fullNameError != "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {this.state.fullNameError}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 0,
              justifyContent: "center",
            }}
          >
            <View style={styles.flagContainer}>
              <Image
                style={{ marginLeft: 7, width: 16, height: 16 }}
                source={IMAGES.nepalFlagIcon}
              />
              <Text style={{ marginLeft: 5, fontSize: 13 }}>+977</Text>
            </View>
            <TextInput
              style={styles.inputContainer}
              onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              value={this.state.phoneNumber}
              keyboardType="numeric"
              maxLength={10}
              placeholder="Mobile Number"
            />
          </View>
          {this.state.phoneNumberError != "" && (
            <Text style={{ color: "red" }}>{this.state.phoneNumberError}</Text>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              marginBottom: 4
            }}
          >
            <CheckBox
              checked={this.state.termsAgreed}
              center
              title={""}
              onIconPress={() =>
                this.setState({ termsAgreed: !this.state.termsAgreed })
              }
              containerStyle={{ padding: 0, margin: 0 }}
            />
            <Text style={{ fontFamily: "Regular", fontSize: 14 }}>
              I agree to the{" "}
            </Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("WebViewScreen", {
                  Title: "Terms of Sevices",
                  Url: Api.TermsOfServices,
                })
              }
            >
              <Text
                style={{ fontFamily: "SemiBold", fontSize: 14, color: "blue" }}
              >
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <CheckBox
              checked={this.state.coopTermsAgreed}
              center
              title={""}
              onIconPress={() =>
                this.setState({ coopTermsAgreed: !this.state.coopTermsAgreed })
              }
              containerStyle={{ padding: 0, margin: 0 }}
            />
            <Text style={{ fontFamily: "Regular", fontSize: 14 }}>
              I agree to the{" "}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                let companyId = await helpers.GetCompanyId();
                this.props.navigation.navigate("WebViewScreen", {
                  Title: "Cooperative Terms",
                  Url: Api.CooperatveTermsOfServices + companyId,
                });
              }}
            >
              <Text
                style={{ fontFamily: "SemiBold", fontSize: 14, color: "blue" }}
              >
                Cooperative Terms
              </Text>
            </TouchableOpacity>
          </View> */}
          {this.state.termsError != "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {this.state.termsError}
            </Text>
          )}
          {/* <View style={{ marginBottom: 10}}><Text style={{color: 'red'}}>The phone number you entered doesn't exist.</Text>
            <Text style={{alignSelf: 'center', color:'red'}}>Renter the number</Text></View> */}
          <TouchableOpacity
            onPress={() => {
              if (this.validateForm()) {
                this.setState({ isLoading: true });
                this.RequestMobileBanking();
              }
            }}
          >
            <View style={styles.continueButton}>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 14,
                  fontFamily: "SemiBold",
                  color: "#FFFFFF",
                }}
              >
                Request a demo
              </Text>
            </View>
            <ActivityIndicator
              animating={this.state.isLoading}
              color="#ffa500"
              style={styles.activityIndicator}
            ></ActivityIndicator>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("OTPVerification", {
                phoneNumber: "",
              })
            }
          > */}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignIn")}
          >
            <Text
              style={{
                color: Colors.primary,
                textAlign: "center",
                paddingTop: 10,
                fontFamily: "SemiBold",
              }}
            >
              Go to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  RequestMobileBanking = async () => {
    var uuid = await DeviceStorage.getKey("DeviceId");
    var data = qs.stringify({
      CompanyId: api.CompanyId,
      CompanyCode: api.CompanyCode,
      SecretKey: api.SecretKey,
      FullName: this.state.fullName,
      PhoneNumber: this.state.phoneNumber,
      DeviceId: uuid,
    });
    var response = await (await request())
      .post(api.MobileBankingActivation, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined && response != null) {
      if (response.data.Code == 200) {
        await DeviceStorage.saveKey("uuid", uuid);
        this.setState({ isLoading: true });
        if (response.data.Data.IsApproved) {
          this.props.navigation.navigate("OTPVerification", {
            phoneNumber: this.state.phoneNumber,
          });
        }
        this.props.navigation.navigate("RegisterSuccess");
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("error connecting to server");
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
  // circle:{
  //   position: 'absolute',
  //   marginTop: 240,
  //   width: "100%",
  //   height:100,
  //   borderBottomLeftRadius: 160,
  //   borderBottomRightRadius: 160,
  //   backgroundColor: Colors.primary,
  // },
  box: {
    backgroundColor: "white",
    position: "absolute",
    marginTop: 60,
    alignItems: "center",
    shadowColor: "red",
    shadowRadius: 5,
    paddingBottom: 20,
    width: "90%",
  },
  registerText: {
    marginTop: 36,
    marginBottom: 24,
  },
  ringingBackGround: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F5F5F5",
    position: "absolute",
    marginTop: 23,
  },
  flagContainer: {
    width: 65,
    height: 40,
    borderColor: "#EEEEEE",
    borderWidth: 2,
    // backgroundColor: 'red',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    // justifyContent: 'center',
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    width: 210,
    height: 40,
    fontFamily: "SemiBold",
    fontSize: 13,
    borderColor: "#EEEEEE",
    borderWidth: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderLeftWidth: 0,
    padding: 8,
    letterSpacing: 1,
  },
  fullNameContainer: {
    width: 65 + 210,
    height: 40,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "#EEEEEE",
    padding: 8,
  },
  continueButton: {
    width: 272,
    height: 40,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
});

export default Register;

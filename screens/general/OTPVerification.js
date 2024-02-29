import React, { useState, useRef } from "react";
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
  Pressable,
  TextInput,
  Button,
  SafeAreaView,
} from "react-native";
import Icon, { FA5Style } from "react-native-vector-icons/FontAwesome5";
import qs from "qs";
import { Images } from "../../constants";
import api from "../../constants/Api";
import { TopBackgroundIcon } from "../../components/IconsAll";
import { TextViewStyle } from "../style/index";
import { InputText } from "../../components/Input";
import { ButtonPrimary } from "../../components/Elements";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import IMAGES from "../../constants/newImages";
import { Colors } from "../../screens/style/Theme";
import * as BankingIcons from "../../components/BankingIcons";
import helpers from "../../constants/Helpers";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const { width, height } = Dimensions.get("screen");

const OTPVerification = (props) => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [parameter, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(
    props.route.params.phoneNumber
  );
  const [resendCodeCount, setResendCodeCount] = useState(0);
  const validateForm = () => {
    let isvalid = true;
    if (value.trim() < 6) {
      isvalid = false;
      setCodeError("Input OTP Code");
    } else {
      setCodeError("");
    }

    return isvalid;
  };

  const ResendCode = async () => {
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      PhoneNumber: phoneNumber,
    });
    var response = await (await request())
      .post(api.ResendOtp, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response.data.Code == 200) {
      ToastMessage.Short("Account successfully verified");
      navigation.navigate("SignIn");
    }
  };
  const VerifyAccount = async () => {
    code = value;
    let companyId = await helpers.GetCompanyId();
    let companyCode = await helpers.GetCompanyCode();
    var data = qs.stringify({
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      Code: code,
      PhoneNumber: phoneNumber,
      CompanyCode: companyCode,
    });
    var response = await (await request())
      .post(api.MobileBankingVerification, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response.data.Code == 200) {
      setIsLoading(false);
      navigation.replace("SignIn");
    } else {
      ToastMessage.Short(response.data.Message);
    }
    setIsLoading(false);
  };
  const display = props.route.params.phoneNumber == "" ? "flex" : "none";
  ``;
  return (
    // <ScrollView style={{ width: "100%", backgroundColor: "#fff" }}>
    //   <View>
    //     <TopBackgroundIcon
    //       style={{ position: "absolute" }}
    //       preserveAspectRatio="none"
    //       width="100%" />
    //   </View>
    //   <Text
    //     style={[
    //       TextViewStyle.PageHeader,
    //       {
    //         marginLeft: 30,
    //         marginTop: 110,
    //         fontSize: 16,
    //         textAlign: "center",
    //       },
    //     ]}
    //   >
    //     Verify Your Account
    //   </Text>
    //   <View style={{ marginTop: 60, margin: 30, flexDirection: "column" }}>
    //     <KeyboardAvoidingView>
    //       <View style={{ display }}>
    //         <InputText
    //           placeholder="phone number"
    //           keyboardType="numeric"
    //           onChangeText={(phoneNumber) => setState({ phoneNumber })}
    //           value={state.phoneNumber}
    //           iconContent={<Icon size={16} name="phone" style={styles.inputIcons} />} />
    //         <Text style={{ color: "red" }}>
    //           {state.phoneNumberError}
    //         </Text>
    //       </View>
    //       <View style={{ marginBottom: 2 }}>
    //         <InputText
    //           keyboardType="numeric"
    //           placeholder="code"
    //           onChangeText={(code) => setState({ code })}
    //           value={state.code}
    //           iconContent={<Icon size={16} name="eye" style={styles.inputIcons} />} />
    //         <Text style={{ color: "red" }}>{state.codeError}</Text>
    //       </View>
    //       <View style={{ marginBottom: 2, textAlign: "center" }}>
    //         <Text>Please input code sent to the registered mobile no.</Text>
    //       </View>
    //       <TouchableOpacity
    //         color="primary"
    //         onPress={() => {
    //           if (validateForm()) {
    //             setState({ isLoading: true });
    //             VerifyAccount();
    //           }
    //         } }
    //       >
    //         <ButtonPrimary title={"Verify"} />
    //         {<ActivityIndicator
    //           animating={state.isLoading}
    //           color="#ffa500"
    //           style={styles.activityIndicator}
    //         ></ActivityIndicator>}
    //       </TouchableOpacity>
    //     </KeyboardAvoidingView>
    //     <TouchableOpacity
    //       onPress={async () => {
    //         setState({
    //           resendCodeCount: state.resendCodeCount + 1,
    //         });
    //         if (state.resendCodeCount > 3) {
    //           ToastMessage.Short("Resend code exceeds max limit (3)");
    //         } else {
    //           await ResendCode();
    //         }
    //       } }
    //     >
    //       <Text
    //         style={{ color: "#2FBB07", textAlign: "center", paddingTop: 10 }}
    //       >
    //         Resend Code
    //       </Text>
    //     </TouchableOpacity>
    //   </View>
    // </ScrollView>
    <View style={styles.container}>
      {/* <Image source={IMAGES.registerEllipse} style={{width:"100%"}}/> */}
      {/* <BankingIcons.ScreenHeaderRegisterIcon
        width="100%"
        fill={Colors.primary}
      /> */}
      <View style={styles.headerBackGround} />
      <View style={styles.box}>
        <View style={styles.registerText}>
          <Text style={{ fontSize: 24, fontFamily: "Bold" }}>Verification</Text>
        </View>
        <View style={{ marginBottom: 31 }}>
          <View style={styles.ringingBackGround}></View>
          {/* <Image source={IMAGES.verificationOTP} /> */}
          <BankingIcons.MobileWithMessageIcon fill={Colors.primary} />
        </View>
        {/* <View style={{ display }}>
            <InputText
              placeholder="phone number"
              keyboardType="numeric"
              onChangeText={(phoneNumber) => setState({ phoneNumber })}
              value={state.phoneNumber}
              iconContent={<Icon size={16} name="phone" style={styles.inputIcons} />} />
            <Text style={{ color: "red" }}>
              {state.phoneNumberError}
            </Text>
          </View> */}
        <View
          style={{
            marginLeft: 51,
            marginRight: 45,
            marginBottom: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 14, fontFamily: "SemiBold" }}>
            Please enter the code that was sent
          </Text>
          <Text style={{ fontSize: 14, fontFamily: "SemiBold" }}>
            to your phone number
          </Text>
        </View>
        <SafeAreaView style={styles.root}>
          <CodeField
            ref={ref}
            {...parameter}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={value}
            onChangeText={setValue}
            cellCount={6}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  isFocused && styles.focusCell,
                  { alignSelf: "center" },
                ]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          {codeError.length > 0 && (
            <Text style={{ color: "red", alignSelf: "center", marginTop: 8 }}>
              {codeError}
            </Text>
          )}
        </SafeAreaView>
        <TouchableOpacity
          onPress={() => {
            if (validateForm()) {
              setIsLoading(true);
              VerifyAccount();
            }
          }}
        >
          <View style={styles.continueButton}>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 14,
                color: "#FFFFFF",
                fontFamily: "SemiBold",
              }}
            >
              Continue
            </Text>
          </View>
          {/* {
                <ActivityIndicator
                  animating={state.isLoading}
                  color="#ffa500"
                  style={styles.activityIndicator}
                ></ActivityIndicator>
              } */}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            // setState({
            //   resendCodeCount: resendCodeCount + 1,
            // });
            setResendCodeCount(resendCodeCount + 1);
            if (resendCodeCount > 3) {
              ToastMessage.Short("Resend code exceeds max limit (3)");
            } else {
              await ResendCode();
            }
          }}
        >
          <Text
            style={{
              color: Colors.primary,
              textAlign: "center",
              paddingTop: 5,
              fontFamily: "SemiBold",
              fontSize: 14,
            }}
          >
            Resend Code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate("SignIn")}>
          <Text
            style={{
              color: Colors.primary,
              textAlign: "center",
              paddingTop: 10,
              fontFamily: "SemiBold",
              fontSize: 14,
            }}
          >
            Go to Login
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={{ color: "#2FBB07", textAlign: "center", paddingTop: 20 }}>Go to Login</Text>
          </TouchableOpacity>   */}
      </View>
    </View>
  );
};

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
    marginTop: 60,
    alignItems: "center",
    shadowColor: "red",
    shadowRadius: 5,
    paddingBottom: 20,
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
    height: 33,
    borderColor: "#EEEEEE",
    borderWidth: 2,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    width: 210,
    height: 33,
    borderColor: "#EEEEEE",
    borderWidth: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderLeftWidth: 0,
    padding: 8,
    letterSpacing: 1,
  },
  continueButton: {
    width: 272,
    height: 36,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    justifyContent: "center",
  },
  otpBox: {
    width: 59,
    height: 59,
    border: "##EEEEEE",
    borderRadius: 4,
    borderWidth: 2,
    fontSize: 30,
    marginRight: 12,
  },
  textInput: {
    marginLeft: 23,
    marginTop: 13,
    width: 14,
    height: 33,
    fontSize: 24,
    backgroundColor: "red",
  },

  //styles for otp
  root: { padding: 10 },
  codeFieldRoot: { alignItems: "center", justifyContent: "center" },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 40,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    borderRadius: 4,
  },
  focusCell: {
    borderColor: "#394249",
  },
});

export default OTPVerification;

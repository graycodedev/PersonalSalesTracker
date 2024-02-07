import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Keyboard,
    ActivityIndicator
  } from "react-native";
  import React, { useEffect, useState } from "react";
import Api from "../../constants/Api";
//   import DropDown from "../../components/DropDown";
//   import Button from "../../components/Button";
//   import Inputfield from "../../components/Inputfield";
//   import { theme } from "../../constants/Theme";
  import ToastMessage from "../../components/Toast/Toast";
import { Colors } from "../style/Theme";
import { ButtonPrimary } from "../../components/Button";
import DropDownPicker from "react-native-dropdown-picker";
import { RegularInputText } from "../../components/Input";
import request from "../../config/RequestManager";

  
  const ReceivePayment = (props) => {
    const [qrUrl, setQrUrl] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [paymentModeError, setPaymentModeError] = useState("");
    const [remarks, setRemarks] = useState("");
    const [remarksError, setRemarksError] = useState("");
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [amount, setAmount] = useState(0);
  
    const paymentModes = [
      {
        value: "cash",
        label: "Cash",
      },
      {
        value: "qr",
        label: "QR",
      },
    ];
    useEffect(() => {
      props.navigation.setOptions({
        title: "Payment",
      });
      getQrImage();
     
  
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          setKeyboardVisible(true);
        }
      );
  
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          setKeyboardVisible(false);
        }
      );
  
      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);
  
    const validateForm = () => {
      let isValid = true;
      if (!paymentMode) {
        isValid = false;
        setPaymentModeError("Select one of the payment mode !!");
      }
      if (!remarks) {
        isValid = false;
        setRemarksError("Remarks is required !!");
      }
      return isValid;
    };
    const getQrImage = async () => {
      let data = {
        key: "COMPANY_QRCODE",
      };
      var response = await (await request())
      .get(Api.ApplicationSettingsByKey+"?key="+data.key)
      .catch(function (error) {
    // setIsLoading(false)

        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        console.log(Api.BaseUrl + response.data.Data.Value)
        setQrUrl(Api.BaseUrl + response.data.Data.Value);

      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error Loading Notes");
    }
    // setIsLoading(false)
  };
      
  
    const makePayment = async () => {
      alert("Pay")
    };
    return (
        <ScrollView contentContainerStyle={{flex:1, justifyContent:"center"}} 
       
      >
        <View>
          {qrUrl && (
            <View style={{ alignItems: "center", justifyContent:"center" }}>
              <Image
                source={{ uri: qrUrl }}
                style={styles.img_style}
                resizeMode="contain"
              />
            </View>
          )}
          {/* <View style={{ paddingHorizontal: 12, marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontFamily: "SemiBold", marginTop: 8 }}>
              Payment Mode
            </Text>
            <View style={{ marginBottom: 10 }}>
                    <DropDownPicker
                        containerStyle={{ height: 50 }}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            fontFamily: "Regular",
                            borderColor: "#fff",
                            borderWidth: 0,
                        }}
                        itemStyle={{
                            justifyContent: "flex-start",
                            fontFamily: "Medium",
                            color: "red",
                        }}
                        labelStyle={{
                            fontFamily: "Medium",
                            color: "#9A9A9A",
                        }}
                        arrowColor={"#9A9A9A"}
                        placeholder="Payment Mode"
                        label="Payment Mode"
                        items={paymentModes}
                        onChangeItem={item => setPaymentMode(item.value)}
                    />
                </View>
          </View>
          {paymentModeError && (
            <Text style={{ color: "red", marginHorizontal: 12, marginTop: 5 }}>
              {paymentModeError}
            </Text>
          )}
          <Text
            style={{
              fontSize: 13,
              fontFamily: "SemiBold",
              marginTop: 8,
              marginHorizontal: 12,
              marginBottom: -8,
            }}
          >
            Amount
          </Text>
  
          <View style={{ paddingHorizontal: 12, marginBottom: 8 }}>
                    <RegularInputText
                        key="amount"
                        placeholder="Amount"
                        onChangeText={(text) => {
                            setAmount(text)
                        }}
                        value={amount}
                        keyboardType="numeric"
                    />
                </View>
         
          <View style={{ paddingHorizontal: 12, marginBottom: 8 }}>
                    <RegularInputText
                        key="remark"
                        placeholder="Remarks"
                        onChangeText={(text) => {
                            setRemarks(text)
                        }}
                        value={remarks}
                        multiline={true}
                        numberOfLines={5}
                        style={{ height: 100, alignItems: 'flex-start', borderWidth: 0 }}
                    />
                </View>
          {remarksError && (
            <Text style={{ color: "red", marginHorizontal: 12, marginTop: 5 }}>
              {remarksError}
            </Text>
          )}
        </View>
       
        <View style={{ margin: 30 }}>
                    <TouchableOpacity
                       onPress={async () => {
                        if (validateForm()) {
                          await makePayment();
                        }
                      }}
                    >
                         {!(paymentMode && remarks) ? (
             <ButtonPrimary title={"Done"} />
            ) : (
                <ButtonPrimary title={"Done"} />
            )}
                    </TouchableOpacity>*/}
                </View> 
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    img_style: {
      width: "95%",
      paddingHorizontal: 12,
      aspectRatio: 1,
    },
    inputfield: {
      padding: 10,
      marginHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      // marginTop: "5%",
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "#EAF0F5",
      borderRadius: 5,
      backgroundColor: "#F9F9F9",
      justifyContent: "center",
      marginTop: 10,
    },
  });
  
  export default ReceivePayment;
  
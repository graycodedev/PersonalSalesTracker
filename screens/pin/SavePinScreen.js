import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import DeviceStorage from "../../config/DeviceStorage";
import { ButtonPrimary } from "../../components/Button";
import Icon from "react-native-vector-icons/FontAwesome5";
import { InputText, RegularInputText } from "../../components/Input";
import api, { endPoints } from "../../constants/Api";
import qs from "qs";
class SavePinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userId: 0,
      pinSetup: false,
      pincode: "",
      repincode: "",
    };
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Save Pin Code",
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
  saveNewUserPin = async () => {
    if (this.state.pincode.length == 0) {
      ToastMessage.Short("Please enter pin code");
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
    if (this.state.pincode == this.state.repincode) {
      var data = qs.stringify({
        UserId: this.state.userId,
        PinCode: this.state.pincode,
        PinCodeType: "transactional",
      });
      var response = await (await request()).post(endPoints.AddNewPin, data);
      if (response != undefined) {
        if (response.data.Code === 200) {
          if (response.data.Data.Status) {
            ToastMessage.Short("Pincode saved");
            this.props.navigation.replace("Home");
          } else {
            ToastMessage.Short(response.data.Data.Message);
          }
        } else {
          ToastMessage.Short("Error Loading Recent Transactions");
        }
      } else {
        ToastMessage.Short("Error Loading Recent Transactions");
      }
    } else {
      ToastMessage.Short("Mis matched retyped pin");
    }
  };
  render() {
    return (
      <ScrollView nestedScrollEnabled={true} horizontal={false}>
        <View
          style={{
            flex: 0.1,
            flexDirection: "row",
            justifyContent: "space-between",
            // backgroundColor: "#eee",
            marginTop: 10,
            marginLeft: 15,
            marginRight: 15,
          }}
        >
          <Text>Pin</Text>
        </View>
        <View style={{ flex: 0.9 }}>
          <View style={{ margin: 10 }}>
            <RegularInputText
              password
              placeholder="Type 4 digit pin"
              keyboardType="numeric"
              maxLength={4}
              Keyboradty
              onChangeText={(pin) => this.setState({ pincode: pin })}
            />
          </View>
          <View style={{ margin: 10 }}>
            <Text>Confirm Pin</Text>

            <RegularInputText
              password
              placeholder="ReType pin"
              keyboardType="numeric"
              maxLength={4}
              Keyboradty
              onChangeText={(repin) => this.setState({ repincode: repin })}
            />
          </View>
          <View style={{ margin: 10, alignItems: "center" }}>
            <Text>Remember your pin, you'll need it during transactions.</Text>
          </View>

          <View
            style={{
              flex: 1,
              margin: 20,
              justifyContent: "flex-end",
              zIndex: 200,
            }}
          >
            <TouchableOpacity onPress={this.saveNewUserPin}>
              <ButtonPrimary title={"Save Pin"} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 10,
  },
  rect2: {
    width: 300,
    height: 90,
  },
  accountNumber: {
    // fontFamily: "Poppins_400Regular",
    color: "rgba(94,108,128,1)",
    fontSize: 16,
    marginTop: 11,
    marginLeft: 15,
    //flex:1
  },
  accountType: {
    // fontFamily: "Poppins_400Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 13,
    marginTop: 5,
    marginLeft: 15,
  },
  balance: {
    // fontFamily: "poppins-500",
    color: "rgba(42,186,0,1)",
    fontSize: 15,
    marginTop: 5,
    marginLeft: 15,
    alignContent: "flex-end",
  },
  icon: {
    //  color: "rgba(128,128,128,1)",
    fontSize: 23,
    height: 23,
    width: 23,
    marginTop: 5,
    marginLeft: 318,
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

export default SavePinScreen;

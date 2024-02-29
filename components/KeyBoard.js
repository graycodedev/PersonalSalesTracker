import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ButtonKey, ButtonPrimary } from "./Elements";
import request from "../config/RequestManager";
import ToastMessage from "./Toast/Toast";
import api, { endPoints } from "../constants/Api";
import qs from "qs";
import { Colors } from "../screens/style/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default class KeyboardPin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pincode: "",
    };
  }

  componentDidMount() {
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
  addPinEntry = (value) => {
    const { pincode } = this.state;
    if (pincode.length >= 4) {
    } else this.setState({ pincode: `${pincode}${value}` });
  };
  removeLastEntry = () => {
    const { pincode } = this.state;
    var newStr = pincode.slice(0, -1);
    this.setState({ pincode: newStr });
  };
  checkValidPin = async () => {
    const { pincode } = this.state;
    try {
      if (pincode.length == 4) {
        var data = qs.stringify({
          userId: this.state.userId,
          pin: this.state.pincode,
        });
        var response = await (await request()).post(
          endPoints.MatchUserPin,
          data
        );
        if (response != undefined) {
          if (response.data.Code === 200) {
            this.props.callback(response.data.Data);
          } else {
            ToastMessage.Short("Please try again.Server Error");
          }
        } else {
          ToastMessage.Short("Please try again.Server Error");
        }
      } else {
        ToastMessage.Short("Enter 4 digit pin code.");
      }
    } catch (e) {
      alert(e);
    }
  };
  render() {
    const { pincode } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ width: "100%", backgroundColor: "#eee" }}
        >
          <Text
            style={{
              color: "#fff",
              marginTop: 30,
              fontWeight: "700",
              fontSize: 20,
              paddingLeft: 15,
              color: "#5E6C80",
              alignSelf: "center",
            }}
          >
            Input Your Pin
          </Text>
          <View style={pinInputBox.container}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {pincode.length == 0 && (
                <>
                  <View style={pinInputBox.circle}></View>
                  <View style={pinInputBox.circle}></View>
                  <View style={pinInputBox.circle}></View>
                  <View style={pinInputBox.circle}></View>
                </>
              )}
              {pincode.length == 1 && (
                <>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.circle}></View>
                  <View style={pinInputBox.circle}></View>
                  <View style={pinInputBox.circle}></View>
                </>
              )}
              {pincode.length == 2 && (
                <>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.circle}></View>
                  <View style={pinInputBox.circle}></View>
                </>
              )}
              {pincode.length == 3 && (
                <>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.circle}></View>
                </>
              )}
              {pincode.length == 4 && (
                <>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.greencircle}></View>
                  <View style={pinInputBox.greencircle}></View>
                </>
              )}

              {/* <View style={pinInputBox.circle}></View>
                            <View style={pinInputBox.circle}></View> */}
            </View>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                width: 370,
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <ButtonKey title="1" onPress={() => this.addPinEntry(1)} />
              <ButtonKey title="2" onPress={() => this.addPinEntry(2)} />
              <ButtonKey title="3" onPress={() => this.addPinEntry(3)} />
              <ButtonKey title="4" onPress={() => this.addPinEntry(4)} />
              <ButtonKey title="5" onPress={() => this.addPinEntry(5)} />
              <ButtonKey title="6" onPress={() => this.addPinEntry(6)} />
              <ButtonKey title="7" onPress={() => this.addPinEntry(7)} />
              <ButtonKey title="8" onPress={() => this.addPinEntry(8)} />
              <ButtonKey title="9" onPress={() => this.addPinEntry(9)} />
              <ButtonKey title="x" />
              <ButtonKey title="0" onPress={() => this.addPinEntry(0)} />
              <ButtonKey title="<-" onPress={() => this.removeLastEntry()} />
            </View>
          </View>
          <View
            style={{
              flex: 0.2,
              margin: 20,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              color="success"
              onPress={() => {
                this.checkValidPin();
              }}
            >
              <ButtonPrimary title={"Confirm"} />

              {/* <ActivityIndicator animating={this.state.isLoading} color="#ffa500" style={styles.activityIndicator}></ActivityIndicator> */}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const pinInputBox = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 330,
    height: 90,
    marginTop: 30,
    marginBottom: 20,
    alignSelf: "center",
  },
  greencircle: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: Colors.primary,
    margin: 5,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: "#9A9A9A",
    margin: 5,
  },
});

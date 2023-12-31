import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  View,
} from "react-native";
import React from "react";
import AppConfig from "../../../config/AppConfig";

import Icon from "react-native-vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import request from "../../../config/RequestManager";
import helpers from "../../../constants/Helpers";
import uuid from "react-native-uuid";
import qs from "qs";
import api from "../../../constants/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SuccessView } from "../../../components/SuccessView";
import ToastMessage from "../../../components/Toast/Toast";
import { ButtonPrimary } from "../../../components/Button";
import KeyboardPin from "../../../components/KeyBoard";

export class PokharaInternetPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showpackages: false,
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      accountNo: "0",
      accountNoError: "",
      username: "",
      usernameError: "",
      number: "",
      numberError: "",
      address: "",
      addressError: "",
      amount: null,
      amountError: "",
      uniqueid: null,
      showpin: false,
      isLoading: false,
    };

    this.GetAccountList();
  }
  GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    this.setState({ accountList: arr });
  };

  validateForm() {
    let isvalid = true;
    if (this.state.accountNo == "0") {
      isvalid = false;
      this.setState({ accountNoError: "Account no is required !" });
    } else {
      this.setState({ accountNoError: "" });
    }
    if (this.state.username == "") {
      isvalid = false;
      this.setState({ usernameError: "Username is required !" });
    } else {
      this.setState({ usernameError: "" });
    }
    if (this.state.number.length != 10) {
      isvalid = false;
      this.setState({ numberError: "Phone number is required !" });
    } else {
      this.setState({ numberError: "" });
    }
    if (this.state.amount < 100 || this.state.amount == null) {
      isvalid = false;
      if (this.state.amount == null)
        this.setState({ amountError: "Amount is required !" });
      if (this.state.amount < 100)
        this.setState({ amountError: "Amount must be more than 100 !" });
    } else {
      this.setState({ amountError: "" });
    }
    if (this.state.address == "") {
      isvalid = false;
      this.setState({ addressError: "Address is required !" });
    } else {
      this.setState({ addressError: "" });
    }

    return isvalid;
  }

  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  PinMatched = (status) => {
    if (status) {
      this.setState({ showpin: false });
      this.confirmpayment();
    } else {
      this.setState({ showpin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  checkBalance = async () => {
    var message = await helpers.CheckAmount({
      accountNumber: this.state.accountNo,
      amount: this.state.amount,
      isCheckCompanyBalance: true,
      isCheckUtilityBalance: true,
    });
    if (message != "") {
      ToastMessage.Long(message);
    }
    return message == "" ? true : false;
  };
  confirmpayment = async () => {
    await this.generateUniqueID();
    if (await this.checkBalance()) {
      // await this.GetUserInfo();
      var data = qs.stringify({
        UniqueId: this.state.transactionId,
        Username: this.state.username,
        Number: this.state.number,
        Address: this.state.address,
        AccountNo: this.state.accountNo,
        Amount: this.state.amount,
      });
      console.log("DATA", data);
      var confirmationData = [
        {
          label: "From Acc:",
          value: this.state.accountNo,
        },
        {
          label: "Username:",
          value: this.state.username,
        },
        {
          label: "Phonenumber:",
          value: this.state.number,
        },
        {
          label: "Amount:",
          value: this.state.amount,
        },
      ];
      var response = await (await request())
        .post(api.PokharaInternet.MakePayment, data)
        .catch(function(error) {
          ToastMessage.Short("Error Ocurred Contact Support");
        });
      this.setState({ isLoading: false });
      if (response != undefined) {
        if (response.data.Code == 200) {
          this.props.navigation.navigate("Pokhara Internet Successful", {
            data: confirmationData,
            logId: response.data.Data,
          });
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short(response.data.Message);
      }
    }
  };
  render() {
    return (
      <View>
        {/* <Spinner
            color={Colors.primary}
            visible={this.state.spinner}
            textContent={"We are processing..."}
            textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
          /> */}
        <ScrollView>
          {this.state.showpin == false ? (
            <View style={{zIndex:99}}>
              <DropDownPicker
                containerStyle={{
                  marginTop: 10,
                  marginBottom: 20,
                  height: 45,
                  width: "100%",
                  alignSelf: "center",
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                  fontFamily: "Medium",
                  color: "red",
                }}
                labelStyle={{
                  fontFamily: "Medium",
                  color: "black",
                }}
                arrowColor={"black"}
                items={this.state.accountList}
                controller={(instance) => (this.controller = instance)}
                onChangeList={(items, callback) => {
                  this.setState(
                    {
                      items,
                    },
                    callback
                  );
                }}
                defaultValue={this.state.accountNo}
                onChangeItem={(item) =>
                  this.setState({
                    accountNo: item.value,
                  })
                }
              />
              {!!this.state.accountNoError && (
                <Text style={{ color: "red" }}>
                  {this.state.accountNoError}
                </Text>
              )}
              <View style={{ paddingHorizontal: 10 }}>
                <Text style={styles.bold_text}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Username..."
                  onChangeText={(text) => {
                    this.setState({ username: text });
                  }}
                />
                {this.state.usernameError ? (
                  <Text style={styles.requiredmessage}>
                    {this.state.usernameError}
                  </Text>
                ) : null}
                <Text style={styles.bold_text}>Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Phonenumber..."
                  onChangeText={(text) => {
                    this.setState({ number: text });
                  }}
                />
                {this.state.numberError ? (
                  <Text style={styles.requiredmessage}>
                    {this.state.numberError}
                  </Text>
                ) : null}
                <Text style={styles.bold_text}>
                  Amount (Must Be greater Than 99)
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Amount..."
                  onChangeText={(text) => {
                    this.setState({ amount: text });
                  }}
                />
                {this.state.amountError ? (
                  <Text style={styles.requiredmessage}>
                    {this.state.amountError}
                  </Text>
                ) : null}
                <Text style={styles.bold_text}>Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Address...."
                  onChangeText={(text) => {
                    this.setState({ address: text });
                  }}
                />
                {this.state.addressError ? (
                  <Text style={styles.requiredmessage}>
                    {this.state.addressError}
                  </Text>
                ) : null}
              </View>
              <View
                style={{
                  flex: 0.2,
                  margin: 20,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    if (this.validateForm()) {
                      if (this.state.isLoading == false) {
                        this.setState({ isLoading: true, showpin: true });
                      }
                    }
                  }}
                >
                  <ButtonPrimary title={"MAKE PAYMENT"} />
                  <ActivityIndicator
                    animating={this.state.isLoading}
                    color="#ffa500"
                    style={styles.activityIndicator}
                  ></ActivityIndicator>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <KeyboardPin callback={this.PinMatched} />
          )}
        </ScrollView>
      </View>
    );
  }
}

export class PokharaInternetSuccessful extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { data, logId } = this.props.route.params;
    return (
      <ScrollView>
        <SuccessView
          title="Payment Successful"
          data={data}
          message=""
          logId={logId}
        />
        <View style={{ margin: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.replace("Home");
            }}
          >
            <ButtonPrimary title="GO TO HOME" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 15,
  },
  bold_text: {
    fontSize: 14,
    marginBottom: 5,
  },
  proceedbtn: {
    width: "90%",
    height: 45,
    borderRadius: 5,
    backgroundColor: AppConfig.ThemeConfig.primaryColor,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  btntext: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  requiredmessage: {
    fontSize: 12,
    fontWeight: "400",
    color: "red",
  },
  detailcontainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#dbdbdb",
  },
  rowdata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  variablename: {
    fontSize: 16,
    fontWeight: "500",
  },
  valuestyle: {
    fontSize: 18,
    fontWeight: "600",
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
  input: {
    width: "100%",
    height: 45,
    borderRadius: 5,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

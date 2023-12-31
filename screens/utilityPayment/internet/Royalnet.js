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

export class Royalnet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionId: "",
      customerid: "",
      emptycustomerid: false,
    };
  }
  checkifempty = (username) => {
    if (username == "") {
      this.setState({ emptycustomerid: true });
      return true;
    } else {
      this.setState({ emptycustomerid: false });
      return false;
    }
  };
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  GetDetails = async () => {
    this.generateUniqueID();
    this.props.navigation.navigate("Royal Network Payment", {
      customerId: this.state.customerid,
    });
  };
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} enabled>
        <View style={styles.container}>
          <Text style={styles.bold_text}>Customer ID</Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              borderRadius: 5,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
            placeholder="Customer id..."
            onChangeText={(text) => {
              this.setState({ customerid: text });
            }}
          />
          {this.state.emptycustomerid ? (
            <Text style={styles.requiredmessage}>
              Customer ID is required !!
            </Text>
          ) : null}
          <TouchableOpacity
            onPress={async () => {
              if (!this.checkifempty(this.state.customerid)) {
                this.GetDetails();
              }
            }}
            style={styles.proceedbtn}
          >
            <Text style={styles.btntext}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export class RoyalnetPayment extends React.Component {
  constructor(props) {
    super(props);
    const { customerId } = this.props.route.params;
    this.state = {
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      accountNo: "0",
      accountNoError: "",
      amountError: "",
      customername: customerId,
      amount: null,
      uniqueid: null,
      showpin: false,
      isLoading: false,
      transactionId: "",
      mobileNumber: "",
      mobileNumberError: "",
      paymentPending: false,
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
      this.setState(() => ({ accountNoError: "Account no is required !" }));
    } else {
      this.setState(() => ({ accountNoError: "" }));
    }
    if (
      this.state.amount == null ||
      this.state.amount > 100000 ||
      this.state.amount < 100
    ) {
      isvalid = false;
      if (this.state.amount == null) {
        this.setState(() => ({
          amountError: "Input an amount to proceed",
        }));
      } else {
        this.setState(() => ({
          amountError: "Input an amount between 100 and 100000",
        }));
      }
    } else {
      this.setState(() => ({ amountError: "" }));
    }
    if (this.state.mobileNumber.length != 10) {
      isvalid = false;
      this.setState(() => ({
        mobileNumberError: "Input a valid mobile number",
      }));
    } else {
      this.setState(() => ({ mobileNumberError: "" }));
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
    // var message = await helpers.CheckAmount({
    //   accountNumber: this.state.accountNo,
    //   amount: this.state.amount,
    //   isCheckCompanyBalance: true,
    //   isCheckUtilityBalance: true,
    // });
    // if (message != "") {
    //   ToastMessage.Long(message);
    // }
    // return message == "" ? true : false;
    return true;
  };
  confirmpayment = async () => {
    await this.generateUniqueID();
    // await this.GetUserInfo();
    if (await this.checkBalance()) {
      var data = qs.stringify({
        UniqueId: this.state.transactionId,
        SessionId: this.state.sessionid,
        Amount: this.state.amount,
        UserName: this.state.customername,
        AccountNo: this.state.accountNo,
        Month: this.state.month,
        Package: this.state.packagename,
        InternetName: "RoyalnetInternet",
        MobileNumber: this.state.mobileNumber,
        Note: this.state.note,
      });
      var confirmationData = [
        {
          label: "Customer Name :",
          value: this.state.customername,
        },
        {
          label: "Amount :",
          value: this.state.amount,
        },
      ];
      var response = await (await request())
        .post(api.Internet.MakePayment, data)
        .catch(function(error) {
          ToastMessage.Short("Error Ocurred Contact Support");
        });
      if (response != undefined) {
        if (response.data.Code == 200) {
          this.setState({ isLoading: false });
          this.props.navigation.navigate("Royal Network Successful", {
            data: confirmationData,
            paymentPending: this.state.paymentPending,
            logId: response.data.Data,
          });
        } else if (response.data.Code == 777) {
          this.setState({ isLoading: false });
          this.setState({ paymentPending: true });
          this.props.navigation.navigate("Royal Network Successful", {
            data: confirmationData,
            paymentPending: this.state.paymentPending,
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
              <View style={styles.detailcontainer}>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Customer Name:</Text>
                  <Text style={styles.valuestyle}>
                    {this.state.customername}
                  </Text>
                </View>
                <Text style={styles.variablename}>Amount:</Text>
                <TextInput
                  style={{
                    width: "100%",
                    height: 45,
                    borderRadius: 5,
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                  }}
                  placeholder="Amount ..."
                  onChangeText={(text) => {
                    this.setState({ amount: text });
                  }}
                />
                {this.state.amountError != "" && (
                  <Text style={styles.requiredmessage}>
                    {this.state.amountError}
                  </Text>
                )}
                <Text style={styles.variablename}>Mobile Number:</Text>
                <TextInput
                  style={{
                    width: "100%",
                    height: 45,
                    borderRadius: 5,
                    backgroundColor: "white",
                    paddingHorizontal: 10,
                  }}
                  placeholder="Amount ..."
                  onChangeText={(text) => {
                    this.setState({ mobileNumber: text });
                  }}
                />
                {this.state.mobileNumberError != "" && (
                  <Text style={styles.requiredmessage}>
                    {this.state.mobileNumberError}
                  </Text>
                )}
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

export class RoyalnetSuccessful extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { data, paymentPending, logId } = this.props.route.params;
    return (
      <ScrollView>
        {!paymentPending ? (
          <SuccessView
            title="Payment Successful"
            data={data}
            message=""
            logId={logId}
          />
        ) : (
          <SuccessView title="Payment Pending" data={data} message="" pending />
        )}
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
});

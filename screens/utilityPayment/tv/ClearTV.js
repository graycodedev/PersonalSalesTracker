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
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../style/Theme";

export class ClearTV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerid: "",
      emptycustomerid: false,
      transactionId: "",
      amount: 0,
      amountError: "",
      mobileNumber: "",
      mobileNumberError: "",
    };
  }

  validateUser = () => {
    let isValid = true;
    if (this.state.customerid == "") {
      this.setState({ emptycustomerid: true });
      isValid = false;
    } else {
      this.setState({ emptycustomerid: false });
    }
    if (this.state.amount < 10 || this.state.amount > 100000) {
      this.setState({ amountError: "Enter amount between 10 and 1,00,000" });
      isValid = false;
    }
    if (this.state.mobileNumber.length < 10) {
      this.setState({ mobileNumberError: "Enter valid phone number!!" });
      isValid = false;
    }
    return isValid;
  };
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  GetDetails = async () => {
    this.props.navigation.navigate("ClearTV Payment", {
      model: {
        customer_id: this.state.customerid,
        amount: this.state.amount,
        mobileNumber: this.state.mobileNumber,
      },
    });
  };
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} enabled>
        <View style={styles.container}>
          <Text style={styles.bold_text}>CAS ID/Chip ID/Customer ID</Text>
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
          <Text style={styles.bold_text}>Mobile Number</Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              borderRadius: 5,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
            placeholder="Mobile No..."
            onChangeText={(text) => {
              this.setState({ mobileNumber: text });
            }}
          />
          {!!this.state.mobileNumberError && (
            <Text style={styles.requiredmessage}>
              {this.state.mobileNumberError}
            </Text>
          )}
          <Text style={styles.bold_text}>Amount</Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              borderRadius: 5,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
            placeholder="Amount..."
            onChangeText={(text) => {
              this.setState({ amount: text });
            }}
          />
          {!!this.state.amountError && (
            <Text style={styles.requiredmessage}>{this.state.amountError}</Text>
          )}
          <TouchableOpacity
            onPress={async () => {
              if (this.validateUser()) {
                this.GetDetails();
              }
            }}
            style={styles.proceedbtn}
          >
            <Text style={styles.btntext}>Make Payment</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export class ClearTVPayment extends React.Component {
  constructor(props) {
    super(props);
    const { data, model } = this.props.route.params;
    this.state = {
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      accountError: "",
      accountNo: "0",
      customerid: model.customer_id,
      amount: model.amount,
      mobileNumber: model.mobileNumber,
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
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ uniqueid: uid });
  }
  GetUserInfo = async () => {
    const user = await AsyncStorage.getItem("UserInfo");
    if (user != null) {
      const u = JSON.parse(user);
      this.setState(
        {
          userId: u.Id,
        },
        () => {}
      );
    }
  };
  userValidation() {
    var isValid = false;
    if (this.state.accountNo == "0") {
      this.setState(() => ({ accountError: "Select the account!!" }));
      return isValid;
    }
    isValid = true;
    return isValid;
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
  confirmpayment = async () => {
    if (!this.userValidation()) {
      return;
    }
    this.generateUniqueID();
    await this.GetUserInfo();
    var data = qs.stringify({
      UniqueId: this.state.uniqueid,
      SessionId: this.state.sessionId,
      Amount: this.state.amount,
      CustomerId: this.state.customerid,
      AccountNo: this.state.accountNo,
      UserId: this.state.userId,
      Note: this.state.note,
      TvName: "ClearTv",
      MobileNumber: this.state.mobileNumber,
    });
    var confirmationData = [
      {
        label: "Customer Id :",
        value: this.state.customerid,
      },
      {
        label: "Amount:",
        value: this.state.amount,
        styleValue: [{ color: "red" }],
      },
    ];
    var response = await (await request())
      .post(api.Tv.MakePayment, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    this.setState({ isLoading: false });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.props.navigation.navigate("ClearTV Success", {
          data: confirmationData,
          logId: response.data.Data,
        });
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short(response.data.Message);
    }
  };
  render() {
    return (
      <View>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
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
              {this.state.accountError != "" && (
                <Text style={{ color: "red" }}>{this.state.accountError}</Text>
              )}
              <View style={styles.detailcontainer}>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Customer Id:</Text>
                  <Text style={styles.value}>{this.state.customerid}</Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Amount:</Text>
                  <Text style={styles.value}>{this.state.amount}</Text>
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
                  onPress={() => {
                    if (
                      this.state.isLoading == false &&
                      this.userValidation()
                    ) {
                      this.setState({ isLoading: true, showpin: true });
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

export class ClearTVSuccessful extends React.Component {
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
    fontSize: 18,
    fontWeight: "400",
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
  value: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
});

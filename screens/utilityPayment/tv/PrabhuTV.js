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

export class PrabhuTV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerid: "",
      emptycustomerid: false,
      transactionId: "",
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
    var response = await (await request())
      .get(
        api.PrabhuTV.GetDetails +
          "?CasId=" +
          this.state.customerid +
          "&UniqueId=" +
          this.state.transactionId
      )
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
        console.log("error while sending data");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.props.navigation.navigate("PrabhuTV Payment", {
          data: response.data.Data,
          casId: this.state.customerid,
        });
      } else {
        ToastMessage.Short("Invalid customer ID");
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
    }
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

export class PrabhuTVPayment extends React.Component {
  constructor(props) {
    super(props);
    const { data, casId } = this.props.route.params;
    this.state = {
      // showpackages: false,
      // allpackage: data.bills,
      // accountList: [
      //   {
      //     label: "Select Account No",
      //     value: "0",
      //   },
      // ],
      // subscribed_package: data.subscribed_package_name,
      // remainingdays: data.days_remaining,
      // branch: data.branch,
      // sessionid: data.session_id,
      // packageid: null,
      // userId: null,
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      accountError: "",
      amountError: "",
      showamounts: false,
      accountNo: "0",
      customerid: casId,
      customername: data.customer_name,
      packages: data.current_packages,
      sessionId: data.session_id,
      balance: data.balance,
      uniqueid: null,
      showpin: false,
      isLoading: false,
      amount: "Select Amount",
      ValidAmounts: [350, 1800, 2400, 3500, 6500, 9000, 11500, 24000],
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
  showAmountList = () => {
    if (this.state.showamounts) {
      this.setState({ showamounts: false });
    } else {
      this.setState({ showamounts: true });
    }
  };
  chooseAmount = (item) => {
    this.setState({ amount: item });
    this.showAmountList();
  };
  AmountDropdown = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.showAmountList()}
          style={{
            marginTop: 10,
            marginBottom: this.state.showamounts ? 5 : 15,
            height: 45,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            backgroundColor: "white",
            borderRadius: 5,
          }}
        >
          <Text>{this.state.amount}</Text>
          {this.state.showamounts ? (
            <Icon name="chevron-up" />
          ) : (
            <Icon name="chevron-down" />
          )}
        </TouchableOpacity>
        {this.state.showamounts ? (
          <View style={{ marginBottom: 15 }}>
            {this.state.ValidAmounts.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.chooseAmount(item)}
                  style={{
                    height: 40,
                    width: "100%",
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    borderBottomWidth: 1,
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                    borderBottomColor: "#b6b8ba",
                    backgroundColor: "white",
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </View>
    );
  };
  userValidation() {
    var isValid = false;
    if (this.state.accountNo == "0") {
      this.setState(() => ({ accountError: "Select the account!!" }));
      return isValid;
    }
    if (this.state.amount == "Select Amount") {
      this.setState(() => ({ amountError: "Select the amount!!" }));
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
      Casid: this.state.customerid,
      Username: this.state.customername,
      AccountNo: this.state.accountNo,
      UserId: this.state.userId,
      Note: this.state.note,
    });
    var confirmationData = [
      {
        label: "customer id :",
        value: this.state.customerid,
      },
      {
        label: "customer name :",
        value: this.state.customername,
      },
      {
        label: "Package :",
        value: this.state.packages[0].product_name,
      },
      {
        label: "Amount:",
        value: this.state.amount,
        styleValue: [{ color: "red" }],
      },
    ];
    var response = await (await request())
      .post(api.PrabhuTV.MakePayment, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.props.navigation.navigate("PrabhuTV Success", {
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
                  <Text style={styles.variablename}>Product Name:</Text>
                  <Text style={styles.value}>
                    {this.state.packages[0].product_name}
                  </Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Service Start Date:</Text>
                  <Text style={styles.value}>
                    {this.state.packages[0].service_start_date}
                  </Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Service Expiry Date:</Text>
                  <Text style={styles.value}>
                    {this.state.packages[0].expiry_date}
                  </Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Balance:</Text>
                  <Text style={[styles.value, { color: "green" }]}>
                    {this.state.balance}
                  </Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Bill Amount:</Text>
                  <Text style={[styles.value, { color: "red" }]}>
                    {this.state.packages[0].bill_amount}
                  </Text>
                </View>
              </View>
              <View>{this.AmountDropdown()}</View>
              {this.state.amountError != "" && (
                <Text style={{ color: "red" }}>{this.state.amountError}</Text>
              )}
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

export class PrabhuTVSuccessful extends React.Component {
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

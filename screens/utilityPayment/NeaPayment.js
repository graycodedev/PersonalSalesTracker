import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
  Switch,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";
import axios from "axios";
import DropDownPicker from "react-native-dropdown-picker";
import { Text } from "galio-framework";
import { RegularInputText } from "../../components/Input";
import api from "../../constants/Api";
import { ButtonPrimary } from "../../components/Button";
import { ScrollView } from "react-native";
import { ConfirmationView } from "../../components/Confirmation";
import { SuccessView } from "../../components/SuccessView";
import helpers from "../../constants/Helpers";
import { Table, Row } from "react-native-table-component";
import request from "../../config/RequestManager";
import KeyboardPin from "../../components/KeyBoard";
import Spinner from "react-native-loading-spinner-overlay";
import ToastMessage from "../../components/Toast/Toast";
import { Colors } from "../style/Theme";
import FavouriteStyles from "../style/favouriteStyle";
import { CustomDropdown } from "../../components/CustomDropdown";
import uuid from "react-native-uuid";
import * as BankingIcons from "../../components/BankingIcons";
import UnfavAPayment from "../../components/UnfavAPayment";
import { Constants } from "expo-barcode-scanner";
const { width, height } = Dimensions.get("screen");
export class NeaPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      fromAccountNo: "0",
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      accountNoError: "",
      counterList: [
        {
          label: "Select Counter",
          value: "0",
        },
      ],
      counterNo: "", //216:nea
      counterName: "Select Counter",
      counterError: "",
      scNo: "", //024.12.512
      scNoError: "",
      customerId: "", //3042
      customerIdError: "",
      billDetail: [],
      totalDue: 0,
      serviceCharge: 0,
      isFavourite: false,
      favouriteList: [],
      transactionId: null,
      note: "",
      noteError: "",
      sessionId: "",
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: `NEA Payment`,
    });
    this.GetAccountList();
    this.GetCountersList();
    this.GetFavourite();
  }
  GetFavourite = async () => {
    var response = await (await request())
      .get(api.Favourite.NEA)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        if (response.data.Data.length > 0) {
          this.setState({ favouriteList: response.data.Data });
        } else {
          this.setState({ favouriteList: [] });
        }
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error ocurred contact support !");
    }
  };
  GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    if (arr.length > 0) {
      this.setState({ accountList: arr, fromAccountNo: arr[0].value });
    }
  };
  GetCountersList = async () => {
    var response = await (await request())
      .get(api.Nea.ListCounters)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        if (response.data.Data.counters.length > 0) {
          var arr = [
            {
              label: "Select Counter",
              value: "0",
            },
          ];
          for (let a of response.data.Data.counters) {
            const obj = { label: "  " + a.name, value: a.value };
            arr.push(obj);
          }
          this.state.counterNo = arr[0].value;
          this.setState({ counterList: arr });
        }
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error ocurred contact support !");
    }
  };
  ValidateCustomer = async () => {
    let isValid = false;
    const userId = (await helpers.GetUserInfo()).Id;
    this.generateUniqueID();
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      ScNo: this.state.scNo,
      ConsumerId: this.state.customerId,
      UniqueId: this.state.transactionId,
      clientId: companyId,
      OfficeCode: this.state.counterNo,
      UserId: userId,
    });
    var response = await (await request())
      .post(api.Nea.CheckCustomer, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    var billArray = [];
    if (response != undefined) {
      if (response.data.Code == 200) {
        isValid = true;
        var responseData = response.data.Data;
        responseData.due_bills.map((data, index) => {
          var arr = [
            data.bill_date,
            parseFloat(data.bill_amount).toFixed(2),
            data.status,
            parseFloat(data.payable_amount).toFixed(2),
          ];
          billArray.push(arr);
        });
        this.setState({
          customerName: responseData.consumer_name,
          totalDue: parseFloat(responseData.total_due_amount).toFixed(2),
          billDetail: billArray,
          sessionId: responseData.session_id,
        });
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error ocurred contact support !");
    }
    return isValid;
  };
  validateForm() {
    let isvalid = true;
    if (this.state.fromAccountNo == "0") {
      isvalid = false;
      this.setState(() => ({ accountNoError: "Account no is required !" }));
    } else {
      this.setState(() => ({ accountNoError: "" }));
    }
    if (this.state.counterNo === "0") {
      isvalid = false;
      this.setState(() => ({ counterError: "Select Counter !" }));
    } else {
      this.setState(() => ({ counterError: "" }));
    }
    if (this.state.scNo.trim() === "") {
      isvalid = false;
      this.setState(() => ({ scNoError: "Sc No is Required !" }));
    } else {
      this.setState(() => ({ scNoError: "" }));
    }
    if (this.state.customerId.trim() === "") {
      isvalid = false;
      this.setState(() => ({ customerIdError: "Customer id is required !" }));
    } else {
      this.setState(() => ({ customerIdError: "" }));
    }
    if (this.state.isFavourite && this.state.note.trim() == "") {
      isvalid = false;
      this.setState(() => ({ noteError: "note is required" }));
    } else {
      this.setState(() => ({ noteError: "" }));
    }
    return isvalid;
  }
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  updateSelectedItem(value, label) {
    this.setState({
      counterNo: value,
      counterName: label,
    });
  }
  ResetVisibility = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const model = {
      accountNo: this.state.fromAccountNo,
      customerId: this.state.customerId,
      counterNo: this.state.counterNo,
      counterName: this.state.counterName,
      customerId: this.state.customerId,
      scNo: this.state.scNo,
      note: this.state.note,
    };
    return (
      <ScrollView>
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            margin: 10,
            alignContent: "center",
          }}
        >
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
            <View style={{ marginTop: 20, marginBottom: 15, zIndex: 99 }}>
              <DropDownPicker
                containerStyle={{ height: 50 }}
                dropDownMaxHeight={500}
                style={{ backgroundColor: "#fafafa" }}
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
                defaultValue={this.state.fromAccountNo}
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
                onChangeItem={(item) =>
                  this.setState({
                    fromAccountNo: item.value,
                  })
                }
              />
              {!!this.state.accountNoError && (
                <Text style={{ color: "red" }}>
                  {this.state.accountNoError}
                </Text>
              )}
            </View>

            <View style={{ marginBottom: 15 }}>
              {/* <DropDownPicker
                searchable={true}
                searchablePlaceholder="Search Counter"
                containerStyle={{ height: 50 }}
                dropDownMaxHeight={500}
                style={{ backgroundColor: "#fafafa" }}
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
                items={this.state.counterList}
                controller={(instance) => (this.controller = instance)}
                onChangeList={(items, callback) => {
                  this.setState(
                    {
                      items,
                    },
                    callback
                  );
                }}
                defaultValue={this.state.counterNo}
                onChangeItem={(item) =>
                  this.setState({
                    counterNo: item.value,
                    counterName: item.label,
                  })
                }
              /> */}
              <CustomDropdown
                items={this.state.counterList}
                placeholder={this.state.counterName}
                searchablePlaceholder="Search Counter"
                itemSelected={this.updateSelectedItem.bind(this)}
              />
              {!!this.state.counterError && (
                <Text style={{ color: "red" }}>{this.state.counterError}</Text>
              )}
            </View>
            <View style={{ marginBottom: 15 }}>
              <RegularInputText
                borderless
                placeholder="Sc No"
                onChangeText={(text) => {
                  this.setState({ scNo: text });
                }}
                value={this.state.scNo}
              />
              {!!this.state.scNoError && (
                <Text style={{ color: "red" }}>{this.state.scNoError}</Text>
              )}
            </View>
            <View style={{ marginBottom: 15 }}>
              <RegularInputText
                type="numeric"
                borderless
                placeholder="Customer ID"
                onChangeText={(text) => {
                  this.setState({ customerId: text });
                }}
                value={this.state.customerId}
              />
              {!!this.state.customerIdError && (
                <Text style={{ color: "red" }}>
                  {this.state.customerIdError}
                </Text>
              )}
            </View>
            <View style={{ flex: 1, flexDirection: "row", marginBottom: 15 }}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={this.state.isFavourite ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  this.setState({ isFavourite: !this.state.isFavourite });
                }}
                value={this.state.isFavourite}
              />
              <Text
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                save this payment
              </Text>
            </View>
            {this.state.isFavourite && (
              <View>
                <RegularInputText
                  key="note"
                  maxLength={100}
                  borderless
                  placeholder="Note"
                  onChangeText={(text) =>
                    this.setState({
                      note: text,
                    })
                  }
                  value={this.state.note}
                />
                {this.state.noteError != "" && (
                  <Text style={{ color: "red" }}>{this.state.noteError}</Text>
                )}
              </View>
            )}
            <View
              style={{
                margin: 20,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  if (!this.state.isLoading) {
                    this.setState({ isLoading: true });
                    if (this.validateForm()) {
                      if (await this.ValidateCustomer()) {
                        this.props.navigation.navigate(
                          "NeaPaymentConfirmation",
                          { data: this.state, model: model }
                        );
                      }
                    }
                    this.setState({ isLoading: false });
                  }
                }}
              >
                <ButtonPrimary title={"PROCEED"} />
                {
                  <ActivityIndicator
                    animating={this.state.isLoading}
                    color="#ffa500"
                    style={styles.activityIndicator}
                  ></ActivityIndicator>
                }
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
        <View style={{ backgroundColor: "#eee" }}>
          <View
            style={{
              justifyContent: "center",
              backgroundColor: "#ddd",
              padding: 10,
            }}
          >
            <Text
              style={{ fontSize: 18, textAlign: "center", fontWeight: "bold" }}
            >
              Saved Payments{" "}
            </Text>
          </View>
          <ScrollView>
            {this.state.favouriteList.map((data, index) => {
              return (
                <View style={FavouriteStyles.container} key={index}>
                  <TouchableOpacity
                    onPress={() => {
                      var counterName = this.state.counterList.find(
                        (arr) => arr.value === data.ExtraField2
                      );
                      this.setState({ counterName: counterName.label });
                      this.setState({ counterNo: data.ExtraField2 });
                      this.setState({ customerId: data.Subscriber });
                      this.setState({ scNo: data.ExtraField1 });
                    }}
                  >
                    <View style={FavouriteStyles.box}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          // backgroundColor: "yellow",
                        }}
                      >
                        <Text style={FavouriteStyles.note} numberOfLines={1}>
                          {data.Remarks}
                        </Text>
                        <View>
                          <UnfavAPayment
                            id={data.Id}
                            updateList={this.GetFavourite}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text>ScNo: {data.ExtraField1}</Text>
                        <Text>Customer ID: {data.Subscriber}</Text>
                      </View>
                      <Text>Counter: {data.ExtraField2}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
          {this.state.favouriteList.length == 0 && (
            <Text style={{ textAlign: "center", padding: 20 }}>
              No Saved Payments
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }
}
export class NeaPaymentConfirmation extends React.Component {
  constructor(props) {
    super(props);
    const { data, model } = this.props.route.params;
    const cashBack = 0;
    const txnCharge = 0;
    const totalAmount = data.totalDue + txnCharge - cashBack;
    var serviceCharge = 0;
    if (parseInt(data.totalDue) > 500) {
      serviceCharge = 5;
    }
    this.state = {
      isLoading: false,
      accountNo: model.accountNo,
      counterNo: model.counterNo,
      counterName: model.counterName,
      scNo: model.scNo,
      customerId: model.customerId,
      customerName: data.customerName,
      sessionId: data.sessionId,
      totalDue: data.totalDue,
      // amount: data.data.due_bills.payable_amount,
      // cashBack: cashBack,
      // txnCharge: txnCharge,
      // totalAmount: totalAmount,
      serviceCharge: serviceCharge,
      billDetail: data.billDetail,
      payableAmount: data.totalDue, // totalDue= advance + due till previous month
      showpin: false,
      spinner: false,
      isFavourite: data.isFavourite,
      note: model.note,
      confirmationData: [
        {
          label: "Account No :",
          value: model.accountNo,
        },
        {
          label: "Counter :",
          value: model.counterName,
        },
        {
          label: "Sc No :",
          value: model.scNo,
        },
        {
          label: "Customer ID :",
          value: model.customerId,
        },
        {
          label: "Customer Name :",
          value: data.customerName,
          styleLabel: [{ color: "red" }],
        },
        {
          label: "Due Amount :",
          value: data.totalDue,
        },
        {
          label: "Service Charge :",
          value: serviceCharge,
        },
      ],
      transactionId: null,
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: `NEA Payment Confirmation`,
    });
    this.generateUniqueID();
  }
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  render() {
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    const tableHead = ["Due Date", "Bill Amount", "Rebate/Fine", "Payable Amt"];

    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView>
          {this.state.showpin == false && (
            <View style={{ margin: 10 }}>
              <ConfirmationView
                confirmationData={this.state.confirmationData}
                amount={this.state.payableAmount} //payable amount
                serviceKey="NEA_PAYMENT"
              />
              <View>
                <View style={{ paddingBottom: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>Bill Detail</Text>
                </View>
                <Table borderStyle={{ borderWidth: 0, borderColor: "#c8e1ff" }}>
                  <Row
                    style={styles.header}
                    data={tableHead}
                    textStyle={styles.headerText}
                    borderStyle={{ borderWidth: 0 }}
                  />
                </Table>
                <Table
                  style={{
                    color: "#474747",
                    fontSize: 18,
                    fontFamily: "Regular",
                  }}
                >
                  {this.state.billDetail.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      style={[
                        styles.row,
                        index % 2 && { backgroundColor: "#fff" },
                      ]}
                      textStyle={styles.text}
                    ></Row>
                  ))}
                </Table>
              </View>

              <View>
                <TouchableOpacity
                  onPress={async () => {
                    if (this.state.isLoading == false) {
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
          )}
          {this.state.showpin == true && (
            <KeyboardPin callback={this.PinMatched} />
          )}
        </ScrollView>
      </>
    );
  }
  PinMatched = (status) => {
    if (status) {
      this.setState({ showpin: false });
      this.ProcessPayment();
    } else {
      this.setState({ showpin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  checkBalance = async () => {
    var message = await helpers.CheckAmount({
      accountNumber: this.state.accountNo,
      amount: parseInt(this.state.payableAmount),
      isCheckCompanyBalance: true,
      isCheckUtilityBalance: true,
    });
    if (message != "") {
      ToastMessage.Long(message);
    }
    return message == "" ? true : false;
  };
  ProcessPayment = async () => {
    let isSuccess = false;
    this.setState({ isLoading: true, spinner: true });
    if (!(await this.checkBalance())) {
      this.setState({ isLoading: false, spinner: false });
      return isSuccess;
    }
    var user = JSON.parse(await AsyncStorage.getItem("UserInfo"));
    var data = qs.stringify({
      ConsumerId: this.state.customerId,
      ScNo: this.state.scNo,
      OfficeCode: this.state.counterNo,
      UniqueId: this.state.transactionId,
      AccountNo: this.state.accountNo,
      SessionId: this.state.sessionId,
      UserId: user.Id,
      Amount: parseInt(this.state.payableAmount),
      IsFavourite: this.state.isFavourite,
      Note: this.state.note,
      ServiceCharge: this.state.serviceCharge,
    });
    var response = await (await request())
      .post(api.Nea.MakePayment, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        isSuccess = true;
        this.setState({ isLoading: false, spinner: false });
        this.props.navigation.navigate("NeaPaymentSuccess", {
          data: this.state.confirmationData,
          logId: response.data.Data,
        });
      } else {
        this.setState({ isLoading: false, spinner: false });
        ToastMessage.Short(response.data.Message);
        this.generateUniqueID();
      }
    } else {
      this.setState({ isLoading: false, spinner: false });
      ToastMessage.Short("Error Ocurred Contact Support");
      this.generateUniqueID();
    }
    this.setState({ isLoading: false });
    return isSuccess;
  };
}

export class NeaPaymentSuccess extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "",
    });
  }
  render() {
    const { data, logId } = this.props.route.params;
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
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
  signInContainer: {
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
  socialConnect: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA",
  },

  inputIcons: {
    marginRight: 12,
  },
  card: {
    backgroundColor: "#fff",
    paddingBottom: 5,
    marginTop: 30,
    paddingTop: 10,
    marginBottom: 5,
    paddingStart: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-between",
    padding: 10,
  },
  value: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
  label: {
    color: "#000",
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
  header: { height: 40, borderWidth: 0, backgroundColor: "grey" },
  headerText: { color: "#fff", textAlign: "center" },
  text: { textAlign: "center", fontFamily: "Regular" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#eee" },
});

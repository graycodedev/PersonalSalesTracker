import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  ScrollView,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";
import DropDownPicker from "react-native-dropdown-picker";
import { RegularInputText } from "../../../components/Input";
import api from "../../../constants/Api";
import { ButtonPrimary } from "../../../components/Button";
import { ConfirmationView } from "../../../components/Confirmation";
import { SuccessView } from "../../../components/SuccessView";
import helpers from "../../../constants/Helpers";
import { Table, Row } from "react-native-table-component";
import request from "../../../config/RequestManager";
import KeyboardPin from "../../../components/KeyBoard";
import Spinner from "react-native-loading-spinner-overlay";
import ToastMessage from "../../../components/Toast/Toast";
import { Colors } from "../../style/Theme";
import FavouriteStyles from "../../style/favouriteStyle";
import { CustomDropdown } from "../../../components/CustomDropdown";
import uuid from "react-native-uuid";
const { width, height } = Dimensions.get("screen");
export class CommunityWaterPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      accountNo: "0",
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
      customerId: "",
      counterNo: "", //245
      counterName: "Select Counter",
      counterError: "",
      customerCode: "", //21720
      customerCodeError: "",
      billDetail: [],
      totalDue: 0,
      serviceCharge: 0,
      isFavourite: false,
      favouriteList: [],
      note: "",
      noteError: "",
      address: "",
      mobileNo: "",
      currentMonthDues: "",
      currentMonthDiscount: "",
      currentMonthFine: "",
      toralCreditSalesAmlount: "",
      totalAdvanceAmount: "",
      previousDues: "",
      minimumPayableAmount: "",
      totalDues: "",
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Community Water Payment`,
    });
    this.GetAccountList();
    this.GetCountersList();
    this.GetFavourite();
  }
  GetFavourite = async () => {
    var response = await (await request())
      .get(api.Favourite.CommmunityKhanepani)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        if (response.data.Data.length > 0) {
          this.setState({ favouriteList: response.data.Data });
        } else {
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
      .get(api.CommmunityKhanepani.ListCounters)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        if (response.data.Data.length > 0) {
          var arr = [
            {
              label: "Select Counter",
              value: "0",
            },
          ];
          for (let a of response.data.Data) {
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
    let companyId = await helpers.GetCompanyId();
    let companyCode = await helpers.GetCompanyCode();
    var data = qs.stringify({
      ClientId: companyId,
      CompanyId: companyId,
      CompanyCode: companyCode,
      SecretKey: api.SecretKey,
      UserId: userId,
      Counter: this.state.counterNo,
      CustomerCode: this.state.customerCode,
    });
    var response = await (await request())
      .get(
        api.CommmunityKhanepani.GetDetails +
          "?MonthId=" +
          1 +
          "&CustomerCode=" +
          this.state.customerId +
          "&Counter=" +
          this.state.counterNo
      )
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        isValid = true;
        var responseData = response.data.Data;
        this.setState({
          customerId: this.state.customerId,
          customerCode: responseData.customer_code,
          customerName: responseData.customer_name,
          address: responseData.address,
          mobileNo: responseData.mobile_number,
          currentMonthDues: responseData.current_month_dues,
          currentMonthDiscount: responseData.current_month_discount,
          currentMonthFine: responseData.current_month_fine,
          toralCreditSalesAmlount: responseData.total_credit_sales_amount,
          totalAdvanceAmount: responseData.total_advance_amount,
          previousDues: responseData.previous_dues,
          minimumPayableAmount: responseData.minimum_payable_amount,
          totalDues: parseFloat(responseData.total_dues).toFixed(2),
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
    if (this.state.accountNo.trim() == "0") {
      isvalid = false;
      this.state.accountNoError = "Account no is required !";
    }
    if (this.state.counterNo === "0") {
      isvalid = false;
      this.setState(() => ({ counterError: "Select Counter !" }));
    } else {
      this.setState(() => ({ counterError: "" }));
    }
    if (this.state.customerId.trim() === "") {
      isvalid = false;
      this.setState(() => ({ customerCodeError: "Customer id is required !" }));
    } else {
      this.setState(() => ({ customerCodeError: "" }));
    }
    if (this.state.isFavourite && this.state.note.trim() == "") {
      isvalid = false;
      this.setState(() => ({ noteError: "note is required" }));
    } else {
      this.setState(() => ({ noteError: "" }));
    }
    return isvalid;
  }
  updateSelectedItem(value, label) {
    this.setState({
      counterNo: value,
      counterName: label,
    });
  }
  render() {
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
                defaultValue={this.state.accountNo}
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
                    accountNo: item.value,
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
                type="numeric"
                borderless
                placeholder="Customer Code"
                onChangeText={(text) => {
                  this.setState({ customerId: text });
                }}
                value={this.state.customerId}
              />
              {!!this.state.customerCodeError && (
                <Text style={{ color: "red" }}>
                  {this.state.customerCodeError}
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
                Save this payment
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
                          "CommunityWaterPaymentConfirmation",
                          { data: this.state }
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
              Saved Payments
            </Text>
          </View>
          {this.state.favouriteList.map((data, index) => {
            return (
              <View style={FavouriteStyles.container} key={index}>
                <TouchableOpacity
                  onPress={() => {
                    var counterName = this.state.counterList.find(
                      (arr) => arr.value === data.CounterCode
                    );
                    this.setState({ counterName: counterName.label });
                    this.setState({ counterNo: data.CounterCode });
                    this.setState({ customerCode: data.customerCode });
                  }}
                >
                  <View style={FavouriteStyles.box}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={FavouriteStyles.note} numberOfLines={1}>
                        {data.Note}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text>Customer ID: {data.customerCode}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
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
export class CommunityWaterPaymentConfirmation extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.route.params;
    const cashBack = 0;
    const txnCharge = 0;
    // const totalAmount = data.totalDues + txnCharge - cashBack;
    const totalAmount = data.totalDues;

    this.state = {
      isLoading: false,
      accountNo: data.accountNo,
      counterNo: data.counterNo,
      counterName: data.counterName,
      customerId: data.customerId,
      customerCode: data.customerCode,
      customerName: data.customerName,
      amount: data.totalDues,
      cashBack: cashBack,
      txnCharge: txnCharge,
      totalAmount: totalAmount,
      serviceCharge: data.serviceCharge,
      billDetail: data.billDetail,
      showpin: false,
      spinner: false,
      isFavourite: data.isFavourite,
      note: data.note,
      confirmationData: [
        {
          label: "Account No :",
          value: data.accountNo,
        },
        {
          label: "Counter :",
          value: data.counterName,
        },
        {
          label: "Customer ID :",
          value: data.customerCode,
        },
        {
          label: "Customer Name :",
          value: data.customerName,
          styleLabel: [{ color: "red" }],
        },
        {
          label: "Address :",
          value: data.address,
        },
        {
          label: "Mobile Number :",
          value: data.mobileNo,
        },
        {
          label: "Current Month Dues :",
          value: data.currentMonthDues,
        },
        {
          label: "Current Month Discount :",
          value: data.currentMonthDiscount,
        },
        {
          label: "Current Month Fine :",
          value: data.currentMonthFine,
        },
        {
          label: "Total Credit Sales Amount :",
          value: data.toralCreditSalesAmlount,
        },
        {
          label: "Total Advance Amount :",
          value: data.totalAdvanceAmount,
        },
        {
          label: "Previous Dues :",
          value: data.previousDues,
        },
        {
          label: "Total Dues :",
          value: data.totalDues,
        },
        {
          label: "Bill Amount :",
          value: data.totalDues,
          styleLabel: [{ color: "red" }],
        },
        {
          label: "Service Charge :",
          value: data.serviceCharge,
        },
        {
          label: "Transaction Charge :",
          value: txnCharge,
        },
      ],
      transactionId: null,
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Payment Confirmation`,
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
                amount={this.state.totalAmount}
                serviceKey="COMMUNITY_WATER_PAYMENT"
              />

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

  ProcessPayment = async () => {
    let isSuccess = false;
    this.setState({ isLoading: true, spinner: true });
    var user = JSON.parse(await AsyncStorage.getItem("UserInfo"));
    let companyId = await helpers.GetCompanyId();
    let companyCode = await helpers.GetCompanyCode();
    var data = qs.stringify({
      UniqueId: this.state.transactionId,
      CustomerCode: this.state.customerId,
      Counter: this.state.counterNo,
      Amount: this.state.totalAmount,
      CompanyId: companyId,
      CompanyCode: companyCode,
      SecretKey: api.SecretKey,
      UserId: user.Id,
      BranchId: api.BranchId,
      AccountNo: this.state.accountNo,
      ServiceCharge: this.state.serviceCharge,
      IsFavourite: this.state.isFavourite,
      Note: this.state.note,
    });

    var response = await (await request())
      .post(api.CommmunityKhanepani.MakePayment, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        let logId = response.data.Data;
        isSuccess = true;
        this.setState({ isLoading: false, spinner: false });
        this.props.navigation.navigate("CommunityWaterPaymentSuccess", {
          data: this.state.confirmationData,
          logId: logId,
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

export class CommunityWaterPaymentSuccess extends React.Component {
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

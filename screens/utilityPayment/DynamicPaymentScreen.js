import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import qs from "qs";
import DropDownPicker from "react-native-dropdown-picker";
import { Block, Text, theme, TextInput } from "galio-framework";
import api from "../../constants/Api";
import { ButtonPrimary } from "../../components/Button";
import { ScrollView } from "react-native";
import helpers from "../../constants/Helpers";
const { width, height } = Dimensions.get("screen");
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
import KeyboardPin from "../../components/KeyBoard";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../style/Theme";
export class DynamicPaymentScreen extends React.Component {
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
      internetCustomerCode: props.route.params.Data.UserName,
      newPrice: 0,
      planId: 0,
      spinner: false,
      showPin: false,
      cashback: 0,
      userVisiblePrice: 0,
    };
    this.GetAccountList();
  }
  GetCommissionByKey = async (amount) => {
    try {
      // console.log('gf', this.props.route.params.merchant);
      let merchant = this.props.route.params.merchant;
      let companyId = await helpers.GetCompanyId();
      var url =
        api.UserCommissionRateApi +
        "?companyId=" +
        companyId.toString() +
        "&serviceKey=" +
        merchant.ServiceKey +
        "&amount=" +
        amount;
      var otherCharges = 0;
      var response = await (await request()).get(url);
      //console.log(url,response);
      if (response != null && response != undefined) {
        var cb = parseFloat(response.data);
        this.setState({ cashback: cb });
        let up = parseFloat(amount) + parseFloat(otherCharges) - cb;
        this.setState({ userVisiblePrice: up });
      } else {
        //incase errrr
        this.setState({ userVisiblePrice: amount });
      }
    } catch (e) {
      //incase errrr
      this.setState({ userVisiblePrice: amount });
    }
  };
  componentDidMount() {
    console.log("tttt", this.props.route.params.Data);
    this.props.navigation.setOptions({
      title: `Paying...`,
    });
    const { BillAmount } = this.props.route.params.Data;
    this.GetCommissionByKey(BillAmount);
  }
  onPlanChange = (item) => {
    // console.log("plan",item);
    this.setState({ newPrice: item.price, planId: item.value });
    this.GetCommissionByKey(item.price);
  };
  GetAccountList = async () => {
    var accList = await helpers.GetBankAccoutList();
    this.setState({ accountList: accList });
  };
  SendPayment = async (param) => {
    this.setState({ isLoading: true, spinner: true });
    var apix = api.DynamicPayment;
    var response = await (await request())
      .post(apix, param)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      this.setState({ spinner: false });
      if (response.data.Code == 200) {
        this.setState({ isLoading: false, spinner: false });
        this.props.navigation.navigate("dynamicpaymentconfirm", {
          ...response.data.Data,
          ...param,
        });
      } else {
        this.setState({ isLoading: false, spinner: false });
        ToastMessage.Short(response.data.Message);
      }
    } else {
      this.setState({ isLoading: false, spinner: false });
      ToastMessage.Short("Error Ocurred Contact Support");
      // this.setState({ isLoading: false });
    }
  };
  PinMatched = (status) => {
    if (status) {
      this.setState({ showPin: false, isLoading: true });
      this.Validate();
    } else {
      this.setState({ showPin: true, isLoading: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  Validate = async () => {
    const { newPrice, planId } = this.state;
    let merchant = this.props.route.params.merchant;
    const { BillAmount } = this.props.route.params.Data;
    let payableAmount =
      this.state.newPrice > 0 ? this.state.newPrice : BillAmount;
    let targetResponse = this.props.route.params.Data.TargetResponse;
    let subscriber = "";
    let khanepaniUserId = "";
    if (targetResponse == "tv") {
      subscriber = this.props.route.params.subscriber;
    }
    if (targetResponse == "khanepani") {
      khanepaniUserId = this.props.route.params.customerId;
    }
    const { formFields } = this.props.route.params;
    let companyId = await helpers.GetCompanyId();
    var param = {
      //merchant: merchant,
      planId: planId,
      billingAmount: payableAmount,
      accountNo: this.state.accountNo,
      userId: (await helpers.GetUserInfo()).Id,
      companyId: companyId,
      internetCustomerCode: this.state.internetCustomerCode,
      branchId: 1,
      // subscriber: subscriber,
      // customerId:khanepaniUserId,
      serviceCharge: 0,
    };
    param = { ...param, ...formFields };
    // console.log(param);
    if (this.state.accountNo == 0) {
      ToastMessage.Short("Please select your account");
      return;
    }
    if (payableAmount > 0 && this.state.accountNo != 0) {
      this.SendPayment(param);
      //this.setState({showPin:true,isLoading:true});
    } else {
      ToastMessage.Short("Invalid Input Parameters!");
    }
  };
  PayNow = async () => {
    const { newPrice, planId } = this.state;
    let merchant = this.props.route.params.merchant;
    const { BillAmount } = this.props.route.params.Data;
    let payableAmount =
      this.state.newPrice > 0 ? this.state.newPrice : BillAmount;
    let targetResponse = this.props.route.params.Data.TargetResponse;
    let subscriber = "";
    let khanepaniUserId = "";
    if (targetResponse == "tv") {
      subscriber = this.props.route.params.subscriber;
    }
    if (targetResponse == "khanepani") {
      khanepaniUserId = this.props.route.params.customerId;
    }
    const { formFields } = this.props.route.params;
    let companyId = await helpers.GetCompanyId();
    var param = {
      //merchant: merchant,
      planId: planId,
      billingAmount: payableAmount,
      accountNo: this.state.accountNo,
      userId: (await helpers.GetUserInfo()).Id,
      companyId: companyId,
      internetCustomerCode: this.state.internetCustomerCode,
      branchId: 1,
      // subscriber: subscriber,
      // customerId:khanepaniUserId,
      serviceCharge: 0,
    };
    param = { ...param, ...formFields };
    // console.log(param);
    if (this.state.accountNo == 0) {
      ToastMessage.Short("Please select your account");
      return;
    }
    if (payableAmount > 0 && this.state.accountNo != 0) {
      //this.SendPayment(param);
      this.setState({ showPin: true, isLoading: true });
    } else {
      ToastMessage.Short("Invalid Input Parameters!");
    }
  };
  render() {
    const {
      PaymentMessage,
      RenewalPlans,
      Plan,
      BillAmount,
      Email,
      UserName,
      CustomerName,
      TargetResponse,
      Office,
      HasKhanePaniDetails,
      KhanepaniBills,
    } = this.props.route.params.Data;
    // console.log("", this.props.route.params)
    let dropdownItems = [];
    if (RenewalPlans.length > 0 && RenewalPlans != null) {
      RenewalPlans.map((plan) => {
        dropdownItems.push({
          label: `${plan.PlanName}`,
          value: plan.PlanId,
          price: plan.PlanAmount,
        });
      });
    }
    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "#eee", flex: 1 }}
        >
          {this.state.showPin == false && (
            <>
              <View style={{ margin: 10, marginRight: 15, marginLeft: 15, zIndex: 99 }}>
                <DropDownPicker
                  containerStyle={{ height: 50 }}
                  dropDownMaxHeight={500}
                  style={{ backgroundColor: "#fafafa" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
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
              </View>
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.label}>Customer Name</Text>
                  <Text style={styles.value}>
                    {CustomerName == undefined ? "N/A" : CustomerName}
                  </Text>
                </View>
                {TargetResponse == "khanepani" && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Office</Text>
                    <Text style={styles.value}>
                      {Office == undefined ? "N/A" : Office}
                    </Text>
                  </View>
                )}
                {TargetResponse == "internet" ||
                  (TargetResponse == "tv" && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Plan</Text>
                      <Text style={styles.value}>
                        {Plan == undefined ? "N/A" : Plan}
                      </Text>
                    </View>
                  ))}
                {(TargetResponse == "internet" || TargetResponse == "tv") &&
                  dropdownItems.length > 0 && (
                    <View style={styles.row}>
                      <Text style={styles.label}>Available Package</Text>
                    </View>
                  )}
                {dropdownItems.length > 0 && (
                  <View style={[styles.row, {zIndex: 99}]}>
                    <DropDownPicker
                      dropDownMaxHeight={500}
                      items={dropdownItems}
                      containerStyle={{ height: 50, width: "100%" }}
                      style={{ backgroundColor: "#fafafa" }}
                      itemStyle={{
                        justifyContent: "flex-start",
                      }}
                      dropDownStyle={{ backgroundColor: "#fafafa" }}
                      onChangeItem={(item) => this.onPlanChange(item)}
                    />
                  </View>
                )}
                {HasKhanePaniDetails && (
                  <>
                    <View style={styles.row}>
                      <Text style={styles.label}>Bills</Text>

                      <Text style={styles.value}>
                        {KhanepaniBills.map((bill) => bill.BillFrom).join(",")}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Amount</Text>

                      <Text style={styles.value}>
                        {KhanepaniBills.map((bill) => bill.BillAmount).join(
                          ","
                        )}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Fines</Text>

                      <Text style={styles.value}>
                        {KhanepaniBills.map((bill) => bill.Fine).join(",")}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.label}>Discounts</Text>

                      <Text style={styles.value}>
                        {KhanepaniBills.map((bill) => bill.Discount).join(",")}
                      </Text>
                    </View>
                  </>
                )}
                <View style={styles.row}>
                  <Text style={styles.label}>Payable Amount</Text>
                  <Text style={styles.value}>
                    {this.state.newPrice > 0 ? this.state.newPrice : BillAmount}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Cashback</Text>
                  <Text style={styles.value}>{this.state.cashback}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Total Payable Amount</Text>
                  <Text style={styles.value}>
                    {this.state.userVisiblePrice}
                  </Text>
                </View>
                <View style={{ textAlign: "center" }}>
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    {PaymentMessage != "Success" ? PaymentMessage : ""}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  margin: 20,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    this.PayNow();
                  }}
                >
                  <ButtonPrimary title={"Pay Now"} />
                </TouchableOpacity>
              </View>
            </>
          )}
          {this.state.showPin == true && (
            <KeyboardPin callback={this.PinMatched} />
          )}
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingBottom: 5,
    margin: 20,
    paddingStart: 10,
    borderRadius: 10,
    flex: 0.3,
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
});
const blockStyle = StyleSheet.create({
  rect2: {
    backgroundColor: "#fff",
    width: 180,
    height: 130,
    margin: 5,
    marginRight: 5,
    alignItems: "center",
    borderRadius: 10,
  },
  icon: {
    // color: "rgba(128,128,128,1)",
    fontSize: 0,
    height: 80,
    width: 150,
    marginTop: 10,
  },
  title: {
    fontFamily: "Light",
    color: "rgba(94,108,128,1)",
    fontSize: 20,
    marginTop: 5,
    textAlign: "center",
  },
});

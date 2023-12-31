import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import qs from "qs";
import DropDownPicker from "react-native-dropdown-picker";
import { RegularInputText, AmountInputText } from "../../components/Input";
import api from "../../constants/Api";
import { ButtonPrimary } from "../../components/Button";
import helpers from "../../constants/Helpers";
import { ConfirmationView } from "../../components/Confirmation";
import { SuccessView } from "../../components/SuccessView";
const { width, height } = Dimensions.get("screen");
import KeyboardPin from "../../components/KeyBoard";
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
import uuid from "react-native-uuid";
export class AccountTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromBranchId: "1",
      fromAccountNo: "0",
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      fromAccountNoError: "",
      toBranchId: 1,
      toAccountNo: "",
      amount: "",
      toAccountNoError: "",
      recieverInfo: "",
      amountError: "",
      remarks: "",
      remarksError: "",
    };
    this.GetAccountList();
  }
  GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    this.state.fromAccountNo = arr[0].value;
    this.setState({ accountList: arr });
  };
  validateAmount = (amount) => {
    var regex = /^\d+$/;
    if (!regex.test(amount)) {
      amount = amount.replace(/\D/g, "");
    }
    return amount;
  };
  ValidateRecieversAccount = async () => {
    this.setState({ isLoading: true });
    ToastMessage.Short("Validating Receiver's Account");
    var isValid = false;
    var userId = (await helpers.GetUserInfo()).Id;
    let companyId = await helpers.GetCompanyId();
    let url =
      api.ValidateAccountNo +
      "?userId=" +
      userId +
      "&CompanyId=" +
      companyId +
      "&AccountNo=" +
      this.state.toAccountNo;
    var response = await (await request()).get(url).catch(function(error) {
      ToastMessage.Short("Error Contact Support");
    });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState(() => ({ recieverInfo: response.data.Data.AccName }));
        isValid = true;
      }
    }
    if (!isValid) {
      ToastMessage.Short("Invalid Account No");
    }
    this.setState({ isLoading: false });
    return isValid;
  };
  validateForm() {
    let isvalid = true;
    if (this.state.fromAccountNo == "") {
      isvalid = false;
      this.setState({ fromAccountNoError: "Account no is required !" });
    } else {
      this.setState(() => ({ fromAccountNoError: "" }));
    }
    if (this.state.toAccountNo.trim() === "") {
      isvalid = false;
      this.setState({
        toAccountoError: "Recievers account number is requided !",
      });
    } else {
      this.setState({ toAccountNoError: "" });
    }
    if (this.state.amount.trim() === "") {
      isvalid = false;
      this.setState({ amountError: "Amount is required !" });
    } else {
      this.setState({ amountError: "" });
    }
    if (this.state.remarks.trim() === "") {
      isvalid = false;
      this.setState({ remarksError: "Remarks is required !" });
    } else {
      this.setState({ remarksError: "" });
    }
    return isvalid;
  }
  render() {
    let model = {
      fromBranchId: this.state.fromBranchId,
      fromAccountNo: this.state.fromaccountNo,
      toBranchId: this.state.toBranchId,
      toAccountNo: this.state.toAccountNo,
      recieverInfo: this.state.recieverInfo,
      amount: this.state.amount,
      remarks: this.state.remarks,
    };

    return (
      <ScrollView
        style={{ width: "100%", backgroundColor: "#eee" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "center", margin: 20 }}>
          <View>
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: 16,
                color: "#5E6C80",
                padding: 5,
              }}
            >
              From Account
            </Text>
          </View>
          <View style={{zIndex: 99}}>
            <DropDownPicker
              containerStyle={{ height: 50 }}
              style={{
                backgroundColor: "#fff",
                color: "red",
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
              defaultValue={this.state.fromAccountNo}
              value={this.state.fromaccountNo}
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
            {!!this.state.fromAccountNoError && (
              <Text style={{ color: "red", fontFamily: "Regular" }}>
                {this.state.fromAccountNoError}
              </Text>
            )}
          </View>
          <View>
            <RegularInputText
              key="acName"
              placeholder="Receivers A/C Name"
              onChangeText={(text) => {
                this.setState({ recieverInfo: text });
              }}
              value={this.state.recieverInfo}
            />
          </View>
          <View>
            <RegularInputText
              key="toaccountNo"
              placeholder="Recievers Account No"
              onChangeText={(text) => {
                this.setState({ toAccountNo: text });
              }}
              value={this.state.toAccountNo}
            />

            {!!this.state.toAccountoError && (
              <Text style={{ color: "red", fontFamily: "Regular" }}>
                {this.state.toAccountoError}
              </Text>
            )}
          </View>

          <View>
            <RegularInputText
              key="remarks"
              Keyboradty
              placeholder="Remarks"
              onChangeText={(text) => {
                this.setState({ remarks: text });
              }}
              value={this.state.remarks}
            />
            {!!this.state.remarksError && (
              <Text style={{ color: "red", fontFamily: "Regular" }}>
                {this.state.remarksError}
              </Text>
            )}
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: 16,
                color: "#5E6C80",
                padding: 5,
              }}
            >
              Amount
            </Text>
            <AmountInputText
              key="amount"
              placeholder="Amount"
              onChangeText={(text) => {
                this.setState({ amount: this.validateAmount(text) });
              }}
              value={this.state.amount}
            />
            {!!this.state.amountError && (
              <Text style={{ color: "red", fontFamily: "Regular" }}>
                {this.state.amountError}
              </Text>
            )}
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
                if (this.validateForm()) {
                  if ((await this.ValidateRecieversAccount()) == true) {
                    this.props.navigation.navigate(
                      "AccountTransferConfirmation",
                      { data: this.state }
                    );
                  }
                }
              }}
            >
              <ButtonPrimary title={"Check Transfer"} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
export class AccountTransferConfirmation extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.route.params;
    const transactionCharge = 0;
    const totalAmount = parseFloat(transactionCharge) + parseFloat(data.amount);
    this.state = {
      showPin: false,
      isLoading: false,
      fromBranchId: data.fromBranchId,
      toBranchId: data.toBranchId,
      fromAccountNo: data.fromAccountNo,
      toAccountNo: data.toAccountNo,
      amount: data.amount,
      transactionCharge: transactionCharge,
      totalAmount: totalAmount,
      remarks: data.remarks,
      recieverInfo: data.recieverInfo,
      transactionNo: "",
      confirmationData: [
        {
          label: "From Account No :",
          value: data.fromAccountNo,
        },
        {
          label: "Reciever's AccountNo :",
          value: data.toAccountNo,
        },
        {
          label: "Recievers Account Name :",
          value: data.recieverInfo,
          styleValue: [{ flexWrap: "wrap" }],
        },
        {
          label: "Transaction Charge :",
          value: transactionCharge,
          styleLabel: [{ color: "#FFA500", border: 1 }],
          styleValue: [{ color: "#FFA500" }],
        },
        {
          label: "Total Amount :",
          value: totalAmount,
          styleRow: [{ borderTopWidth: 1, borderTopColor: "green" }],
        },
      ],
      transactionId: null,
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Transfer Confirmation`,
    });
    this.generateUniqueID();
  }
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  isPinMatched = async (status) => {
    if (status) {
      this.setState({ isLoading: true, showPin: false });
      let isSuccess = await this.ProcessAccountTransfer();
      if (isSuccess == true) {
        this.props.navigation.navigate("AccountTransferSuccess", {
          data: this.state.confirmationData,
          logId: this.state.transactionNo,
        });
      }
    } else {
    }
  };
  render() {
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    return (
      <View style={{ flex: 1 }}>
        {this.state.showPin == false && (
          <ScrollView
            horizontal={false}
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ width: "100%", backgroundColor: "#eee" }}
          >
            <ConfirmationView
              confirmationData={this.state.confirmationData}
              amount={this.state.amount}
              serviceKey=""
            />
            <View
              style={{
                flex: 0.2,
                margin: 20,
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity
                color="success"
                onPress={async () => {
                  this.setState({ isLoading: false, showPin: true });
                }}
              >
                <ButtonPrimary title={"PROCEED"} />

                <ActivityIndicator
                  animating={this.state.isLoading}
                  color="#ffa500"
                  style={styles.activityIndicator}
                ></ActivityIndicator>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {this.state.showPin == true && (
          <KeyboardPin callback={this.isPinMatched} />
        )}
      </View>
    );
  }
  ProcessAccountTransfer = async () => {
    let isSuccess = false;
    this.setState({ isLoading: true });
    var user = await helpers.GetUserInfo();
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      TransactionID: this.state.transactionId,
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      UserId: user.Id,
      FromBranchCode: this.state.fromBranchId,
      ToBranchCode: this.state.toBranchId,
      ToComapnayCode: companyId,
      FromAccountNo: this.state.fromAccountNo,
      ToAccountNo: this.state.toAccountNo,
      Amount: this.state.amount,
      Remarks: this.state.remarks,
    });
    // var response = await axios({
    //   method: 'POST',
    //   url: api.AccountTransfer,
    //   data: data,
    //   headers: {
    //     'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    //   }

    // }).catch(function (error) {
    //   ToastMessage.Short("Error Ocurred Contact Support");
    // });
    var response = await (await request())
      .post(api.AccountTransfer, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        response.data.Data;
        this.setState({ transactionNo: response.data.Data });
        isSuccess = true;
      } else {
        this.setState({ isLoading: false });
        ToastMessage.Long(response.data.Message);
        this.generateUniqueID();
      }
    } else {
      this.setState({ isLoading: false });
      ToastMessage.Short("Error Ocurred Contact Support");
      this.generateUniqueID();
    }
    return isSuccess;
  };
}

export class AccountTransferSuccess extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    const { data, logId } = this.props.route.params;
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ width: "100%", backgroundColor: "#eee" }}
        >
          <SuccessView
            title="Transfer Successful"
            data={data}
            logId={logId}
            message=""
          />
          {/* <View style={{ flex: 0.1, justifyContent: 'center', margin: 0 }}>
          <Text style={{ textAlign: 'center' }}>Download Pdf</Text>
        </View> */}
          <View
            style={{
              flex: 0.6,
              margin: 20,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              color="success"
              onPress={() => {
                this.props.navigation.replace("Home");
              }}
            >
              <ButtonPrimary title={"OK"} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const transferhead = StyleSheet.create({
  container: {
    width: "100%",
    height: 115,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  from: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 17,
  },
  accountNumber: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 17,
  },
  accountNumber1: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 12,
    textAlign: "right",
    marginRight: 10,
  },
  balance: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 12,
    marginTop: 0,
    marginLeft: 17,
  },
  balancevalue: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    fontSize: 12,
    marginRight: 10,
    textAlign: "right",
  },
  rect2: {
    width: "90%",
    height: 1,
    backgroundColor: "rgba(174,185,202,1)",
    marginTop: 5,
    marginLeft: 0,
  },
  change: {
    fontFamily: "Regular",
    color: "rgba(174,185,202,1)",
    marginTop: -5,
    padding: 0,
  },
});
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
  inputIcons: {
    marginRight: 12,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
  },
  card: {
    backgroundColor: "#fff",
    flex: 0.7,
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
    fontSize: 16,
    fontFamily: "Medium",
    color: "#687992",
  },
  label: {
    color: "#AEB9CA",
    fontFamily: "Light",
    fontSize: 12,
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

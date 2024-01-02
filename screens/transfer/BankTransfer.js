import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Text,
  Switch,
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
import TransferService from "./TransferService";
import { CustomDropdown } from "../../components/CustomDropdown";
import uuid from "react-native-uuid";
import { Colors } from "../style/Theme";
export class BankTransfer extends React.Component {
  async componentDidMount() {
    this.props.navigation.setOptions({
      title: `Bank Transfer`,
    });
  }
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
      toAccountNo:
        props.route.params && props.route.params.qrscan
          ? props.route.params.qrscan.accountNumber
          : "",
      amount: "",
      toAccountNoError: "",
      recieverInfo:
        props.route.params && props.route.params.qrscan
          ? props.route.params.qrscan.accountName
          : "",
      torecieverInfoError: "",
      amountError: "",
      remarks: "",
      remarksError: "",
      bankList: [
        {
          label: "Select Bank",
          value: "0",
        },
      ],
      toBankId: "",
      toBankIdError: "",
      toBankName: "Select bank",
      transactionCharge: 0,
      isFavourite: false,
      favouriteList: [],
      note: "",
      noteError: "",
    };
  }
  GetFavourite = async () => {
    var response = await (await request())
      .get(api.Favourite.BANKTRANSFER)
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
  
 
  updateSelectedItem(value, label) {
    this.setState({
      toBankId: value,
      toBankName: label,
    });
  }

  updateSavedItem(item) {
    this.setState({
      toAccountNo: item.Subscriber,
      recieverInfo: item.ExtraField1,
      toBankName: item.ExtraField2,
      toBankId: item.ExtraField3,
    });
  }

  updateFavouriteList() {
    this.GetFavourite();
  }
  checkBalance = async () => {
    var message = await helpers.CheckAmount({
      accountNumber: this.state.fromAccountNo,
      amount: this.state.amount,
      isCheckCompanyBalance: true,
      isCheckUtilityBalance: false, //checks banktransfer balance
    });
    if (message != "") {
      ToastMessage.Long(message);
    }
    return message == "" ? true : false;
  };
  ValidateRecieverBank = async () => {
    this.setState({ isLoading: true });
    const { toAccountNo, selectedBank, recieverInfo } = this.state;
    ToastMessage.Short("Validating Receiver's Account");
    var isValid = false;
    let model = {
      account_holder_name: this.state.recieverInfo,
      bank_idx: this.state.toBankId,
      account_no: this.state.toAccountNo,
      CompanyId: 0,
      CompanyCode: 0,
    };
    let response = await TransferService.CheckBankAccount(model);
    if (response != undefined) {
      if (response.Code == 200) {
        isValid = response.Data;
        this.setState({ isLoading: false });
      } else {
        ToastMessage.Short("Please Contact Support Team.");
      }
    } else {
      ToastMessage.Short("Invalid Account No");
    }
    return isValid;
  };
  validateAmount = (amount) => {
    var regex = /^\d+$/;
    if (!regex.test(amount)) {
      amount = amount.replace(/\D/g, "");
    }
    return amount;
  };
  validateForm() {
    let isvalid = true;
    if (this.state.fromAccountNo == "") {
      isvalid = false;
      this.state.fromAccountNoError = "Account no is required !";
    } else {
      this.setState(() => ({ fromAccountNoError: "" }));
    }
    if (this.state.toBankId == "") {
      isvalid = false;
      this.state.toBankIdError = "Account no is required !";
    } else {
      this.setState(() => ({ toBankIdError: "" }));
    }
    if (this.state.toAccountNo.trim() == "") {
      isvalid = false;
      this.setState(() => ({
        toAccountNoError: "Recievers account number is required !",
      }));
    } else {
      this.setState(() => ({ toAccountNoError: "" }));
    }
    if (this.state.recieverInfo.trim() == "") {
      isvalid = false;
      this.setState(() => ({
        torecieverInfoError: "Recievers name is requided !",
      }));
    } else {
      this.setState(() => ({ torecieverInfoError: "" }));
    }
    if (this.state.amount.trim() === "") {
      isvalid = false;
      this.setState(() => ({ amountError: "Amount is required !" }));
    } else {
      if (this.state.amount < 100) {
        isvalid = false;
        this.setState(() => ({
          amountError: "Minimum transfer amount is 100 !",
        }));
      } else {
        this.setState(() => ({ amountError: "" }));
      }
    }
    if (this.state.remarks.trim() === "") {
      isvalid = false;
      this.setState(() => ({ remarksError: "Remarks is required !" }));
    } else {
      this.setState(() => ({ remarksError: "" }));
    }
    if (this.state.remarks.length >= 18) {
      isvalid = false;
      this.setState(() => ({
        remarksError: "Remarks should be less than 18 characters !",
      }));
    } else {
      this.setState(() => ({ remarksError: "" }));
    }
    if (this.state.isFavourite && this.state.note.trim() == "") {
      isvalid = false;
      this.setState(() => ({ noteError: "note is required" }));
    } else {
      this.setState(() => ({ noteError: "" }));
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
      toBankId: this.state.toBankId,
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
              dropDownMaxHeight={500}
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
              <Text style={{ color: "red" }}>
                {this.state.fromAccountNoError}
              </Text>
            )}
          </View>

          {/* {this.state.favouriteList.map((data, index) => {
            return (
              <View style={FavouriteStyles.container} key={index}>
                <TouchableOpacity
                  onPress={() => {
                    var toBankName = this.state.bankList.find(
                      (arr) => arr.value === data.BankCode
                    );
                    this.setState({ toBankName: toBankName.label });
                    this.setState({ toAccountNo: data.receiverAcNo });
                    this.setState({ recieverInfo: data.receiverName });
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
                      <Text>Account No: {data.receiverAcNo}</Text>
                      <Text>Account Name: {data.receiverName}</Text>
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
          )} */}
          <View
            style={{
              flexDirection: "row",
              padding: 5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: 16,
                color: "#5E6C80",
              }}
            >
              Receiver's Info
            </Text>
            <View
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 5,
                padding: 5,
              }}
            >
              <CustomDropdown
                items={this.state.favouriteList}
                searchablePlaceholder="Search Transfers"
                itemSelected={this.updateSavedItem.bind(this)}
                favouriteList
                filterBy={"ExtraField1"}
                updateFavouriteList={this.updateFavouriteList.bind(this)}
                bankTransfer
              />
            </View>
          </View>
          <View style={{}}>
            {/* <DropDownPicker
              searchable={true}
              placeholder="Select Receiver's Bank"
              searchablePlaceholder="search bank"
              zIndex={999}
              dropDownMaxHeight={500}
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
              value={this.state.toBankId}
              items={this.state.bankList}
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
                  toBankId: item.value,
                  toBankName: item.label,
                })
              }
            /> */}
            <CustomDropdown
              items={this.state.bankList}
              placeholder={this.state.toBankName}
              searchablePlaceholder="Search Bank"
              itemSelected={this.updateSelectedItem.bind(this)}
            />
            {!!this.state.toBankIdError && (
              <Text style={{ color: "red" }}>{this.state.toBankIdError}</Text>
            )}
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
            {!!this.state.toAccountNoError && (
              <Text style={{ color: "red" }}>
                {this.state.toAccountNoError}
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
            {!!this.state.torecieverInfoError && (
              <Text style={{ color: "red" }}>
                {this.state.torecieverInfoError}
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
              <Text style={{ color: "red" }}>{this.state.remarksError}</Text>
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
              <Text style={{ color: "red" }}>{this.state.amountError}</Text>
            )}
          </View>
          <View style={{ flex: 1, flexDirection: "row", marginBottom: 15, alignItems:"center"}}>
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
                marginLeft: 6
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
              flex: 1,
              margin: 20,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                if (this.validateForm()) {
                  if ((await this.ValidateRecieverBank()) == true) {
                    if (await this.checkBalance()) {
                      await TransferService.GetTransferServiceCharge(
                        this.state.amount
                      ).then((resp) => {
                        if (resp.Code == 200) {
                          this.setState(
                            { transactionCharge: resp.Data, bankList: [] },
                            () => {
                              let dta = {
                                fromBranchId: this.state.fromBranchId,
                                fromAccountNo: this.state.fromAccountNo,
                                toAccountNo: this.state.toAccountNo,
                                amount: this.state.amount,
                                recieverInfo: this.state.recieverInfo,
                                toBankId: this.state.toBankId,
                                toBankName: this.state.toBankName,
                                remarks: this.state.remarks,
                                isFavourite: this.state.isFavourite,
                                transactionCharge: resp.Data,
                              };
                              this.props.navigation.navigate(
                                "BankTransferConfirmation",
                                { data: dta }
                              );
                            }
                          );
                        } else {
                          this.setState({ isLoading: false });
                          ToastMessage.Short(
                            "Could not load transaction charge"
                          );
                        }
                      });
                    }
                  } else {
                    ToastMessage.Short("Could not verify receiver's account");
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
export class BankTransferConfirmation extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.route.params;
    const totalAmount =
      parseFloat(data.transactionCharge) + parseFloat(data.amount);
    this.state = {
      showPin: false,
      isLoading: false,
      fromBranchId: data.fromBranchId,
      toBranchId: data.toBranchId,
      fromAccountNo: data.fromAccountNo,
      toBankId: data.toBankId,
      toAccountNo: data.toAccountNo,
      toBankName: data.toBankName,
      amount: data.amount,
      transactionCharge: data.transactionCharge,
      totalAmount: totalAmount,
      remarks: data.remarks,
      recieverInfo: data.recieverInfo,
      isFavourite: data.isFavourite,
      transactionNo: "",
      confirmationData: [
        {
          label: "To Bank  :",
          value: data.toBankName,
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
          label: "Transfer Amount :",
          value: data.amount,
        },
        {
          label: "From Account No :",
          value: data.fromAccountNo,
        },
        {
          label: "Transaction Charge :",
          value: data.transactionCharge,
          styleLabel: [{ color: "#FFA500", border: 1 }],
          styleValue: [{ color: "#FFA500" }],
        },
        {
          label: "Remarks: ",
          value: data.remarks,
          styleValue: [{ flexWrap: "wrap" }],
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

  async componentDidMount() {
    this.props.navigation.setOptions({
      title: `Bank Transfer Confirmation`,
    });
    this.generateUniqueID();
  }
  isPinMatched = async (status) => {
    if (status) {
      this.setState({ isLoading: true, showPin: false });
      let isSuccess = await this.ProcessBankTransfer();
      if (isSuccess == true) {
        this.props.navigation.navigate("BankTransferSuccess", {
          data: this.state.confirmationData,
          logId: this.state.transactionNo,
        });
      }
    } else {
      ToastMessage.Short("Invalid pin");
    }
  };
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
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
  ProcessBankTransfer = async () => {
    this.setState({ isLoading: true });
    var user = await helpers.GetUserInfo();
    let companyId = await helpers.GetCompanyId();
    let companyCode = await helpers.GetCompanyCode();
    var data = {
      TranscationId: this.state.transactionId,
      CompanyId: companyId,
      CompanyCode: companyCode,
      BranchId: api.BranchId,
      account_holder_name: this.state.recieverInfo,
      bank_idx: this.state.toBankId,
      BankName: this.state.toBankName,
      account_no: this.state.toAccountNo,
      UserId: user.Id,
      FromAccountNo: this.state.fromAccountNo,
      amount: this.state.amount,
      ServiceCharge: this.state.ServiceCharge,
      remarks: this.state.remarks,
      isFavourite: this.state.isFavourite,
    };
    var response = await TransferService.TransferToBank(data);
    if (response != undefined) {
      if (response.Code == 200) {
        this.setState({ transactionNo: response.Data });
        this.generateUniqueID();
        return true;
      } else {
        this.setState({ isLoading: false });
        ToastMessage.Long(response.Message);
        this.generateUniqueID();
        return false;
      }
    } else {
      this.setState({ isLoading: false });
      ToastMessage.Short("Error Ocurred Contact Support");
      this.generateUniqueID();
      return false;
    }
  };
}

export class BankTransferSuccess extends React.Component {
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
            message=""
            logId={logId}
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

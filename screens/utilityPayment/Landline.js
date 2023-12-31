import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";
import DropDownPicker from "react-native-dropdown-picker";
import { Block, Text } from "galio-framework";
import uuid from "react-native-uuid";
import { RegularInputText } from "../../components/Input";
import api from "../../constants/Api";
import { ScrollView } from "react-native";
import { ButtonPrimary } from "../../components/Button";
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
const { width, height } = Dimensions.get("screen");
import KeyboardPin from "../../components/KeyBoard";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../style/Theme";
import { ConfirmationView } from "../../components/Confirmation";
import helpers from "../../constants/Helpers";
import { SuccessView } from "../../components/SuccessView";
const minLandlineAmt = 10;
const maxLandlineAmt = 5000;
const minAdslAmt = 10;
const maxAdslAmt = 10000;
export class Landline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountNo: "0",
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      accountNoError: "",
      serviceType: "LP",
      serviceTypeList: [
        {
          label: "Landline Payment",
          value: "LP",
        },
        {
          label: "Adsl Payment",
          value: "AP",
        },
        {
          label: "Adsl Unlimited Payment",
          value: "AUP",
        },
      ],
      serviceTypeError: "",
      phoneNumber: "",
      amount: "",
      phoneNumberError: "",
      amountError: "",
    };
    this.GetAccountList();
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Landline/Adsl Payment`,
    });
  }
  GetAccountList = async () => {
    var data = await helpers.GetBankAccoutList();
    if (data != null) {
      this.setState({ accountList: data });
    }
  };

  validatePhoneNumber = (phoneNumber) => {
    var regex = /^\d+$/;
    if (!regex.test(phoneNumber)) {
      phoneNumber = phoneNumber.replace(/\D/g, "");
    }
    return phoneNumber;
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
    if (this.state.accountNo == "") {
      isvalid = false;
      this.state.accountNoError = "Account no is required !";
    }
    if (this.state.phoneNumber.trim() === "") {
      isvalid = false;
      this.setState(() => ({ phoneNumberError: "Phone number is requided !" }));
    } else {
      if (
        this.state.phoneNumber.length < 8 ||
        this.state.phoneNumber.length > 9
      ) {
        isvalid = false;
        this.setState(() => ({ phoneNumberError: "Invalid landline number." }));
      } else {
        this.setState(() => ({ phoneNumberError: null }));
      }
    }
    if (this.state.amount.trim() === "") {
      isvalid = false;
      this.setState(() => ({ amountError: "Amount is required !" }));
    } else {
      if (this.state.serviceType == "LP") {
        if (
          this.state.amount < minLandlineAmt ||
          this.state.amount > maxLandlineAmt
        ) {
          isvalid = false;
          this.setState(() => ({
            amountError:
              "Amount should be in range " +
              minLandlineAmt +
              "-" +
              maxLandlineAmt,
          }));
        } else {
          this.setState(() => ({ amountError: "" }));
        }
      } else {
        if (this.state.amount < minAdslAmt || this.state.amount > maxAdslAmt) {
          isvalid = false;
          this.setState(() => ({
            amountError:
              "Amount should be in range " + minAdslAmt + "-" + maxAdslAmt,
          }));
        } else {
          this.setState(() => ({ amountError: "" }));
        }
      }
    }
    return isvalid;
  }
  render() {
    let model = {
      accountNo: this.state.accountNo,
      phoneNumber: this.state.phoneNumber,
      amount: this.state.amount,
      serviceType: this.state.serviceType,
    };

    return (
      <ScrollView
        style={{ width: "100%", backgroundColor: "#eee" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "center", margin: 20 }}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
            <View style={{ marginTop: 20, marginBottom: 15, zIndex:99 }}>
              <DropDownPicker
                containerStyle={{ height: 50 }}
                style={{
                  backgroundColor: "#fff",
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
                <Text style={{ color: "red", fontFamily: "Regular" }}>
                  {this.state.accountNoError}
                </Text>
              )}
            </View>

            <View style={{ marginBottom: 15 }}>
              <RegularInputText
                key="landlineNo"
                maxLength={10}
                keyboardType="numeric"
                borderless
                placeholder="Landline No"
                onChangeText={(text) => {
                  this.setState({
                    phoneNumber: this.validatePhoneNumber(text),
                  });
                }}
                value={this.state.phoneNumber}
              />
              {!!this.state.phoneNumberError && (
                <Text style={{ color: "red", fontFamily: "Regular" }}>
                  {this.state.phoneNumberError}
                </Text>
              )}
            </View>
            <View style={{ marginBottom: 15, zIndex: 99 }}>
              <DropDownPicker
                containerStyle={{ height: 50 }}
                style={{
                  backgroundColor: "#fff",
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
                items={this.state.serviceTypeList}
                controller={(instance) => (this.controller = instance)}
                onChangeList={(items, callback) => {
                  this.setState(
                    {
                      items,
                    },
                    callback
                  );
                }}
                defaultValue={this.state.serviceType}
                onChangeItem={(item) =>
                  this.setState({
                    serviceType: item.value,
                  })
                }
              />
              {!!this.state.serviceTypeError && (
                <Text style={{ color: "red", fontFamily: "Regular" }}>
                  {this.state.serviceTypeError}
                </Text>
              )}
            </View>
            <View>
              <RegularInputText
                key="amount"
                keyboardType="numeric"
                maxLength={4}
                Keyboradty
                borderless
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
          </KeyboardAvoidingView>
          <View
            style={{
              flex: 1,
              margin: 20,
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (this.validateForm()) {
                  this.props.navigation.navigate("LandlineConfirmation", {
                    data: model,
                  });
                }
              }}
            >
              <ButtonPrimary title={"PROCEED"} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
export class LandlineConfirmation extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.route.params;
    this.state = {
      isLoading: false,
      accountNo: data.accountNo,
      number: data.phoneNumber,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      serviceType: data.serviceType,
      paymentType:
        data.serviceType == "LP" ? "Landline Payment" : "Adsl Payment",
      serviceKey: data.serviceType == "LP" ? "NT_LANDLINE" : "NT_ADSL",
      cashBack: 0,
      totalAmount: "",
      showPin: false,
      spinner: false,
      logId: "",
      confirmationData: [
        {
          label: "Account No :",
          value: data.accountNo,
        },
        {
          label: "Landline No :",
          value: data.phoneNumber,
        },
        {
          label: "Payment Type :",
          value: data.serviceType == "LP" ? "Landline Payment" : "Adsl Payment",
        },
        {
          label: "Amount :",
          value: data.amount,
        },
      ],
      transactionID: null,
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
    this.setState({ transactionID: uid });
  }
  render() {
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        {this.state.showPin == false && (
          <View>
            <ConfirmationView
              confirmationData={this.state.confirmationData}
              amount={this.state.amount}
              serviceKey={this.state.serviceKey}
            />
            <View style={{ margin: 30 }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isLoading: true, showPin: true });
                }}
              >
                <ButtonPrimary title={"CONFIRM"} />
                <ActivityIndicator
                  animating={this.state.isLoading}
                  color="#ffa500"
                  style={styles.activityIndicator}
                ></ActivityIndicator>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {this.state.showPin == true && (
          <KeyboardPin callback={this.PinMatched} />
        )}
      </>
    );
  }
  PinMatched = async (status) => {
    if (status) {
      this.setState({ showPin: false });
      this.ProcessPayment();
    } else {
      this.setState({ showPin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  ProcessPayment = async () => {
    this.setState({ isLoading: true, spinner: true });
    var user = JSON.parse(await AsyncStorage.getItem("UserInfo"));
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      UniqueId: this.state.transactionID,
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      UserId: user.Id,
      AccountNo: this.state.accountNo,
      ServiceType: this.state.serviceType,
      PhoneNumber: this.state.phoneNumber,
      Number: this.state.number,
      Amount: this.state.amount,
      Type: this.state.serviceType == "AP" ? "VolumeBased" : "Unlimited",
    });

    // var response = await axios({
    //   method: 'POST',
    //   url: api.LandlineAdslPayment,
    //   data: data,
    //   headers: {
    //     'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    //   }

    // }).catch(function (error) {
    //   ToastAndroid.show("Error Ocurred Contact Support", ToastAndroid.LONG);
    // });
    if (this.state.serviceType == "LP") {
      var response = await (await request()).post(api.BalanceTopup, data);
      if (response != undefined) {
        if (response.data.Code == 200) {
          this.setState({ isLoading: false, spinner: false });
          this.setState({ logId: response.data.Data });
          this.props.navigation.navigate("LandlineSuccess", {
            data: this.state.confirmationData,
            logId: this.state.logId,
          });
        } else {
          this.setState({ isLoading: false, spinner: false });
          ToastAndroid.show(response.data.Message, ToastAndroid.LONG);
          this.generateUniqueID();
        }
      } else {
        this.setState({ isLoading: false, spinner: false });
        ToastAndroid.show("Error Ocurred Contact Support", ToastAndroid.LONG);
        this.generateUniqueID();
      }
      this.setState({ isLoading: false });
    } else {
      var response = await (await request()).post(api.AdslPayment, data);
      if (response != undefined) {
        if (response.data.Code == 200) {
          this.setState({ isLoading: false, spinner: false });
          this.setState({ logId: response.data.Data });
          this.props.navigation.navigate("LandlineSuccess", {
            data: this.state.confirmationData,
            logId: this.state.logId,
          });
        } else {
          this.setState({ isLoading: false, spinner: false });
          ToastAndroid.show(response.data.Message, ToastAndroid.LONG);
          this.generateUniqueID();
        }
      } else {
        this.setState({ isLoading: false, spinner: false });
        ToastAndroid.show("Error Ocurred Contact Support", ToastAndroid.LONG);
        this.generateUniqueID();
      }
      this.setState({ isLoading: false });
    }
  };
}

export class LandlineSuccess extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.route.params;
    this.state = {
      isLoading: false,
      accountNo: data.accountNo,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      successMessage: "The payment is successfully completed.",
    };
  }
  componentDidMount() {}
  render() {
    const { data, logId } = this.props.route.params;
    const { item, horizontal, full, style, ctaColor, imageStyle } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    return (
      <View>
        {/* <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Account Number:</Text>
            <Text style={styles.value}>{this.state.accountNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Landline Number:</Text>
            <Text style={styles.value}>{this.state.phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount (NPR):</Text>
            <Text style={{ fontWeight: "bold" }}>{this.state.amount}</Text>
          </View>
        </View>
        <Block
          style={{
            paddingTop: 20,
            backgroundColor: "#46A049",
            height: 100,
            borderRadius: 10,
            margin: 20,
          }}
        >
          <Text style={{ color: "#fff", padding: 10, textAlign: "center" }}>
            {this.state.successMessage}
          </Text>
        </Block>
        <Block middle>
          <TouchableOpacity>
            <ButtonPrimary
              color="success"
              style={styles.createButton}
              onPress={() => {
                this.props.navigation.replace("Home");
              }}
            >
              <Text bold size={14} color={"#fff"}>
                GO TO HOME
              </Text>
            </ButtonPrimary>
          </TouchableOpacity>
        </Block> */}
        <SuccessView title={"Topup Successful"} data={data} logId={logId} />
        <View style={{ margin: 20 }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.replace("Home");
            }}
          >
            <ButtonPrimary title="GO TO HOME" />
          </TouchableOpacity>
        </View>
      </View>
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
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: Colors.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
  },
  Logo: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
    marginTop: 50,
  },
  card: {
    backgroundColor: "#fff",
    paddingBottom: 5,
    margin: 20,
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
});

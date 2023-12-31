import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
  ToastAndroid,
  Switch,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import qs from "qs";
import DropDownPicker from "react-native-dropdown-picker";
import helpers from "../../constants/Helpers";
import { RegularInputText } from "../../components/Input";
import api from "../../constants/Api";
import { ButtonPrimary } from "../../components/Button";
import { ScrollView } from "react-native";
import { ConfirmationView } from "../../components/Confirmation";
import { SuccessView } from "../../components/SuccessView";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
const { width, height } = Dimensions.get("screen");
import KeyboardPin from "../../components/KeyBoard";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../style/Theme";
import FavouriteStyles from "../style/favouriteStyle";
import { RetriveContacts } from "../../components/RetriveContacts";
import * as BankingIcons from "../../components/BankingIcons";
import UnfavAPayment from "../../components/UnfavAPayment";
export class TopUp extends React.Component {
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
      phoneNumber: "",
      amount: "",
      phoneNumberError: "",
      amountError: "",
      isFavourite: false,
      favouriteList: [],
      note: "",
      noteError: "",
      spinner: false,
    };
  }
  async componentDidMount() {
    this.props.navigation.setOptions({
      title: `Mobile Topup`,
    });

    await this.GetAccountList();
    await this.GetFavourite();
  }
  GetAccountList = async () => {
    var data = await helpers.GetBankAccoutList();
    this.setState({ accountList: data });
  };
  GetFavourite = async () => {
    var response = await (await request())
      .get(api.Favourite.TopUp)
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
  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  checkBalance = async () => {
    var message = await helpers.CheckAmount({
      accountNumber: this.state.accountNo,
      amount: this.state.amount,
      isCheckCompanyBalance: true,
    });
    if (message != "") {
      ToastMessage.Long(message);
    }
    return message == "" ? true : false;
  };
  validateForm = () => {
    let isvalid = true;
    if (this.state.accountNo == "0") {
      isvalid = false;
      this.setState(() => ({ accountNoError: "Account no is required !" }));
    } else {
      this.setState(() => ({ accountNoError: null }));
    }
    if (this.state.phoneNumber.trim() === "") {
      isvalid = false;
      this.setState(() => ({ phoneNumberError: "Phone number is requided !" }));
    } else {
      if (this.state.phoneNumber.length != 10) {
        isvalid = false;
        this.setState(() => ({ phoneNumberError: "Invalid phone number." }));
      } else {
        this.setState(() => ({ phoneNumberError: null }));
      }
    }
    if (this.state.amount.trim() === "") {
      isvalid = false;
      this.setState(() => ({ amountError: "Amount is required !" }));
    } else {
      this.setState(() => ({ amountError: null }));
    }
    if (parseInt(this.state.amount) < 10) {
      isvalid = false;
      this.setState(() => ({
        amountError: "Amount must be greater than 10 !",
      }));
    } else {
      this.setState(() => ({ amountError: null }));
    }
    if (this.state.isFavourite && this.state.note.trim() == "") {
      isvalid = false;
      this.setState(() => ({ noteError: "note is required" }));
    } else {
      this.setState(() => ({ noteError: null }));
    }
    return isvalid;
  };
  retrivePhoneNumber = (number) => {
    this.setState({ phoneNumber: number });
  };

  render() {
    let model = {
      accountNo: this.state.accountNo,
      phoneNumber: this.state.phoneNumber,
      amount: this.state.amount,
      isFavourite: this.state.isFavourite,
      note: this.state.note,
    };
    return (
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", backgroundColor: "#eee" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            margin: 10,
            alignContent: "center",
          }}
        >
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
            <View style={{ marginHorizontal: 20 }}>
              <View style={{ marginTop: 20, marginBottom: 15, zIndex: 99 }}>
                <DropDownPicker
                  containerStyle={{
                    height: 50,
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

              <View style={styles.numberInputSection}>
                <RetriveContacts
                  topup
                  key="mobileno"
                  maxLength={10}
                  keyboardType="numeric"
                  borderless
                  placeholder="Mobile"
                  onChangeText={(text) => {
                    this.setState({
                      phoneNumber: this.validatePhoneNumber(text),
                    });
                  }}
                  value={this.state.phoneNumber}
                  retriveNumber={this.retrivePhoneNumber}
                />
                {!!this.state.phoneNumberError && (
                  <Text style={{ color: "red", fontFamily: "Regular" }}>
                    {this.state.phoneNumberError}
                  </Text>
                )}
              </View>
              <View style={styles.amountInput}>
                <TextInput
                  placeholder="Amount"
                  keyboardType="numeric"
                  maxLength={4}
                  Keyboradty
                  style={{ fontSize: 12, fontFamily: "Regular", height: 50 }}
                  onChangeText={(text) => {
                    this.setState({ amount: this.validateAmount(text) });
                  }}
                  value={this.state.amount}
                />
                {!!this.state.amountError && (
                  <Text
                    style={{
                      color: "red",
                      fontFamily: "Regular",
                      fontFamily: "Regular",
                    }}
                  >
                    {this.state.amountError}
                  </Text>
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginBottom: 15,
                  marginLeft: 20,
                }}
              ></View>
              <View style={{ flex: 1, flexDirection: "row", marginBottom: 15 }}>
                <Switch
                  trackColor={{ false: "#e2e2e2", true: "#e2e2e2" }}
                  thumbColor={
                    this.state.isFavourite ? Colors.primary : "#c4c4c4"
                  }
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
                    style={{ marginBottom: 20 }}
                    onChangeText={(text) =>
                      this.setState({
                        note: text,
                      })
                    }
                    value={this.state.note}
                  />
                  {!!this.state.noteError && (
                    <Text style={{ color: "red", fontFamily: "Regular" }}>
                      {this.state.noteError}
                    </Text>
                  )}
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={async () => {
                if (this.validateForm()) {
                  if (await this.checkBalance()) {
                    this.props.navigation.navigate("Confirmation", {
                      data: model,
                    });
                  }
                }
              }}
            >
              <View style={styles.proceedButton}>
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 14,
                    color: "#FFFFFF",
                    fontFamily: "Medium",
                  }}
                >
                  PROCEED
                </Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
        <View style={{ backgroundColor: "#F5F5F5", bottom: 20 }}>
          <View
            style={{
              justifyContent: "center",
              // backgroundColor: "white",
              alignItems: "center",
              height: 50,
            }}
          >
            <Text style={styles.savedPayments}>SAVED PAYMENTS </Text>
          </View>
          {this.state.favouriteList.map((data, index) => {
            return (
              <View style={FavouriteStyles.container} key={index}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ phoneNumber: data.Subscriber });
                    this.setState({ amount: data.Amount.toString().slice(1) });
                  }}
                >
                  <View style={FavouriteStyles.box}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{ fontSize: 16, marginBottom: 2 }}
                        numberOfLines={1}
                      >
                        {data.Note}
                      </Text>
                      <Text></Text>
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
                      }}
                    >
                      <Text style={FavouriteStyles.note}>
                        {data.Subscriber}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingRight: 10,
                      }}
                    >
                      <Text style={{ fontSize: 12 }}>
                        {data.TranDate.substr(0, 10)}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <BankingIcons.ArrowDownIcon
                          fill={Colors.primary}
                          style={{
                            width: "200%",
                            height: "200%",
                            alignSelf: "center",
                          }}
                        />
                        <Text style={{ color: "red", fontFamily: "Regular" }}>
                          {data.Amount.toString().slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}
export class TopUpConfirmation extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.route.params;
    const cashBack = 0;
    const totalAmount = data.amount - cashBack;
    var sk = this.CheckMobileOperator(data.phoneNumber);
    this.state = {
      isLoading: false,
      showPin: false,
      accountNo: data.accountNo,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      isFavourite: data.isFavourite,
      note: data.note,
      spinner: false,
      cashBack: 0,
      serviceKey: sk,
      confirmationData: [
        {
          label: "Account No :",
          value: data.accountNo,
        },
        {
          label: "Mobile No :",
          value: data.phoneNumber,
        },
        {
          label: "Amount :",
          value: data.amount,
        },
      ],
      TransactionId: null,
    };
  }
  CheckMobileOperator(phoneNumber) {
    var ntcprepaid = ["984", "986"];
    var ntcPostpaid = ["985"];
    var ntccdmaprepaid = ["974", "976"];
    var ntccdmaPostpaid = ["975"];
    var ncell = ["980", "981", "982"];
    var smart = ["961", "962", "988"];
    var utl = ["972"];
    var x = phoneNumber.substring(0, 3);
    if (ntcprepaid.indexOf(x) > -1) {
      return "NT_PREPAID";
    } else if (ntcPostpaid.indexOf(x) > -1) {
      return "NT_POSTPAID";
    } else if (ntccdmaprepaid.indexOf(x) > -1) {
      return "NT_CDMAPREPAID";
    } else if (ntccdmaPostpaid.indexOf(x) > -1) {
      return "NT_CDMAPOSTPAID";
    } else if (ncell.indexOf(x) > -1) {
      return "NCELL_TOPUP";
    } else if (smart.indexOf(x) > -1) {
      return "SMART_TOPUP";
    } else if (utl.indexOf(x) > -1) {
      return "UTL_TOPUP";
    }
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Topup Confirmation`,
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
    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView>
          {this.state.showPin == false && (
            <View style={{ margin: 10 }}>
              <ConfirmationView
                confirmationData={this.state.confirmationData}
                amount={this.state.amount}
                serviceKey={this.state.serviceKey}
              />
              <View
                style={{
                  flex: 1,
                  margin: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.isLoading == false) {
                      this.setState({ isLoading: true, showPin: true });
                    }
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
        </ScrollView>
      </>
    );
  }
  PinMatched = (status) => {
    if (status) {
      this.setState({ showPin: false });
      this.ProcessTopup();
    } else {
      this.setState({ showPin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  ProcessTopup = async () => {
    this.setState({ isLoading: true, spinner: true });
    var user = JSON.parse(await AsyncStorage.getItem("UserInfo"));
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      UniqueId: this.state.transactionId,
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      UserId: user.Id,
      AccountNo: this.state.accountNo,
      PhoneNumber: this.state.phoneNumber,
      Amount: this.state.amount,
      IsFavourite: this.state.isFavourite,
      note: this.state.note,
    });

    var response = await (await request())
      .post(api.BalanceTopup, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ isLoading: false, spinner: false });
        this.props.navigation.navigate("TopUpSuccess", {
          data: this.state.confirmationData,
          logId: response.data.Data,
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
  };
}

export class TopUpSuccess extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.route.params;
    this.state = {
      isLoading: false,
      accountNo: data.accountNo,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      successMessage:
        "The mobile no " +
        data.phoneNumber +
        " has been successfully topped up.",
    };
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "",
    });
  }

  render() {
    const { data, logId } = this.props.route.params;
    const { style } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    return (
      <View>
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
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
      alignItems: "center",
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
    height: 220,
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
  numberInputSection: {
    width: "100%",
    marginBottom: 12,
  },
  numberInput: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 13,
    justifyContent: "space-between",
    borderRadius: 4,
    flexDirection: "row",
    alignSelf: "center",
  },
  mblIcon: {
    width: "100%",
    alignSelf: "center",
  },
  amountInput: {
    paddingLeft: 12,
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    marginBottom: 12,
    borderRadius: 4,
    alignSelf: "center",
  },
  proceedButton: {
    marginHorizontal: 35,
    height: 50,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 24,
  },
  savedPayments: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  up: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  down: {
    marginTop: 20,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },
  modalButton: {
    height: 40,
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
});

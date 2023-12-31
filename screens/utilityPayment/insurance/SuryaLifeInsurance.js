import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  View,
  Switch,
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
import { RegularInputText } from "../../../components/Input";
import KeyboardPin from "../../../components/KeyBoard";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../style/Theme";

export class SuryaLifeInsurance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      policyNumberError: "",
      dobError: "",
      transactionId: "",
      policyNo: "",
      dob: "",
      note: "",
      noteError: "",
      isFavourite: false,
      spinner: false,
    };
  }
  validateUser = () => {
    var isValid = true;
    if (this.state.policyNo == "") {
      this.setState(() => ({ policyNumberError: "Enter the policy number" }));
      isValid = false;
    }
    if (this.state.dob == "") {
      this.setState(() => ({ amountError: "Enter your date of birth" }));
      isValid = false;
    }
    if (this.state.isFavourite && this.state.note.trim() == "") {
      isvalid = false;
      this.setState(() => ({ noteError: "note is required" }));
    } else {
      this.setState(() => ({ noteError: null }));
    }
    return isValid;
  };
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  GetFavourite = async () => {
    var response = await (await request())
      .get(api.Favourite.Khalti)
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
  GetDetails = async () => {
    let model = {
      policyNo: this.state.policyNo,
      dob: this.state.dob,
      note: this.state.note,
    };
    this.generateUniqueID();
    var response = await (await request())
      .get(
        api.Insurance.GetDetails +
          "?PolicyNo=" +
          this.state.policyNo +
          "&Dob=" +
          this.state.dob +
          "&UniqueId=" +
          this.state.transactionId +
          "&InsuranceName=" +
          "SuryaLife"
      )
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.props.navigation.navigate("Surya Life Payment", {
          data: response.data.Data.Data,
          model: model,
        });
      } else {
        ToastMessage.Short("Invalid Policy No or DOB");
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
    }
  };
  render() {
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
            margin: 10,
            alignContent: "center",
          }}
        >
          <Text style={styles.bold_text}>Policy Number</Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              borderRadius: 5,
              backgroundColor: "white",
              paddingHorizontal: 10,
              marginBottom: 20,
            }}
            placeholder="Policy No..."
            onChangeText={(text) => {
              this.setState({ policyNo: text });
            }}
          />
          {this.state.policyNumberError != "" && (
            <Text style={styles.requiredmessage}>
              {this.state.policyNumberError}
            </Text>
          )}
          <Text style={styles.bold_text}>Date Of Birth</Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              borderRadius: 5,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
            placeholder="yyyy-mm-dd (AD)"
            onChangeText={(text) => {
              this.setState({ dob: text });
            }}
          />

          {this.state.dobError != "" && (
            <Text style={styles.requiredmessage}>{this.state.dobError}</Text>
          )}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 15,
              marginLeft: 20,
            }}
          ></View>
          <View style={{ flex: 1, flexDirection: "row", marginBottom: 15 }}>
            <Switch
              trackColor={{ false: "#e2e2e2", true: "#e2e2e2" }}
              thumbColor={this.state.isFavourite ? Colors.primary : "#c4c4c4"}
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
          <TouchableOpacity
            onPress={async () => {
              if (this.validateUser()) {
                this.GetDetails();
              }
            }}
            style={styles.proceedbtn}
          >
            <Text style={styles.btntext}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export class SuryaLifeInsurancePayment extends React.Component {
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
      amountError: "",
      showamounts: false,
      accountNo: "0",
      customername: data.name,
      //   productName: data.product_name,
      transactionId: data.transaction_id,
      policyNo: model.policyNo,
      dob: model.dob,
      sessionId: data.session_id,
      note: model.note,
      address: data.address,
      uniqueid: null,
      showpin: false,
      isLoading: false,
      paymode: data.paymode,
      fine: data.fine_amount,
      amount: data.amount,
      spinner: false,
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
      this.confirmPayment();
    } else {
      this.setState({ showpin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  confirmPayment = async () => {
    this.setState({ isLoading: true, spinner: true });
    if (!this.userValidation()) {
      return;
    }
    this.generateUniqueID();
    await this.GetUserInfo();
    var data = qs.stringify({
      Amount: this.state.amount,
      PolicyNo: this.state.policyNo,
      SessionId: this.state.sessionId,
      Dob: this.state.dob,
      UniqueId: this.state.uniqueid,
      AccountNo: this.state.accountNo,
      UserId: this.state.userId,
      Note: this.state.note,
      InsuranceName: "SuryaLife",
    });
    var confirmationData = [
      {
        label: "Customer Name :",
        value: this.state.customername,
      },
      {
        label: "Policy No :",
        value: this.state.policyNo,
      },
      {
        label: "Date Of Birth (AD) :",
        value: this.state.dob,
      },
      {
        label: "Amount:",
        value: this.state.amount,
        styleValue: [{ color: "red" }],
      },
    ];
    var response = await (await request())
      .post(api.Insurance.MakePayment, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ isLoading: false, spinner: false });
        this.props.navigation.navigate("Surya Life Success", {
          data: confirmationData,
          logId: response.data.Data,
        });
      } else {
        this.setState({ isLoading: false, spinner: false });
        ToastMessage.Short(response.data.Message);
      }
    } else {
      this.setState({ isLoading: false, spinner: false });
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
                  <Text style={styles.variablename}>Customer Name:</Text>
                  <Text style={styles.value}>{this.state.customername}</Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Policy No :</Text>
                  <Text style={styles.value}>{this.state.policyNo}</Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Date Of Birth (AD) :</Text>
                  <Text style={styles.value}>{this.state.dob}</Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Fine Amount:</Text>
                  <Text style={[styles.value, { color: "red" }]}>
                    {this.state.fine}
                  </Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Amount:</Text>
                  <Text style={[styles.value, { color: "red" }]}>
                    {this.state.amount}
                  </Text>
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

export class SuryaLifeInsuranceSuccessful extends React.Component {
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

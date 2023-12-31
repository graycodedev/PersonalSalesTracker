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

export class WorldLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionId: "",
      username: "",
      emptyusername: false,
    };
  }
  checkifempty = (username) => {
    if (username == "") {
      this.setState({ emptyusername: true });
      return true;
    } else {
      this.setState({ emptyusername: false });
      return false;
    }
  };
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  GetDetails = async () => {
    this.generateUniqueID();
    // var data = qs.stringify({
    //   UniqueId: this.state.transactionId,
    //   Username: this.state.username,
    // });
    var response = await (await request())
      .get(
        api.Worldlink.GetDetails +
          "?uniqueId=" +
          this.state.transactionId +
          "&username=" +
          this.state.username
      )
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.props.navigation.navigate("WorldLink Payment", {
          data: response.data.Data,
        });
      } else {
        ToastMessage.Short("Invalid Username");
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
    }
  };
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} enabled>
        <View style={styles.container}>
          <Text style={styles.bold_text}>Username</Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              borderRadius: 5,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
            placeholder="Username..."
            onChangeText={(text) => {
              this.setState({ username: text });
            }}
          />
          {this.state.emptyusername ? (
            <Text style={styles.requiredmessage}>Username is required !!</Text>
          ) : null}
          <TouchableOpacity
            onPress={async () => {
              if (!this.checkifempty(this.state.username)) {
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

export class WorldLinkPayment extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.route.params;
    this.state = {
      showpackages: false,
      allpackage: data.package_options,
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      accountNo: "0",
      accountNoError: "",
      username: data.username,
      subscribed_package: data.subscribed_package_name,
      remainingdays: data.days_remaining,
      branch: data.branch,
      sessionid: data.session_id,
      packageid: null,
      packagename: "Select a Package",
      packageNameError: "",
      amount: null,
      amountError: "",
      uniqueid: null,
      // userId: null,
      showpin: false,
      isLoading: false,
    };

    this.GetAccountList();
  }
  GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    this.setState({ accountList: arr });
  };
  showpackagelist = () => {
    if (this.state.showpackages) {
      this.setState({ showpackages: false });
    } else {
      this.setState({ showpackages: true });
    }
  };

  validateForm() {
    let isvalid = true;
    if (this.state.accountNo == "0") {
      isvalid = false;
      this.setState(() => ({ accountNoError: "Account no is required !" }));
    } else {
      this.setState(() => ({ accountNoError: "" }));
    }

    if (this.state.packagename == "Select a Package") {
      isvalid = false;
      this.setState(() => ({ packageNameError: "Choose a package !" }));
    } else {
      this.setState(() => ({ packageNameError: "" }));
    }
    return isvalid;
  }
  choosepackage = (item) => {
    this.setState({ packageid: item.packageId });
    this.setState({ packagename: item.packageName });
    this.setState({ amount: item.packageRate });
    this.showpackagelist();
  };
  PackageDropdown = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.showpackagelist()}
          style={{
            marginTop: 10,
            marginBottom: this.state.showpackages ? 5 : 15,
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
          <Text>{this.state.packagename}</Text>
          {this.state.showpackages ? (
            <Icon name="chevron-up" />
          ) : (
            <Icon name="chevron-down" />
          )}
        </TouchableOpacity>
        {this.state.showpackages ? (
          <View style={{ marginBottom: 15 }}>
            {this.state.allpackage.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.choosepackage(item)}
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
                  <Text>{item.packageName}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
        {!!this.state.packageNameError && (
          <Text style={{ color: "red" }}>{this.state.packageNameError}</Text>
        )}
      </View>
    );
  };
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  // GetUserInfo = async () => {
  //   const user = await AsyncStorage.getItem("UserInfo");
  //   if (user != null) {
  //     const u = JSON.parse(user);
  //     this.setState(
  //       {
  //         userId: u.Id,
  //       },
  //       () => {}
  //     );
  //   }
  // };
  PinMatched = (status) => {
    if (status) {
      this.setState({ showpin: false });
      this.confirmpayment();
    } else {
      this.setState({ showpin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  checkBalance = async () => {
    var message = await helpers.CheckAmount({
      accountNumber: this.state.accountNo,
      amount: this.state.amount,
      isCheckCompanyBalance: true,
      isCheckUtilityBalance: true,
    });
    if (message != "") {
      ToastMessage.Long(message);
    }
    return message == "" ? true : false;
  };
  confirmpayment = async () => {
    await this.generateUniqueID();
    if (await this.checkBalance()) {
      // await this.GetUserInfo();
      var data = qs.stringify({
        UniqueId: this.state.transactionId,
        SessionId: this.state.sessionid,
        PackageId: this.state.packageid,
        Amount: this.state.amount,
        UserName: this.state.username,
        // CompanyId: api.CompanyId,
        // CompanyCode: api.CompanyCode,
        // SecretKey: api.SecretKey,
        // UserId: this.state.userId,
        BranchId: api.BranchId,
        AccountNo: this.state.accountNo,
        // ServiceCharge: this.state.serviceCharge,
        // IsFavourite: this.state.isFavourite,
        // Note: this.state.note,
      });
      var confirmationData = [
        {
          label: "From Acc: :",
          value: this.state.accountNo,
        },
        {
          label: "Username: :",
          value: this.state.username,
        },
        {
          label: "Branch: :",
          value: this.state.branch,
        },
        {
          label: "Package name :",
          value: this.state.packagename.replace("SPECIAL OFFER", ""),
        },
        {
          label: "Amount :",
          value: this.state.amount,
        },
      ];
      var response = await (await request())
        .post(api.Worldlink.MakePayment, data)
        .catch(function(error) {
          ToastMessage.Short("Error Ocurred Contact Support");
        });
      // var response = await (await request())
      //   .get(
      //     api.Worldlink.MakePayment +
      //     "?uniqueId=" +
      //     this.state.uniqueid +
      //     "&sessionid=" +
      //     this.state.sessionid +
      //     "&packageid=" +
      //     this.state.packageid +
      //     "&amount=" +
      //     this.state.amount
      //   )
      //   .catch(function (error) {
      //     console.log("error while sending data")
      //   });

      if (response != undefined) {
        if (response.data.Code == 200) {
          this.props.navigation.navigate("WorldLink Successful", {
            data: confirmationData,
            logId: response.data.Data,
          });
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short(response.data.Message);
      }
    }
  };
  render() {
    return (
      <View>
        {/* <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        /> */}
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
              {!!this.state.accountNoError && (
                <Text style={{ color: "red" }}>
                  {this.state.accountNoError}
                </Text>
              )}
              <Text
                style={{ fontSize: 16, fontWeight: "400", textAlign: "center" }}
              >
                You have {this.state.remainingdays} days remaining until your
                package expires. You can pay in advance.
              </Text>
              <View style={styles.detailcontainer}>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Customer Name:</Text>
                  <Text style={styles.valuestyle}>{this.state.username}</Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Subscribed Package:</Text>
                  <Text style={styles.valuestyle}>
                    {this.state.subscribed_package}
                  </Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Branch:</Text>
                  <Text style={styles.valuestyle}>{this.state.branch}</Text>
                </View>
                <Text style={styles.variablename}>Available Package:</Text>
                <View>{this.PackageDropdown()}</View>
                <Text style={styles.variablename}>Amount:</Text>
                <View
                  style={{
                    justifyContent: "center",
                    marginTop: 10,
                    marginBottom: 15,
                    paddingHorizontal: 15,
                    height: 45,
                    width: "100%",
                    alignSelf: "center",
                    backgroundColor: "white",
                    borderRadius: 5,
                  }}
                >
                  <Text>{this.state.amount}</Text>
                </View>
                {!!this.state.amountError && (
                  <Text style={{ color: "red" }}>{this.state.amountError}</Text>
                )}
              </View>

              <View
                style={{
                  flex: 0.2,
                  margin: 20,
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={async () => {
                    if (this.validateForm()) {
                      if (this.state.isLoading == false) {
                        this.setState({ isLoading: true, showpin: true });
                      }
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

export class WorldlinkSuccessful extends React.Component {
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
    fontSize: 14,
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
});

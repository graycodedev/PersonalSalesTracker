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
import { CustomDropdown } from "../../../components/CustomDropdown";

export class MeroTV extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stb: "",
      emptystb: false,
      transactionId: "",
    };
  }
  checkifempty = () => {
    let isValid = false;
    if (this.state.stb == "") {
      this.setState({ emptystb: true });
      isValid = true;
    } else {
      this.setState({ emptystb: false });
    }
    return isValid;
  };
  generateUniqueID() {
    var uid = uuid.v4();
    this.setState({ transactionId: uid });
  }
  GetDetails = async () => {
    this.generateUniqueID();
    var response = await (await request())
      .get(
        api.Tv.GetDetails +
          "?Stb=" +
          this.state.stb +
          "&UniqueId=" +
          this.state.transactionId +
          "&TvName=MeroTv"
      )
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.props.navigation.navigate("MeroTV Payment", {
          data: response.data.Data,
          model: {
            stb: this.state.stb,
          },
        });
      } else {
        ToastMessage.Short("Invalid Stb ID");
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
    }
  };
  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} enabled>
        <View style={styles.container}>
          <Text style={styles.bold_text}>Stb/Customer ID</Text>
          <TextInput
            style={{
              width: "100%",
              height: 45,
              borderRadius: 5,
              backgroundColor: "white",
              paddingHorizontal: 10,
            }}
            placeholder="Stb..."
            onChangeText={(text) => {
              this.setState({ stb: text });
            }}
          />
          {this.state.emptystb ? (
            <Text style={styles.requiredmessage}>Stb ID is required !!</Text>
          ) : null}

          <TouchableOpacity
            onPress={async () => {
              if (!this.checkifempty()) {
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

export class MeroTVPayment extends React.Component {
  constructor(props) {
    super(props);
    const { data, model } = this.props.route.params;
    this.state = {
      showpackages: false,
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
      sessionId: data.session_id,
      offerList: data.offer_list,
      accountError: "",
      amountError: "",
      showamounts: false,
      accountNo: "0",
      choosenOffer: "Choose an offer",
      choosenOfferError: "",
      selectPackageError: "",
      packageList: [],
      stb: model.stb,
      customerName: data?.first_name + " " + data?.last_name,
      code: "",
      uniqueid: null,
      showpin: false,
      isLoading: false,
      showPlans: false,
      packageName: "Select Package",
      days: "",
      renewal_date: "",
      packageId: 0,
      packagePrice: "",
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
    if (this.state.choosenOffer == "Choose an offer") {
      this.setState(() => ({ choosenOfferError: "Select any offer!!" }));
      return isValid;
    }
    if (this.state.packageName == "a") {
      this.setState(() => ({
        selectPackageError: "Select one of the  package!!",
      }));
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
  choosepackage = (item) => {
    this.setState({
      choosenOffer: item.offer_name,
      packageList: item.package_list,
    });

    this.showpackagelist();
  };
  showpackagelist = () => {
    if (this.state.showpackages) {
      this.setState({ showpackages: false });
    } else {
      this.setState({ showpackages: true });
    }
  };

  PackageDropdown = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.showpackagelist();
            this.setState({ packageName: "Select Package" });
          }}
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
          <Text>{this.state.choosenOffer}</Text>
          {this.state.showpackages ? (
            <Icon name="chevron-up" />
          ) : (
            <Icon name="chevron-down" />
          )}
        </TouchableOpacity>
        {this.state.showpackages ? (
          <View style={{ marginBottom: 15 }}>
            {this.state.offerList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    this.choosepackage(item);
                  }}
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
                  <Text>{item.offer_name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
        {!!this.state.choosenOfferError && (
          <Text style={{ color: "red" }}>{this.state.choosenOfferError}</Text>
        )}
      </View>
    );
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
      Amount: this.state.packagePrice,
      Stb: this.state.stb,
      PackageId: this.state.packageId,
      AccountNo: this.state.accountNo,
      UserId: this.state.userId,
      Note: this.state.note,
      Code: this.state.code,
      TvName: "MeroTv",
    });
    var confirmationData = [
      {
        label: "Stb :",
        value: this.state.stb,
      },
      {
        label: "Customer Name :",
        value: this.state.customerName,
      },
      {
        label: "Amount:",
        value: this.state.packagePrice,
        styleValue: [{ color: "red" }],
      },
    ];
    var response = await (await request())
      .post(api.Tv.MakePayment, data)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    this.setState({ isLoading: false });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.props.navigation.navigate("MeroTV Success", {
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
  updateSelectedItem(item) {
    this.setState({
      packageId: item.id,
      packagePrice: item.price,
      packageName: item.name,
    });
  }
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
            <View style={[styles.container, {zIndex: 99}]}>
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
                  <Text style={styles.variablename}>Stb :</Text>
                  <Text style={styles.value}>{this.state.stb}</Text>
                </View>
                <View style={styles.rowdata}>
                  <Text style={styles.variablename}>Customer Name:</Text>
                  <Text style={styles.value}>{this.state.customerName}</Text>
                </View>
              </View>
              <Text style={styles.variablename}>Available Package:</Text>
              <View>{this.PackageDropdown()}</View>
              {this.state.choosenOffer != "Choose an offer" && (
                <CustomDropdown
                  items={this.state.packageList}
                  placeholder={this.state.packageName}
                  searchablePlaceholder="Search Packages"
                  itemSelected={this.updateSelectedItem.bind(this)}
                  updateItem
                  label={"name"}
                  filterBy={"name"}
                />
              )}
              {!!this.state.selectPackageError && (
                <Text style={{ color: "red" }}>
                  {this.state.selectPackageError}
                </Text>
              )}
              {this.state.packageName != "Select Package" && (
                <View>
                  <Text style={styles.bold_text}>Price</Text>
                  <TextInput
                    style={{
                      width: "100%",
                      height: 45,
                      borderRadius: 5,
                      backgroundColor: "white",
                      paddingHorizontal: 10,
                    }}
                    placeholder={String(this.state.packagePrice)}
                    editable={false}
                    placeholderTextColor={Colors.primary}
                  />
                </View>
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

export class MeroTVSuccessful extends React.Component {
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
    marginBottom: 10,
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

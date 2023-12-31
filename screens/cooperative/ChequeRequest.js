import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import qs from "qs";
import Icon from "../../components/Icon";
import api from "../../constants/Api";
import { ButtonPrimary } from "../../components/Button";
import { RegularInputText } from "../../components/Input";
import ToastMessage from "../../components/Toast/Toast";
import request from "../../config/RequestManager";
import helpers from "../../constants/Helpers";
const { width, height } = Dimensions.get("screen");
const ddlNoOfLeaf = [
  {
    label: "10 Leaf",
    value: "10",
    icon: () => <Icon name="flag" size={18} color="#900" />,
  },
  {
    label: "20 Leaf",
    value: "20",
    icon: () => <Icon name="flag" size={18} color="#900" />,
  },
  {
    label: "50 Leaf",
    value: "50",
    icon: () => <Icon name="flag" size={18} color="#900" />,
  },
  {
    label: "100 Leaf",
    value: "100",
    icon: () => <Icon name="flag" size={18} color="#900" />,
  },
];
class ChequeRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      noOfLeaf: "10",
      remarks: "",
      accountNo: "0",
      accountNoError: "",
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
    };
    this.GetAccountList();
  }
  componentDidMount() {
    this.props.navigation.setOptions({
      title: "Request Cheque Book",
    });
  }

  render() {
    return (
      <ScrollView
        style={{ width: "100%", backgroundColor: "#eee" }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ flex: 1, justifyContent: "center", margin: 20 }}>
          <KeyboardAvoidingView>
            <View width={"100%"} style={{ marginBottom: 10, zIndex: 99 }}>
              <DropDownPicker
                containerStyle={{ height: 50 }}
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
            <View width={"100%"} style={{ marginBottom: 10, zIndex: 99 }}>
              <DropDownPicker
                items={ddlNoOfLeaf}
                defaultValue={this.state.noOfLeaf}
                containerStyle={{ height: 50 }}
                style={{
                  font: "Regular",
                  backgroundColor: "#fafafa",
                  zIndex: 999,
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
                dropDownStyle={{ backgroundColor: "#fafafa" }}
                onChangeItem={(item) =>
                  this.setState({
                    noOfLeaf: item.value,
                  })
                }
              />
            </View>
            <View width={"100%"} style={{ marginBottom: 10 }}>
              <RegularInputText
                placeholder="Remarks"
                onChangeText={(remarks) => this.setState({ remarks })}
                //style={{ paddingBottom: 10 }}
                value={this.state.remarks}
                multiline
                numberOfLines={4}
              />
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
              color="primary"
              onPress={() => {
                if (this.validateForm()) {
                  this.ChequeRequest();
                }
              }}
            >
              <ButtonPrimary title={"Request Cheque"} />
              <ActivityIndicator
                animating={this.state.isLoading}
                color="#ffa500"
                style={styles.activityIndicator}
              ></ActivityIndicator>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
  GetAccountList = async () => {
    const accList = await AsyncStorage.getItem("UserAccountsInfo");

    if (accList != null) {
      const acc = JSON.parse(accList);
      if (acc.length > 0) {
        var arr = [];
        for (let a of acc) {
          if (a.AccType != "Loan") {
            const obj = { label: a.AccNum, value: a.AccNum };
            arr.push(obj);
          }
        }
        this.setState({ accountList: arr });
      }
    }
  };
  ChequeRequest = async () => {
    if (this.state.isLoading) {
      return null;
    }
    this.setState({ isLoading: true });
    var user = JSON.parse(await AsyncStorage.getItem("UserInfo"));
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      clientId: companyId,
      SecretKey: api.SecretKey,
      UserId: user.Id,
      AccountNo: this.state.accountNo,
      NoOfLeaf: this.state.noOfLeaf,
      Remarks: this.state.remarks,
    });
    var response = await (await request())
      .post(api.ChequeRequest[0], data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        ToastMessage.Long(response.data.Message);
      } else {
        ToastMessage.Long(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error Ocurred Contact Support");
    }

    this.setState({ isLoading: false });
  };

  validateForm() {
    let isvalid = true;
    if (this.state.accountNo.trim() === "0") {
      isvalid = false;
      this.setState(() => ({ accountNoError: "Select Account No." }));
    } else {
      this.setState(() => ({ accountNoError: null }));
    }
    return isvalid;
  }
}

const styles = StyleSheet.create({
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

export default ChequeRequest;

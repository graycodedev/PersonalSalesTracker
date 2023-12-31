import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  AppRegistry,
} from "react-native";
import React from "react";
import NavigationCard from "../../components/NavigationCard";
import * as SVG from "../../components/BankingIcons";
import { useEffect, useState } from "react";
import { Colors, TEXT } from "../style/Theme";
import SpacedView from "../../components/SpacedView";
import Api from "../../constants/Api";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import { SearchableList } from "../../components/SearchableList";
import CustomModal from "../../components/CustomModal";
import { ButtonPrimary } from "../../components/Button";
import Warning from "../../components/Warning";
import uuid from "react-native-uuid";
import helpers from "../../constants/Helpers";
import QueryString from "qs";
import DropDownPicker from "react-native-dropdown-picker";
import { SuccessView } from "../../components/SuccessView";

import Spinner from "react-native-loading-spinner-overlay";

import utils from "../../components/utils";
import DeviceStorage from "../../config/DeviceStorage";


const LoadAccountList = (props) => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState();
  const [showSearch, setShowSearch] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [remarks, setRemarks] = useState("");

  const [amountError, setAmountError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const [uniqueId, setUniqueId] = useState("");

  const [modeType, setModeType] = useState("");

  const [fromAccountNo, setFromAccountNo] = useState("");

  const [accountList, setAccountList] = useState("");

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPaymentGateway, setSelectedPaymentGateway]= useState("");

  const validateForm = () => {
    let isValid = true;
    setAmountError("");
    setRemarksError("");
    if (amount <= 0) {
      setAmountError("Please input the valid amount !!");
    }
    if (remarks.trim(" ").length == 0) {
      setRemarksError("Please input the remarks !!");
    }
    // if (fromAccountNo == "") {
    //   isValid = false;
    // }
    return isValid;
  };

  useEffect(() => {
    props.navigation.setOptions({
      title: "Add money",
    });
    generateUniqueId();
    getAccountList();
    getPaymentMethods();
    setIsLoading(false);
  }, []);

  const getPaymentMethods = async () => {
    let payMethods = await helpers.GetPaymentMethods();
    if (payMethods) {
      setPaymentMethods(payMethods);
    }
  };

  const onPressNavigationCard = async (pg) => {
    let type= pg.Name.replace(" ", "");
    setModeType(type);
    setSelectedPaymentGateway(pg.ServiceProvider);
    if (type.includes("BANKING")) {
      await getBanksList(type);
      setShowSearch(true);
    } else {
      setShowBankModal(true);
    }
  };
  const getBanksList = async (type) => {
    let route = Api.LoadAccountFromBank.BankingList + "?type=" + type;
    var response = await (await request()).get(route).catch(function(error) {
      ToastMessage.Short("Error! Contact Support");
    });
    if (response != undefined) {
      if (response.data.Code == 200) {
        setBanks(response.data.Data.records);
      } else {
        generateUniqueId();
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error ocurred contact support !");
    }

    if (response != undefined) {
      setBanks(response.data.Data.records);
    } else {
      ToastMessage.Short("Error Loading Banks List");
    }
  };
  const initiateTransfer = async (type) => {
    let data = {};
    if (!type.includes("BANKING")) {
      data = {
        uniqueId: uniqueId,
        referenceId: fromAccountNo,
        remarks: remarks,
        companyId: helpers.GetCompanyId(),
        userId: helpers.GetUserInfo().UserId,
        amount: amount,
        mode: type,
      };
    } else {
      data = {
        uniqueId: uniqueId,
        referenceId: fromAccountNo,
        remarks: remarks,
        bankId: selectedBank.idx,
        bankName: selectedBank.name,
        companyId: helpers.GetCompanyId(),
        userId: helpers.GetUserInfo().UserId,
        amount: amount,
        mode: type,
      };
    }
    let strData = QueryString.stringify(data);
    let url= Api.LoadAccountFromBank.InitiateTransfer+"/" + selectedPaymentGateway+ "/initiate"; 

    var response = await (await request())
      .post(url, strData)
      .catch(function(error) {
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        return response.data.Data;
      } else {
        generateUniqueId();
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error ocurred contact support !");
    }
  };

  const updateSelectedItem = (item) => {
    setSelectedBank(item);
    setShowBankModal(true);
    setModeType(modeType);
  };

  const onClose = () => {
    setShowSearch(false);
  };

  const onInputAmount = (text) => {
    setAmount(text);
  };

  const onInputRemarks = (text) => {
    setRemarks(text);
  };

  const onPressAddMoney = async () => {
    if (validateForm()) {
      setShowBankModal(false);
      await DeviceStorage.saveKey(
        utils.StorageConstants.IsPaymentPolling, 
        "true"
      );
      let data = await initiateTransfer(modeType);
      if (!data) {
        return;
      }
      let paymentUrl = data.payment_url;
      let uniqueId = data.unique_id;

      if (paymentUrl) {
        let webTime = 0;
        let companyId = await helpers.GetCompanyId();
        let strData = QueryString.stringify({
          CompanyId: companyId,
          UniqueId: uniqueId,
        });
        const pollingInterval = setInterval(pollRequest, 3000);
        async function pollRequest() {
          if (
            (await DeviceStorage.getKey(
              utils.StorageConstants.IsPaymentPolling
            )) == "false"
          ) {
            clearInterval(pollingInterval);
          }
          webTime += 3000;
          if (webTime > 1000 * 60 * 3) {
            ToastMessage.Long("Time Limit Reached.. Try Again");
            props.navigation.navigate("Home");
            clearInterval(pollingInterval);
          }
          var response = await (await request()).get(
            Api.LoadAccountFromBank.LookUp+ "/" + selectedPaymentGateway+ "/lookup"+ "?" + strData
          );
          if (response != undefined) {
            if (response.data.Code == 200) {
              if (
                response.data.Message != "Initiated" &&
                response.data.Data.IsConfirmed
              ) {
                clearInterval(pollingInterval);
                let dataModel = response.data.Data;
                let amount = dataModel.Amount;
                let bankName = dataModel.FromInstitutionId;
                let logType = "Load Account From Bank";
                let confirmationData = [
                  {
                    label: "Transaction Type :",
                    value: "Load Account From Bank",
                  },
                  {
                    label: "Reciever's AccountNo :",
                    value: fromAccountNo,
                  },
                  {
                    label: "Amount :",
                    value: amount,
                  },
                  {
                    label: "Bank Name :",
                    value: bankName,
                  },

                  {
                    label: "Transaction Charge :",
                    value: "0",
                    styleLabel: [{ color: "#FFA500", border: 1 }],
                    styleValue: [{ color: "#FFA500" }],
                  },

                  {
                    label: "Status :",
                    value: response.data.Message,
                  },
                  {
                    label: "Total Amount :",
                    value: amount,
                    styleRow: [{ borderTopWidth: 1, borderTopColor: "green" }],
                  },
                ];
                props.navigation.navigate("LoadAccountSuccess", {
                  data: confirmationData,
                  tranDate: dataModel.TranDate,
                });
              }
            } else {
              clearInterval(pollingInterval);
              generateUniqueId();
              ToastMessage.Short(response.data.Message);
            }
          } else {
            clearInterval(pollingInterval);
            ToastMessage.Short("Error ocurred contact support !");
          }
        }
        props.navigation.navigate("WebViewScreen", {
          Title: "Load Account",
          Url: paymentUrl,
          Payment: true,
          OnBackNavigation: "LoadAccountList",
        });
      }
    }
  };

  const generateUniqueId = () => {
    var uid = uuid.v4();
    setUniqueId(uid);
  };

  const getAccountList = async () => {
    const arr = await helpers.GetCreditableBankAccoutList();
    if (arr.length > 0) {
      setAccountList(arr);
      setFromAccountNo(arr[0].value);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        color={Colors.primary}
        visible={isLoading}
        textContent={"loading details..."}
        textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
      />

      <SpacedView spacing={24}>
        {paymentMethods.length > 0 &&
          paymentMethods.map((pg, index) => {
            return (
              <NavigationCard
                key={index}
                icon={
                  <Image
                    style={{ height: 30, width: 50, resizeMode: "center" }}
                    source={{ uri: pg.IconPath }}
                  />
                }
                title={pg.Name}
                body={"Use " + pg.Name}
                onPress={() => onPressNavigationCard(pg)}
              />
            );
          })}
        {showSearch && (
          <SearchableList
            items={banks}
            noItemFoundText={"No banks found"}
            searchablePlaceholder="Search Bank"
            itemSelected={updateSelectedItem}
            filterBy={"name"}
            visible={showSearch}
            onClose={()=>onClose()}
            renderItem={(item) => (
              <View style={styles.item}>
                <Image
                  source={{
                    uri: item.logo,
                  }}
                  style={{
                    height: 50,
                    aspectRatio: 1,
                    resizeMode: "contain",
                  }}
                />
                <Text style={{ marginLeft: 18 }}>{item.name}</Text>
              </View>
            )}
          />
        )}
      </SpacedView>
      {showBankModal && (
        <CustomModal
          visible={showBankModal}
          closeModal={() => setShowBankModal(false)}
          containerStyle={{ marginTop: -100 }}
        >
          <View style={{ width: "100%" }}>
            {selectedBank && (
              <View style={styles.bankNameAndLogo}>
                <Image
                  source={{
                    uri: selectedBank.logo,
                  }}
                  style={{
                    height: 50,
                    aspectRatio: 1,
                    resizeMode: "contain",
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[TEXT.normal.regular.large, { marginLeft: 18 }]}>
                    {selectedBank.name}
                  </Text>
                </View>
              </View>
            )}
            {accountList.length > 0 ? (
              <View style={{ zIndex: 99 }}>
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
                  defaultValue={fromAccountNo}
                  items={accountList}
                  controller={(instance) => (this.controller = instance)}
                  // onChangeList={(items, callback) => {
                  //   this.setState(
                  //     {
                  //       items,
                  //     },
                  //     callback
                  //   );
                  // }}
                  onChangeItem={(item) => setFromAccountNo(item.value)}
                />
              </View>
            ) : (
              <Text>You have no accounts, you cannot add money</Text>
            )}
            <View
              style={{
                borderColor: "lightgray",
                borderRadius: 4,
                borderWidth: 1,
                height: 40,
                justifyContent: "center",
                paddingLeft: 8,
                marginTop: 12,
              }}
            >
              <TextInput
                placeholder="Amount (Rs)"
                onChangeText={(text) => onInputAmount(text)}
                keyboardType="numeric"
              />
            </View>
            <Warning text={amountError} />
            <View
              style={{
                borderColor: "lightgray",
                borderRadius: 4,
                borderWidth: 1,
                height: 40,
                justifyContent: "center",
                paddingLeft: 8,
                marginTop: 12,
              }}
            >
              <TextInput
                placeholder="Remarks"
                onChangeText={(text) => onInputRemarks(text)}
              />
            </View>
            <Warning text={remarksError} />
            <TouchableOpacity
              onPress={() => onPressAddMoney()}
              style={{
                paddingHorizontal: Dimensions.get("screen").width / 5,
                marginTop: 20,
              }}
            >
              <ButtonPrimary title={"Add Money"} />
            </TouchableOpacity>
          </View>
        </CustomModal>
      )}
    </View>
  );
};

const LoadAccountSuccess = (props) => {
  const { data } = props.route.params;
  const { tranDate } = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({
      title: "Load Account Success",
    });
  }, []);
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
          tranDate={tranDate}
        />

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
              props.navigation.replace("Home");
            }}
          >
            <ButtonPrimary title={"OK"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  item: {
    padding: 8,
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  bankNameAndLogo: {
    padding: 4,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export { LoadAccountList, LoadAccountSuccess };

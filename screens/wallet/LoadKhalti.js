import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  ToastAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
  Switch,
  Platform,
} from "react-native";
import api from "../../constants/Api";
import uuid from "react-native-uuid";
import { SuccessView } from "../../components/SuccessView";
import request from "../../config/RequestManager";
import { RegularInputText } from "../../components/Input";
import { RetriveContacts } from "../../components/RetriveContacts";
import DropDownPicker from "react-native-dropdown-picker";
import helpers from "../../constants/Helpers";
import FavouriteStyles from "../style/favouriteStyle";
import Spinner from "react-native-loading-spinner-overlay";
import { ConfirmationView } from "../../components/Confirmation";
import KeyboardPin from "../../components/KeyBoard";
import { ActivityIndicator } from "react-native";
import { ButtonPrimary } from "../../components/Button";
import ToastMessage from "../../components/Toast/Toast";
import qs from "qs";
import { Colors } from "../style/Theme";
export const LoadKhalti = (props) => {
  const [amount, setAmount] = useState("");
  const [khaltiId, setkhaltiId] = useState("");
  const [purposeOptions, setPurposeOptions] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [note, setNote] = useState("");

  const [amountError, setAmountError] = useState(null);
  const [khaltiIdError, setKhaltiIdError] = useState(null);
  const [noteError, setNoteError] = useState(null);
  const [favouriteList, setFavouriteList] = useState([]);

  const retrivePhoneNumber = (number) => {
    setkhaltiId(number);
  };
  const validatePhoneNumber = (phoneNumber) => {
    var regex = /^\d+$/;
    if (!regex.test(phoneNumber)) {
      phoneNumber = phoneNumber.replace(/\D/g, "");
    }
    return phoneNumber;
  };
  const GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    setAccountList(arr);
    if (arr.length > 0) {
      setAccountNumber(arr[0].value);
    }
  };
  const GetPurposeOptions = () => {
    const arr = [
      {
        value: "1",
        label: "Utility Payment",
      },
      {
        value: "2",
        label: "Personal Use",
      },
      {
        value: "3",
        label: "Lend/Borrow",
      },
    ];
    setPurposeOptions(arr);
    setPurpose(arr[0].value);
  };

  useEffect(() => {
    GetAccountList();
    GetFavourite();
    GetPurposeOptions();
  }, []);
  const validateAmount = (amount) => {
    var regex = /^\d+$/;
    if (!regex.test(amount)) {
      amount = amount.replace(/\D/g, "");
    }
    return amount;
  };
  const GetFavourite = async () => {
    var response = await (await request())
      .get(api.Favourite.Khalti)
      .catch(function(error) {
        ToastMessage.Short("Error Ocurred Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        if (response.data.Data.length > 0) {
          setFavouriteList(response.data.Data);
        } else {
        }
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error ocurred contact support !");
    }
  };
  const checkBalance = async () => {
    var message = await helpers.CheckAmount({
      accountNumber: accountNumber,
      amount: amount,
    });
    if (message != "") {
      ToastMessage.Long(message);
    }
    return message == "" ? true : false;
  };
  const validateForm = () => {
    let isvalid = true;
    if (khaltiId.trim() === "") {
      isvalid = false;
      setKhaltiIdError("Khalti ID is required!");
    } else {
      if (khaltiId.length != 10) {
        isvalid = false;
        setKhaltiIdError("Invalid ID");
      } else {
        setKhaltiIdError(null);
      }
    }
    if (amount.trim() === "") {
      isvalid = false;
      setAmountError("Amount is Required!");
    } else {
      if (amount > 25000) {
        isvalid = false;
        setAmountError("Amount should not exceed Rs. 25000! ");
      } else {
        setAmountError(null);
      }
    }
    if (isFavourite && note.trim() == "") {
      isvalid = false;
      setNoteError("Note is Required!");
    } else {
      setNoteError(null);
    }
    return isvalid;
  };
  let model = {
    accountNumber: accountNumber,
    khaltiId: khaltiId,
    amount: amount,
    isFavourite: isFavourite,
    note: note,
  };
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      <KeyboardAvoidingView style={{ marginHorizontal: 10 }}>
        <View style={styles.item}>
          <Text style={styles.label}>Khalti ID</Text>
          <RetriveContacts
            key="mobileno"
            maxLength={10}
            keyboardType="numeric"
            borderless
            placeholder="Khalti ID"
            onChangeText={(text) => {
              setkhaltiId(validatePhoneNumber(text));
            }}
            value={khaltiId}
            retriveNumber={retrivePhoneNumber}
          />
          {!!khaltiIdError && (
            <Text style={{ color: "red", marginTop: 5 }}>{khaltiIdError}</Text>
          )}
        </View>

        <View>
          <Text style={styles.label}>Amount</Text>
          <RegularInputText
            key="amount"
            maxLength={100}
            keyboardType="numeric"
            borderless
            placeholder="Amount"
            value={amount}
            onChangeText={(text) => setAmount(validateAmount(text))}
          />
          {!!amountError && <Text style={{ color: "red" }}>{amountError}</Text>}
        </View>
        <View style={styles.item}>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 15,
              marginLeft: 5,
              marginTop: 7,
            }}
          >
            Purpose
          </Text>
          <View style={{zIndex: 99}}>
            <DropDownPicker
              containerStyle={{ height: 50 }}
              style={{
                backgroundColor: "#fafafa",
                fontFamily: "Medium",
                color: "red",
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
              defaultValue={purpose}
              arrowColor={"#9A9A9A"}
              value={purpose}
              items={purposeOptions}
              onChangeItem={(item) => setPurpose(item.value)}
            />
          </View>
        </View>
        <View style={styles.item}>
          <Text
            style={{
              marginBottom: 10,
              fontSize: 15,
              marginLeft: 5,
              marginTop: 7,
            }}
          >
            Account
          </Text>
          <View style={{zIndex: 99}}>
            <DropDownPicker
              containerStyle={{ height: 50 }}
              style={{
                backgroundColor: "#fafafa",
                fontFamily: "Medium",
                color: "red",
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
              defaultValue={accountNumber}
              arrowColor={"#9A9A9A"}
              value={accountNumber}
              items={accountList}
              onChangeItem={(item) => setAccountNumber(item.value)}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginBottom: 15,
            marginTop: 10,
          }}
        >
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isFavourite ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setIsFavourite(!isFavourite);
            }}
            value={isFavourite}
          />
          <Text
            style={{
              alignSelf: "center",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            save this payment
          </Text>
        </View>
        {isFavourite && (
          <View>
            <RegularInputText
              key="note"
              maxLength={100}
              borderless
              placeholder="Note"
              onChangeText={(text) => setNote(text)}
              value={note}
            />
            {!!noteError && <Text style={{ color: "red" }}>{noteError}</Text>}
          </View>
        )}
        <TouchableOpacity
          style={{ marginVertical: 30 }}
          onPress={async () => {
            if (validateForm()) {
              if (await checkBalance()) {
                props.navigation.navigate("Load Khalti Confirmation", {
                  data: model,
                });
              }
            }
          }}
        >
          <View style={styles.button}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
              Proceed
            </Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <View style={{ backgroundColor: "#eee" }}>
        <View
          style={{
            justifyContent: "center",
            backgroundColor: "#ddd",
            padding: 10,
          }}
        >
          <Text
            style={{ fontSize: 18, textAlign: "center", fontWeight: "bold" }}
          >
            Saved Payments{" "}
          </Text>
        </View>

        {favouriteList.map((data, index) => {
          return (
            <View style={FavouriteStyles.container} key={index}>
              <TouchableOpacity
                onPress={() => {
                  setkhaltiId(data.WalletId);
                  setAmount(data.Amount.toString());
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
                    <Text>{data.WalletId}</Text>
                    <Text>Rs. {data.Amount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
// export default LoadKhalti;

export const LoadKhaltiConfirmation = (props) => {
  const { data } = props.route.params;
  const [transactionId, setTransactionId] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [accountNumber, setAccountNumber] = useState(data.accountNumber);
  const [khaltiId, setKhaltiId] = useState(data.khaltiId);
  const [isFavourite, setIsFavourite] = useState(data.isFavourite);
  const [note, setNote] = useState(data.note);
  const [IosCompanyId, setIosCompanyId] = useState(0);
  const [transactionCode, setTransactionCode] = useState();
  const [confirmationData, setConfirmationData] = useState([
    {
      label: "Account No :",
      value: data.accountNumber,
    },
    {
      label: "Khalti ID :",
      value: data.khaltiId,
    },
    {
      label: "Amount :",
      value: data.amount,
    },
  ]);
  const [amount, setAmount] = useState(data.amount);
  const [isLoading, setIsLoading] = useState(false);
  const PinMatched = (status) => {
    if (status) {
      setShowPin(false);
      handleIos();
      ProcessLoadWallet();
    } else {
      setShowPin(true);
      ToastMessage.Short("Invalid pin code");
    }
  };
  const generateUniqueID = () => {
    var uid = uuid.v4();
    setTransactionId(uid);
  };
  const handleIos = async () => {
    let CompanyDetail = await helpers.GetCompanyInfoIOS();
    setIosCompanyId(CompanyDetail.CompanyDetail);
  };
  const ProcessLoadWallet = async () => {
    setIsLoading(true);
    setSpinner(true);
    var user = await helpers.GetUserInfo();
    let companyId = api.IsAppForMultiple ? IosCompanyId : api.CompanyId;
    var data = qs.stringify({
      TransactionId: transactionId,
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      UserId: user.Id,
      AccountNo: accountNumber,
      WalletId: khaltiId,
      Amount: amount,
      IsFavourite: isFavourite,
      note: note,
    });

    var response = await (await request())
      .post(api.LoadKhalti, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        setTransactionCode(response.data.TransactionCode);
        setIsLoading(false);
        setSpinner(false);
        props.navigation.navigate("Load Khalti Success", {
          data: confirmationData,
          logId: transactionCode,
        });
      } else {
        setIsLoading(false);
        setSpinner(false);
        ToastAndroid.show(response.data.Message, ToastAndroid.LONG);
        generateUniqueID();
      }
    } else {
      setIsLoading(false), setSpinner(false);
      ToastAndroid.show("Error Ocurred Contact Support", ToastAndroid.LONG);
      generateUniqueID();
    }
    setIsLoading(false);
    setSpinner(false);
  };

  useEffect(() => {
    generateUniqueID();
  }, []);

  return (
    <>
      <Spinner
        color={Colors.primary}
        visible={spinner}
        textContent={"We are processing..."}
        textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
      />
      <ScrollView>
        {showPin == false && (
          <View style={{ margin: 10 }}>
            <ConfirmationView
              confirmationData={confirmationData}
              amount={amount}
            />
            <View
              style={{
                flex: 1,
                margin: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (isLoading == false) {
                    setShowPin(true);
                  }
                }}
              >
                <ButtonPrimary title={"CONFIRM"} />
                <ActivityIndicator
                  animating={isLoading}
                  color="#ffa500"
                  style={styles.activityIndicator}
                ></ActivityIndicator>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {showPin == true && <KeyboardPin callback={PinMatched} />}
      </ScrollView>
    </>
  );
};

export const LoadKhaltiSuccess = (props) => {
  const { data, logId } = props.route.params;

  return (
    <View>
      <SuccessView
        title={"Khalti Loaded Successfully"}
        data={data}
        logId={logId}
      />
      <View style={{ margin: 20 }}>
        <TouchableOpacity onPress={() => props.navigation.replace("Home")}>
          <ButtonPrimary title="GO TO HOME" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingBottom: 20,
  },
  label: {
    fontSize: 15,
    marginLeft: 5,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
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

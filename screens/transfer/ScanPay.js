import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  AsyncStorage,
  AppState,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Text
} from "react-native";
import api, { endPoints } from "../../constants/Api";
import qs from "qs";
import tokenManager from "../../config/TokenManager";
import request from "../../config/RequestManager";
import ToastMessage from "../../components/Toast/Toast";
import { ButtonPrimary } from "../../components/Button";
import helpers from "../../constants/Helpers";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Colors } from "../style/Theme";
import KeyboardPin from "../../components/KeyBoard";
import Spinner from "react-native-loading-spinner-overlay";
import DropDownPicker from "react-native-dropdown-picker";
//import {Camera,BarCodeScanner} from 'expo-camera';
import { RegularInputText, AmountInputText } from "../../components/Input";
import { SuccessView } from "../../components/SuccessView";
//import { QRCode } from "react-native-custom-qr-codes-expo";
import { useIsFocused } from "@react-navigation/native";

import Swiper from "react-native-swiper";
import { AccountCard, AccountCardNoQr } from "../../components/Card";
const styles = StyleSheet.create({
  swiper: {
    marginTop: 80,
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.backgroundColor,
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
  activityIndicatorscanning: {
    zIndex: 999,
    position: "absolute",
    left: 0,
    right: 100,
    top: 100,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    paddingBottom: 5,
    margin: 20,
    paddingStart: 10,
    borderRadius: 10,
    flex: 0.3,
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
});
const ScanPay = (props) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [userId, setUserId] = useState(0);
  const [fullName, setFullName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showmerchantModal, setShowMerchantModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pinSetup, setPinSetup] = useState(false);
  const [pincode, setPincode] = useState("");
  const [repincode, setRepincode] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingQrScanning, setIsLoadingQrScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showError, setShowError] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    // console.log("Hello")
    const getCameraPermission = async () => {

      const { status } = await BarCodeScanner.requestPermissionsAsync();

      setCameraPermission(status == "granted");
    };

    tokenManager.restoreNewToken().then(() => {
      GetUserInfo();
    });

    props.navigation.setOptions({
      title: "Scan & Pay",
    });
    const fetchData = async () => {
      await GetUserInfo();
      helpers.GetUserInfo().then((userinfo) => {
        if (userinfo == null) {
          props.navigation.navigate("SignIn");
        }
      });
    };
    fetchData();
    getCameraPermission();
  }, []);

  const setError = (err) => {
    setShowError(err);
    setTimeout(() => {
      setShowError("");
    }, 2000);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    setIsLoadingQrScanning(true);
    setScanned(true);
    let qrscan;
    let qrVendor = "";
    try {
      if (data.indexOf("fonepay.com") >= 0) {
        qrVendor = "FONEPAY";
      } else if (data.indexOf("CompanyName") >= 0) {
        qrVendor = "MOBANX";
      } else if (
        data.indexOf("bankCode") >= 0 ||
        data.indexOf("bankName") >= 0
      ) {
        qrVendor = "BANK";
      } else {
        setIsLoadingQrScanning(false);
        setScanned(false);
        // ToastMessage.Short("Invalid  QR !");
        setError("Invalid QR!");
      }
      if (qrVendor == "FONEPAY") {
        let verifyURL = api.QRPayment.FonePayQrVerify + "?qrData=" + data;
        var resp = await (await request()).get(verifyURL);
        if (resp != undefined) {
          if (resp.data != null && resp.data.Code == 200) {
            props.navigation.navigate("ScanPayConfirmFonePay", {
              data: resp.data.Data,
              PhoneNumber: phoneNumber,
              UserId: userId,
            });
          } else {
            // ToastMessage.Short(resp.data.Message);
            setError(resp.data.Message);
          }
        } else {
          // ToastMessage.Short("Could not validate QR SCAN again !!!");
          setError("Could not validate QR, Scan again!");
        }
      } else if (qrVendor == "MOBANX") {
        try {
          qrscan = JSON.parse(data);
          props.navigation.navigate("ScanPayConfirmAccountTransfer", {
            qrscan: qrscan,
          });
        } catch (e) {
          setError("Invalid QR code");
          // ToastMessage.Short("Invalid QR code");
        }
      } else if (qrVendor == "BANK") {
        try {
          qrscan = JSON.parse(data);
          props.navigation.navigate("BankTransfer", { qrscan: qrscan });
        } catch (e) {
          // ToastMessage.Short("Invalid QR code");
          setError("Invalid QR code");
        }
      } else {
        setError("Invalid QR code");
        // ToastMessage.Short("Invalid QR code");
      }
    } catch (e) {
      setError("Invalid QR code");
      // ToastMessage.Short("Invalid QR code");
    }
    setIsLoadingQrScanning(false);
    setScanned(false);
  };

  const GetUserInfo = async () => {
    const user = await helpers.GetUserInfo();
    if (user != null) {
      setFullName(user.FullName);
      setMemberId(user.UserName);
      setUserId(user.Id);
      setPhoneNumber(user.PhoneNumber);
      () => {
        getAccountList();
      };
    }
  };

  const getAccountList = async () => {
    var accList = await helpers.GetSavingAccounts();
    setAccountList(accList);
  };

  return (
    <>
      <Spinner
        zIndex={999}
        color={Colors.secondary}
        visible={isLoadingQrScanning}
        textContent={"generating information for  QR..."}
        textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 18 }}
      />
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#fff" }}
      >
        <View>
          <Text
            style={{
              fontFamily: "Bold",
              fontSize: 24,
              margin: 10,
              color: "black",
              textAlign: "center",
            }}
          >
            Scan To Pay
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              height: 150,
              width: "100%",
            }}
          >
            {isFocused && cameraPermission && !isLoadingQrScanning && (
              <BarCodeScanner
                // type={Camera.Constants.type.back}
                // barCodeScannerSettings={{
                //   barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                // }}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                width={400}
                height={400}
                style={{}}
              />
            )}
            {!cameraPermission && <Text>No access to camera</Text>}
          </View>

          <View style={{ flex: 1, marginTop: 30 }}>
            <Text
              style={{
                fontFamily: "Bold",
                fontSize: 18,
                color: Colors.HeadingColor,
                textAlign: "center",
              }}
            >
              Move the camera toward QR Code Merchants
            </Text>
            <Text
              style={{
                fontFamily: "Regular",
                marginTop: 10,
                fontSize: 16,
                color: Colors.SubtitleColor,
                textAlign: "center",
              }}
            >
              The scan will take place automatically
            </Text>
            {showError.length != 0 && (
              <View style={{ alignSelf: "center" }}>
                <Text
                  style={{
                    color: "red",
                    fontFamily: "Regular",
                    fontSize: 20,
                  }}
                >
                  {showError}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              flex: 1,
              position: "absolute",
              bottom: 0,
              width: "100%",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Bold",
                  fontSize: 14,
                  marginTop: 27,
                  color: Colors.HeadingColor,
                  textAlign: "center",
                  width: "50%",
                }}
              >
                {" "}
                Or share my code to recieve payment
              </Text>
              {accountList.length > 0 && (
                <TouchableOpacity
                  style={{ margin: 20, width: "40%" }}
                  onPress={() => {
                    props.navigation.navigate("ShareMyQr");
                  }}
                >
                  <ButtonPrimary title={"Share My QR"} />
                  <ActivityIndicator
                    animating={isLoading}
                    color="#ffa500"
                    style={styles.activityIndicator}
                  ></ActivityIndicator>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export class ShareQR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      fullName: "",
      memberId: "",
      phoneNumber: "",
      accountList: [],
      isLoading: false,
      qrData: {
        AccountNumber: "",
        AccountName: "",
        CompanyName: "",
        BranchId: "",
        CompanyId: "",
      },
      updated: false,
      IosCompanyName: "",
      IosCompanyId: 0,
    };
  }
  componentDidMount() {
    tokenManager.restoreNewToken().then(() => {
      this.GetUserInfo();
    });
    this.props.navigation.setOptions({
      title: "Sharing QR to Others",
    });
  }
  handleIos = async () => {
    let companyDetail = await helpers.GetCompanyInfoIOS();
    this.setState({
      IosCompanyName: companyDetail.Name,
      IosCompanyId: companyDetail.CompanyId,
    });
  };
  GetUserInfo = async () => {
    const user = await AsyncStorage.getItem("UserInfo");
    if (user != null) {
      const u = JSON.parse(user);
      this.setState(
        {
          fullName: u.FullName,
          memberId: u.UserName,
          userId: u.Id,
          PhoneNumber: u.PhoneNumber,
        },
        () => {
          this.getAccountList();
        }
      );
    }
  };
  getAccountList = async () => {
    this.setState({ isLoading: true });
    var accList = await helpers.GetSavingAccounts();
    this.setState({ accountList: accList });
    this.setState({ isLoading: false });
    // console.log(accList)
    // if (accList.length > 0) {
    //   let qr = {
    //     AccountNumber: accList[0].AccNum,
    //     AccountName: accList[0].AccName,
    //     CompanyName: api.CompanyName,
    //     CompanyId: api.CompanyId,
    //     BranchId: api.BranchId,
    //   };
    //   this.setState({ qrData: qr, updated: true });
    // }
  };

  render() {
    return (
      <>
        <View style={{ margin: 20 }}>
          <Text
            style={{
              fontFamily: "Regular",
              fontSize: 20,
              color: Colors.HeadingColor,
              textAlign: "center",
            }}
          >
            Share your Qr code to friends,family or others to recieve payments.
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            textAlign: "center",
            alignContent: "center",
            justifyContent: "center",
            margin: 30,
          }}
        >
          <View style={{ height: 400, minHeight: 400, maxHeight: 400 }}>
            <Swiper
              activeDotColor={Colors.primary}
              paginationStyle={{
                bottom: -15,
              }}
              key={this.state.accountList.length}
            >
              {this.state.accountList.length > 0 ? (
                this.state.accountList.map((item, index) => {
                  return (
                    <View style={{ flexDirection: "column" }}>
                      <AccountCardNoQr
                        navigation={this.props.navigation}
                        key={item.AccNum}
                        data={item}
                      />
                      <View
                        style={{
                          marginTop: 80,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* {!api.IsAppForMultiple && (
                          <QRCode
                            size={300}
                            content={JSON.stringify({
                              AccountNumber: item.AccNum,
                              AccountName: item.AccName,
                              CompanyName: api.CompanyName,
                              CompanyId: api.CompanyId,
                              BranchId: api.BranchId,
                            })}
                          />
                        )}
                        {app.IsAppForMultiple && (
                          <QRCode
                            size={300}
                            content={JSON.stringify({
                              AccountNumber: item.AccNum,
                              AccountName: item.AccName,
                              CompanyName: this.state.IosCompanyName,
                              CompanyId: this.state.IosCompanyId,
                              BranchId: api.BranchId,
                            })}
                          />
                        )} */}
                      </View>
                    </View>
                  );
                })
              ) : (
                <>
                  <AccountCardNoQr
                    data={"blank"}
                    navigation={this.props.navigation}
                  />
                  <View
                    style={{
                      marginTop: 80,
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Loading...</Text>
                  </View>
                </>
              )}
            </Swiper>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontFamily: "Light",
                fontSize: 16,
                color: Colors.SubtitleColor,
                textAlign: "center",
              }}
            >
              Let other scan your QR Code
            </Text>
          </View>
        </View>
      </>
    );
  }
}
export class ScanPayConfirmAccountTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showPin: false,
      spinner: false,
      fromAccountNo: "",
      fromBranchId: api.BranchId,
      toBranchId: this.props.route.params.qrscan.BranchId,
      toCompanyId: this.props.route.params.qrscan.CompanyId,
      toAccountNo: this.props.route.params.qrscan.AccountNumber,
      toAccountName: this.props.route.params.qrscan.AccountName,
      toCompanyName: this.props.route.params.qrscan.CompanyName,
      amount: "",
      remarks: "",

      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
    };
  }
  componentDidMount = async () => {
    await this.GetAccountList();
    this.props.navigation.setOptions({
      title: "Payment to QR Scan",
    });
  };
  GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    this.setState({ accountList: arr, fromAccountNo: arr[0].value });
  };
  validateAmount = (amount) => {
    var regex = /^\d+$/;
    if (!regex.test(amount)) {
      amount = amount.replace(/\D/g, "");
    }
    return amount;
  };
  checkForm = () => {
    if (this.state.amount > 0 && this.state.remarks != "") {
      this.setState({ showPin: true });
    }
  };
  PinMatched = (status) => {
    if (true) {
      this.setState({ showPin: false });
      this.TranserMoney();
    } else {
      this.setState({ showPin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  TranserMoney = async () => {
    this.setState({ spinner: true });
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      UserId: user.Id,
      FromBranchCode: this.state.fromBranchId,
      ToBranchCode: this.state.toBranchId,
      ToComapnayCode: this.state.toCompanyId,
      FromAccountNo: this.state.fromAccountNo,
      ToAccountNo: this.state.toAccountNo,
      Amount: this.state.amount,
      Remarks: this.state.remarks,
    });

    let confirmationData = [
      {
        label: "From Account No :",
        value: this.state.fromAccountNo,
      },
      {
        label: "Reciever's AccountNo :",
        value: this.state.toAccountNo,
      },
      {
        label: "Amount :",
        value: this.state.amount,
      },
      {
        label: "Recievers Account Name :",
        value: this.state.toAccountName,
        styleValue: [{ flexWrap: "wrap" }],
      },
      {
        label: "Transaction Charge :",
        value: "0",
        styleLabel: [{ color: "#FFA500", border: 1 }],
        styleValue: [{ color: "#FFA500" }],
      },
      {
        label: "Total Amount :",
        value: this.state.amount,
        styleRow: [{ borderTopWidth: 1, borderTopColor: "green" }],
      },
    ];
    var response = await (await request())
      .post(api.AccountTransfer, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ transactionNo: response.data.Data });
        this.props.navigation.navigate("ScanPaySuccess", {
          data: confirmationData,
          logId: this.state.transactionNo,
        });
      } else {
        this.setState({ isLoading: false });
        ToastMessage.Long(response.data.Message);
      }
    } else {
      this.setState({ isLoading: false });
      ToastMessage.Short("Error Ocurred Contact Support");
    }
  };
  render() {
    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.isloadingQrScanning}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "#eee", flex: 1 }}
        >
          {this.state.showPin == false && (
            <>
              <View
                style={{
                  margin: 10,
                  marginRight: 15,
                  marginLeft: 15,
                  zIndex: 99,
                }}
              >
                <DropDownPicker
                  containerStyle={{ height: 50 }}
                  style={{ backgroundColor: "#fafafa" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  defaultValue={this.state.fromAccountNo}
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
              </View>
              <View style={styles.card}>
                <Text
                  style={{
                    fontFamily: "Regular",
                    margin: 20,
                    fontSize: 20,
                    color: Colors.HeadingColor,
                    textAlign: "center",
                  }}
                >
                  QR Scan Information
                </Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Customer Name</Text>
                  <Text style={styles.value}>
                    {this.state.toAccountName == ""
                      ? "N/A"
                      : this.state.toAccountName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Account Number</Text>
                  <Text style={styles.value}>
                    {this.state.toAccountNo == undefined
                      ? "N/A"
                      : this.state.toAccountNo}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Organization</Text>
                  <Text style={styles.value}>
                    {this.state.CompanyName == undefined
                      ? "N/A"
                      : this.state.CompanyName}
                  </Text>
                </View>
                <View style={{ textAlign: "center" }}>
                  {/* <Text style={{ textAlign: "center", marginTop: 20 }}>{PaymentMessage != "Success" ? PaymentMessage : ""}
            </Text> */}
                </View>
              </View>
              <View style={{ margin: 20 }}>
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
              </View>
              <View style={{ margin: 20 }}>
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
                  <Text style={{ color: "red" }}>
                    {this.state.remarksError}
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
                    this.checkForm();
                  }}
                >
                  <ButtonPrimary title={"Pay Now"} />
                </TouchableOpacity>
              </View>
            </>
          )}
          {this.state.showPin == true && (
            <KeyboardPin callback={this.PinMatched} />
          )}
        </ScrollView>
      </>
    );
  }
}

export class ScanPayConfirmFonePay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showPin: false,
      spinner: false,
      fromAccountNo: "",
      amount: "",
      remarks: "",
      remarksError: "",
      amountError: "",
      fromAccountNoError: "",
      userId: props.route.params.UserId,
      phoneNumber: props.route.params.PhoneNumber,
      merchantName: props.route.params.data.qrMessage.merchantName,
      merchantCode: props.route.params.data.qrMessage.merchantCode,
      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
    };
  }
  componentDidMount = async () => {
    await this.GetAccountList();
    this.props.navigation.setOptions({
      title: "Payment to QR Scan",
    });
  };
  GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    this.setState({ accountList: arr, fromAccountNo: arr[0].value });
  };
  validateAmount = (amount) => {
    var regex = /^\d+$/;
    if (!regex.test(amount)) {
      amount = amount.replace(/\D/g, "");
    }
    return amount;
  };
  checkForm = () => {
    if (
      this.state.amount > 0 &&
      this.state.remarks != "" &&
      this.state.fromAccountNo != ""
    ) {
      this.setState({ showPin: true });
    } else {
      if (this.state.amount < 1) {
        this.setState({ amountError: "amount is required !!" });
      }
      if (this.state.remarks == "") {
        this.setState({ remarksError: "remarks is required !!" });
      }
      if (this.state.fromAccountNo == "") {
        this.setState({ fromAccountNoError: "account is required !!" });
      }
    }
  };
  PinMatched = (status) => {
    if (status) {
      this.setState({ showPin: false });
      this.MerchantPay();
    } else {
      this.setState({ showPin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  MerchantPay = async () => {
    this.setState({ spinner: true });
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      UserId: this.state.userId,
      FromAccountNo: this.state.fromAccountNo,
      merchantName: this.state.merchantName,
      Remarks: this.state.remarks,
      Amount: this.state.amount,
      transactionURI: this.state.merchantCode,
      amountInformation: {
        currency: "NPR",
        amount: this.state.amount,
      },
      requestFields: [
        { key: "initiator", value: this.state.phoneNumber },
        {
          key: "qrType",
          value: "OFFLINE",
        },
        {
          key: "merchantCode",
          value: this.state.merchantCode,
        },
        {
          key: "merchantName",
          value: this.state.merchantName,
        },
        {
          key: "qrRequestId",
          value: "0",
        },
      ],
    });

    let confirmationData = [
      {
        label: "From Account No :",
        value: this.state.fromAccountNo,
      },
      {
        label: "Merchant:",
        value: this.state.merchantName,
      },
      {
        label: "Amount:",
        value: this.state.amount,
      },
      {
        label: "Transaction Charge :",
        value: "0",
        styleLabel: [{ color: "#FFA500", border: 1 }],
        styleValue: [{ color: "#FFA500" }],
      },
      {
        label: "Total Amount :",
        value: this.state.amount,
        styleRow: [{ borderTopWidth: 1, borderTopColor: "green" }],
      },
    ];
    var response = await (await request())
      .post(api.QRPayment.FonePayQrPay, data)
      .catch(function(error) {
        this.setState({ spinner: false });
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ transactionNo: response.data.Data });
        this.props.navigation.navigate("ScanPaySuccess", {
          data: confirmationData,
          logId: this.state.transactionNo,
        });
      } else {
        this.setState({ spinner: false });
        this.setState({ isLoading: false });
        ToastMessage.Long(response.data.Message);
      }
    } else {
      this.setState({ isLoading: false });
      this.setState({ spinner: false });
      ToastMessage.Short("Error Ocurred Contact Support");
    }
    this.setState({ isLoading: false });
    this.setState({ spinner: false });
  };
  render() {
    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "#eee", flex: 1 }}
        >
          {this.state.showPin == false && (
            <>
              <View
                style={{
                  margin: 10,
                  marginRight: 15,
                  marginLeft: 15,
                  zIndex: 99,
                }}
              >
                <DropDownPicker
                  containerStyle={{ height: 50 }}
                  style={{ backgroundColor: "#fafafa" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
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
                  defaultValue={this.state.fromAccountNo}
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
              <View style={styles.card}>
                <Text
                  style={{
                    fontFamily: "Regular",
                    margin: 20,
                    fontSize: 20,
                    color: Colors.HeadingColor,
                    textAlign: "center",
                  }}
                >
                  QR Scan Information
                </Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Merchant</Text>
                  <Text style={styles.value}>
                    {this.state.toAccountName == ""
                      ? "N/A"
                      : this.state.merchantName}
                  </Text>
                </View>
              </View>
              <View style={{ margin: 20 }}>
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
              <View style={{ margin: 20 }}>
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
                  <Text style={{ color: "red" }}>
                    {this.state.remarksError}
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
                    this.checkForm();
                  }}
                >
                  <ButtonPrimary title={"Pay Now"} />
                </TouchableOpacity>
              </View>
            </>
          )}
          {this.state.showPin == true && (
            <KeyboardPin callback={this.PinMatched} />
          )}
        </ScrollView>
      </>
    );
  }
}

export class ScanPayConfirmBankTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showPin: false,
      spinner: false,
      fromAccountNo: "",
      fromBranchId: api.BranchId,
      toBranchId: this.props.route.params.qrscan.BranchId,
      toCompanyId: this.props.route.params.qrscan.CompanyId,
      toAccountNo: this.props.route.params.qrscan.AccountNumber,
      toAccountName: this.props.route.params.qrscan.AccountName,
      toCompanyName: this.props.route.params.qrscan.CompanyName,
      amount: "",
      remarks: "",

      accountList: [
        {
          label: "Select Account No",
          value: "0",
        },
      ],
    };
  }
  componentDidMount = async () => {
    await this.GetAccountList();
    this.props.navigation.setOptions({
      title: "Payment to QR Scan",
    });
  };
  GetAccountList = async () => {
    const arr = await helpers.GetBankAccoutList();
    this.setState({ accountList: arr, fromAccountNo: arr[0].value });
  };
  validateAmount = (amount) => {
    var regex = /^\d+$/;
    if (!regex.test(amount)) {
      amount = amount.replace(/\D/g, "");
    }
    return amount;
  };
  checkForm = () => {
    if (this.state.amount > 0 && this.state.remarks != "") {
      this.setState({ showPin: true });
    }
  };
  PinMatched = (status) => {
    if (status) {
      this.setState({ showPin: false });
      this.TranserMoney();
    } else {
      this.setState({ showPin: true });
      ToastMessage.Short("Invalid pin code");
    }
  };
  TranserMoney = async () => {
    this.setState({ spinner: true });
    let companyId = await helpers.GetCompanyId();
    var data = qs.stringify({
      CompanyId: companyId,
      SecretKey: api.SecretKey,
      UserId: user.Id,
      FromBranchCode: this.state.fromBranchId,
      ToBranchCode: this.state.toBranchId,
      ToComapnayCode: this.state.toCompanyId,
      FromAccountNo: this.state.fromAccountNo,
      ToAccountNo: this.state.toAccountNo,
      Amount: this.state.amount,
      Remarks: this.state.remarks,
    });

    let confirmationData = [
      {
        label: "From Account No :",
        value: this.state.fromAccountNo,
      },
      {
        label: "Reciever's AccountNo :",
        value: this.state.toAccountNo,
      },
      {
        label: "Recievers Account Name :",
        value: this.state.toAccountName,
        styleValue: [{ flexWrap: "wrap" }],
      },
      {
        label: "Amount :",
        value: this.state.amount,
      },
      {
        label: "Transaction Charge :",
        value: "0",
        styleLabel: [{ color: "#FFA500", border: 1 }],
        styleValue: [{ color: "#FFA500" }],
      },
      {
        label: "Total Amount :",
        value: this.state.amount,
        styleRow: [{ borderTopWidth: 1, borderTopColor: "green" }],
      },
    ];
    var response = await (await request())
      .post(api.AccountTransfer, data)
      .catch(function(error) {
        ToastMessage.Short("Error Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        this.setState({ transactionNo: response.data.Data });
        this.props.navigation.navigate("ScanPaySuccess", {
          data: confirmationData,
          logId: this.state.transactionNo,
        });
      } else {
        this.setState({ isLoading: false });
        ToastMessage.Long(response.data.Message);
      }
    } else {
      this.setState({ isLoading: false });
      ToastMessage.Short("Error Ocurred Contact Support");
    }
  };
  render() {
    return (
      <>
        <Spinner
          color={Colors.primary}
          visible={this.state.spinner}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "#eee", flex: 1 }}
        >
          {this.state.showPin == false && (
            <>
              <View
                style={{
                  margin: 10,
                  marginRight: 15,
                  marginLeft: 15,
                  zIndex: 99,
                }}
              >
                <DropDownPicker
                  containerStyle={{ height: 50 }}
                  style={{ backgroundColor: "#fafafa" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
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
                  defaultValue={this.state.fromAccountNo}
                  onChangeItem={(item) =>
                    this.setState({
                      fromAccountNo: item.value,
                    })
                  }
                />
              </View>
              <View style={styles.card}>
                <Text
                  style={{
                    fontFamily: "Regular",
                    margin: 20,
                    fontSize: 20,
                    color: Colors.HeadingColor,
                    textAlign: "center",
                  }}
                >
                  QR Scan Information
                </Text>
                <View style={styles.row}>
                  <Text style={styles.label}>Customer Name</Text>
                  <Text style={styles.value}>
                    {this.state.toAccountName == ""
                      ? "N/A"
                      : this.state.toAccountName}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Account Number</Text>
                  <Text style={styles.value}>
                    {this.state.toAccountNo == undefined
                      ? "N/A"
                      : this.state.toAccountNo}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Organization</Text>
                  <Text style={styles.value}>
                    {this.state.CompanyName == undefined
                      ? "N/A"
                      : this.state.CompanyName}
                  </Text>
                </View>
                <View style={{ textAlign: "center" }}>
                  {/* <Text style={{ textAlign: "center", marginTop: 20 }}>{PaymentMessage != "Success" ? PaymentMessage : ""}
            </Text> */}
                </View>
              </View>
              <View style={{ margin: 20 }}>
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
              </View>
              <View style={{ margin: 20 }}>
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
                  <Text style={{ color: "red" }}>
                    {this.state.remarksError}
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
                    this.checkForm();
                  }}
                >
                  <ButtonPrimary title={"Pay Now"} />
                </TouchableOpacity>
              </View>
            </>
          )}
          {this.state.showPin == true && (
            <KeyboardPin callback={this.PinMatched} />
          )}
        </ScrollView>
      </>
    );
  }
}

export class ScanPaySuccess extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title: `Scan And Pay Success`,
    });
  }
  render() {
    const { data, logId } = this.props.route.params;

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

export default ScanPay;

import React, { useState } from "react";
import {
  Easing,
  Text,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import request from "../config/RequestManager";
import ToastMessage from "../components/Toast/Toast";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createSwitchNavigator } from "react-navigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import Home from "../screens/Home";
import Accounts from "../screens/cooperative/Accounts";
import AccountStatement from "../screens/cooperative/AccountStatement";
import IntrestRate from "../screens/cooperative/IntrestRate";
import ChequeRequest from "../screens/cooperative/ChequeRequest";
import Settings from "../screens/general/Settings";
import ServiceList from "../screens/utilityPayment/ServiceList";
import {
  LoadAccountList,
  LoadAccountSuccess,
} from "../screens/transfer/LoadAccount";

import {
  TopUp,
  TopUpConfirmation,
  TopUpSuccess,
} from "../screens/utilityPayment/TopUp";
import {
  DishHome,
  DishHomePayment,
  DishHomeSuccessful,
} from "../screens/utilityPayment/tv/DishHome";
import {
  PrabhuTV,
  PrabhuTVPayment,
  PrabhuTVSuccessful,
} from "../screens/utilityPayment/tv/PrabhuTV";
import {
  SkyTV,
  SkyTVPayment,
  SkyTVSuccessful,
} from "../screens/utilityPayment/tv/SkyTV";
import {
  SimTV,
  SimTVPayment,
  SimTVSuccessful,
} from "../screens/utilityPayment/tv/SimTV";
import {
  MeroTV,
  MeroTVPayment,
  MeroTVSuccessful,
} from "../screens/utilityPayment/tv/MeroTV";
import {
  MaxTV,
  MaxTVPayment,
  MaxTVSuccessful,
} from "../screens/utilityPayment/tv/MaxTV";
import {
  ClearTV,
  ClearTVPayment,
  ClearTVSuccessful,
} from "../screens/utilityPayment/tv/ClearTV";
import {
  RelianceInsurance,
  RelianceInsurancePayment,
  RelianceInsuranceSuccessful,
} from "../screens/utilityPayment/insurance/RelianceInsurance";
import {
  NepalLifeInsurance,
  NepalLifeInsurancePayment,
  NepalLifeInsuranceSuccessful,
} from "../screens/utilityPayment/insurance/NepalLifeInsurance";
import {
  PrimeLifeInsurance,
  PrimeLifeInsurancePayment,
  PrimeLifeInsuranceSuccessful,
} from "../screens/utilityPayment/insurance/PrimeLifeInsurance";
import {
  JyotiLifeInsurance,
  JyotiLifeInsurancePayment,
  JyotiLifeInsuranceSuccessful,
} from "../screens/utilityPayment/insurance/JyotiLifeInsurance";
import {
  SuryaLifeInsurance,
  SuryaLifeInsurancePayment,
  SuryaLifeInsuranceSuccessful,
} from "../screens/utilityPayment/insurance/SuryaLifeInsurance";
import {
  UnionLifeInsurance,
  UnionLifeInsurancePayment,
  UnionLifeInsuranceSuccessful,
} from "../screens/utilityPayment/insurance/UnionLifeInsurance";
import {
  MahalaxmiLifeInsurance,
  MahalaxmiLifeInsurancePayment,
  MahalaxmiLifeInsuranceSuccessful,
} from "../screens/utilityPayment/insurance/MahalaxmiLifeInsurance";
import {
  SagarmathaInsurance,
  SagarmathaInsurancePayment,
  SagarmathaInsuranceSuccessful,
} from "../screens/utilityPayment/insurance/SagarmathaInsurance";
import Register from "../screens/general/Register";
import RegisterSuccess from "../screens/general/RegisterSuccess";
import SignIn from "../screens/general/SignIn";
import { HeaderBackButton } from "@react-navigation/stack";
import {
  Landline,
  LandlineConfirmation,
  LandlineSuccess,
} from "../screens/utilityPayment/Landline";
import {
  AccountTransfer,
  AccountTransferConfirmation,
  AccountTransferSuccess,
} from "../screens/transfer/AccountTransfer";
import {
  BankTransfer,
  BankTransferConfirmation,
  BankTransferSuccess,
} from "../screens/transfer/BankTransfer";
import KeyboardPin from "../components/KeyBoard";
import { UtilityList } from "../screens/utilityPayment/UtilityServices";
import {
  NeaPayment,
  NeaPaymentConfirmation,
  NeaPaymentSuccess,
} from "../screens/utilityPayment/NeaPayment";
import { DynamicScreen } from "../screens/utilityPayment/DynamicScreen";
import { DynamicInquiryScreen } from "../screens/utilityPayment/DynamicInquiryScreen";
import { DynamicPaymentScreen } from "../screens/utilityPayment/DynamicPaymentScreen";
import { DynamicPaymentConfirmScreen } from "../screens/utilityPayment/DynamicPaymentConfirmScreen";
import MoneyTransferList from "../screens/transfer/MoneyTransfer";
import { CommingSoon } from "../screens/CommingSoon";
import OTPVerification from "../screens/general/OTPVerification";
import {
  TransactionList,
  TransactionDetail,
} from "../screens/TransactionsList";
import {
  CommunityWaterPayment,
  CommunityWaterPaymentConfirmation,
  CommunityWaterPaymentSuccess,
} from "../screens/utilityPayment/water/CommunityWater";
import ForgotPassword from "../screens/general/ForgotPassword";
import ForgotPasswordReset from "../screens/general/ForgotPasswordReset";
import SavePinScreen from "../screens/pin/SavePinScreen";
import ChangePassword from "../screens/general/ChangePassword";
import ChangePin from "../screens/pin/ChangePin";
import {
  Airlines,
  AirlinesFlights,
  AirlinesFlightDetail,
  AirlinesFlightBooking,
  TicketSuccess,
} from "../screens/Airlines";
import {
  ShareQR,
  ScanPayConfirm,
  ScanPaySuccess,
  ScanPayConfirmAccountTransfer,
  ScanPayConfirmBankTransfer,
  ScanPayConfirmFonePay,
} from "../screens/transfer/ScanPay";
import ScanPay from "../screens/transfer/ScanPay";
import FingerPrintSetup from "../screens/general/FingerPrintSetup";
import FAQ from "../screens/FAQ";
import OfferScreen from "../screens/OfferScreen";
import ExchangeRates from "../screens/ExchangeRates";
import Notifications from "../screens/Notifications";
import Profile from "../screens/profile";
import WalletList from "../screens/wallet/WalletList";
import Internet from "../screens/utilityPayment/Internet";
import Television from "../screens/utilityPayment/Television";
import Insurance from "../screens/utilityPayment/Insurance";
import {
  WorldLink,
  WorldLinkPayment,
  WorldlinkSuccessful,
} from "../screens/utilityPayment/internet/WorldLink";
import {
  PokharaInternetPayment,
  PokharaInternetSuccessful,
} from "../screens/utilityPayment/internet/PokharaInternet";
import {
  LoadKhalti,
  LoadKhaltiConfirmation,
  LoadKhaltiSuccess,
} from "../screens/wallet/LoadKhalti";
import {
  LoadEsewa,
  LoadEsewaConfirmation,
  LoadEsewaSuccess,
} from "../screens/wallet/LoadEsewa";
import DeviceStorage from "../config/DeviceStorage";
import ModalPopUp from "../components/Modal";
import api from "../constants/Api";
import WebView from "react-native-webview";
import IMAGES from "../constants/newImages";
import ChangeProfile from "../screens/ChangeProfile";
import {
  ButwalPowerCompany,
  BpcPaymentConfirmation,
  BpcPaymentSuccess,
} from "../screens/utilityPayment/electricity/ButwalPowerCompany";

import { Colors } from "../screens/style/Theme";

import * as BankingIcons from "../components/BankingIcons";
import WebViewScreen from "../screens/general/WebViewScreen";
import {
  Vianet,
  VianetPayment,
  VianetSuccessful,
} from "../screens/utilityPayment/internet/Vianet";
import {
  Classictech,
  ClassictechPayment,
  ClassictechSuccessful,
} from "../screens/utilityPayment/internet/Classictech";
import {
  Arrownet,
  ArrownetPayment,
  ArrownetSuccessful,
} from "../screens/utilityPayment/internet/Arrownet";
import {
  Royalnet,
  RoyalnetPayment,
  RoyalnetSuccessful,
} from "../screens/utilityPayment/internet/Royalnet";
import { Subisu } from "../screens/utilityPayment/internet/Subisu";
import PartyList from "../screens/salestracking/party/PartyList";
import PartyDetails from "../screens/salestracking/party/PartyDetails";
import Notes from "../screens/salestracking/notes/Notes";
import CollectionList from "../screens/salestracking/collection/CollectionLists";
import CollectionDetails from "../screens/salestracking/collection/CollectionDetails";
import AddCollection from "../screens/salestracking/collection/AddCollection";
import NoteInfo from "../screens/salestracking/notes/NoteInfo";
import AddParty from "../screens/salestracking/party/AddParty";
import AddNote from "../screens/salestracking/notes/AddNote";
import Products from "../screens/salestracking/products/Products";
import ProductDetails from "../screens/salestracking/products/ProductDetails";
import OdometerList from "../screens/salestracking/odometer/OdometerList";
import OdometerDetails from "../screens/salestracking/odometer/OdometerDetails";
import StartTrip from "../screens/salestracking/odometer/StartTrip";
import EndTrip from "../screens/salestracking/odometer/EndTrip";
import RequestLeave from "../screens/salestracking/leave/RequestLeave";
import LeaveList from "../screens/salestracking/leave/LeaveList";
import LeaveDetails from "../screens/salestracking/leave/LeaveDetails";
import RequestAdvance from "../screens/salestracking/advance/RequestAdvance";
import AdvanceList from "../screens/salestracking/advance/AdvanceList";
import AdvanceDetails from "../screens/salestracking/advance/AdvanceDetails";
import Attendance from "../screens/salestracking/attendance/Attendance";
import OrderList from "../screens/salestracking/order/OrderList";
import AddOrder from "../screens/salestracking/order/AddOrder";
import OrderDetails from "../screens/salestracking/order/OrderDetails";
import Visits from "../screens/salestracking/visits/Visits";
import AddVisit from "../screens/salestracking/visits/AddVisit";
import VisitDetails from "../screens/salestracking/visits/VisitDetails";
import ExpenseList from "../screens/salestracking/expense/ExpenseList";
import ExpenseDetails from "../screens/salestracking/expense/ExpenseDetails";
import AddExpense from "../screens/salestracking/expense/AddExpense";
import ReturnList from "../screens/salestracking/return/ReturnList";
import ReturnDetails from "../screens/salestracking/return/ReturnDetails";
import ReturnOrder from "../screens/salestracking/return/ReturnOrder";

const { width } = Dimensions.get("screen");
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const screenOptionStyle = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "Bold",
  },
};
const headerOptions = {
  headerShown: true,
  headerTitleStyle: {
    color: "#fff",
    fontFamily: "Medium",
  },
  headerTintColor: "#fff",
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerRight: (props) => {
    const [data, setData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const GetPageInfo = async (key) => {
      var sendKey = key.replace(/\s/g, "");
      var response = await (await request())
        .get(api.BaseUrl + "api/v1/information/getbykey?key=" + sendKey)
        .catch(function (error) {
          ToastMessage.Short("Error Ocurred Contact Support");
          console.log(error);
        });
      if (response != undefined) {
        if (response.data.Code == 200) {
          if (response.data.Data) {
            setData(response.data.Data);
          } else {
          }
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short("Error ocurred contact support !");
      }

    };
    return (
      <>
        <TouchableOpacity
          onPress={async () => {
            const key = await DeviceStorage.getKey("currentScreen");
            await GetPageInfo(key);
            setIsVisible(true);
          }}
        >
          <View style={{ marginRight: 20 }}>
            <Icon name="info-circle" size={25} style={{ color: "#fff" }} />
          </View>
        </TouchableOpacity>
        <>
          <ModalPopUp
            visible={isVisible}
            onPress={() => { }}
            onRequestClose={() => {
              setIsVisible(!isVisible);
            }}
            height={0.5}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: 50,
                  flexDirection: "row",
                  backgroundColor: Colors.primary,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 22, color: "white", marginLeft: 20 }}>
                  info
                </Text>
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                  <Ionicons
                    name="close"
                    size={30}
                    style={{
                      alignSelf: "flex-end",
                      color: "white",
                      marginRight: 15,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <WebView source={{ html: data }} />
              </View>
            </View>
          </ModalPopUp>
        </>
      </>
    );
  },
};

function HomeStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      {...props}
      mode="card"
      screenOptions={screenOptionStyle}
    >
      <Stack.Screen
        name="SignIn"
        {...props}
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        {...props}
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterSuccess"
        {...props}
        component={RegisterSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        {...props}
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTPVerification"
        {...props}
        component={OTPVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        {...props}
        component={ForgotPassword}
        options={headerOptions}
      />
      <Stack.Screen
        name="ForgotPasswordReset"
        {...props}
        component={ForgotPasswordReset}
        options={headerOptions}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQ}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="Exchange Rates"
        component={ExchangeRates}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="ChequeRequest"
        component={ChequeRequest}
        options={headerOptions}
      />
      <Stack.Screen name="topup" component={TopUp} options={headerOptions} />
      <Stack.Screen name="PartyList" component={PartyList} options={headerOptions} />
      <Stack.Screen name="PartyDetails" component={PartyDetails} options={headerOptions} />
      <Stack.Screen name="AddParty" component={AddParty} options={headerOptions} />
      <Stack.Screen name="Notes" component={Notes} options={headerOptions} />
      <Stack.Screen name="NoteInfo" component={NoteInfo} options={headerOptions} />
      <Stack.Screen name="AddNote" component={AddNote} options={headerOptions} />
      <Stack.Screen name="CollectionList" component={CollectionList} options={headerOptions} />
      <Stack.Screen name="CollectionDetails" component={CollectionDetails} options={headerOptions} />
      <Stack.Screen name="AddCollection" component={AddCollection} options={headerOptions} />
      <Stack.Screen name="ServiceList" component={ServiceList} options={headerOptions} />
      <Stack.Screen name="Visits" component={Visits} options={headerOptions} />
      <Stack.Screen name="AddVisit" component={AddVisit} options={headerOptions} />
      <Stack.Screen name="VisitDetails" component={VisitDetails} options={headerOptions} />
      <Stack.Screen name="Products" component={Products} options={headerOptions} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={headerOptions} />
      <Stack.Screen name="OdometerList" component={OdometerList} options={headerOptions} />
      <Stack.Screen name="OdometerDetails" component={OdometerDetails} options={headerOptions} />
      <Stack.Screen name="StartTrip" component={StartTrip} options={headerOptions} />
      <Stack.Screen name="EndTrip" component={EndTrip} options={headerOptions} />
      <Stack.Screen name="RequestLeave" component={RequestLeave} options={headerOptions} />
      <Stack.Screen name="LeaveList" component={LeaveList} options={headerOptions} />
      <Stack.Screen name="LeaveDetails" component={LeaveDetails} options={headerOptions} />
      <Stack.Screen name="RequestAdvance" component={RequestAdvance} options={headerOptions} />
      <Stack.Screen name="AdvanceList" component={AdvanceList} options={headerOptions} />
      <Stack.Screen name="AdvanceDetails" component={AdvanceDetails} options={headerOptions} />
      <Stack.Screen name="Attendance" component={Attendance} options={headerOptions} />
      <Stack.Screen name="OrderList" component={OrderList} options={headerOptions} />
      <Stack.Screen name="AddOrder" component={AddOrder} options={headerOptions} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} options={headerOptions} />
      <Stack.Screen name="ExpenseList" component={ExpenseList} options={headerOptions} />
      <Stack.Screen name="AddExpense" component={AddExpense} options={headerOptions} />
      <Stack.Screen name="ExpenseDetails" component={ExpenseDetails} options={headerOptions} />
      <Stack.Screen name="ReturnList" component={ReturnList} options={headerOptions} />
      <Stack.Screen name="ReturnDetails" component={ReturnDetails} options={headerOptions} />
      <Stack.Screen name="ReturnOrder" component={ReturnOrder} options={headerOptions} />


      <Stack.Screen
        name="Confirmation"
        component={TopUpConfirmation}
        options={headerOptions}
      />
      <Stack.Screen
        name="Internet"
        component={Internet}
        options={headerOptions}
      />
      <Stack.Screen
        name="Television"
        component={Television}
        options={headerOptions}
      />
      <Stack.Screen
        name="Insurance"
        component={Insurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="WorldLink"
        component={WorldLink}
        options={headerOptions}
      />
      <Stack.Screen
        name="WorldLink Payment"
        component={WorldLinkPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="WorldLink Successful"
        component={WorldlinkSuccessful}
        options={headerOptions}
      />
      <Stack.Screen name="Vianet" component={Vianet} options={headerOptions} />
      <Stack.Screen
        name="Vianet Payment"
        component={VianetPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Vianet Successful"
        component={VianetSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Classic Tech"
        component={Classictech}
        options={headerOptions}
      />
      <Stack.Screen
        name="Classic Tech Payment"
        component={ClassictechPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Classic Tech Successful"
        component={ClassictechSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Arrownet"
        component={Arrownet}
        options={headerOptions}
      />
      <Stack.Screen
        name="Arrownet Payment"
        component={ArrownetPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Arrownet Successful"
        component={ArrownetSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Royal Network"
        component={Royalnet}
        options={headerOptions}
      />
      <Stack.Screen
        name="Royal Network Payment"
        component={RoyalnetPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Royal Network Successful"
        component={RoyalnetSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Pokhara Internet"
        component={PokharaInternetPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Pokhara Internet Successful"
        component={PokharaInternetSuccessful}
        options={headerOptions}
      />
      <Stack.Screen name="Subisu" component={Subisu} options={headerOptions} />
      <Stack.Screen
        name="DishHome"
        component={DishHome}
        options={headerOptions}
      />
      <Stack.Screen
        name="DishHome Payment"
        component={DishHomePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="DishHome Success"
        component={DishHomeSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="PrabhuTV"
        component={PrabhuTV}
        options={headerOptions}
      />
      <Stack.Screen
        name="PrabhuTV Payment"
        component={PrabhuTVPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="PrabhuTV Success"
        component={PrabhuTVSuccessful}
        options={headerOptions}
      />
      <Stack.Screen name="SkyTV" component={SkyTV} options={headerOptions} />
      <Stack.Screen
        name="SkyTV Payment"
        component={SkyTVPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="SkyTV Success"
        component={SkyTVSuccessful}
        options={headerOptions}
      />
      <Stack.Screen name="SimTV" component={SimTV} options={headerOptions} />
      <Stack.Screen
        name="SimTV Payment"
        component={SimTVPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="SimTV Success"
        component={SimTVSuccessful}
        options={headerOptions}
      />
      <Stack.Screen name="MeroTV" component={MeroTV} options={headerOptions} />
      <Stack.Screen
        name="MeroTV Payment"
        component={MeroTVPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="MeroTV Success"
        component={MeroTVSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="ClearTV"
        component={ClearTV}
        options={headerOptions}
      />
      <Stack.Screen
        name="ClearTV Payment"
        component={ClearTVPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="ClearTV Success"
        component={ClearTVSuccessful}
        options={headerOptions}
      />
      <Stack.Screen name="MaxTV" component={MaxTV} options={headerOptions} />
      <Stack.Screen
        name="MaxTV Payment"
        component={MaxTVPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="MaxTV Success"
        component={MaxTVSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Reliance"
        component={RelianceInsurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="Reliance Payment"
        component={RelianceInsurancePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Reliance Success"
        component={RelianceInsuranceSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Nepal Life"
        component={NepalLifeInsurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="Nepal Life Payment"
        component={NepalLifeInsurancePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Nepal Life Success"
        component={NepalLifeInsuranceSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Prime Life"
        component={PrimeLifeInsurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="Prime Life Payment"
        component={PrimeLifeInsurancePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Prime Life Success"
        component={PrimeLifeInsuranceSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Jyoti Life"
        component={JyotiLifeInsurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="Jyoti Life Payment"
        component={JyotiLifeInsurancePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Jyoti Life Success"
        component={JyotiLifeInsuranceSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Surya Life"
        component={SuryaLifeInsurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="Surya Life Payment"
        component={SuryaLifeInsurancePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Surya Life Success"
        component={SuryaLifeInsuranceSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Union Life"
        component={UnionLifeInsurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="Union Life Payment"
        component={UnionLifeInsurancePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Union Life Success"
        component={UnionLifeInsuranceSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Mahalaxmi Life"
        component={MahalaxmiLifeInsurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="Mahalaxmi Life Payment"
        component={MahalaxmiLifeInsurancePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Mahalaxmi Life Success"
        component={MahalaxmiLifeInsuranceSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="Sagarmatha"
        component={SagarmathaInsurance}
        options={headerOptions}
      />
      <Stack.Screen
        name="Sagarmatha Payment"
        component={SagarmathaInsurancePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="Sagarmatha Success"
        component={SagarmathaInsuranceSuccessful}
        options={headerOptions}
      />
      <Stack.Screen
        name="TopUpSuccess"
        component={TopUpSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Accounts"
        component={Accounts}
        options={headerOptions}
      />
      <Stack.Screen
        name="AccountStatement"
        component={AccountStatement}
        options={headerOptions}
      />
      <Stack.Screen
        name="Landline"
        component={Landline}
        options={headerOptions}
      />
      <Stack.Screen
        name="LandlineConfirmation"
        component={LandlineConfirmation}
        options={headerOptions}
      />
      <Stack.Screen
        name="LandlineSuccess"
        component={LandlineSuccess}
        options={headerOptions}
      />
      <Stack.Screen
        name="AccountTransfer"
        component={AccountTransfer}
        options={headerOptions}
      />
      <Stack.Screen
        name="AccountTransferConfirmation"
        component={AccountTransferConfirmation}
        options={headerOptions}
      />
      <Stack.Screen
        name="AccountTransferSuccess"
        component={AccountTransferSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BankTransfer"
        component={BankTransfer}
        options={headerOptions}
      />
      <Stack.Screen
        name="BankTransferConfirmation"
        component={BankTransferConfirmation}
        options={headerOptions}
      />
      <Stack.Screen
        name="BankTransferSuccess"
        component={BankTransferSuccess}
        options={headerOptions}
      />
      <Stack.Screen
        name="UtilityList"
        component={UtilityList}
        options={headerOptions}
      />
      <Stack.Screen
        name="electricity"
        component={NeaPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="ButwalPowerCompany"
        component={ButwalPowerCompany}
        options={headerOptions}
      />
      <Stack.Screen
        name="BpcPaymentConfirmation"
        component={BpcPaymentConfirmation}
        options={headerOptions}
      />
      <Stack.Screen
        name="BpcPaymentSuccess"
        component={BpcPaymentSuccess}
        options={headerOptions}
      />
      <Stack.Screen
        name="dynamicmerchant"
        component={DynamicScreen}
        options={headerOptions}
      />
      <Stack.Screen
        name="dynamicinquiry"
        component={DynamicInquiryScreen}
        options={headerOptions}
      />
      <Stack.Screen
        name="dynamicpayment"
        component={DynamicPaymentScreen}
        options={headerOptions}
      />
      <Stack.Screen
        name="dynamicpaymentconfirm"
        component={DynamicPaymentConfirmScreen}
        options={headerOptions}
      />
      <Stack.Screen
        name="NeaPaymentConfirmation"
        component={NeaPaymentConfirmation}
        options={headerOptions}
      />
      <Stack.Screen
        name="NeaPaymentSuccess"
        component={NeaPaymentSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommunityWaterPayment"
        component={CommunityWaterPayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="CommunityWaterPaymentConfirmation"
        component={CommunityWaterPaymentConfirmation}
        options={headerOptions}
      />
      <Stack.Screen
        name="CommunityWaterPaymentSuccess"
        component={CommunityWaterPaymentSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommingSoon"
        component={CommingSoon}
        options={headerOptions}
      />
      <Stack.Screen
        name="savepin"
        component={SavePinScreen}
        options={headerOptions}
      />
      <Stack.Screen
        name="IntrestRate"
        component={IntrestRate}
        options={headerOptions}
      />
      <Stack.Screen
        name="airlines"
        component={Airlines}
        options={headerOptions}
      />
      <Stack.Screen
        name="AirlinesFlights"
        component={AirlinesFlights}
        options={headerOptions}
      />
      <Stack.Screen
        name="AirlinesFlightDetail"
        component={AirlinesFlightDetail}
        options={headerOptions}
      />
      <Stack.Screen
        name="AirlinesFlightBooking"
        component={AirlinesFlightBooking}
        options={headerOptions}
      />
      <Stack.Screen
        name="AirlinesTicketSuccess"
        component={TicketSuccess}
        options={headerOptions}
      />

      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="OfferScreen"
        {...props}
        component={OfferScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerShown: true,
          headerTitleStyle: {
            color: "#fff",
          },
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
        })}
      ></Stack.Screen>
      <Stack.Screen
        name="Wallets"
        component={WalletList}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="Load Khalti"
        component={LoadKhalti}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="Load Khalti Confirmation"
        component={LoadKhaltiConfirmation}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="Load Khalti Success"
        component={LoadKhaltiSuccess}
        options={{ headerShown: false }}
      ></Stack.Screen>

      <Stack.Screen
        name="Load Esewa"
        component={LoadEsewa}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="Load Esewa Confirmation"
        component={LoadEsewaConfirmation}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="Load Esewa Success"
        component={LoadEsewaSuccess}
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="LoadAccountList"
        component={LoadAccountList}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="LoadAccountSuccess"
        component={LoadAccountSuccess}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="ShareMyQr"
        {...props}
        component={ShareQR}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="ScanPayConfirmAccountTransfer"
        {...props}
        component={ScanPayConfirmAccountTransfer}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="ScanPayConfirmBankTransfer"
        {...props}
        component={ScanPayConfirmBankTransfer}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="ScanPayConfirmFonePay"
        {...props}
        component={ScanPayConfirmFonePay}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="ScanPaySuccess"
        {...props}
        component={ScanPaySuccess}
        options={headerOptions}
      ></Stack.Screen>
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetail}
        options={headerOptions}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: true,
          headerTitleStyle: {
            color: "#fff",
            fontFamily: "Medium",
          },
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="ChangePin"
        component={ChangePin}
        options={{
          headerShown: true,
          headerTitleStyle: {
            color: "#fff",
          },
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={headerOptions}
      />
      <Stack.Screen
        name="Fingerprint"
        component={FingerPrintSetup}
        options={headerOptions}
      />
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={headerOptions}
      />
      <Stack.Screen
        name="View Profile"
        component={ChangeProfile}
        options={headerOptions}
      />
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          color: "#fff",
          fontFamily: "Medium",
        },
        headerTintColor: "#fff",
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        tabBarStyle: {
          ...Platform.select({
            ios: {
              paddingBottom: 5,
              height: 60,
              marginBottom: 15,
            },
            android: {
              paddingBottom: 5,
              height: 60,
            },
          }),
        },
      }}
      tabBarOptions={{
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 5,
                width: 50,
              }}
            >
              <BankingIcons.HomeIcon
                fill={focused ? Colors.primary : Colors.defaultBlack}
              />
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 10,
                  color: focused ? Colors.primary : Colors.defaultBlack,
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TransactionList"
        component={TransactionList}
        options={{
          tabBarLabel: "History",
          headerShown: true,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 5,
                width: 50,
              }}
            >
              <BankingIcons.HistoryIcon
                fill={focused ? Colors.primary : Colors.defaultBlack}
              />
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 10,
                  color: focused ? Colors.primary : Colors.defaultBlack,
                }}
              >
                Orders
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanPay}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                marginBottom: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.primary,
                  borderWidth: 5,
                  borderColor: "white",
                }}
              >
                <BankingIcons.QrOnlyIcon style={{ height: 70, width: 70 }} />
              </View>
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 10,
                  color: focused ? Colors.primary : Colors.defaultBlack,
                }}
              >
                Share QR
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MoneyTransferList"
        component={MoneyTransferList}
        options={{
          headerShown: true,

          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 5,
                width: 50,
              }}
            >
              <BankingIcons.SendMoneyIcon
                fill={focused ? Colors.primary : Colors.defaultBlack}
              />
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 10,
                  color: focused ? Colors.primary : Colors.defaultBlack,
                }}
              >
                Parties
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 5,
                width: 50,
              }}
            >
              <BankingIcons.ProfileIcon
                fill={focused ? Colors.primary : Colors.defaultBlack}
              />
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 10,
                  color: focused ? Colors.primary : Colors.defaultBlack,
                }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppRoute(props) {
  return <HomeStack {...props} />;
}

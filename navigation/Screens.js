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
  Platform
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as BankingIcons from "../components/BankingIcons";

import { Colors } from "../screens/style/Theme";
import Home from "../screens/Home";
import Settings from "../screens/general/Settings";
import MainScreen from "../screens/general/MainScreen";

import Register from "../screens/general/Register";
import RegisterSuccess from "../screens/general/RegisterSuccess";
import SignIn from "../screens/general/SignIn";
import { CommingSoon } from "../screens/CommingSoon";
import OTPVerification from "../screens/general/OTPVerification";

 import ForgotPassword from "../screens/general/ForgotPassword";
import ForgotPasswordReset from "../screens/general/ForgotPasswordReset";
import ChangePassword from "../screens/general/ChangePassword";
import ChangePin from "../screens/pin/ChangePin";

import FingerPrintSetup from "../screens/general/FingerPrintSetup";
import FAQ from "../screens/FAQ";
import OfferScreen from "../screens/OfferScreen";
import Notifications from "../screens/Notifications";

import DeviceStorage from "../config/DeviceStorage";
import ModalPopUp from "../components/Modal";
import api from "../constants/Api";
import WebView from "react-native-webview";
import ChangeProfile from "../screens/ChangeProfile";
import WebViewScreen from "../screens/general/WebViewScreen";

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
import EODReport from "../screens/salestracking/EODReport/EODReport";
import ReceivePayment from "../screens/payment/ReceivePayment";
import DeliverList from "../screens/salestracking/deliver/DeliverList";
import DeliverDetails from "../screens/salestracking/deliver/DeliverDetails";
import PaymentDueList from "../screens/salestracking/paymentdue/PaymentDueList";
import PermissionScreen from "../screens/general/PermissionScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../screens/profile";
import AddFuel from "../screens/salestracking/fuel/AddFuel"; 
import FuelList from "../screens/salestracking/fuel/FuelList";
import Tasks from "../screens/salestracking/task/Tasks";
import AddTask from "../screens/salestracking/task/AddTask";
import Task from "../screens/salestracking/task/Task";
import Requests from "../screens/salestracking/request/Requests";
import AddRequest from "../screens/salestracking/request/AddRequest";
import Request from "../screens/salestracking/request/Request";

const Stack = createNativeStackNavigator();
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
  // headerRight: (props) => {
  //   const [data, setData] = useState(null);
  //   const [isVisible, setIsVisible] = useState(false);

  //   const GetPageInfo = async (key) => {
  //     var sendKey = key.replace(/\s/g, "");
  //     var response = await (await request())
  //       .get(api.BaseUrl + "api/v1/information/getbykey?key=" + sendKey)
  //       .catch(function(error) {
  //         ToastMessage.Short("Error Ocurred Contact Support");
  //         console.log(error);
  //       });
  //     if (response != undefined) {
  //       if (response.data.Code == 200) {
  //         if (response.data.Data) {
  //           setData(response.data.Data);
  //         } else {
  //         }
  //       } else {
  //         ToastMessage.Short(response.data.Message);
  //       }
  //     } else {
  //       ToastMessage.Short("Error ocurred contact support !");
  //     }
  //   };
  //   return (
  //     <>
  //       <TouchableOpacity
  //         onPress={async () => {
  //           const key = await DeviceStorage.getKey("currentScreen");
  //           await GetPageInfo(key);
  //           setIsVisible(true);
  //         }}
  //       >
  //         <View style={{ marginRight: 20 }}>
  //           <Icon name="info-circle" size={25} style={{ color: "#fff" }} />
  //         </View>
  //       </TouchableOpacity>
  //       <>
  //         <ModalPopUp
  //           visible={isVisible}
  //           onPress={() => {}}
  //           onRequestClose={() => {
  //             setIsVisible(!isVisible);
  //           }}
  //           height={0.5}
  //         >
  //           <View style={{ flex: 1 }}>
  //             <View
  //               style={{
  //                 height: 50,
  //                 flexDirection: "row",
  //                 backgroundColor: Colors.primary,
  //                 alignItems: "center",
  //                 justifyContent: "space-between",
  //               }}
  //             >
  //               <Text style={{ fontSize: 22, color: "white", marginLeft: 20 }}>
  //                 info
  //               </Text>
  //               <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
  //                 <Ionicons
  //                   name="close"
  //                   size={30}
  //                   style={{
  //                     alignSelf: "flex-end",
  //                     color: "white",
  //                     marginRight: 15,
  //                   }}
  //                 />
  //               </TouchableOpacity>
  //             </View>
  //             <View style={{ flex: 1 }}>
  //               <WebView source={{ html: data }} />
  //             </View>
  //           </View>
  //         </ModalPopUp>
  //       </>
  //     </>
  //   );
  // },
};


function ScreenStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="MainScreen"
      {...props}
      mode="card"
      screenOptions={screenOptionStyle}
    >
      <Stack.Screen
        name="MainScreen"
        {...props}
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        {...props}
        component={SignIn}
        options={{ headerShown: false }}
      />
      
      <Stack.Screen
        name="Home"
        {...props}
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="CollectionList"
        component={CollectionList}
        options={headerOptions}
      /> 
          <Stack.Screen    {...props} name="Visits" component={Visits}  options={headerOptions} />  
        <Stack.Screen
       {...props}
        name="AddVisit"
        component={AddVisit}
        options={headerOptions}
      />
        <Stack.Screen
       {...props}
        name="PartyList"
        component={PartyList}
        options={headerOptions}
      />
      
      <Stack.Screen
      {...props}
        name="VisitDetails"
        component={VisitDetails}
        options={headerOptions}
      /> 
      <Stack.Screen
        name="Register"
        {...props}
        component={Register}
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
        name="PartyDetails"
        component={PartyDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="AddParty"
        component={AddParty}
        options={headerOptions}
      />
      <Stack.Screen name="Notes" component={Notes} options={headerOptions} />
      <Stack.Screen
        name="NoteInfo"
        component={NoteInfo}
        options={headerOptions}
      />
      <Stack.Screen
        name="AddNote"
        component={AddNote}
        options={headerOptions}
      />

      <Stack.Screen
        name="CollectionDetails"
        component={CollectionDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="AddCollection"
        component={AddCollection}
        options={headerOptions}
      />

      <Stack.Screen
        name="Products"
        component={Products}
        options={headerOptions}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="OdometerList"
        component={OdometerList}
        options={headerOptions}
      />
      <Stack.Screen
        name="OdometerDetails"
        component={OdometerDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="StartTrip"
        component={StartTrip}
        options={headerOptions}
      />
      <Stack.Screen
        name="EndTrip"
        component={EndTrip}
        options={headerOptions}
      />
      <Stack.Screen
        name="RequestLeave"
        component={RequestLeave}
        options={headerOptions}
      />
      <Stack.Screen
        name="LeaveList"
        component={LeaveList}
        options={headerOptions}
      />
      <Stack.Screen
        name="LeaveDetails"
        component={LeaveDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="RequestAdvance"
        component={RequestAdvance}
        options={headerOptions}
      />
      <Stack.Screen
        name="AdvanceList"
        component={AdvanceList}
        options={headerOptions}
      />
      <Stack.Screen
        name="AdvanceDetails"
        component={AdvanceDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="Attendance"
        component={Attendance}
        options={headerOptions}
      />
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={headerOptions}
      />
      <Stack.Screen
        name="AddOrder"
        component={AddOrder}
        options={headerOptions}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="ExpenseList"
        component={ExpenseList}
        options={headerOptions}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpense}
        options={headerOptions}
      />
      <Stack.Screen
        name="AddFuel"
        component={AddFuel}
        options={headerOptions}
      />
      <Stack.Screen
        name="ExpenseDetails"
        component={ExpenseDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="ReturnList"
        component={ReturnList}
        options={headerOptions}
      />
      <Stack.Screen
        name="ReturnDetails"
        component={ReturnDetails}
        options={headerOptions}
      />
      <Stack.Screen
        name="ReturnOrder"
        component={ReturnOrder}
        options={headerOptions}
      />
      <Stack.Screen
        name="EODReport"
        component={EODReport}
        options={headerOptions}
      />
      <Stack.Screen
        name="ReceivePayment"
        component={ReceivePayment}
        options={headerOptions}
      />
      <Stack.Screen
        name="PaymentDueList"
        component={PaymentDueList}
        options={headerOptions}
      />
      <Stack.Screen
        name="PermissionScreen"
        component={PermissionScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CommingSoon"
        component={CommingSoon}
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
      <Stack.Screen
        name="DeliverList"
        component={DeliverList}
        options={headerOptions}
      />
      <Stack.Screen
        name="FuelList"
        component={FuelList}
        options={headerOptions}
      />
      <Stack.Screen
        name="DeliverDetails"
        component={DeliverDetails}
        options={headerOptions}
      /> 
      <Stack.Screen
        name="Tasks"
        component={Tasks}
        options={headerOptions}
      /> 
      <Stack.Screen
        name="AddTask"
        component={AddTask}
        options={headerOptions}
      /> 
      <Stack.Screen
        name="Task"
        component={Task}
        options={headerOptions}
      /> 
       <Stack.Screen
        name="Requests"
        component={Requests}
        options={headerOptions}
      /> 
      <Stack.Screen
        name="AddRequest"
        component={AddRequest}
        options={headerOptions}
      /> 
      <Stack.Screen
        name="Request"
        component={Request}
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
        name="AddVisit"
        component={AddVisit}
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
              <BankingIcons.addVisit
                fill={focused ? Colors.primary : Colors.defaultBlack}
                height={30}
                width={30}
              />
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 10,
                  color: focused ? Colors.primary : Colors.defaultBlack,
                }}
              >
                Visit
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={AddOrder}
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
                <BankingIcons.order
                  style={{ height: 30, width: 33 }}
                  fill="white"
                />
              </View>
              <Text
                style={{
                  fontFamily: "SemiBold",
                  fontSize: 10,
                  color: focused ? Colors.primary : Colors.defaultBlack,
                }}
              >
                Place Order
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="AddParty"
        component={AddParty}
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
              <BankingIcons.addParties
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
              <BankingIcons.profile1
                fill={focused ? Colors.primary : Colors.defaultBlack}
                style={{ height: 27, width: 27 }}
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
  return <ScreenStack {...props} />;
}

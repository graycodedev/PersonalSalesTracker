import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import IMAGES from "../constants/newImages";
import * as BankingIcons from "../components/BankingIcons";
import { Colors } from "../screens/style/Theme";
import Api from "../constants/Api";
// import Icon from "react-native-vector-icons/FontAwesome5";
// import IconEntypo from "react-native-vector-icons/Entypo";
// import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
// import IconIonicons from "react-native-vector-icons/Ionicons";

// export const DashBoardServices = ({ navigation }) => {
//   let iconSize = 35;
//   return (
//     <View style={serviceStyle.container}>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("topup");
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <Icon
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="mobile-alt"
//           />
//           <Text style={serviceStyle.title}>Top Up</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("MoneyTransferList");
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <Icon
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="sync-alt"
//             // name="send-to-mobile"
//           />
//           <Text style={serviceStyle.title}>Transfer</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("electricity");
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <IconMaterialCommunityIcons
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="lightning-bolt"
//           />
//           <Text style={serviceStyle.title}>Electricity</Text>
//         </View>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("Landline");
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <IconEntypo
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="old-phone"
//           />
//           <Text style={serviceStyle.title}>Adsl/Landline</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate(`dynamicmerchant`, {
//             Name: `khanepani`,
//             ServiceCategoryId: 7,
//           });
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <Icon
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="hand-holding-water"
//           />
//           <Text style={serviceStyle.title}>Water</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate(`dynamicmerchant`, {
//             Name: `TV`,
//             ServiceCategoryId: 9,
//           });
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <IconMaterialCommunityIcons
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="television-classic"
//           />
//           <Text style={serviceStyle.title}>Television</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate(`dynamicmerchant`, {
//             Name: `Internet`,
//             ServiceCategoryId: 8,
//           });
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <IconMaterialCommunityIcons
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="web"
//           />
//           <Text style={serviceStyle.title}>Internet</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate(`dynamicmerchant`, {
//             Name: `Insurance`,
//             ServiceCategoryId: 10,
//           });
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <IconMaterialIcons
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="family-restroom"
//           />
//           <Text style={serviceStyle.title}>Insurance</Text>
//         </View>
//       </TouchableOpacity>
//       <View style={serviceStyle.rect}>
//         <TouchableOpacity
//           onPress={() => {
//             navigation.navigate("Accounts");
//           }}
//         >
//           <IconMaterialCommunityIcons
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="account"
//           />
//           <Text style={serviceStyle.title}>Account</Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("ChequeRequest");
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <IconMaterialCommunityIcons
//             style={serviceStyle.iconStyle}
//             size={35}
//             name="book-open"
//           />
//           <Text style={serviceStyle.title}>Cheque</Text>
//         </View>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("Accounts");
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <IconIonicons
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="ios-receipt"
//           />
//           <Text style={serviceStyle.title}>Statement</Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.navigate("IntrestRate");
//         }}
//       >
//         <View style={serviceStyle.rect}>
//           <IconMaterialCommunityIcons
//             style={serviceStyle.iconStyle}
//             size={iconSize}
//             name="calculator"
//           />
//           <Text style={serviceStyle.title}>Intrest Rate</Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

export const DashBoardServices = ({ navigation }) => {
  const [showAllIcons, setShowAllIcons] = useState(false);
  const showServices = () => setShowAllIcons((value) => !value);

  var arrServices = [
    {
      name: "Parties",
      icon: BankingIcons.TransferIcon,
      navigation: "PartyList",
    },

    { name: "Collections", icon: BankingIcons.collection, navigation: "CollectionList" },

    {
      name: "Orders",
      icon: BankingIcons.order,
      ServiceCategoryId: 8,
      navigation: "OrderList",
    },
    {
      name: "Visits",
      icon: BankingIcons.visits,
      navigation: "Visits",
    },
    {
      name: "Attendance",
      icon: BankingIcons.attendancereport,
      navigation: "Attendance",
    },
    {
      name: "Notes",
      icon: BankingIcons.StatementIcon,
      navigation: "Notes",
      ServiceCategoryId: 10,
    },
    {
      name: "Odometer",
      icon: BankingIcons.odometer,
      navigation: "OdometerList",
      ServiceCategoryId: 9,
    },
    {
      name: "Leave",
      icon: BankingIcons.leave,
      navigation: "LeaveList",
      ServiceCategoryId: 7,
    },
    { name: "Returns", icon: BankingIcons.productreturn, navigation: "ReturnList" },
    {
      name: "Advance",
      icon: BankingIcons.advance,
      navigation: "AdvanceList",
    },
    {
      name: "Products",
      icon: BankingIcons.product,
      navigation: "Products",
    },
    {
      name: "Expenses",
      icon: BankingIcons.ChequeIcon,
      navigation: "ExpenseList",
    },
    {
      name: "Deliver",
      icon: BankingIcons.delivery,
      navigation: "DeliverList",
    },
    {
      name: "EOD Report",
      icon: BankingIcons.eodreport,
      navigation: "EODReport",
    },
    {
      name: "Sales Report",
      icon: BankingIcons.salesreport,
      navigation: "CollectionList",
    },
    {
      name: "Visit Report",
      icon: BankingIcons.visitreport,
      navigation: "Visits",
    },
    

    // {
    //   name: "Interest rate",
    //   icon: BankingIcons.InterestIcon,
    //   navigation: "ButwalPowerCompany",
    // },
  ];
  var arrServicesMore = [
    {
      name: "Load Wallet",
      icon: BankingIcons.LoadWalletIcon,
      navigation: "Wallets",
    },
    {
      name: "Transfer",
      icon: BankingIcons.TransferIcon,
      navigation: "MoneyTransferList",
    },
    {
      name: "Airlines",
      icon: BankingIcons.Airplane,
      navigation: "airlines",
    },
    {
      name: "Butwal Power",
      icon: BankingIcons.ElectricityIcon,
      navigation: "ButwalPowerCompany",
    },
  ];
  var allServices = [...arrServices, ...arrServicesMore];
  const clickHandler = (item) => {
    if (item.navigation != "TV" && item.navigation != "khanepani") {
      navigation.navigate(item.navigation);
    } else {
      if (item.navigation == "khanepani") {
        navigation.navigate("ServiceList", {
          items: [
            {
              navigation: "CommunityWaterPayment",
              name: "Community Khanepani",
              imgSource: {
                uri: Api.ServerImages.Insurance.Reliance,
              },
              svg: <BankingIcons.KhanepaniSVG
                fill={Colors.primary}
                height="80"
                width="80"
              />
            }
          ], title: "Water"
        })
      }
      else {
        navigation.navigate(`dynamicmerchant`, {
          Name: item.name,
          ServiceCategoryId: item.ServiceCategoryId,
        });
      }
    }
  };
  return (
    <View>
      {!showAllIcons && (
        <View style={styles.container}>
          {arrServices.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.optionContainerStyle}
                onPress={() => {
                  clickHandler(item);
                }}
                key={index}
              >
                <View style={styles.anOption}>
                  <View style={styles.iconWithBack}>
                    {/* <Image source={item.icon} /> */}
                    <item.icon fill={Colors.primary} />
                  </View>
                  <Text style={styles.text}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {showAllIcons && (
        <View style={styles.container}>
          {allServices.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.optionContainerStyle}
                onPress={() => {
                  clickHandler(item);
                }}
                key={index}
              >
                <View style={styles.anOption}>
                  <View style={styles.iconWithBack}>
                    <item.icon fill={Colors.primary}></item.icon>
                  </View>
                  <Text style={styles.text}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View>
        {/* {!showAllIcons && (
          <TouchableOpacity
            style={styles.viewMore}
            title=""
            onPress={() => showServices()}
          >
            <Text
              style={{
                alignSelf: "center",
                marginRight: 11,
                fontFamily: "Bold",
                fontSize: 10,
                color: Colors.primary,
              }}
            >
              VIEW MORE
            </Text>
          
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <BankingIcons.DownArrow fill={Colors.primary} />
            </View>
          </TouchableOpacity>
        )} */}
        {showAllIcons && (
          <TouchableOpacity
            style={styles.viewLess}
            title=""
            onPress={() => showServices()}
          >
            <Text
              style={{
                alignSelf: "center",
                marginRight: 11,
                fontFamily: "Bold",
                fontSize: 10,
                color: "#fff",
              }}
            >
              VIEW LESS
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <BankingIcons.UpArrow />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionContainerStyle: { width: "25%" },
  anOption: {
    marginHorizontal: 5,
    height: 88,
    paddingVertical: 10,
    paddingHorizontal: 2,
    marginBottom: 12,
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "white",
  },
  iconWithBack: {
    backgroundColor: "#FAFDFB",
    height: 48,
    width: 48,
    borderRadius: 48,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  viewMore: {
    width: 100,
    height: 26,
    borderRadius: 4,
    alignContent: "center",
    justifyContent: "center",
    // borderColor: "#5BBE8B",
    borderColor: Colors.primary,
    borderWidth: 1,
    alignSelf: "center",
    marginBottom: 10,
    flexDirection: "row",
  },
  viewLess: {
    width: 100,
    height: 26,
    borderRadius: 4,
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
    flexDirection: "row",
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Regular",
  },
});

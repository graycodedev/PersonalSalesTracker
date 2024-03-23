import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import * as BankingIcons from "../components/BankingIcons";
import { Colors } from "../screens/style/Theme";
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
      name: "Tasks",
      icon: BankingIcons.Task,
      navigation: "Tasks",
    },
    {
      name: "Day Log",
      icon: BankingIcons.Daylog3,
      navigation: "DayLogs",
    },
    {
      name: "Request Form",
      icon: BankingIcons.Request,
      navigation: "Requests",
    },
    {
      name: "Beat Plan",
      icon: BankingIcons.BeatPlan2,
      navigation: "BeatPlans",
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
    // {
    //   name: "Sales Report",
    //   icon: BankingIcons.salesreport,
    //   navigation: "CollectionList",
    // },
    {
      name: "Anouncement",
      icon: BankingIcons.Announcement1,
      navigation: "Announcements",
    },
    {
      name: "Visit Report",
      icon: BankingIcons.visitreport,
      navigation: "Visits",
    }
  ];
  var arrServicesMore = [
    {
      name: "Load Wallet",
      icon: BankingIcons.LoadWalletIcon,
      navigation: "Wallets",
    }
  ];
  var allServices = [...arrServices, ...arrServicesMore];
  const clickHandler = (item) => {
      navigation.navigate(item.navigation);
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

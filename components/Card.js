import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "galio-framework";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as BankingIcons from "./BankingIcons";
import { Colors } from "../screens/style/Theme";
import * as SVG from "../components/BankingIcons";

export const AccountCard = ({ data, navigation, callback, balanceError }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View style={styles.container}>
        <View>
          <View style={styles.accountInfo}>
            <View style={styles.left}>
              <View style={styles.accountType}>
                <Text style={styles.accountInfoText}>Visits: 444</Text>
              </View>
              <View style={styles.accountNumber}>
              <Text style={[styles.amountText, {fontSize:11}]}>
                Order: 555
              </Text>
                <Text style={styles.accountInfoText}>{data.AccNum}</Text>
              </View>
            </View>
          </View>
          <View style={styles.amount}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.amountText}>
                Collection: 666
              </Text>
              {visible ? (
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                  <Icon name="eye" size={15} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                  <Icon name="eye-slash" size={15} />
                </TouchableOpacity>
              )}
            
            </View>
          </View>
        </View>
        <TouchableOpacity   onPress={() => {
              navigation.navigate("ReceivePayment");
            }} style={{padding: 10}}>
          <View
            style={{
              alignSelf: "flex-end",
              // right: 30,
              // paddingTop: 6,
              alignItems: "center",
            }}
          
          >
            <SVG.purseIcon height={45} width={45} fill={Colors.primary} />
            {/* <Text
              style={{
                fontSize: 10,
                textAlign: "center",
                fontFamily: "Regular",
                color: Colors.primary,
              }}
            >
             Receive Payment
            </Text> */}
          </View>
          {/* <TouchableOpacity onPress={() => navigation.navigate("Scan")}>
              <BankingIcons.qrIcon fill={Colors.primary} />
            </TouchableOpacity> */}
        </TouchableOpacity>

        {visible && balanceError != "" && (
          <View>
            <Text style={{ color: "red" }}>{balanceError}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
export const AccountCardNoQr = ({ data, navigation }) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.container, { height: 60 }]}>
        <View style={styles.accountInfo}>
          <View style={styles.left}>
            <View style={styles.accountType}>
              <Text style={styles.accountInfoText}>{data.AccType} A/C</Text>
            </View>
            <View style={styles.accountNumber}>
              <Ionicons
                name="ios-wallet-outline"
                size={15}
                style={{ color: "#555555", marginRight: 5 }}
              />
              <Text style={styles.accountInfoText}>{data.AccNum}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: 25,
    borderRadius: 5,
    justifyContent: "space-between",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  accountInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountInfoText: {
    fontFamily: "Regular",
    fontSize: 12,
    color: "#555555",
    marginVertical: 2,
  },
  accountNumber: {
    flexDirection: "row",
    alignItems: "center",
  },
  amount: {},
  amountText: {
    fontFamily: "Medium",
    fontSize: 14,
    marginRight: 20,
  },
});

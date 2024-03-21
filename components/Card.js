import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as BankingIcons from "./BankingIcons";
import { Colors } from "../screens/style/Theme";
import * as SVG from "../components/BankingIcons";
import Api from "../constants/Api";
import ToastMessage from "./Toast/Toast";
import request from "../config/RequestManager";

export const AccountCard = ({ data, navigation,  balanceError }) => {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState();

  useEffect(() => {
      (async () => getReport())();
  }, [])

  const getReport = async () => {
      var response = await (await request())
          .get(Api.Reports.Eod)
          .catch(function (error) {
              setIsLoading(false)
              ToastMessage.Short("Error! Contact Support");
          });
      if (response != undefined) {
          if (response.data.Code == 200) {
              setReports(response.data.Data);
          } else {
              ToastMessage.Short(response.data.Message);
          }
      } else {
          ToastMessage.Short("Error Loading Notes");
      }
      setIsLoading(false);
  };


  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View style={styles.container}>
        <View>
          <View style={styles.accountInfo}>
            <View style={styles.left}>
              <View style={styles.accountType}>
              {!reports ? <Text style={styles.accountInfoText}>Visits: XXX</Text>: <Text style={styles.accountInfoText}>Visits: {reports?.Visit}</Text>}
              </View>
              <View style={styles.accountNumber}>
            
              {!reports ? <Text style={styles.accountInfoText}>Order: XXX</Text>: <Text style={styles.accountInfoText}>Order: {reports?.NewOrder}</Text>}
                <Text style={styles.accountInfoText}>{data.AccNum}</Text>
              </View>
            </View>
          </View>
            <View>
              <View style={{ flexDirection: "row", justifyContent:"space-between", alignItems:"center" }}>
              
                {!reports || !visible ? <Text style={[styles.accountInfoText]}>Order Amount: Rs. XXXXXX</Text>: <Text style={styles.accountInfoText}>Order Amount: Rs. {reports?.OrderAmount}</Text>}
                <View style={{marginLeft: 8}}>
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
        </View>
        <TouchableOpacity   onPress={() => {
              navigation.navigate("ReceivePayment");
            }} style={{padding: 10}}>
          <View
            style={{
              alignSelf: "flex-end",
              alignItems: "center",
            }}
          
          >
            <SVG.purseIcon height={45} width={45} fill={Colors.primary} />
          
          </View>
        
        </TouchableOpacity>
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
  amountText: {
    fontFamily: "Medium",
    fontSize: 14,
    marginRight: 20,
  },
});

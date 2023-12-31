import React from "react";
import { useState, useEffect } from "react";
import api from "../constants/Api";
import request from "../config/RequestManager";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import helpers from "../constants/Helpers";
export const ConfirmationView = ({
  style,
  confirmationData,
  amount,
  otherCharges = 0,
  serviceKey,
}) => {
  const lableStyle = [styles.label, { ...style }];
  const [cashBack, setCashBack] = useState(0);
  const [totalAmount, setTotalAmount] = useState(amount);
  const [service, setService] = useState(serviceKey);

  const serviceCharge = confirmationData.find(
    (arr) => arr.label === "Service Charge :"
  );
  const GetCommissionByKey = async () => {
    let companyId = await helpers.GetCompanyId();
    var url =
      api.UserCommissionRateApi +
      "?companyId=" +
      companyId +
      "&serviceKey=" +
      serviceKey +
      "&amount=" +
      amount;
    var response = await (await request()).get(url);
    if (response != null && response != undefined) {
      var cb = parseFloat(response.data);
      setCashBack(cb);
      setTotalAmount(
        parseFloat(amount) +
          parseFloat(otherCharges) -
          cb +
          parseFloat(serviceCharge.value)
      );
    }
  };

  useEffect(() => {
    if (service != "" && service != null) {
      GetCommissionByKey();
    }
  }, []);

  return (
    <View style={styles.card}>
      {confirmationData.map(function(item, index) {
        return (
          <View style={[styles.row, item.styleRow]} key={index}>
            <Text style={[styles.label, item.styleLabel]}>{item.label}</Text>
            <Text style={[styles.value, item.styleValue]}>{item.value}</Text>
          </View>
        );
      })}
      {serviceKey != "" && (
        <View>
          <View style={[styles.row]}>
            <Text
              style={[styles.label, { color: "#FFA500", fontFamily: "Medium" }]}
            >
              Cash Back
            </Text>
            <Text
              style={[styles.value, { color: "#FFA500", fontFamily: "Medium" }]}
            >
              {cashBack}
            </Text>
          </View>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 1,
                borderTopColor: "green",
                fontFamily: "Medium",
              },
            ]}
          >
            <Text style={[styles.label]}>Total Amount</Text>
            <Text style={[styles.value]}>{totalAmount}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingBottom: 5,
    margin: 20,
    paddingStart: 10,
    borderRadius: 10,
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
    fontFamily: "Bold",
  },
  label: {
    color: "#000",
    fontFamily: "Medium",
  },
});

import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import request from "../config/RequestManager";
import ToastMessage from "../components/Toast/Toast";
import moment from "moment";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "./style/Theme";

const ExchangeRates = () => {
  useEffect(() => {
    updateDate();
  }, []);

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const updateDate = () => {
    const fullDate = moment().format("yyyy-MM-DD");
    let link =
      "https://www.nrb.org.np/api/forex/v1/rates?page=1&per_page=100&from=" +
      fullDate +
      "&to=" +
      fullDate;
    getRates(link);
  };

  const [rates, setRates] = useState([]);

  const getRates = async (link) => {
    setIsLoading(true);
    var response = await (await request()).get(link).catch(function(error) {
      ToastMessage.Short("Error loading forex");
    });
    if (response != undefined) {
      if (response.status == 200) {
        let payload = response.data.data.payload;
        let rate = [];
        if (payload != null && payload.length > 0) {
          setError(false);
          rate = payload.map((item) => setRates(item.rates));
        } else {
          setError(true);
        }
      } else {
        ToastMessage.Short("Error Loading  Rates");
      }
    } else {
      ToastMessage.Short("Error Loading Exchange Rates");
    }
    setIsLoading(false);
  };
  return (
    <>
      <View style={styles.head}>
        <Spinner
          color={Colors.primary}
          visible={isLoading}
          textContent={"Loading rates..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
        <View style={styles.head1}>
          <Text style={styles.headText}>Currency</Text>
        </View>
        <View style={styles.head2}>
          <Text style={styles.headText}>Buy</Text>
          <Text style={styles.headText}>Sell</Text>
        </View>
      </View>
      <ScrollView style={styles.container}>
        {error ? (
          <View style={styles.container}>
            <Text style={styles.errorMessage}>
              The Exchange Rates are updated everyday at 12:00
            </Text>
          </View>
        ) : (
          <View style={styles.table}>
            {rates.map((item, index) => (
              <View style={styles.item} key={index}>
                <View style={styles.item1}>
                  <Text style={styles.itemText}>{item.currency.name}</Text>
                </View>
                <View style={styles.item2}>
                  <Text style={styles.itemText}>{item.buy}</Text>
                  <Text style={styles.itemText}>{item.sell}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
};
export default ExchangeRates;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  table: {
    padding: 10,
    borderTopWidth: 0,
  },
  head: {
    padding: 10,
    flexDirection: "row",
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginRight: "5%",
    marginLeft: "5%",
  },

  head1: {
    width: "50%",
  },

  head2: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-evenly",
  },

  item: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    height: 35,
  },

  item1: {
    width: "50%",
  },

  item2: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "space-evenly",
  },
  headText: {
    fontWeight: "bold",
    fontSize: 17.5,
  },
  itemText: {
    fontSize: 15,
  },
  errorMessage: {
    textAlign: "center",
    fontSize: 15,
    color: "red",
  },
});

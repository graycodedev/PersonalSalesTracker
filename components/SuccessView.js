import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors } from "../screens/style/Theme";
import { TopBackgroundIcon } from "./IconsAll";
import * as FileSystem from "expo-file-system";
import helpers from "../constants/Helpers";
import ToastMessage from "./Toast/Toast";
import * as BankingIcons from "./BankingIcons";
import Api from "../constants/Api";
import Spinner from "react-native-loading-spinner-overlay";
import moment from "moment/moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SuccessView = ({
  title,
  style,
  data,
  message,
  pending,
  logId,
  tranDate,
}) => {
  const lableStyle = [styles.label, { ...style }];
  const [isLoading, setIsLoading] = useState(true);
  const [logDetail, setLogDetail] = useState({});
  const [userName, setUserName] = useState();

  const getUserInfo = async () => {
    let user = await AsyncStorage.getItem("UserInfo");
    if (user != null) {
      const u = JSON.parse(user);
      setUserName(u.UserName);
    }
  };

  const getLogDetail = async () => {
    var detail = await helpers.GetTransactionDetailByUniqueId(logId);
    // console.log("Details", detail.TranDate);
    setLogDetail(detail);
  };

  // the useEffect is only there to call `fetchData` at the right time
  useEffect(() => {
    getUserInfo();
    if (!tranDate) {
      getLogDetail();
    }

    setIsLoading(false);
  }, []);

  const downloadFile = async () => {
    let fileUrl = await helpers.GetFileUrlById(logId);
    // console.log("AVC", fileUrl);
    await helpers.DownloadFile(fileUrl);
  };

  return (
    <ScrollView nestedScrollEnabled={true}>
      <Spinner
        color={Colors.primary}
        visible={isLoading}
        textContent={"loading details..."}
        textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
      />
      <View>
        <TopBackgroundIcon
          style={{ position: "absolute" }}
          preserveAspectRatio="none"
          width="100%"
        />
      </View>

      {!pending ? (
        <Text
          style={[
            {
              fontWeight: "700",
              fontSize: 20,
              color: "#fff",
              marginLeft: 30,
              marginTop: 60,
            },
          ]}
        >
          {title}
        </Text>
      ) : (
        <Text
          style={[
            {
              fontWeight: "700",
              fontSize: 20,
              color: Colors.pending,
              marginLeft: 30,
              marginTop: 60,
            },
          ]}
        >
          {title}
        </Text>
      )}
      {!isLoading && (
        <View style={styles.card}>
          <BankingIcons.Success
            width={200}
            height={200}
            style={{ alignSelf: "center" }}
          />
          {logId && (
            <View style={[styles.row]}>
              <Text style={[styles.label]}>Reference</Text>
              <Text style={[styles.value]}>{logId}</Text>
            </View>
          )}
          {logDetail?.TranDate && (
            <View style={[styles.row]}>
              <Text style={[styles.label]}>Date/Time</Text>

              <Text style={[styles.value]}>
                {logDetail.TranDate
                  ? moment(logDetail.TranDate).format("D MMMM YYYY, h:mm A")
                  : "loading"}
              </Text>
            </View>
          )}
          {tranDate && (
            <View style={[styles.row]}>
              <Text style={[styles.label]}>Date/Time</Text>

              <Text style={[styles.value]}>
                {moment(tranDate).format("D MMMM YYYY, h:mm A")}
              </Text>
            </View>
          )}
          {data.map(function(item, index) {
            return (
              <View key={index} style={[styles.row, item.styleRow]}>
                <Text style={[styles.label, item.styleLabel]}>
                  {item.label}
                </Text>
                <Text style={[styles.value, item.styleValue]}>
                  {item.value}
                </Text>
              </View>
            );
          })}
          <View style={[styles.row]}>
            <Text style={[styles.label]}>Initiator</Text>
            <Text style={[styles.value]}>{userName}</Text>
          </View>
          <View>
            <Text>{message}</Text>
          </View>
        </View>
      )}
      {!pending && logId && (
        <TouchableOpacity
          style={{
            alignSelf: "center",
            padding: 10,
          }}
          onPress={() => downloadFile()}
        >
          <Text
            style={{ textDecorationLine: "underline", color: Colors.primary }}
          >
            download receipt
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
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
    fontWeight: "bold",
  },
  label: {
    color: "#000",
  },
});

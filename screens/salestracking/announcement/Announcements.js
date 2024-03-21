import { getNotificationChannelsAsync } from "expo-notifications";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";

import request from "../../../config/RequestManager";
import api from "../../../constants/Api";
import ToastMessage from "../../../components/Toast/Toast";
import Spinner from "react-native-loading-spinner-overlay";

import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../style/Theme";

const Announcements = (props) => {
  const [notifications, setNotifications] = useState([]);
  const [pushNotificationData, setPushNotificationData] = useState();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    setLoading(true);
    var response = await (await request())
      .get(api.Announcement.List + "?offset=" + pageNo + "?limit=" + pageSize)
      .catch(function(error) {
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        setNotifications(response.data.Data);
      } else {
        ToastMessage.Short("Error Loading Notifications");
      }
    } else {
      ToastMessage.Short("Error Loading Notifications");
    }
    setLoading(false);
  };

  // const notifications = [
  //   {
  //     text:
  //       "This is a notification :3This is a notification :3This is a notification :3This is a notification :3This is a notification :3This is a notification :3This is a notification :3This is a notification :3",
  //     date: "2021-10-28",
  //   },
  //   {
  //     text:
  //       "This is a notification :3This is a notification :3This is a notification :3This is a notification :3This is a notification :3This is a notification :3This is a notification :3This is a notification :3",
  //     date: "2021-10-29",
  //   },
  //   {
  //     text:
  //       "This is a notification :3This is a notification :3This is a notification :3This is a notification :3",
  //     date: "2021-10-29",
  //   },
  // ];

  return (
    <>
      <Spinner
        color={Colors.primary}
        visible={loading}
        textContent={"Loading notifications..."}
        textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
      />
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.container}>
        {loading == false && notifications.length === 0 && (
          <View style={styles.noNoti}>
            <Text style={styles.noNotiText}>
              You don't have any Notifications!
            </Text>
          </View>
        )}

        {loading == false && notifications.length > 0 && (
          <>
            {notifications.map((item, index) => (
              <View style={styles.notification} key={index}>
                <Icon
                  name="notifications-circle-outline"
                  size={32}
                  style={styles.notificationIcon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.notificationText}>{item.Title}</Text>
                  <View style={styles.notiFooter}>
                    <Text style={styles.date}>{item.Body}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </>
  );
};
export default Announcements;

const styles = StyleSheet.create({
  notification: {
    backgroundColor: "#e5e5e5",
    width: Dimensions.get("screen").width - 30,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    marginTop: 10,
    borderRadius: 15,
    flexDirection: "row",
  },
  notificationText: {
    textAlign: "justify",
    fontSize: 15.9,
  },
  textContainer: {
    width: "86%",
  },
  notificationIcon: {
    width: "14%",
    color: Colors.primary,
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
  noNotiText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
    fontFamily: "Regular",
  },
  notiFooter: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
  },
  showButton: {
    color: "blue",
  },
});

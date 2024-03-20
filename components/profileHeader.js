import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ImageStore,
  AppState,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Colors } from "../screens/style/Theme";
import IMAGES from "../constants/newImages";
import helpers from "../constants/Helpers";
import * as BankingIcons from "./BankingIcons";
import ThemedListItem from "react-native-elements/dist/list/ListItem";
import Api from "../constants/Api";
import { ProfileIcon } from "./IconsAll";
import * as SVG from "../components/BankingIcons";
import * as Location from "expo-location";
import axios from "axios";
import qs from "qs";
import { ActivityIndicator } from "react-native";
import ToastMessage from "./Toast/Toast";
import DeviceStorage from "../config/DeviceStorage";
import request from "../config/RequestManager";
import WarningModal from "./WarningModal";

const ProfileHeader = (props) => {
  const [userId, setUserId] = useState();
  const [fullName, setFullName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckInConfirmation, setShowCheckInConfirmation] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    GetCheckInStatus();
  }, []);

  const GetCheckInStatus = async () => {
    let isCheckedIn = await helpers.GetCheckInStatus();
    setCheckedIn(isCheckedIn);
  };
  const GetUserInfo = async () => {
    const u = await helpers.GetUserInfo();
    if (u != null) {
      setFullName(u.FullName);
      setMemberId(u.UserName);
      setUserId(u.Id);
      setPhoneNumber(u.PhoneNumber);
      setProfilePicture(u.ProfilePicture);
    }
  };
  GetUserInfo();

  const checkIn = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      props.navigation.navigate("PermissionScreen", {type:"location"});
      return;
    }
    let location = await helpers.GetLocation();
   

    let date = new Date();
    let attendanceDate = date.toISOString().split("T")[0];
    let attendanceTime = date.toTimeString().split(" ")[0];
    let route = checkedIn ? Api.Attendances.CheckOut : Api.Attendances.CheckIn;
    let data = {
      Latitude: location.lat,
      Longitude: location.lng,
      IsCheckIn: !checkedIn,
      AttendanceDate: attendanceDate,
      AttendanceTime: attendanceTime,
    };

    var response = await (await request()).post(route, qs.stringify(data));
    if (response != undefined) {
      if (response.data.Code == 200) {
        if (checkedIn) {
          await DeviceStorage.deleteKey("checkInInfo");
        } else {
          await DeviceStorage.saveKey("checkInInfo", JSON.stringify(data));
        }
        GetCheckInStatus();
        setShowCheckInConfirmation(false);
        ToastMessage.Short(response.data.Message);
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error Occurred, Contact Support !");
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <BankingIcons.ScreenheaderEllipse
          fill={Colors.primary}
          position="absolute"
          width="100%"
        />
      </View>
      <View style={styles.profileBox}>
        {profilePicture ? (
          <Image source={{ uri: Api.BaseUrl + profilePicture }} />
        ) : (
          // <Image
          //   style={{ width: 60, height: 60, marginBottom: 12 }}
          //   source={IMAGES.profile}
          // />
          <ProfileIcon height={80} width={80} fill={"gray"} />
        )}
        <Text style={{ fontSize: 16, fontFamily: "Bold" }}>{fullName}</Text>
        <Text
          style={{
            fontSize: 12,
            color: "#777777",
            marginBottom: 24,
            fontFamily: "SemiBold",
          }}
        >
          {phoneNumber}
        </Text>
        <View
          style={{
            width: 263,
            borderBottomColor: "#EEEEEE",
            borderBottomWidth: 2,
            marginBottom: 15,
          }}
        />
        <View style={styles.qrAndTickets}>
          <TouchableOpacity
            style={styles.boxes}
            onPress={() => props.navigation.navigate("ReceivePayment")}
          >
            {/* <Image source={IMAGES.shareQR} style={{marginLeft: 22.4, marginRight: 12}} /> */}
            <BankingIcons.QrInBlackIcon />
            <Text style={{ fontFamily: "SemiBold", fontSize: 12 }}>
              Share QR
            </Text>
          </TouchableOpacity>
          {/* navigation.navigate("LoadAccountList"); */}
          <TouchableOpacity
            style={[
              styles.checkIn,
              { borderColor: checkedIn ? "red" : "#5BC236" },
            ]}
            onPress={() => setShowCheckInConfirmation(true)}
          >
            <BankingIcons.fingerPrint height={25} width={25} fill={"black"} />

            {!checkedIn ? (
              <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>
                Check In
              </Text>
            ) : (
              <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>
                Check Out
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {showCheckInConfirmation && (
          <WarningModal
            text1={!checkedIn ? "CHECK IN?" : "CHECK OUT?"}
            text2={
              !checkedIn
                ? "Are you sure you want to Check In?"
                : "Are you sure you want to Check Out?"
            }
            onConfirm={checkIn}
            onCancel={() => {
              setShowCheckInConfirmation(false);
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 105,
    alignItems: "center",
    paddingTop: 24,
    backgroundColor: Colors.primary,
  },
  profileBox: {
    width: "85%",
    height: 233,
    backgroundColor: "white",
    borderRadius: 4,
    // position: "absolute",
    top: -40,
    alignSelf: "center",
    marginTop: 10,
    alignItems: "center",
    paddingTop: 24,
  },
  qrAndTickets: {
    width: 264,
    height: 36,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 0,
  },
  boxes: {
    width: 126,
    height: 36,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  checkIn: {
    borderColor: "#5BC236",
    width: 126,
    height: 36,
    borderRadius: 4,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  notificationAndProfile: {
    position: "absolute",
    marginTop: 25,
    alignSelf: "flex-end",
    paddingRight: 30,
    flexDirection: "row",
  },
});

export default ProfileHeader;

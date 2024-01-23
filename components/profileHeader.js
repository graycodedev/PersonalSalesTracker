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
} from "react-native";
import { Colors } from "../screens/style/Theme";
import IMAGES from "../constants/newImages";
import helpers from "../constants/Helpers";
import * as BankingIcons from "./BankingIcons";
import ThemedListItem from "react-native-elements/dist/list/ListItem";
import Api from "../constants/Api";
import { Profile } from "./IconsAll";
import * as SVG from "../components/BankingIcons"
import * as Location from 'expo-location';
import axios from 'axios';
import qs from "qs";
import { ActivityIndicator } from "react-native";

const ProfileHeader = (props) => {
  const [userId, setUserId] = useState();
  const [fullName, setFullName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState();
  const [isLoading, setIsLoading] = useState(false);


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
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    let date = new Date();
    let attendanceDate = date.toISOString().split('T')[0];
    let attendanceTime = date.toTimeString().split(' ')[0];

    let data = {
      Latitude: latitude,
      Longitude: longitude,
      AttendanceDate: attendanceDate,
      AttendanceTime: attendanceTime
    };

    axios.post(Api.Attendances.CheckIn, data)
      .then(response => {
        console.log(response.data);

        AsyncStorage.setItem('checkInInfo', JSON.stringify(data));
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View>
      <View style={styles.container}>
        <BankingIcons.ScreenheaderEllipse
          fill={Colors.primary}
          position='absolute'
          width='100%'
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
          <Profile height={80} width={80} fill={"gray"} />
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
            onPress={() =>
              props.navigation.navigate("Scan", { screen: "ShareMyQr" })
            }
          >
            {/* <Image source={IMAGES.shareQR} style={{marginLeft: 22.4, marginRight: 12}} /> */}
            <BankingIcons.QrInBlackIcon
            />
            <Text style={{ fontFamily: "SemiBold", fontSize: 12 }}>
              Share QR
            </Text>
          </TouchableOpacity>
          {/* navigation.navigate("LoadAccountList"); */}
          <TouchableOpacity
            style={styles.checkIn}
            onPress={checkIn}
          >
            <Text style={{ fontFamily: "SemiBold", fontSize: 14, color: "white" }}>
              Check In
            </Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "space-around"
  },
  checkIn: {
    backgroundColor: "#5BC236",
    width: 126,
    height: 36,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
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

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  AppState,
} from "react-native";
import Swiper from "react-native-swiper";
import IMAGES from "../constants/newImages";
import { Colors } from "../screens/style/Theme";
import helpers from "../constants/Helpers";
import { setAutoServerRegistrationEnabledAsync } from "expo-notifications";

const HomeHeader = () => {
  // const [accountType, setAccountType]=useState('Saving');
  // const [accountNumber, setAccountNumber]=useState('014001458371854');
  // const [balance, setBalance]=useState(1000000000);
  const [userName, setUserName] = useState("");
  const [bankName, setBankName] = useState("");
  useEffect(() => {
    GetBankName();
    GetUserInfo();
  }, []);

  const GetBankName = async () => {
    let compInfo = await helpers.GetCompanyDetails();
    setBankName(compInfo.Name);
  };
  const GetUserInfo = async () => {
    const u = await helpers.GetUserInfo();
    if (u != null) {
      setUserName(u.FullName);
    }
  };
  return (
    // <View style={{flex:1}}>

    <ImageBackground source={IMAGES.screenheader} style={styles.container}>
      <Image source={IMAGES.Ellipse} style={{ width: "100%" }} />
      <View style={styles.accountAndBankName}>
        <Text style={{ fontSize: 16, color: "white" }}>Hi, {userName}</Text>
        <Text style={{ fontSize: 12, color: "white" }}>
          Welcome to {bankName}
        </Text>
      </View>
      <View style={styles.notificationAndProfile}>
        <Image source={IMAGES.notification} style={{ marginRight: 20 }} />
        <Image source={IMAGES.profile} />
      </View>
    </ImageBackground>
    // <View style={styles.balanceContainer}>

    //     <Text style={{color: '#555555'}}>{accountType} A/C</Text>
    //     <View style={{flexDirection:'row', width: 148, height: 20, marginTop: 4, marginBottom: 6}}>
    //         <Image source={IMAGES.account} style={{marginRight: 10, tintColor: '#555555'}}/>
    //         <Text style={{marginBottom: 6, fontSize: 12, color: '#555555'}}>{accountNumber}</Text>
    //     </View>
    //     <View style={{flexDirection:'row', alignItems: 'center'}}>
    //     <Text style={{fontSize:20, marginRight: 16}}>NPR {balance}</Text>
    //     <Image source={IMAGES.eyes} />
    //     </View>
    //     <View style={{marginBottom: 130}}>
    //     </View>
    //     <View style={styles.qrCode}>
    //         <Image style={{ tintColor: COLORS.primary}} source={IMAGES.QRcode} />
    //     </View>

    // </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 105,
    backgroundColor: Colors.primary,
  },
  balanceContainer: {
    marginTop: 82,
    alignSelf: "center",
    height: 90,
    backgroundColor: "grey",
    padding: 12,
    backgroundColor: "white",
    position: "absolute",
    width: 312,
    borderRadius: 5,
  },
  qrCode: {
    position: "absolute",
    marginTop: 12,
    marginLeft: 264,
  },
  notificationAndProfile: {
    position: "absolute",
    marginTop: 25,
    alignSelf: "flex-end",
    paddingRight: 30,
    flexDirection: "row",
    backgroundColor: "red",
  },
  accountAndBankName: {
    position: "absolute",
    marginTop: 30,
    marginLeft: 25,
  },
});

export default HomeHeader;

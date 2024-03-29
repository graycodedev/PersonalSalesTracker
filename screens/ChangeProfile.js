import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import helpers from "../constants/Helpers";
import { Colors } from "./style/Theme";
import api, { endPoints } from "../constants/Api";
// import * as ImagePicker from "expo-image-picker";
const { width, height } = Dimensions.get("screen");
import { ProfileIcon } from "../components/IconsAll";

const ChangeProfile = () => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [image, setImage] = useState();

  const GetUserInfo = async () => {
    const u = await helpers.GetUserInfo();
    console.log(u);
    if (u != null) {
      setPhoneNumber(u.PhoneNumber);
      setEmail(u.Email);
      setFullName(u.FullName);
      setProfilePicture(
        u.ProfilePicture ? api.BaseUrl + u.ProfilePicture : null
      );
    }
  };

  // const imagePicker = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.cancelled) {
  //     setImageChanged(true);
  //     setProfilePicture(result.uri);
  //     uploadFileToServer(result);
  //   }
  // };
  // const uploadFileToServer = async (photo) => {
  //   await helpers.uploadFileToServer(photo);
  // };

  useEffect(() => {
    GetUserInfo();
  }, []);
  return (
    <View style={styles.container}>
    
      <View style={styles.headerBackGround} />
      <View style={styles.box}>
        <View style={{ marginBottom: 10 }}>
          {!profilePicture ? (
            <ProfileIcon height={100} width={100} fill={"gray"} />
          ) : (
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 75,
              }}
              source={{
                uri:
                  imageChanged == true
                    ? profilePicture
                    : api.BaseUrl + myInfo.ProfileImage,
              }}
            />
          )}
        </View>

        {/* <TouchableOpacity onPress={imagePicker}>
          <Text>Edit Image</Text>
        </TouchableOpacity> */}

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: "5%",
            color: Colors.primary,
          }}
        >
          {api.CompanyName}
        </Text>
        <View style={{ alignSelf: "flex-start" }}>
          <Text
            style={{ fontSize: 16, fontWeight: "bold", marginBottom: "3%" }}
          >
            Basic Information
          </Text>
          <View style={styles.userInfoRow}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.infoName}>Name</Text>
              <Text>{fullName}</Text>
            </View>
          </View>
          <View style={styles.userInfoRow}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.infoName}>PhoneNumber</Text>
              <Text>{phoneNumber}</Text>
            </View>
          </View>
          <View style={styles.userInfoRow}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.infoName}>Email</Text>
              <Text>{email}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

//   ChangeProfile = async () => {
//     const userId = (await helpers.GetUserInfo()).Id;
//     var data = qs.stringify({
//       clientId: api.CompanyId,
//       CompanyId: api.CompanyId,
//       SecretKey: api.SecretKey,
//       UserId: userId,
//       OldPassword: this.state.oldPassword,
//       NewPassword: this.state.newPassword,
//       ConfirmPassword: this.state.confirmPassowrd,
//       DeviceId: 1,
//       // Expo.Constants.deviceId,
//     });

//     var response = await (await request())
//       .post(api.ChangePassword, data)
//       .catch(function(error) {
//         console.log(error);
//         ToastMessage.Short("Error Contact Support");
//       });
//     if (response.data.Code == 200) {
//       this.setState({ isLoading: false });
//       ToastMessage.Short(response.data.Message);
//       this.props.navigation.navigate("Home");
//     } else {
//       ToastMessage.Short(response.data.Message);
//     }
//     this.setState({ isLoading: false });
//   };
// }
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  headerBackGround: {
    width: "100%",
    height: "45%",
    backgroundColor: Colors.primary,
  },
  box: {
    width: "90%",
    backgroundColor: "white",
    position: "absolute",
    marginTop: "20%",
    alignItems: "center",
    shadowColor: "red",
    shadowRadius: 5,
    padding: 10,
    borderRadius: 8,
  },
  topText: {
    marginTop: 36,
    marginBottom: "10%",
  },
  imageBackground: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F5F5F5",
    position: "absolute",
    marginTop: 23,
  },
  submitButton: {
    width: "90%",
    height: 36,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignSelf: "center",
  },
  changePasswordText: {
    alignSelf: "center",
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  iconStyles: {
    color: "#CCCCCC",
  },
  inputBox: {
    height: 40,
    backgroundColor: "white",
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 4,
    borderColor: "#e2e2e2",
    borderWidth: 2,
    marginVertical: 10,
  },
  alert: {
    color: "red",
    marginHorizontal: "10%",
  },
  infoName: { color: "grey", marginRight: 10, fontSize: 14 },

  userInfoRow: {
    marginBottom: "1%",
  },
});

export default ChangeProfile;

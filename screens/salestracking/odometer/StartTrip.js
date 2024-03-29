import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ButtonPrimary } from "../../../components/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { RegularInputText, AmountInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";
import * as Location from "expo-location";
import qs from "qs";
import Api from "../../../constants/Api";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import { ApiRequestWithImage } from "../../../components/ApiRequest";

const StartTrip = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startOdometer, setStartOdometer] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Start Trip",
    });
    getLocation();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      props.navigation.navigate("PermissionScreen");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy:
        Platform.OS == "android"
          ? Location.Accuracy.Low
          : Location.Accuracy.Lowest,
    });

    setLocation(location);
  };

  const saveTrip = async () => {
    if (!location) {
      ToastMessage.Short("Location not available");
      return;
    }
    setIsLoading(true);

    let data = {
      Id: 0,
      VehicleNo: 1,
      StartLatitude: location.coords.latitude,
      StartLongitude: location.coords.longitude,
      StartOdometer: startOdometer,
      StartDate: new Date(),
    };

    let imageData = {
      StartOdometerFile: selectedImage,
    };
    var response = await ApiRequestWithImage(
      Api.Odometers.Start,
      data,
      imageData
    );

    if (response != undefined) {
      if (response.data.Code == 200) {
        setIsLoading(false);
        navigation.goBack();
        return response.data.Data;
      } else {
        console.log("Server response:", response.data);
        ToastMessage.Short(response.data.Message || "An error occurred");
      }
    } else {
      ToastMessage.Short("Error Occurred. Contact Support");
    }
    setIsLoading(false);
  };

  const isFormFilled = startOdometer && location && selectedImage;

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.container}>
        <View>
          <RegularInputText
            key="startOdometer"
            placeholder="Start Odometer"
            onChangeText={(text) => {
              setStartOdometer(text);
            }}
            value={startOdometer}
            keyboardType="numeric"
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "Medium", marginBottom: 20 }}>
            Odometer Image
          </Text>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={pickImage}
          >
            <View style={styles.ImagePicker}>
              {selectedImage ? (
                <Image style={styles.image} source={{ uri: selectedImage }} />
              ) : (
                <Image
                  style={styles.defaultImage}
                  source={require("../../../assets/newImg/plus.png")}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ margin: 30 }}>
          <TouchableOpacity
            onPress={async () => {
              if (isFormFilled) {
                await saveTrip();
              }
            }}
            disabled={!isFormFilled}
          >
            <ButtonPrimary title={"Start Trip"} />
            <ActivityIndicator
              animating={isLoading}
              color="#ffa500"
              style={styles.activityIndicator}
            ></ActivityIndicator>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    padding: 10,
    alignContent: "center",
    justifyContent: "flex-start",
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  ImagePicker: {
    height: 150,
    width: 150,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9A9A9A",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  defaultImage: {
    width: "50%",
    height: "50%",
    resizeMode: "cover",
    opacity: 0.1,
  },
});

export default StartTrip;

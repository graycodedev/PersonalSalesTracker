import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Platform,
  ImageBackground, Modal
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
import helpers from "../../../constants/Helpers";
import { Colors } from "../../style/Theme";
import * as SVG from "../../../components/BankingIcons"
import { Camera } from "expo-camera";
import { AutoCompleteList } from "../../../components/AutoCompleteList";


const StartTrip = (props) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [startOdometer, setStartOdometer] = useState("");
  const [location, setLocation] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
     const [selectedVehicle, setselectedVehicle] = useState();
        const [showVehiclesList, setshowVehiclesList] = useState(false);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: "Start Trip",
    });
    getLocation();
    (async () => {
      let { status } = await Camera.getCameraPermissionsAsync();
      if (status !== "granted") {
        props.navigation.navigate("PermissionScreen", {type:"camera"});
        return;
      }
    })();
  }, []);

  const handlePhotoUpload = async () => {
    setIsCameraReady(true);
    if (!cameraRef.current) {
      return;
    }
  };

  const takePhoto = async () => {
    const options = { quality: 1, base64: true };
    var photo = await cameraRef.current.takePictureAsync(options);
    setPhoto(photo);
    setIsCameraReady(false);
  };

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

    let location = await helpers.GetLocation();
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
      VehicleId: selectedVehicle.Id,
      StartLatitude: location.lat,
      StartLongitude: location.lng,
      StartOdometer: startOdometer,
      StartDate: new Date(),
    };

    let imageData = {
      StartOdometerFile: photo.uri,
    };
    var response = await ApiRequestWithImage(
      Api.Odometers.Start,
      data,
      imageData
    );

    console.log("Response", response)

    if (response != undefined) {
      if (response.data.Code == 200) {
        setIsLoading(false);
        props.navigation.navigate("OdometerList");
        // return response.data.Data;
      } else {
        // console.log("Server response:", response.data);
        ToastMessage.Short(response.data.Message || "An error occurred");
      }
    } else {
      ToastMessage.Short("Error Occurred. Contact Support");
    }
    setIsLoading(false);
  };

  const isFormFilled = startOdometer && location;

  
    const onClose = () => {
        setshowVehiclesList(false);
    }

     const updateselectedVehicle = (item) => {
        setselectedVehicle(item);
        setshowVehiclesList(false);
    }

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.container}>
        <View style={{ marginBottom: 15, zIndex: 99 }}>
                    <TouchableOpacity onPress={() => setshowVehiclesList(true)} style={{ paddingLeft: 10, paddingVertical: 14, backgroundColor: "white", borderRadius: 5 }}>

                        <Text style={{ fontFamily: "Regular", fontSize: 14 }}>  {!selectedVehicle ? "Select Vehicle" : selectedVehicle.VehicleName +" - "+  selectedVehicle.PlateNo}</Text>

                    </TouchableOpacity>


                    {showVehiclesList && (
                        <AutoCompleteList
                            autocompleteurl={Api.Vehicles.List}
                            noItemFoundText={"No vehicles found!"}
                            searchablePlaceholder="Search Vehicle"
                            itemSelected={updateselectedVehicle}
                            visible={showVehiclesList}
                            onClose={() => onClose()}
                            renderItem={(item) => (
                                <View style={styles.item}>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>{item.VehicleName}</Text>
                                    <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>{item.PlateNo}</Text>
                                    <Text style={{ fontFamily: "Regular", fontSize: 14 }}>{item.FuelType =="p"?"Petrol":item.FuelType =="d"?"Diesel":item.FuelType =="e"?"Electric": item.FuelType}</Text>
                                </View>
                            )}
                        />
                    )}
                </View>
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
        <View style={{flexDirection:"row",  backgroundColor: "#e5e5e5", marginTop: 4}}>
          <View style={{flex:5, padding: 12 }}>
            <Text style={{fontFamily:"Regular"}}>{location ?location.lat + ", " + location.lng:"Fetch Location Failed !!"}</Text>
          </View>
          <TouchableOpacity style={{flex: 2, backgroundColor: Colors.primary, padding: 12}} onPress={async()=>await getLocation()}><Text style={{color: "white", alignSelf:"center"}}>Get Location</Text></TouchableOpacity>
        </View>

      {!photo ?  <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "Medium", marginBottom: 20 }}>
            Odometer Image
          </Text>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={handlePhotoUpload}
          >
            <View style={styles.ImagePicker}>
             <SVG.Camera  fill={Colors.primary}  height={60} width={60} />
            </View>
          </TouchableOpacity>
        </View>:
          <View
                  style={{
                    height: 300,
                    width: "100%",
                     marginTop: 20
                  }}
                >
                  <ImageBackground
                    source={{
                      uri: photo.uri,
                    }}
                  
                    resizeMode="cover"
                    style={{
                      backgroundColor: "yellow",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={handlePhotoUpload}
                      style={{ alignItems: "center" }}
                    >
                      <SVG.Camera
                        height={50}
                        width={50}
                        fill={Colors.primary}
                      />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
        }

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
      {isCameraReady && (
        <Modal
        animationType="slide"
        transparent={true}
        visible={isCameraReady}
        style={{flex: 1}}
        >
                <Camera
                  ref={cameraRef}
                  isCameraReady={isCameraReady}
                  focusMode="continuous"
                  style={{ flex: 1,zIndex: 999, justifyContent:"flex-end", alignItems:"center"}}
                  ratio="16:9"
                >
                  {/* <Text> HI</Text> */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => takePhoto()}
                    ></TouchableOpacity>
                  </View>
                </Camera>
                </Modal>
              )}
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
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 10
  },
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "white",
  },
  item: {
    padding: 8,
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    marginBottom: 5,
    backgroundColor: "#fff",
    paddingLeft: 18
},
});

export default StartTrip;

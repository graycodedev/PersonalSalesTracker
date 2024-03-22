import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Modal,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { Camera } from "expo-camera";
import DropDownPicker from "react-native-dropdown-picker";
import { RegularInputText } from "../../../components/Input";
import { ButtonPrimary } from "../../../components/Button";
import PageStyle from "../../style/pageStyle";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AutoCompleteList } from "../../../components/AutoCompleteList";
import Api from "../../../constants/Api";
import qs from "qs";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import helpers from "../../../constants/Helpers";
import axios from "axios";
import { Colors } from "../../style/Theme";
import * as SVG from "../../../components/BankingIcons";
import MediaServices from "../../../components/media/MediaServices";
import {
  ApiRequestWithImage,
  ApiRequestWithImageAndFiles,
} from "../../../components/ApiRequest";

const { width } = Dimensions.get("screen");

const AddVisit = (props, route) => {
  const update = props.route.params?.update;
  const visits = props.route.params?.visit;
  const isParty = Boolean(visits?.PartyName);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    isParty ? "party" : "location"
  );
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState(visits?.LocationName || "");
  const [remark, setRemark] = useState(visits?.Remarks || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    visits?.VisitDate ? new Date(visits.VisitDate) : new Date()
  );
  const [showPartiesList, setShowPartiesList] = useState(false);
  const [selectedParty, setSelectedParty] = useState(visits?.PartyName || "");
  const [locationError, setLocationError] = useState("");
  const [remarkError, setRemarkError] = useState("");
  const [partyError, setPartyError] = useState("");
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [files, setFiles] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [fileError, setFileError] = useState("");
  const cameraRef = useRef(null);

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

  const getVisitPurpose = async () => {
    try {
      var response = await (await request())
        .get(Api.VisitPurpose.List)
        .catch(function (error) {
          ToastMessage.Short(error);
        });
      if (response != undefined) {
        if (response.data.Code == 200) {
          let purposesArr = [];
          if (response.data.Data.length == 0) {
            return;
          }
          response.data.Data.map((item) => {
            let purpose = {
              label: item.PurposeName,
              value: item,
            };
            purposesArr.push(purpose);
          });
          setPurposes(purposesArr);
        } else {
          ToastMessage.Short("Error Loading Purposes for Visit !");
        }
      } else {
        ToastMessage.Short("Error Loading Purposes for Visit !!");
      }
    } catch (error) {
      ToastMessage.Short(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let addText = update ? "Update" : "Add";
    navigation.setOptions({
      title: addText + " Visit",
    });
    (async () => await getLocation())();
    getVisitPurpose();
    (async () => {
      let { status } = await Camera.getCameraPermissionsAsync();
      if (status !== "granted") {
        props.navigation.navigate("PermissionScreen", { type: "camera" });
        return;
      }
    })();
  }, []);

  const parties = route.params ? route.params.parties || [] : [];

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const formattedDate = selectedDate.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const updateSelectedParty = (item) => {
    setSelectedParty(item);
    setShowPartiesList(false);
  };

  const onClose = () => {
    setShowPartiesList(false);
  };

  const getLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      props.navigation.navigate("PermissionScreen", { type: "location" });
      return;
    }

    let location = await helpers.GetLocation();
    setLocation(location);
  };

  const renderAdditionalComponent = () => {
    if (selectedOption === "party") {
      return (
        <View style={{ marginBottom: 15, zIndex: 98 }}>
          <TouchableOpacity
            onPress={() => setShowPartiesList(true)}
            style={{
              paddingLeft: 10,
              paddingVertical: 14,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <Text style={{ fontFamily: "Regular", fontSize: 14 }}>
              {" "}
              {!selectedParty ? "Add Party" : selectedParty.PartyName}
            </Text>
          </TouchableOpacity>
          {showPartiesList && (
            <AutoCompleteList
              autocompleteurl={Api.Parties.List}
              noItemFoundText={"No parties found!"}
              searchablePlaceholder="Search Party"
              itemSelected={updateSelectedParty}
              visible={showPartiesList}
              onClose={() => onClose()}
              renderItem={(item) => (
                <View style={styles.item}>
                  <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>
                    {item.PartyName}
                  </Text>
                  <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>
                    {item.ContactPersonName}
                  </Text>
                  <Text style={{ fontFamily: "Regular", fontSize: 14 }}>
                    {item.Email}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      );
    } else if (selectedOption === "location") {
      return (
        <View>
          <RegularInputText
            key="location"
            placeholder="Location"
            onChangeText={(text) => {
              setLocationName(text);
            }}
            value={locationName}
          />
          {locationError !== "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {locationError}
            </Text>
          )}
          <ActivityIndicator
            animating={isLoading}
            color="#ffa500"
            style={styles.activityIndicator}
          ></ActivityIndicator>
        </View>
      );
    }
    return null;
  };

  const goToVisits = () => {
    navigation.goBack();
  };

  const pickFiles = async () => {
    let selectedFiles = await MediaServices.PickFiles();
    let allFiles = selectedFiles.concat(files);
    setFiles(allFiles);
  };

  const saveVisit = async () => {
    let visitData = {};
    try {
      const companyId = 1;
      let partyId = null;
      let partyName = null;
      let locationNameToSave = null;
      let isParty = true;

      if (selectedOption === "party") {
        partyId = selectedParty ? selectedParty.Id : null;
        partyName = selectedParty ? selectedParty.PartyName : null;
      } else if (selectedOption === "location") {
        locationNameToSave = locationName;
        isParty = false;
      }

      const remarks = remark;

      let isValid = true;
      if (selectedOption === "location" && locationName.trim() === "") {
        isValid = false;
        setLocationError("Location is Required!");
      } else {
        setLocationError("");
      }

      if (remark.trim() === "") {
        isValid = false;
        setRemarkError("Remark is Required!");
      } else {
        setRemarkError("");
      }

      if (selectedOption === "party" && !selectedParty) {
        isValid = false;
        setPartyError("Party is Required!");
      } else {
        setPartyError("");
      }

      if (selectedPurpose?.IsReportRequired && files.length == 0) {
        isValid = false;
        setFileError("Select at least a file");
      } else {
        setFileError("");
      }
      if (selectedPurpose?.IsImageRequired && photo == null) {
        isValid = false;
        setPhotoError("Take a pic");
      } else [setPhotoError("")];

      if (!isValid) {
        return;
      }
      visitData = {
        Id: update ? visits.Id : 0,
        CompanyId: companyId,
        IsParty: isParty,
        PartyId: partyId,
        PartyName: partyName,
        LocationName: locationNameToSave,
        Remarks: remarks,
        Latitude: location ? location.lat : null,
        Longitude: location ? location.lng : null,
        IsActive: true,
        VisitPurposeId: selectedPurpose?.Id,
      };
      Object.keys(visitData).forEach(
        (key) => visitData[key] === null && delete visitData[key]
      );

      let imageData = {
        ImageFile: photo?.uri,
      };

      var response;
      if (
        selectedPurpose?.IsImageRequired &&
        selectedPurpose?.IsReportRequired
      ) {
        response = await ApiRequestWithImageAndFiles({
          route: Api.Visits.SaveByUser,
          data: visitData,
          imageData: imageData,
          files: files,
        });
      } else {
        if (selectedPurpose?.IsImageRequired) {
          response = await ApiRequestWithImageAndFiles({
            route: Api.Visits.SaveByUser,
            data: visitData,
            imageData: imageData,
          });
        } else if (selectedPurpose?.IsReportRequired) {
          response = await ApiRequestWithImageAndFiles({
            route: Api.Visits.SaveByUser,
            data: visitData,
            files: files,
          });
        } else {
          response = await ApiRequestWithImageAndFiles({
            route: Api.Visits.SaveByUser,
            data: visitData,
          });
        }
      }

      if (response != undefined) {
        if (response.data.Code == 200) {
          setIsLoading(false);
          goToVisits();
          ToastMessage.Short(response.data.Message);
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short("Error Occurred. Contact Support");
      }
    } catch (error) {
      await helpers.PostException({ data: visitData, messsage: error });
      setIsLoading(false);
      ToastMessage.Short("Error Occurred. Contact Support !!");
    }
  };

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={PageStyle.container}>
        <View style={{ marginBottom: 15, zIndex: 99 }}>
          <Text style={{ fontFamily: "Medium", color: "#9A9A9A" }}>
            Existing Party?
          </Text>
          <DropDownPicker
            containerStyle={{ height: 50 }}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              fontFamily: "Regular",
              borderColor: "#fff",
              borderWidth: 0,
            }}
            itemStyle={{
              justifyContent: "flex-start",
              fontFamily: "Medium",
              color: "red",
            }}
            labelStyle={{
              fontFamily: "Medium",
              color: "#9A9A9A",
            }}
            arrowColor={"#9A9A9A"}
            placeholder="Existing Party?"
            label="Existing Party?"
            items={[
              { label: "Yes", value: "party" },
              { label: "No", value: "location" },
            ]}
            onChangeItem={(item) => {
              setSelectedOption(item.value);
              if (item.value === "party") {
                setLocationName("");
              } else {
                setSelectedParty(null);
              }
            }}
            defaultValue={isParty ? "party" : "location"}
          />
        </View>

        {renderAdditionalComponent()}

        {/* <View>
          <Text style={{ fontFamily: "Medium", color: "#9A9A9A" }}>
            Visited Date
          </Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <RegularInputText
              key="date"
              placeholder="Visited Date"
              value={formattedDate}
              editable={false}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View> */}
        <View style={{ marginBottom: 10, marginTop: 10, zIndex: 99 }}>
          <DropDownPicker
            containerStyle={{ height: 50 }}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              fontFamily: "Regular",
              borderColor: "#fff",
              borderWidth: 0,
            }}
            itemStyle={{
              justifyContent: "flex-start",
              fontFamily: "Medium",
              color: "red",
            }}
            labelStyle={{
              fontFamily: "Medium",
              color: "#9A9A9A",
            }}
            arrowColor={"#9A9A9A"}
            placeholder="Choose purpose of Visit"
            label="Vat or Pan"
            items={purposes}
            onChangeItem={(item) => setSelectedPurpose(item.value)}
            defaultValue={"Vat or pan"}
          />
        </View>
        <View>
          <RegularInputText
            key="remark"
            placeholder="Remarks:"
            onChangeText={(text) => {
              setRemark(text);
            }}
            value={remark}
            multiline={true}
            numberOfLines={5}
            style={{ height: 100, alignItems: "flex-start", borderWidth: 0 }}
          />
          {remarkError !== "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {remarkError}
            </Text>
          )}
        </View>
        {selectedPurpose &&
          (selectedPurpose?.IsImageRequired ||
            selectedPurpose?.IsReportRequired) && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 12,
                paddingHorizontal: 20,
                backgroundColor: "#ffffff",
                marginBottom: 8,
              }}
            >
              {selectedPurpose?.IsReportRequired && (
                <View style={{ alignItems: "center" }}>
                  <TouchableOpacity
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 25,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.primary,
                    }}
                    onPress={async () => {
                      await pickFiles();
                    }}
                  >
                    <SVG.Upload height={25} width={25} fill={"#ffffff"} />
                  </TouchableOpacity>
                  <Text>Upload file</Text>
                  {files.length > 0 &&
                    files.map((item, index) => {
                      return (
                        <Text key={index}>
                          {item.name.slice(0, 20) +
                            "..." +
                            item.name.substring(item.name.length - 5)}
                        </Text>
                      );
                    })}
                </View>
              )}
              {selectedPurpose?.IsImageRequired && (
                <View style={{ alignItems: "center" }}>
                  {!photo && (
                    <>
                      <TouchableOpacity
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: Colors.primary,
                        }}
                        onPress={handlePhotoUpload}
                      >
                        <SVG.Camera height={25} width={25} fill={"#ffffff"} />
                      </TouchableOpacity>
                      <Text>Take Photo</Text>
                    </>
                  )}
                </View>
              )}
            </View>
          )}
        {photo && (
          <View
            style={{
              height: 300,
              width: "100%",
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
                <SVG.Camera height={50} width={50} fill={Colors.primary} />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#e5e5e5",
            marginTop: 4,
          }}
        >
          <View style={{ flex: 5, padding: 12 }}>
            <Text style={{ fontFamily: "Regular" }}>
              {location
                ? location.lat + ", " + location.lng
                : "Fetch Location Failed !!"}
            </Text>
          </View>
          <TouchableOpacity
            style={{ flex: 2, backgroundColor: Colors.primary, padding: 12 }}
            onPress={async () => await getLocation()}
          >
            <Text style={{ color: "white", alignSelf: "center" }}>
              Get Location
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ margin: 30 }}>
          <TouchableOpacity onPress={saveVisit}>
            <ButtonPrimary title={update ? "Update" : "Save"} />
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
          style={{ flex: 1 }}
        >
          <Camera
            ref={cameraRef}
            isCameraReady={isCameraReady}
            focusMode="continuous"
            style={{
              flex: 1,
              zIndex: 999,
              justifyContent: "flex-end",
              alignItems: "center",
            }}
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
  item: {
    padding: 8,
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    marginBottom: 5,
    backgroundColor: "#fff",
    paddingLeft: 18,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    bottom: 10,
  },
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "white",
  },
});

export default AddVisit;

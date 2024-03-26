import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Button
} from "react-native";
import { ButtonPrimary } from "../../../components/Button";
import { RegularInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import qs from "qs";
import * as Location from "expo-location";
import DropDownPicker from "react-native-dropdown-picker";
import * as BankingIcons from "../../../components/BankingIcons";
import MapView, { Marker } from "react-native-maps";
import helpers from "../../../constants/Helpers";
import Form from "../../../components/Form";

const AddParty = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      title: "Add Party",
    });
    getLocation();
   
  }, []);

  const getMap=()=>{
    openMap({ latitude: 37.865101, longitude: -119.538330 });
  }

 

  const update = props.route.params?.update;
  const party = props.route.params?.party;
  const [partyName, setPartyName] = useState(party?.PartyName);
  const [partyCode, setPartyCode] = useState(party?.PartyCode);
  const [contactPersonName, setContactPersonName] = useState(
    party?.ContactPersonName
  );
  const [mobileNumber, setMobileNumber] = useState(party?.MobileNumber);
  const [email, setEmail] = useState(party?.Email);
  const [vatOrPanNo, setVatOrPanNo] = useState(party?.VatOrPanNo);
  const [address, setAddress] = useState(party?.Address);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Vat or Pan");

  const [partyNameError, setPartyNameError] = useState("");
  const [contactPersonNameError, setContactPersonNameError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [vatOrPanNoError, setVatOrPanNoError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [locationError, setLocationError] = useState("");

  const goToPartyList = () => {
    props.navigation.goBack();
  };

  const getLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      props.navigation.navigate("PermissionScreen", {type: "location"});
      return;
    }

    let location = await helpers.GetLocation();

    

    setLatitude(location.lat);
    setLongitude(location.lng);
    // setRegion({
    //   latitude: location.coords.latitude,
    //   longitude: location.coords.longitude,
    //   latitudeDelta: 0.0922,
    //   longitudeDelta: 0.0421,
    // });
    // setShowMap(!showMap); // Map on/off
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setLatitude(newRegion.latitude);
    setLongitude(newRegion.longitude);
  };

 

  const saveParty = async (formData) => {
    formData.Id= update?party.Id:0; 
    formData.Latitude= latitude;
    formData.Longitude= longitude;
    formData.State= 4;
    setIsLoading(true);

    try {
      const response = await (await request()).post(
        Api.Parties.SaveByUser,
        qs.stringify(formData)
      );

      if (response.data.Code === 200) {
        setIsLoading(false);
        goToPartyList();
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } catch (error) {
      setIsLoading(false);
      ToastMessage.Short("Error Occurred. Contact Support");
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
       

        <Form inputs={[
          {key: "PartyName", name: "Name", required: true, type:"input", placeholder:"Name"},
          {key:"ContactPersonName", name: "Contact Person Name", required: true, type:"input", placeholder:"Contact Person Name"},
          {key:"MobileNumber", name: "Mobile No", required: true, type:"input", placeholder:"Mobile no."},
          {key:"Address", name: "Address", required: true, type:"input", placeholder:"Address"},
          {key:"Email", name: "Email", required: false, type:"input", placeholder:"Email"},
         
          {key:"VatOrPan", name: "Vat or Pan", required: false, type:"dropdown", placeholder:"VAT or PAN", items: [
              { label: "Vat", value: "v" },
              { label: "Pan", value: "p" },
            ]},
            {key:"VatOrPanNo", name: "VAT or PAN Number", required: false, type:"input", placeholder:"VAT or PAN No"},
        ]} onSubmit={saveParty} buttonText={"Save"}/>

        {showMap && region && (
          <MapView
            style={{ height: 200, width: "100%" }}
            region={region}
            onRegionChangeComplete={handleRegionChange}
          >
            <Marker coordinate={region} />
          </MapView>
        )}

        
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
});

export default AddParty;

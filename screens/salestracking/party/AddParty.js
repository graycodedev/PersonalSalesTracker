import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator, 
  Platform
} from "react-native";
import { ButtonPrimary } from "../../../components/Button";
import { RegularInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import qs from "qs";
import * as Location from 'expo-location';
import DropDownPicker from 'react-native-dropdown-picker';
import * as BankingIcons from "../../../components/BankingIcons";
import MapView, { Marker } from 'react-native-maps';

const AddParty = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      title: "Add Party",
    });
  }, []);

  const update = props.route.params?.update;
  const party = props.route.params?.party;
  const [partyName, setPartyName] = useState(party?.PartyName);
  const [partyCode, setPartyCode] = useState(party?.PartyCode);
  const [contactPersonName, setContactPersonName] = useState(party?.ContactPersonName);
  const [mobileNumber, setMobileNumber] = useState(party?.MobileNumber);
  const [email, setEmail] = useState(party?.Email);
  const [vatOrPanNo, setVatOrPanNo] = useState(party?.VatOrPanNo);
  const [address, setAddress] = useState(party?.Address);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [region, setRegion] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Vat or Pan');

  const [partyNameError, setPartyNameError] = useState("");
  const [contactPersonNameError, setContactPersonNameError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [vatOrPanNoError, setVatOrPanNoError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [locationError, setLocationError] = useState("");

  const goToPartyList = () => {
    props.navigation.goBack();
  }

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location= await Location.getCurrentPositionAsync({ accuracy: Platform.OS=="android" ? Location.Accuracy.Low : Location.Accuracy.Lowest});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setShowMap(!showMap); // Map on/off
  };

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
    setLatitude(newRegion.latitude);
    setLongitude(newRegion.longitude);
  };

  const saveParty = async () => {
    const companyId = 1;
    const groupId = 1234;

    let isValid = true;
    if (partyName.trim() === "") {
      isValid = false;
      setPartyNameError("Party Name is Required!");
    } else {
      setPartyNameError("");
    }

    if (contactPersonName.trim() === "") {
      isValid = false;
      setContactPersonNameError("Contact Person Name is Required!");
    } else {
      setContactPersonNameError("");
    }

    if (mobileNumber.trim() === "") {
      isValid = false;
      setMobileNumberError("Mobile Number is Required!");
    } else {
      setMobileNumberError("");
    }

    if (email.trim() === "") {
      isValid = false;
      setEmailError("Email is Required!");
    } else {
      setEmailError("");
    }

    if (vatOrPanNo.trim() === "") {
      isValid = false;
      setVatOrPanNoError("VAT or PAN No is Required!");
    } else {
      setVatOrPanNoError("");
    }

    if (address.trim() === "") {
      isValid = false;
      setAddressError("Address is Required!");
    } else {
      setAddressError("");
    }

    if (!latitude || !longitude) {
      isValid = false;
      setLocationError("Location is Required!");
    } else {
      setLocationError("");
    }

    if (!isValid) {
      return;
    }

    let strData = qs.stringify({
      Id: update ? party.Id : 0,
      PartyName: partyName,
      PartyCode: partyCode,
      ContactPersonName: contactPersonName,
      Email: email,
      Latitude: latitude,
      Longitude: longitude,
      State: 4,
      Address: address,
      VatOrPan: selectedOption === 'Vat or Pan' ? 'p' : 'v',
      VatOrPanNo: vatOrPanNo,
      MobileNumber: mobileNumber,
    });

    setIsLoading(true);

    try {
      const response = await (await request()).post(Api.Parties.SaveByUser, strData);

      if (response.data.Code === 200) {
        setIsLoading(false);
        goToPartyList();
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } catch (error) {
      alert(3)
      setIsLoading(false);
      ToastMessage.Short("Error Occurred. Contact Support");
    }
  }

  const isFormFilled = partyName && contactPersonName && mobileNumber && email && vatOrPanNo && address && latitude && longitude;

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={PageStyle.container}>
        <View>
          <RegularInputText
            key="partyName"
            placeholder="Party Name"
            onChangeText={(text) => setPartyName(text)}
            value={partyName}
          />
          {partyNameError !== "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {partyNameError}
            </Text>
          )}
        </View>

        <View>
          <RegularInputText
            key="contactPersonName"
            placeholder="Contact Person Name"
            onChangeText={(text) => setContactPersonName(text)}
            value={contactPersonName}
          />
          {contactPersonNameError !== "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {contactPersonNameError}
            </Text>
          )}
        </View>

        <View>
          <RegularInputText
            key="mobileNumber"
            placeholder="Mobile no."
            onChangeText={(text) => setMobileNumber(text)}
            value={mobileNumber}
            keyboardType="numeric"
          />
          {mobileNumberError !== "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {mobileNumberError}
            </Text>
          )}
        </View>

        <View>
          <RegularInputText
            key="address"
            placeholder="Address"
            onChangeText={(text) => setAddress(text)}
            value={address}
          />
          {addressError !== "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {addressError}
            </Text>
          )}
        </View>

        <View>
          <RegularInputText
            key="email"
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          {emailError !== "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {emailError}
            </Text>
          )}
        </View>

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
            placeholder="Vat or Pan"
            label="Vat or Pan"
            items={[
              { label: 'Vat', value: 'Vat' },
              { label: 'Pan', value: 'Pan' },
            ]}
            onChangeItem={(item) => setSelectedOption(item.value)}
            defaultValue={'Vat or pan'}
          />
        </View>

        <View>
          <RegularInputText
            key="vatOrPanNo"
            placeholder="VAT or PAN No"
            onChangeText={(text) => setVatOrPanNo(text)}
            value={vatOrPanNo}
            keyboardType="numeric"
          />
          {vatOrPanNoError !== "" && (
            <Text style={{ color: "red", marginTop: -10, marginBottom: 10 }}>
              {vatOrPanNoError}
            </Text>
          )}
        </View>

        {showMap && region && (
          <MapView
            style={{ height: 200, width: '100%' }}
            region={region}
            onRegionChangeComplete={handleRegionChange}
          >
            <Marker coordinate={region} />
          </MapView>
        )}

        <View style={{ margin: 30 }}>
          <View style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={getLocation}>
              <ButtonPrimary title="Set Location" />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 30 }}>
            <TouchableOpacity
              onPress={() => {
                if (isFormFilled) {
                  saveParty();
                }
              }}
            >
              <ButtonPrimary title={update ? "Update" : "Save"} />
              <ActivityIndicator
                animating={isLoading}
                color="#ffa500"
                style={styles.activityIndicator}
              ></ActivityIndicator>
            </TouchableOpacity>
          </View>
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
});

export default AddParty;

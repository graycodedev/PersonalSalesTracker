import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ButtonPrimary } from "../../../components/Button";
import { RegularInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import qs from "qs";

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
  const [website, setWebsite] = useState(party?.Website);
  const [email, setEmail] = useState(party?.Email);
  const [vatOrPanNo, setVatOrPanNo] = useState(party?.VatOrPanNo);
  const [address, setAddress] = useState(party?.Address);
  const [city, setCity] = useState(party?.City);
  const [isLoading, setIsLoading] = useState(false);

  const goToPartyList = () => {
    props.navigation.goBack();
  }

  const saveParty = async () => {
    
    const companyId = 1;
    const groupId = 1234;

    let strData = qs.stringify({
      Id: update ? party.Id : 0,
      PartyName: partyName,
      ContactPersonName: contactPersonName,
      Website: website,
      Email: email,
      Latitude: "233",
      Longitude: "233",
      State: 4,
      City: city,
      Address: address,
      VatOrPan: "v",
      VatOrPanNo: vatOrPanNo,
      MobileNumber: "1234",
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
  
      setIsLoading(false);
      ToastMessage.Short("Error Occurred. Contact Support");
    }
  }


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
        </View>

        <View>
          <RegularInputText
            key="partyCode"
            placeholder="Party Code"
            onChangeText={(text) => setPartyCode(text)}
            value={partyCode}
          />
        </View>

        <View>
          <RegularInputText
            key="contactPersonName"
            placeholder="Contact Person Name"
            onChangeText={(text) => setContactPersonName(text)}
            value={contactPersonName}
          />
        </View>

        <View>
          <RegularInputText
            key="city"
            placeholder="City"
            onChangeText={(text) => setCity(text)}
            value={city}
          />
        </View>

        <View>
          <RegularInputText
            key="address"
            placeholder="Address"
            onChangeText={(text) => setAddress(text)}
            value={address}
          />
        </View>

        <View>
          <RegularInputText
            key="website"
            placeholder="Website"
            onChangeText={(text) => setWebsite(text)}
            value={website}
          />
        </View>

        <View>
          <RegularInputText
            key="email"
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
        </View>

        <View>
          <RegularInputText
            key="vatOrPanNo"
            placeholder="VAT or PAN No"
            onChangeText={(text) => setVatOrPanNo(text)}
            value={vatOrPanNo}
          />
        </View>

        <View style={{ margin: 30 }}>
          <TouchableOpacity
            onPress={() => saveParty()}
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

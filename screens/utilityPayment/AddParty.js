import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";
import ImagePicker from 'react-native-image-picker';
import { ButtonPrimary } from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../style/Theme";
import { TextInput } from "react-native-gesture-handler";
import { RegularInputText, AmountInputText } from "../../components/Input";
import PageStyle from "../style/pageStyle";
import { SearchableList } from "../../components/SearchableList";
import DropDownPicker from "react-native-dropdown-picker";



const { width, height } = Dimensions.get("screen");

const AddParty = (navigation, props) => {
  useEffect(() => {
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [partyName, setPartyName] = useState("");
  const [personName, setPersonName] = useState("");
  const [website, setWebsite] = useState("");
  const [address1, setAddress1] = useState("");
  const [mobile, setMobile] = useState("");
  const [phone, setPhone] = useState("");
  const [pan, setPan] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [showPartyList, setShowPartyList] = useState(false);
  const [groups, setGroups] = useState([
    {
      value: 0,
      label: "Group A"
    },
    {
      value: 1,
      label: "Group B"
    },
    {
      value: 2,
      label: "Group C"
    },
    {
      value: 3,
      label: "Group D"
    },
  ]);



  const [selectedGroup, setSelectedGroup] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const openPicker = () => {
    setModalVisible(true);
  };

  const closePicker = () => {
    setModalVisible(false);
  };





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
            onChangeText={(text) => {
              setPartyName(text)
            }}
            value={partyName}
          />
        </View>
        {/* <View style={{ zIndex: 1 }}>
          <DropDownPicker
            containerStyle={{ height: 50 }}
            dropDownMaxHeight={500}
            style={{
              backgroundColor: "#fff",
              color: "red",
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
            defaultValue={groups[0].value}
            value={selectedGroup}
            items={groups}
            controller={(instance) => (this.controller = instance)}
            onChangeItem={(item) =>
              setSelectedGroup(item.value)
            }
          />
        </View>
          */}

        <View>
          <RegularInputText
            key="personName"
            placeholder="Contact Person Name"
            onChangeText={(text) => {
              setPersonName(text)
            }}
            value={personName}
          />
        </View>

        <View>
          <RegularInputText
            key="website"
            placeholder="Website (eg www.abc.com)"
            onChangeText={(text) => {
              setWebsite(text)
            }}
            value={website}
          />
        </View>

        <View>
          <RegularInputText
            key="email"
            placeholder="Email"
            onChangeText={(text) => {
              setEmail(text)
            }}
            value={email}
          />
        </View>

        <View style={{ margin: 30, marginBottom: -10 }}>
          <TouchableOpacity
            onPress={() => {
              setIsLoading(true);
            }}
          >
            <ButtonPrimary title={"Choose Location"} />
            <ActivityIndicator
              animating={isLoading}
              color="#ffa500"
              style={styles.activityIndicator}
            ></ActivityIndicator>
          </TouchableOpacity>
        </View>

        <View>
          <RegularInputText
            key="address1"
            placeholder="Address Line 1"
            onChangeText={(text) => {
              setAddress1(text)
            }}
            value={address1}
          />
        </View>

        <View>
          <RegularInputText
            key="mobile"
            placeholder="Mobile Number"
            onChangeText={(text) => {
              setMobile(text)
            }}
            value={mobile}
          />
        </View>

        <View>
          <RegularInputText
            key="phone"
            placeholder="Phone"
            onChangeText={(text) => {
              setPhone(text)
            }}
            value={phone}
          />
        </View>

        <View>
          <RegularInputText
            key="pan"
            placeholder="Pan"
            onChangeText={(text) => {
              setPan(text)
            }}
            value={pan}
          />
        </View>

        <View>
          <RegularInputText
            key="note"
            placeholder="Note"
            onChangeText={(text) => {
              setNote(text)
            }}
            value={note}
          />
        </View>

        <View style={{ margin: 30 }}>
          <TouchableOpacity
            onPress={() => {
              setIsLoading(true);
            }}
          >
            <ButtonPrimary title={"Save"} />
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
    justifyContent: 'flex-start'
  },

  button: {
    marginTop: 20,
    height: 40,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 25,
  },
  noteInput: {
    marginTop: 30,
    height: 80,
    width: 400,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    fontSize: 20
  }
});

export default AddParty;

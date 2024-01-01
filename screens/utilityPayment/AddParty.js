import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../style/Theme";
import { TextInput } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

const AddParty = (navigation, props) => {
  useEffect(() => {
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const openPicker = () => {
    setModalVisible(true);
  };

  const closePicker = () => {
    setModalVisible(false);
  };

  const handleOptionChange = (itemValue) => {
    setSelectedOption(itemValue);
    closePicker();
  };

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.container}>
        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Party Name"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
        <View>
          <Text style={{ marginTop: 30, fontSize: 20, opacity: 0.4, }}>Set Business Type</Text>
          <TouchableOpacity style={{ marginBottom: -10, width: 400, height: 50 }} onPress={openPicker}>
            <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 5 }}>
              <Text style={{ fontSize: 20 }}>***Select business***: {selectedOption}</Text>
            </View>
          </TouchableOpacity>

          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={closePicker}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onPress={closePicker}
              />
              <View style={{ backgroundColor: '#fff' }}>
                <Picker
                  selectedValue={selectedOption}
                  onValueChange={handleOptionChange}
                >
                  <Picker.Item label="Option 1" value="option1" />
                  <Picker.Item label="Option 2" value="option2" />
                  <Picker.Item label="Option 3" value="option3" />
                </Picker>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Contact Person Name"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>

        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Website (eg www.abc.com)"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Email"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
        <View>
          <TouchableOpacity style={styles.button}>
            <Text style={{ fontSize: 20, color: 'white' }}>Choose Location</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 18, marginRight: 10, marginTop: 3 }}>City</Text>
          <TouchableOpacity style={{ marginBottom: -10, width: 350, height: 50 }} onPress={openPicker}>
            <View style={{ borderWidth: 1, borderColor: '#ccc', padding: 5 }}>
              <Text style={{ fontSize: 20 }}> {selectedOption}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Address Line 1"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Address Line 2"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Mobile Number"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Phone"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
        <View>
          <TextInput
            style={styles.partyName}
            placeholder="Pan"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
        <View>
          <TextInput
            style={styles.noteInput}
            placeholder="Note"
          //value={partyName}
          //onChangeText={handlePartyNameChange}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    margin: 10,
    padding: 10,
    alignContent: "center",
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  partyName: {
    marginTop: 30,
    height: 30,
    width: 400,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    fontSize: 20
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

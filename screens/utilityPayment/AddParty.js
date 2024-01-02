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
    const [partyName, setPartyName]= useState("");
    const [showPartyList, setShowPartyList]= useState(false);
    const [groups, setGroups]= useState([
      {
        value:0, 
        label:"Group A"
      }, 
      {
        value:1, 
        label:"Group B"
      },  
      {
        value:2, 
        label:"Group C"
      },  
      {
        value:3, 
        label:"Group D"
      }, 
    ]); 
    const [selectedGroup, setSelectedGroup]= useState(""); 


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
      <View style={{zIndex: 1}}>
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

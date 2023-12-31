import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  TextInput,
  Button,
  ScrollView, 
  Keyboard, 
  TouchableWithoutFeedback
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Input } from "galio-framework";
import { Colors } from "../screens/style/Theme";
import * as Contacts from "expo-contacts";
import ModalPopUp from "../components/Modal";
import { SearchBar, Avatar } from "react-native-elements";
import * as BankingIcons from "../components/BankingIcons";

export const RetriveContacts = (props) => {
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [pageSize, setPageSize] = useState(40);
  const [contactsNumber, setContactsNumber] = useState(0);
  useEffect(() => {
    getContactsNumber();
  }, []);
  const getContactsNumber = async () => {
    const { data } = await Contacts.getContactsAsync({});
    if (data.length > 0) {
      setContacts(data);
    }
    setContactsNumber(data.length);
  };
  const getContacts = async (page) => {
    setPageSize(page);
    const { status } = await Contacts.requestPermissionsAsync();
    if (status.length > 0 && status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.name, Contacts.PHONE_NUMBERS],
        sort: "FirstName",
        pageSize: page,
      });
      if (data.length > 0) {
        setFiltered(data);
      }
    } else {
      Alert.alert(
        "Permission Denied!",
        "The permissions for accessing the contacts have been declined, Please go to Settings > App Permissions and allow Contact Permissions",
        [
          {
            text: "Ok",
          },
        ]
      );
      status = "";
    }
  };
  const updatePage = () => {
    if (pageSize != 0) {
      if (pageSize < contactsNumber) {
        if (pageSize + 40 > contactsNumber || pageSize + 40 == contactsNumber) {
          getContacts(0);
        } else {
          getContacts(pageSize + 40);
        }
      }
    } else {
      getContacts(0);
    }
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setFiltered([]);
    setSearch("");
    setPageSize(40);
  };
  const updateSearch = (search) => {
    setSearch(search);
    const filteredList = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(filteredList);
  };
  const validateNumber = (phoneNumber) => {
    var regex = /^\d+$/;
    if (phoneNumber.length > 0) {
      if (!regex.test(phoneNumber)) {
        phoneNumber = phoneNumber.replace(/\D/g, "");
      }
      props.retriveNumber(phoneNumber.slice(-10));
    } else {
      props.retriveNumber("");
    }
  };
  const renderContacts = () => {
    if (filtered.length > 0) {
      return (
        <ScrollView
        keyboardShouldPersistTaps='handled'
          contentContainerStyle={styles.scrollViewStyle}
          onScroll={updatePage}
          style={{ flexGrow: 1 }}
          nestedScrollEnabled
          
        >
          {filtered.map((item, index) => (
            <View 
              key={index}
              style={{pointerEvents: 'box-none'}}
              onTouchEnd={()=>{
                toggleModal();
                validateNumber(
                  item.phoneNumbers ? item.phoneNumbers[0].number : ""
                );
                Keyboard.dismiss(); 
              }}
            >
              <View style={styles.item}>
                <View style={{ width: "20%" }}>
                  <Avatar
                    size={50}
                    rounded
                    title={item.name.charAt(0)}
                    titleStyle={{
                      fontFamily: "Regular",
                      color: "black",
                      backgroundColor: Colors.muted,
                      width: "100%",
                      height: "100%",
                      paddingTop: 6,
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={styles.contactFooter}>
                    <Text style={styles.number}>
                      {item.phoneNumbers
                        ? item.phoneNumbers[0].label + ":"
                        : "*Contact doesn't store any numbers*"}
                    </Text>
                    <Text style={styles.number}>
                      {item.phoneNumbers && item.phoneNumbers[0].number}
                    </Text>
                  </View>
                </View>
              </View>
            </View >
          ))}
        </ScrollView>
      );
    } else if (filtered.length == 0 && search.length == 0) {
      return (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size={55} color={Colors.primary} />
        </View>
      );
    } else {
      return (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text>No contacts found!</Text>
        </View>
      );
    }
  };

  return (
    <>
      <ModalPopUp
        visible={modalVisible}
        onRequestClose={() => {
          toggleModal();
        }}
        full
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{flexGrow: 1}}
  keyboardShouldPersistTaps='handled'>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                toggleModal();
              }}
            >
              <View>
                <IconMaterialIcons
                  style={styles.iconStyles}
                  name='arrow-back'
                  size={25}
                />
              </View>
            </TouchableOpacity>
            <View>
              <TextInput
                type='text'
                style={styles.searchBar}
                value={search}
                placeholder='Search Contact'
                placeholderTextColor={"white"}
                onChangeText={(text) => {
                  updateSearch(text);
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  toggleModal();
                }}
              >
                <View>
                  <IconMaterialIcons
                    style={styles.iconStyles}
                    name='close'
                    size={25}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {renderContacts()}
        </ScrollView>
      </ModalPopUp>
      {props.topup ? (
        <View style={styles.containerTopup}>
          <TextInput
            type={props.keyboardType}
            style={styles.inputTopup}
            {...props}
          />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              getContacts(40);
            }}
          >
            <BankingIcons.AddressBookIcon fill={Colors.primary} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.conatiner}>
          <Input
            type={props.keyboardType}
            placeholderTextColor={Colors.muted}
            style={styles.input}
            {...props}
          />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              getContacts(40);
            }}
          >
            <BankingIcons.AddressBookIcon fill={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  conatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    marginTop: 10,
    paddingRight: 10,
    maxHeight: 50,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },
  containerTopup: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    maxHeight: 50,
    paddingRight: 10,
    marginBottom: 4,
    borderRadius: 4,
    alignItems: "center",
  },
  inputTopup: {
    paddingLeft: 12,
    minWidth: Dimensions.get("window").width - 100,
    fontSize: 12,
    fontFamily: "Regular",
    height: 50,
  },
  input: {
    minWidth: Dimensions.get("window").width - 100,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: Colors.secondary,
  },

  scrollViewStyle: {
    padding: 10,
    backgroundColor: Colors.secondary,
    flexGrow: 1,
  },
  item: {
    padding: 8,
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
  },
  contactFooter: {
    flexDirection: "row",
  },
  number: {
    color: Colors.muted,
    marginRight: 10,
  },
  loadingScreen: {
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
  },
  modalHeader: {
    height: 60,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  searchBar: {
    height: "100%",
    width: Dimensions.get("window").width - 110,
    color: "#fff",
    fontSize: 18,
  },
  iconStyles: {
    color: "#fff",
  },
});

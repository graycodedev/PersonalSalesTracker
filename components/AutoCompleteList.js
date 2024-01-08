import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import ModalPopUp from "./Modal";
import { Colors } from "../screens/style/Theme";
import * as BankingIcons from "../components/BankingIcons";
import request from "../config/RequestManager";
import ToastMessage from "./Toast/Toast";

export const AutoCompleteList = (props) => {
  const [modalVisible, setModalVisible] = useState(props.visible);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading,setIsLoading]= useState(true);

  const updateSearch = async(text) => {
    await getAutoCompleteList(text);
  };

  useEffect(() => {
    getAutoCompleteList("");
    setIsLoading(false);
  }, []);

  const toggleModal = () => {
    props.onClose();
    setSearchText("");
    setModalVisible(false);
  };




  const getAutoCompleteList=async(text)=>{
      var response = await (await request())
      .get(props.autocompleteurl+"?query="+text)
      .catch(function(error) {
        ToastMessage.Short("Error! Contact Support");
      });
      if (response != undefined) {
        if (response.data.Code == 200) {
            setOptions(response.data.Data);
        } else {
          ToastMessage.Long(response.data.Message);
        }
      } else {
        ToastMessage.Short("Error Ocurred Contact Support");
      }

  }

  return (
    <>
      <ModalPopUp
        visible={modalVisible}
        onRequestClose={() => {
          toggleModal();
        }}
        full
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                toggleModal();
              }}
            >
              <IconMaterialIcons
                style={styles.iconStyles}
                name="arrow-back"
                size={25}
              />
            </TouchableOpacity>
            <View>
              <TextInput
                type="text"
                style={styles.searchBar}
                // value={searchText}
                placeholder={props.searchablePlaceholder}
                placeholderTextColor="white"
                onChangeText={async(text) => {
                  await updateSearch(text);
                }}
              />
            </View>
            <View>
              <TouchableOpacity onPress={() => toggleModal()}>
                <View>
                  <IconMaterialIcons
                    style={styles.iconStyles}
                    name="close"
                    size={25}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {isLoading &&  (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "Bold", fontSize: 16, marginTop: 10 }}>
              Loading ....
              </Text>
            </View>)
        }
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
              {options.length == 0 ? (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={{ fontSize: 18 }}>{props.noItemFoundText}</Text>
                </View>
              ) : (
                options.map((item, index) => (
                    <View
                    style={{pointerEvents:"box-none"}}
                      onTouchStart={() => {
                        toggleModal();
                        props.itemSelected(item);
                        Keyboard.dismiss()
                      }}
                    >
                      {props.renderItem(item)}
                    </View>
                ))
              )}
            </ScrollView>
        </View>
      </ModalPopUp>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 8,
    marginTop: 10,
    paddingRight: 10,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },
  scrollViewStyle: {
    padding: 10,
  },
  item: {
    padding: 8,
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  loadingScreen: {
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
  },
  modal: {
    flex: 1,
    backgroundColor: "#F4F5F7",
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
    color: "white",
    fontSize: 18,
  },
  iconStyles: {
    color: "white",
  },
});

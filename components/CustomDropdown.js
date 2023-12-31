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
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import ModalPopUp from "./Modal";
import { Colors } from "../screens/style/Theme";
import FavouriteStyles from "../screens/style/favouriteStyle";
import * as BankingIcons from "../components/BankingIcons";
import UnfavAPayment from "./UnfavAPayment";

export const CustomDropdown = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [placeholder, setPlaceholder] = useState(props.placeholder);
  const [options, setOptions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loadingTextDisplay, setloadingTextDisplay] = useState("Loading List");
  const [filterParam, setFilterParam] = useState(props.filterBy);

  const updateSearch = (search) => {
    setSearchText(search);
    const filteredList = !props.filterBy
      ? options.filter((option) =>
          option.label.toLowerCase().includes(search.toLowerCase())
        )
      : options.filter((option) =>
          option[filterParam].toLowerCase().includes(search.toLowerCase())
        );
    setFiltered(filteredList);
  };
  const getOptions = () => {
    setFiltered(props.items);
    setOptions(props.items);
  };
  const toggleModal = () => {
    setSearchText("");
    setModalVisible(false);
    setFiltered([]);
  };
  const removeFromList = (id) => {
    setFiltered(options.filter((option) => option.Id != id));
    props.updateFavouriteList();
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
                value={searchText}
                placeholder={props.searchablePlaceholder}
                placeholderTextColor="white"
                onChangeText={(text) => {
                  updateSearch(text);
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
          {options.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <ActivityIndicator size={"large"} /> */}
              <Text style={{ fontFamily: "Bold", fontSize: 16, marginTop: 10 }}>
                No saved transfers found!!
              </Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
              {filtered.length == 0 && props.favouriteList ? (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={{ fontSize: 18 }}>
                    No saved transfers found!!
                  </Text>
                </View>
              ) : !props.favouriteList ? (
                filtered.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      toggleModal();
                      !props.updateItem
                        ? props.itemSelected(item.value, item.label)
                        : props.itemSelected(item);
                      !props.label
                        ? setPlaceholder(item.label)
                        : setPlaceholder(item[props.label]);
                    }}
                  >
                    {!props.label ? (
                      <View style={styles.item} key={item.value}>
                        <Text>{item.label}</Text>
                      </View>
                    ) : (
                      <View style={styles.item} key={index}>
                        <Text>{item[props.label]}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                filtered.map((item, index) => (
                  <View style={FavouriteStyles.container} key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        toggleModal();
                        props.itemSelected(item);
                        setPlaceholder(item.ExtraField1);
                      }}
                    >
                      <View style={FavouriteStyles.box}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontSize: 16, marginBottom: 2 }}
                            numberOfLines={1}
                          >
                            {item.ExtraField1}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={FavouriteStyles.note}>
                            {item.Subscriber}
                          </Text>
                          {!props.bankTransfer && (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <BankingIcons.ArrowDownIcon
                                fill={Colors.primary}
                                style={{ width: "200%", height: "200%" }}
                              />
                              <Text
                                style={{ color: "red", fontFamily: "Regular" }}
                              >
                                {item.Amount.toString().slice(1)}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={FavouriteStyles.note}>
                            {item.ExtraField2}
                          </Text>
                          <View>
                            <UnfavAPayment
                              id={item.Id}
                              updateList={removeFromList.bind(this)}
                              bankTransfer
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                  // <TouchableOpacity
                  //   key={index}
                  //   onPress={() => {
                  //     toggleModal();
                  //     props.itemSelected(item);
                  //   }}
                  // >
                  //   <View style={styles.item} key={item.value}>
                  //     <Text>{item.label}</Text>
                  //   </View>
                  //   <View
                  //       style={{
                  //         flexDirection: "row",
                  //         justifyContent: "space-between",
                  //       }}
                  //     >
                  //       <Text>Account No: {item.Subscriber}</Text>
                  //       <Text>Account Name: {data.receiverName}</Text>
                  //     </View>
                  //   //
                  // </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </ModalPopUp>

      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
          getOptions();
        }}
      >
        <View style={!props.favouriteList ? styles.container : null}>
          <View>
            {!props.favouriteList && (
              <Text
                style={{
                  color: "#9A9A9A",
                  fontSize: props.fontSize ? props.fontSize : 16,
                }}
              >
                {props.placeholder}
              </Text>
            )}
            {props.favouriteList && (
              // <BankingIcons.HistoryIcon fill={"white"} height={"20"} />
              <Text style={{ color: "white" }}>Select Saved Transfers</Text>
            )}
          </View>
          {!props.favouriteList && (
            <View>
              <Icon name="angle-down" size={20} style={{ marginRight: 10 }} />
            </View>
          )}
        </View>
      </TouchableOpacity>
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

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import Circle from "../../../components/shapes/Circle";
import { AutoCompleteList } from "../../../components/AutoCompleteList";
import AppStyles from "../../../assets/theme/AppStyles";
import { Contact } from "../../../constants/Contact";
import FeatherIcons from "react-native-vector-icons/Feather";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const BeatPlans = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [beatplans, setBeatPlans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [options, setOptions] = useState([]);

  let beatplanDynamic = [
    {
      RouteName: "Kupandole to Lagankhel Route",
    },
    {
      RouteName: "Baneshwor to Jaudbuti Route",
    },
    {
      RouteName: "South Lalitpur Route",
    },
  ];

  const onRefresh = () => {
    wait(2000).then(() => {
      setRefreshing(false);
      getList();
    });
  };

  const handleReadMore = (note) => {
    navigation.navigate("NoteInfo", { note });
  };
  useEffect(() => {
    getList();
    getAutoCompleteList("");
  }, []);

  const getList = async () => {
    try {
      var response = await (await request())
        .get(Api.BeatPlan.List)
        .catch(function (error) {
          setIsLoading(false);
          ToastMessage.Short("Error! Contact Support");
        });

      if (response != undefined) {
        if (response.data.Code == 200) {
          //   setNotes(response.data.Data);
          setBeatPlans(beatplanDynamic);
        } else {
          ToastMessage.Short(response.data.Message);
        }
      } else {
        ToastMessage.Short("Error Loading Notes");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      getList();
      return () => {
        // Cleanup function (optional)
        // Additional cleanup logic (if needed)
      };
    }, [])
  );

  const updateSearch = async (text) => {
    await getAutoCompleteList(text);
  };

  const getAutoCompleteList = async (text) => {
    var response = await (await request())
      .get(Api.Parties.List + "?query=" + text)
      .catch(function (error) {
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
  };

  const onClose = () => {
    // setShowPartiesList(false);
  };

  return (
    <>
      {!isLoading ? (
        <View style={{ height: "100%" }}>
          {beatplans.length > 0 ? (
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              style={{ width: "100%", backgroundColor: "#eee" }}
              // contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View style={styles.container}>
                {beatplans.length > 0 && (
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "SemiBold",
                        padding: 6,
                        paddingBottom: 0,
                      }}
                    >
                      Beats
                    </Text>
                    {beatplans.map((note, index) => (
                      <View key={index} style={styles.noteContainer}>
                        <Circle
                          radius={5}
                          backgroundColor={Colors.primary}
                          containerStyle={{ marginRight: 5 }}
                        />
                        <Text style={styles.noteHead}>{note.RouteName}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Regular",
                    color: Colors.primary,
                    textDecorationLine: "underline",
                  }}
                >
                  view all
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  borderColor: "gray",
                  borderWidth: 1,
                  backgroundColor: "white",
                  paddingLeft: 10,
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FeatherIcons
                  style={{ color: "#c5c5c5" }}
                  size={20}
                  name="search"
                />

                <TextInput
                  type="text"
                  style={styles.searchBar}
                  // value={searchText}
                  placeholder={"Search ..."}
                  placeholderTextColor="#c5c5c5"
                  onChangeText={async (text) => {
                    await updateSearch(text);
                  }}
                />
              </View>
              <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                {options.length == 0 ? (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ fontSize: 18 }}>No parties found</Text>
                  </View>
                ) : (
                  options.map((party, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.partyItem, { pointerEvents: "box-none" }]}
                      onPress={() => {
                        // toggleModal();
                        // props.itemSelected(item);
                        props.navigation.navigate("PartyDetails", {
                          party: party,
                        });
                        // Keyboard.dismiss();
                      }}
                    >
                      <Text
                        style={[AppStyles.Text.BoldTitle, { marginBottom: 4 }]}
                      >
                        {party.PartyName}
                      </Text>
                      <TouchableOpacity
                        onPress={() => Contact.MakeCall(party.MobileNumber)}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <BankingIcons.callIcon
                          fill={"green"}
                          height={18}
                          width={18}
                        />
                        <Text style={[styles.orderInfo]}>
                          {party.MobileNumber}
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={styles.partyInfo}
                      >{`${party.ContactPersonName}`}</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={styles.partyInfo}
                        >{`Address: ${party.Address}`}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Text
                          style={styles.partyInfo}
                        >{`Code: ${party.PartyCode}`}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </ScrollView>
          ) : (
            <View style={styles.noDataContainer}>
              <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
              <Text style={[styles.noDataText, { fontSize: 20 }]}>
                No beatplans available
              </Text>
            </View>
          )}
          {/* <TouchableOpacity
            style={styles.circle}
            onPress={() => {
              navigation.navigate('AddNote');
            }}
          >
            <BankingIcons.plus fill="white" />
          </TouchableOpacity> */}
        </View>
      ) : (
        <View style={styles.spinnercontainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    margin: 10,
    alignContent: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  noteContainer: {
    backgroundColor: "#fff",
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  noteHead: {
    fontSize: 16,
    fontWeight: "400",
  },
  noteView: {
    marginTop: 8,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
  circle: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 50,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnercontainer: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  noDataContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  noDataText: {
    fontSize: 20,
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
    // height: "100%",
    width: Dimensions.get("window").width - 110,
    // color: Colors.primary,
    fontSize: 18,
    marginLeft: 10,
  },
  iconStyles: {
    color: "white",
  },
  partyInfo: {
    fontSize: 16,
  },
  orderInfo: {
    fontSize: 16,
    marginLeft: 4,
  },
  partyItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
});

export default BeatPlans;

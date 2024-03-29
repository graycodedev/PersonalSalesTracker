import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";


const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
const Notes = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    wait(2000).then(() => {
      setRefreshing(false);
      getList();
    }
    );
  };

  const handleReadMore = (note) => {
    navigation.navigate("NoteInfo", { note });
  };
  useEffect(() => {
    getList();
  }, [])

  const getList = async () => {
    try {
      var response = await (await request())
        .get(Api.Notes.List)
        .catch(function (error) {
          setIsLoading(false)
          ToastMessage.Short("Error! Contact Support");
        });

      if (response != undefined) {
        if (response.data.Code == 200) {
          setNotes(response.data.Data);
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

  return (
    <>
      {!isLoading ? <View style={{ height: "100%" }}>
        {notes.length > 0 ? (
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View style={styles.container}>
              {notes.map((note, index) => (
                <View key={index} style={styles.noteContainer}>
                  <Text style={styles.noteHead}>{note.NoteTitle}</Text>
                  <View style={styles.noteView}>
                    <Text style={styles.noteText} numberOfLines={4}>{note.Note}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ marginTop: 10, }}
                    onPress={() => handleReadMore(note)}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '500', color: "#AE529B" }}>Read More ➔</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.noDataContainer}>
            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
            <Text style={[styles.noDataText, { fontSize: 20 }]}>No notes available</Text>
          </View>
        )}
          <TouchableOpacity
            style={styles.circle}
            onPress={() => {
              navigation.navigate('AddNote');
            }}
          >
            <BankingIcons.plus fill="white" />
          </TouchableOpacity>
      </View> :

        <View style={styles.spinnercontainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>}
    </>
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
  noteContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  noteHead: {
    fontSize: 16,
    fontWeight: '700',
  },
  noteView: {
    marginTop: 8
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
  circle: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 50,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center"
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
});

export default Notes;

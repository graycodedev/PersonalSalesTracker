import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Api from "../../../constants/Api";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";


const NoteInfo = ({ route }) => {
  const { note } = route.params;

  const [noteDetails, setNoteDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDetail();
    setIsLoading(false);
  }, [])


  const getDetail = async () => {
    var response = await (await request())
      .get(Api.Notes.Details + "?id=" + note.Id)
      .catch(function (error) {
        // console.log(error);
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        setNoteDetails(response.data.Data);
      } else {
        ToastMessage.Short("Error Loading Note Detail");
      }
    } else {
      ToastMessage.Short("Error Loading Note Detail");
    }
  };




  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {!noteDetails ?
        <Spinner
          color={Colors.primary}
          visible={isLoading}
          textContent={"Getting Details"}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        /> :
        <View style={styles.container}>
          <Text style={styles.noteHead}>{noteDetanpxils.NoteTitle}</Text>
          <View style={styles.noteView}>
            <Text style={styles.noteText}>{noteDetails.Note}</Text>
          </View>
        </View>}
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
  noteHead: {
    fontSize: 24,
    fontWeight: "700",
  },
  noteView: {
    marginTop: 15,
  },
  noteText: {
    fontSize: 16,
    color: "#333",
  },
});

export default NoteInfo;

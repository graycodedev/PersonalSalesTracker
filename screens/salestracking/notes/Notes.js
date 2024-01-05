import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";

const Notes = ({ navigation }) => {

    const [notes, setNotes] = useState([]);

    const handleReadMore = (note) => {
        navigation.navigate("NoteInfo", { note });
    };
    useEffect(()=>{
        getList();
    }, [])


    const getList = async () => {
        var response = await (await request())
          .get(Api.Notes.List)
          .catch(function(error) {
            // console.log(error);
            ToastMessage.Short("Error! Contact Support");
          });
        if (response != undefined) {
          if (response.data.Code == 200) {
            setNotes(response.data.Data);
          } else {
            ToastMessage.Short("Error Loading Notes");
          }
        } else {
          ToastMessage.Short("Error Loading Notes");
        }
      };


    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                {notes.length>0 && notes.map((note) => (
                    <View key={note.value} style={styles.noteContainer}>
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

            <View>
                <TouchableOpacity
                    style={styles.circle}
                    onPress={() => {
                        navigation.navigate('AddNote');
                    }}
                >
                    <BankingIcons.plus fill="white" />
                </TouchableOpacity>
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
    }
});

export default Notes;

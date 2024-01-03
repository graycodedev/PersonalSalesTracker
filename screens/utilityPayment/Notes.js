import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import PageStyle from "../style/pageStyle";
import { ButtonPrimary } from "../../components/Button";

const Notes = ({ navigation }) => {

    const [notes, setNotes] = useState([
        {
            value: 0,
            title: "Note 1 Title",
            note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
            value: 1,
            title: "Note 2 Title",
            note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
    ]);

    const handleReadMore = (note) => {
        navigation.navigate("Note Info", { note });
    };


    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                {notes.map((note) => (
                    <View key={note.value} style={styles.noteContainer}>
                        <Text style={styles.noteHead}>{note.title}</Text>
                        <View style={styles.noteView}>
                            <Text style={styles.noteText}>{note.note}</Text>
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
        fontSize: 24,
        fontWeight: '700',
    },
    noteView: {
        marginTop: 15
    },
    noteText: {
        fontSize: 16,
        color: "#333",
    },
});

export default Notes;

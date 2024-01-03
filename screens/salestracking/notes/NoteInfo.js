import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const NoteInfo = ({ route }) => {
    const { note } = route.params;

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <Text style={styles.noteHead}>{note.title}</Text>
                <View style={styles.noteView}>
                    <Text style={styles.noteText}>{note.note}</Text>
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

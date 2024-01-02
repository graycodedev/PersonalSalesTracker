import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import PageStyle from "../style/pageStyle";

const PartyList = () => {
    const [parties, setParties] = useState([
        {
            value: 0,
            name: "Party 1",
            person: "Person 1",
            phone: "Phone 1",
        },
        {
            value: 1,
            name: "Party 2",
            person: "Person 2",
            phone: "Phone 2",
        },
        {
            value: 2,
            name: "Party 3",
            person: "Person 3",
            phone: "Phone 3",
        },
        {
            value: 3,
            name: "Party 4",
            person: "Person 4",
            phone: "Phone 4",
        },
        {
            value: 4,
            name: "Party 5",
            person: "Person 5",
            phone: "Phone 5",
        },
    ]);


    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                {parties.map((party) => (
                    <TouchableOpacity
                        key={party.value}
                        style={styles.partyItem}
                        onPress={() => console.log(`Selected party: ${party.name}`)}
                    >
                        <Text style={styles.partyName}>{party.name}</Text>
                        <Text style={styles.partyInfo}>{`Contact Person: ${party.person}`}</Text>
                        <Text style={styles.partyInfo}>{`Phone: ${party.phone}`}</Text>
                    </TouchableOpacity>
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
    partyItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    partyName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    partyInfo: {
        fontSize: 16,
    },
});

export default PartyList;

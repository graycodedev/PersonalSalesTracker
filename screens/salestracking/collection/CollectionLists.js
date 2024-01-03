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


const CollectionList = ({ navigation }) => {
    const [parties, setParties] = useState([
        {
            value: 0,
            name: "Party 1",
            person: "Person 1",
            phone: "Phone 1",
            address: "address 1",
            note: "note 1",
            amount: "amount 1",
            date: "date 1",
            mode: "mode 1"
        },
        {
            value: 1,
            name: "Party 2",
            person: "Person 2",
            phone: "Phone 2",
            address: "address 2",
            note: "note 2",
            amount: "amount 2",
            date: "date 2",
            mode: "mode 2"
        },
        {
            value: 2,
            name: "Party 3",
            person: "Person 3",
            phone: "Phone 3",
            address: "address 3",
            note: "note 3",
            amount: "amount 3",
            date: "date 3",
            mode: "mode 3"
        },
        {
            value: 3,
            name: "Party 4",
            person: "Person 4",
            phone: "Phone 4",
            address: "address 4",
            note: "note 4",
            amount: "amount 4",
            date: "date 4",
            mode: "mode 4"
        },
        {
            value: 4,
            name: "Party 5",
            person: "Person 5",
            phone: "Phone 5",
            address: "address 5",
            note: "note 5",
            amount: "amount 5",
            date: "date 5",
            mode: "mode 5"
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);


    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View>
                    {parties.map((party) => (
                        <TouchableOpacity
                            key={party.value}
                            style={styles.partyItem}
                            onPress={() =>
                                navigation.navigate("CollectionDetails", { party })
                            }
                        >
                            <Text style={styles.partyName}>{party.name}</Text>
                            <Text style={styles.partyInfo}>{`Recieved Amount: ${party.amount}`}</Text>
                            <Text style={styles.partyInfo}>{`Recieved Date: ${party.date}`}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </View>

            <View>
                <TouchableOpacity
                    style={styles.circle}
                    onPress={() => {
                        navigation.navigate('AddCollection');
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 40 }}>+</Text>
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
    circle: {
        backgroundColor: "#AE529B",
        width: 60,
        height: 60,
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    }
});

export default CollectionList;

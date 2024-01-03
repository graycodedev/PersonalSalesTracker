import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLayoutEffect } from "react";

const CollectionDetails = ({ route }) => {

    const { party } = route.params;

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <View style={styles.item}>
                        <Text style={styles.partyInfo}>Party Name:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.partyData}>{party.name}</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.partyInfo}>Recieved Amount:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.partyData}>{party.amount}</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.partyInfo}>Recieved Date:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.partyData}>{party.date}</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.partyInfo}>Recieved Mode:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.partyData}>{party.mode}</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.partyInfo}>Note:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.partyData}>{party.note}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10,
        alignContent: "center",
        justifyContent: "flex-start",
    },
    itemContainer: {
        backgroundColor: 'white',
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        justifyContent: 'space-between',
        padding: 10,
    },
    partyInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    partyData: {
        fontSize: 20,
        textAlign: 'right'
    },
});


export default CollectionDetails;
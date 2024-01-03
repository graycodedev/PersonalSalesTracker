import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLayoutEffect } from "react";

const Tab = createMaterialTopTabNavigator();

const OverviewScreen = ({ party }) => {
    const partyDetails = [
        { label: "Party Name:", data: party.name },
        { label: "Contact Person:", data: party.person },
        { label: "Phone:", data: party.phone },
        { label: "Party Code:", data: party.code },
        { label: "Mobile:", data: party.mobile },
        { label: "Address:", data: party.address },
        { label: "Email:", data: party.email },
        { label: "Website:", data: party.website },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    {partyDetails.map((detail, index) => (
                        <View key={index} style={styles.partyItem}>
                            <Text style={styles.detail}>{detail.label}</Text>
                            <View style={styles.labelContainer}>
                                <Text style={styles.data}>{detail.data}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const OrdersScreen = () => (
    <View style={styles.tabContent}>
        {/* Orders details go here */}
    </View>
);

const CollectionsScreen = ({ parties }) => (
    <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%", backgroundColor: "#eee" }}
        contentContainerStyle={{ flexGrow: 1 }}
    >
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                {parties.map((party, index) => (
                    <View key={index} style={styles.partyItem}>
                        <Text style={styles.detail}>{party.label}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.data}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    </ScrollView>
);

const VisitsScreen = () => (
    <View style={styles.tabContent}>
        {/* Visits details go here */}
    </View>
);

const PartyDetails = ({ route, navigation }) => {
    const { party } = route.params;
    const parties = [
        { label: "Party Name:", data: party.name },
        { label: "Recieved Amount", data: party.amount },
        { label: "Recieved Date", data: party.date },
        { label: "Payment Mode", data: party.mode },
        { label: "Note", data: party.note },
    ];

    return (
        <Tab.Navigator>
            <Tab.Screen name="Overview" component={() => <OverviewScreen party={party} />} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Collections" component={() => <CollectionsScreen parties={parties} />} />
            <Tab.Screen name="Visits" component={VisitsScreen} />
        </Tab.Navigator>
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
    itemContainer: {
        backgroundColor: "#fff",
        elevation: 2,
        borderRadius: 8,
    },
    partyItem: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
    },
    detail: {
        fontSize: 20,
    },
    data: {
        textAlign: 'right',
        fontSize: 20,

    },
    labelContainer: {
        width: '50%'
    },
});

export default PartyDetails;

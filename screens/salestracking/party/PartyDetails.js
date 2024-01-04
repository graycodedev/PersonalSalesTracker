import React, { useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useLayoutEffect } from "react";
import { Colors } from "../../style/Theme";

const Tab = createMaterialTopTabNavigator();

const OverviewScreen = ({ party }) => {




    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.itemContainer}>

                    <View style={styles.partyItem}>
                        <Text style={styles.detail}>Party Name: </Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.name}</Text>
                        </View>
                    </View>
                    <View style={styles.partyItem}>
                        <Text style={styles.detail}>Contact Person: </Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.person}</Text>
                        </View>
                    </View>
                    <View style={styles.partyItem}>
                        <Text style={styles.detail}>Phone: </Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.phone}</Text>
                        </View>
                    </View>
                    <View style={styles.partyItem}>
                        <Text style={styles.detail}>PartyCode: </Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.code}</Text>
                        </View>
                    </View>
                    <View style={styles.partyItem}>
                        <Text style={styles.detail}>Mobile: </Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.mobile}</Text>
                        </View>
                    </View>
                    <View style={styles.partyItem}>
                        <Text style={styles.detail}>Address: </Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.address}</Text>
                        </View>
                    </View>
                    <View style={styles.partyItem}>
                        <Text style={styles.detail}>Email: </Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.email}</Text>
                        </View>
                    </View>
                    <View style={styles.partyItem}>
                        <Text style={styles.detail}>Website: </Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.website}</Text>
                        </View>
                    </View>

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
                {/* {parties.map((party, index) => (
                    <View key={index} style={styles.partyItem}>
                        <Text style={styles.detail}>{party.label}</Text>
                        <View style={styles.labelContainer}>
                            <Text style={styles.data}>{party.data}</Text>
                        </View>
                    </View>
                ))} */}
            </View>
        </View>
    </ScrollView>
);

const VisitsScreen = () => (
    <View style={styles.tabContent}>
        {/* Visits details go here */}
    </View>
);


const PartyDetails = (props) => {
    const { party } = props.route.params;
    console.log(props)
    useEffect(() => {
        props.navigation.setOptions({
            title: party.name,
        });
    }, [])


    return (
        <Tab.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarIndicatorStyle: { color: "red" },
                tabBarPressColor: Colors.primary
            }}>
            <Tab.Screen name="Overview" component={() => <OverviewScreen party={party} />} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Collections" component={() => <CollectionsScreen />} />
            <Tab.Screen name="Visits" component={VisitsScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 2,
        alignContent: "center",
        justifyContent: "flex-start",

    },
    itemContainer: {
        padding: 2,
        backgroundColor: "#fff",
        elevation: 2,
        borderRadius: 8,
    },
    partyItem: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 4,
    },
    detail: {
        fontSize: 16,
        fontFamily: "Regular"
    },
    data: {
        fontSize: 16,
        textAlign: 'right'

    },
    labelContainer: {
        width: '50%'
    },
});

export default PartyDetails;

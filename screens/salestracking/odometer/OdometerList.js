import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { useNavigation } from "@react-navigation/native";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";

const OdometerList = () => {

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: "Odometer List",
        });
    }, [])

    const [trips, setTrips] = useState([
        {
            id: "1",
            name: "Baglung Trip",
            date: "2021-01-01",
            start: "2300 KM",
            end: undefined,
        },
        {
            id: "2",
            name: "Syangja Trip",
            date: "2021-01-01",
            start: "2250 KM",
            end: "2260 KM",
        },
    ])

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>

                <View>
                    {trips.map((trip) => (
                        <TouchableOpacity key={trip.id} style={styles.tripItem}
                            onPress={() =>
                                navigation.navigate("StartTrip", { trip })
                            }
                        >
                            <Image source={trip.image} style={styles.tripImage} />
                            <View>
                                <Text style={styles.tripName}>{trip.name}</Text>
                                <Text style={styles.tripInfo}>{trip.date}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.tripInfo}>{trip.start} - {trip.end || ''}</Text>
                                    {trip.end === undefined && (
                                        <TouchableOpacity
                                            style={styles.endTripButton}
                                            onPress={() => navigation.navigate('EndTrip')}
                                        >
                                            <Text style={styles.endTripButtonText}>End Trip</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

            </View>

            <View>
                <TouchableOpacity
                    style={styles.circle}
                    onPress={() => {
                        navigation.navigate('StartTrip');
                    }}
                >
                    <BankingIcons.plus fill="white" />
                </TouchableOpacity>
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
    tripItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    tripName: {
        fontSize: 20,
        fontWeight: '700',
    },
    tripInfo: {
        fontSize: 16,
        color: "#333",
    },
    endTripButton: {

    },
    endTripButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: Colors.primary,
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

export default OdometerList;

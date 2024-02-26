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
import { useNavigation } from "@react-navigation/native";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import AppStyles from "../../../assets/theme/AppStyles";
import { DateDisplay, TimeDisplay } from "../../../components/DateDisplay";

const OdometerList = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [odometers, setOdometers] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            title: "Odometer List",
        });
        getList();
    }, [])

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Odometers.List)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setOdometers(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Odometers");
                }
            } else {
                ToastMessage.Short("Error Loading Odometers");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%", backgroundColor: "#eee" }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {isLoading ? (
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                ) : (
                    <View>
                        {odometers.length > 0 ? (
                            odometers.map((odometer) => (
                                <TouchableOpacity key={odometer.Id} style={styles.tripItem}
                                    onPress={() =>
                                        navigation.navigate("OdometerDetails", { odometer })
                                    }
                                >
                                    <View>
                                        <Text style={AppStyles.Text.BoldTitle}>
                                            <DateDisplay date={odometer.StartDate} />
                                        </Text>
                                        <Text style={styles.tripInfo}>Start Odometer: {odometer.StartOdometer}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={styles.tripInfo}>End Odometer: {odometer.EndOdometer || ''}</Text>
                                            {odometer.EndOdometer == undefined && (
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
                            ))
                        ) : (
                            <View style={styles.noDataContainer}>
                                <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
                                <Text style={[AppStyles.Text.BoldTitle, { fontSize: 20 }]}>No odometers available</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    navigation.navigate('StartTrip');
                }}
            >
                <BankingIcons.plus fill="white" />
            </TouchableOpacity>
        </View>
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
    tripItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
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
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        margin: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    noDataContainer: {
        alignItems: "center",
        marginTop: 20,
    },
});

export default OdometerList;

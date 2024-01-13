import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Visits = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Visits List",
        });
    }, [])

    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
    };

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Visits.ListByUser)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setVisits(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Visits");
                }
            } else {
                ToastMessage.Short("Error Loading Visits");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getList();
            return () => {
                // Cleanup function (optional)
                // Additional cleanup logic (if needed)
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    style={{ width: "100%", backgroundColor: "#eee", flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {visits.map((visit) => (
                        <TouchableOpacity
                            key={visit.Id}
                            style={styles.visitItem}
                            onPress={() => navigation.navigate("VisitDetails", { visit })}
                        >
                            {visit.PartyName && (

                                <BankingIcons.tickMark fill='green'
                                    style={styles.imageStyle} />
                            )}
                            <View>
                                <Text style={styles.visitName}>{visit.PartyName ? visit.PartyName : visit.LocationName}</Text>
                                <Text style={styles.visitText}>{visit.VisitDate}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}


                </ScrollView>
            )}

            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    navigation.navigate("AddVisit");
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
    visitItem: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        alignItems: 'center',
    },
    visitName: {
        fontSize: 20,
        fontWeight: '700',
    },
    visitText: {
        fontSize: 16,
        color: "#333",
    },
    imageStyle: {
        marginRight: 10,
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

export default Visits;

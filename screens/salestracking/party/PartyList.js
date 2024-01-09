import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PageStyle from "../../style/pageStyle";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import * as BankingIcons from "../../../components/BankingIcons";


const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const PartyList = ({ navigation }) => {
    const [parties, setParties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
    };

    const getList = async () => {
        var response = await (await request())
            .get(Api.Parties.List)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setParties(response.data.Data);
            } else {
                ToastMessage.Short("Error Loading Notes");
            }
        } else {
            ToastMessage.Short("Error Loading Notes");
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
        <>
            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <View>
                    <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        style={{ width: "100%", backgroundColor: "#eee" }}
                        contentContainerStyle={{ flexGrow: 1 }}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <View style={styles.container}>
                            {parties.map((party) => (
                                <TouchableOpacity
                                    key={party.value}
                                    style={styles.partyItem}
                                    onPress={() => navigation.navigate("PartyDetails", { party })}
                                >
                                    <Text style={styles.partyName}>{party.PartyName}</Text>
                                    <Text style={styles.partyInfo}>{`${party.ContactPersonName}`}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={styles.partyInfo}>{`Address: ${party.Address}`}</Text>
                                        <Text style={styles.partyInfo}>{`Code: ${party.PartyCode}`}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <View>
                        <TouchableOpacity
                            style={styles.circle}
                            onPress={() => {
                                navigation.navigate("AddParty");
                            }}
                        >
                            {/* Assuming you have a plus icon component */}
                            <BankingIcons.plus fill="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
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
        backgroundColor: Colors.primary,
        width: 50,
        height: 50,
        position: "absolute",
        bottom: 20,
        right: 20,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        margin: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
});

export default PartyList;

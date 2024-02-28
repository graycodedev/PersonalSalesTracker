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
import AppStyles from "../../../assets/theme/AppStyles";
import { Contact } from "../../../constants/Contact";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const PartyList = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Parties",
        });
    }, [])

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
        try {
            var response = await (await request())
                .get(Api.Parties.ActiveList)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setParties(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Parties");
                }
            } else {
                ToastMessage.Short("Error Loading Parties");
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
                    {parties.map((party, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.partyItem}
                            onPress={() => navigation.navigate("PartyDetails", { party })}
                        >
                            <Text style={[AppStyles.Text.BoldTitle, {marginBottom: 4}]}>{party.PartyName}</Text>
                            <TouchableOpacity onPress={()=>Contact.MakeCall(party.MobileNumber) } style={{flexDirection:"row", alignItems:"center"}}>
                                    <BankingIcons.callIcon fill={"green"} height={18} width={18}/>
                                        <Text style={[styles.orderInfo]}>{party.MobileNumber}</Text>
                                    </TouchableOpacity>
                            <Text style={styles.partyInfo}>{`${party.ContactPersonName}`}</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={styles.partyInfo}>{`Address: ${party.Address}`}</Text>
                               
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                            <Text style={styles.partyInfo}>{`Code: ${party.PartyCode}`}</Text></View>
                             
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    navigation.navigate("AddParty");
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
    orderInfo: {
        fontSize: 16,
        marginLeft: 4
    },
});

export default PartyList;

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import qs from "qs";

import Api from "../../../constants/Api";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import * as BankingIcons from "../../../components/BankingIcons";
import WarningModal from "../../../components/WarningModal";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetailCard from "../../../components/DetailCard";

const Tab = createMaterialTopTabNavigator();

const OverviewScreen = ({ partyDetails }) => {
    if (!partyDetails) {
        return (
            <Spinner
                color={Colors.primary}
                visible={true}
                textContent={"Getting Details"}
                textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
            />
        );
    }

    const partyDetailList = [
        { Label: "Party Name", Value: partyDetails.PartyName },
        { Label: "Contact Person", Value: partyDetails.ContactPersonName },
        { Label: "PartyCode", Value: partyDetails.PartyCode },
        { Label: "Address", Value: partyDetails.Address },
        { Label: "Email", Value: partyDetails.Email },
        { Label: "Website", Value: partyDetails.Website },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={partyDetailList} />
        </ScrollView>
    );
};


const OrdersScreen = () => (
    <View style={styles.tabContent}>
        {/* Orders details go here */}
    </View>
);

const CollectionsScreen = () => (
    <View style={styles.tabContent}>
        {/* Collections details go here */}
    </View>
);

const VisitsScreen = () => (
    <View style={styles.tabContent}>
        {/* Visits details go here */}
    </View>
);

const PartyDetails = (props) => {
    useEffect(() => {
        props.navigation.setOptions({
            title: partyDetails ? partyDetails.PartyName : party.partyName,
        });
    }, [partyDetails]);

    const { party } = props.route.params;
    const [partyDetails, setPartyDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);


    useEffect(() => {
        getDetail();
        setIsLoading(false);
    }, []);

    const getDetail = async () => {
        var response = await (await request())
            .get(Api.Parties.Details + "?id=" + party.Id)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setPartyDetails(response.data.Data);

                props.navigation.setOptions({
                    title: response.data.Data.PartyName,
                });

            } else {
                ToastMessage.Short("Error Loading Party Detail");
            }
        } else {
            ToastMessage.Short("Error Loading Party Detail");
        }
    };

    const deleteParty = async () => {
        let data = qs.stringify({
            id: party.Id,
        });
        var response = await (await request())
            .post(Api.Parties.Delete, data)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setShowConfirmDelete(false);
                ToastMessage.Short(response.data.Message);
                props.navigation.goBack();
            } else {
                ToastMessage.Short("Error deleting the party");
            }
        } else {
            ToastMessage.Short("Error deleting the party");
        }
    };

    const updateParty = () => {
        props.navigation.navigate("AddParty", { update: true, party: partyDetails });
    };

    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    tabBarScrollEnabled: true,
                    tabBarIndicatorStyle: { color: "red" },
                    tabBarPressColor: Colors.primary,
                }}
            >
                <Tab.Screen name="Overview" component={() => <OverviewScreen partyDetails={partyDetails} />} />
                <Tab.Screen name="Orders" component={OrdersScreen} />
                <Tab.Screen name="Collections" component={() => <CollectionsScreen />} />
                <Tab.Screen name="Visits" component={VisitsScreen} />
            </Tab.Navigator>

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                    onPress={() => {
                        updateParty();
                    }}
                >
                    <BankingIcons.Edit fill={"white"} height={25} width={25} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.circle, { backgroundColor: "#FF5F7F" }]}
                    onPress={() => {
                        setShowConfirmDelete(true);
                    }}
                >
                    <BankingIcons.DeleteIcon fill="white" />
                </TouchableOpacity>
            </View>
            {showConfirmDelete && (
                <WarningModal
                    text1={"Delete Party?"}
                    text2={"Are you sure you want to delete the party?"}
                    onConfirm={deleteParty}
                    onCancel={() => {
                        setShowConfirmDelete(false);
                    }}
                    warning
                />
            )}
        </>
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
        fontFamily: "Regular",
    },
    data: {
        fontSize: 16,
        textAlign: 'right',
    },
    labelContainer: {
        width: '50%',
    },
    tabContent: {
        // Styles for the other tabs' content
    },
    circle: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    buttons: {
        position: "absolute",
        bottom: 20,
        right: 20,
        zIndex: 1,
    },
});

export default PartyDetails;

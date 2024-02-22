import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import qs from "qs";

import Api from "../../../constants/Api";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import * as BankingIcons from "../../../components/BankingIcons";
import WarningModal from "../../../components/WarningModal";
import DetailCard from "../../../components/DetailCard";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppStyles from "../../../assets/theme/AppStyles";
import DateDisplay from "../../../components/DateDisplay";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Tab = createMaterialTopTabNavigator();

const OverviewScreen = ({ partyDetails }) => {
    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            {!partyDetails ? (
                <Spinner
                    color={Colors.primary}
                    visible={true}
                    textContent={"Getting Details"}
                    textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
                />
            ) : (
                <View style={styles.container}>
                    <DetailCard details={[
                        { Label: "Party Name", Value: partyDetails.PartyName },
                        { Label: "Contact Person", Value: partyDetails.ContactPersonName },
                        { Label: "Mobile Number", Value: partyDetails.MobileNumber },
                        { Label: "Party Code", Value: partyDetails.PartyCode },
                        { Label: "Address", Value: partyDetails.Address },
                        { Label: "Email", Value: partyDetails.Email },
                        { Label: "Website", Value: partyDetails.Website },
                    ]} />
                </View>
            )}
        </ScrollView>
    );
};

const OrdersScreen = ({ partyId }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
        setIsLoading(false);
    };

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Orders.ListByParty + "?partyId=" + partyId)
                .catch(function (error) {
                    console.error("Error fetching orders:", error.message, error.response);
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code === 200) {
                    setOrders(response.data.Data);
                } else {
                    console.error("Error loading orders:", response.data.Message);
                    ToastMessage.Short("Error Loading Orders");
                }
            } else {
                console.error("Undefined response from API");
                ToastMessage.Short("Error Loading Orders");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee", flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <View>
                    {console.log("order log:", orders)}
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.orderItem}
                                onPress={() => navigation.navigate("DeliverDetails", { deliverId: order.Id })}
                            >
                                {/* Display order details similar to OrderList component */}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No orders found!!</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
};


const CollectionsScreen = ({ partyId }) => {
    const [collections, setCollections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
        setIsLoading(false);
    };

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Collections.ListByParty + "?partyId=" + partyId)
                .catch(function (error) {
                    console.error("Error fetching collections:", error.message, error.response);
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code === 200) {
                    setCollections(response.data.Data);
                } else {
                    console.error("Error loading collections:", response.data.Message);
                    ToastMessage.Short("Error Loading Collections");
                }
            } else {
                console.error("Undefined response from API");
                ToastMessage.Short("Error Loading Collections");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee", flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <View>
                    {collections.length > 0 ? (
                        collections.map((collection, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.collectionItem}
                                onPress={() => navigation.navigate("CollectionDetails", { collection })}
                            >
                                <View>
                                    <Text style={AppStyles.Text.BoldTitle}>{collection.PartyName}</Text>
                                    <Text style={AppStyles.Text.Regular}>{`Payment Amount: Rs.${collection.Amount}`}</Text>
                                    <Text style={AppStyles.Text.Regular}>
                                        Recieved Date: <DateDisplay date={collection.PaymentDate} />
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No collections found!!</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
};



const VisitsScreen = ({ partyId }) => {
    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
        setIsLoading(false);
    };

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Visits.ListByParty + "?partyId=" + partyId)
                .catch(function (error) {
                    console.error("Error fetching visits:", error.message, error.response);
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setVisits(response.data.Data);
                } else {
                    console.error("Error loading visits:", response.data.Message);
                    ToastMessage.Short("Error Loading Visits");
                }
            } else {
                console.error("Undefined response from API");
                ToastMessage.Short("Error Loading Visits");
            }
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getList();
    }, []);

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee", flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <View>
                    {console.log("visits log:", visits)}
                    {visits.length > 0 ? (
                        visits.map((visit) => (
                            <TouchableOpacity
                                key={visit.Id}
                                style={styles.visitItem}
                                onPress={() => navigation.navigate("VisitDetails", { visit })}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={AppStyles.Text.BoldTitle}>{visit.PartyName ? visit.PartyName : visit.LocationName}</Text>
                                        <DateDisplay date={visit.VisitDate} />
                                    </View>
                                    {visit.PartyName && (
                                        <BankingIcons.tickMark fill='green' style={styles.imageStyle} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No visits found!!</Text>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

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
                <Tab.Screen name="Orders" component={() => <OrdersScreen partyId={party.Id} />} />
                <Tab.Screen name="Collections" component={() => <CollectionsScreen partyId={party.Id} />} />
                <Tab.Screen name="Visits" component={() => <VisitsScreen partyId={party.Id} />} />
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
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    visitItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    imageStyle: {
        marginRight: 10,
    },
});

export default PartyDetails;


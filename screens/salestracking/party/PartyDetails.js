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
import { DateDisplay, TimeDisplay } from "../../../components/DateDisplay";
import DeviceStorage from "../../../config/DeviceStorage";
import helpers from "../../../constants/Helpers";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Tab = createMaterialTopTabNavigator();

const OverviewScreen = (props) => {
    const [partyDetails, setPartyDetails] = useState();


    useEffect(() => {
        getDetail();
    }, []);

    const getDetail = async () => {
        let partyId= await DeviceStorage.getKey("selectedParty");
        if(partyId>0 || partyId != null || partyId != undefined){
        var response = await (await request())
            .get(Api.Parties.Details + "?id=" + partyId)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setPartyDetails(response.data.Data);

            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error Loading Party Detail");
        }}
        else{
            await helpers.PostException("Errors while saving the partyid in async strorage in party details screen, partyId:"+partyId);
        }
    };
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
                        { Label: "Party Name", Value: partyDetails?.PartyName },
                        { Label: "Contact Person", Value: partyDetails?.ContactPersonName },
                        { Label: "Mobile Number", Value: partyDetails?.MobileNumber },
                        { Label: "Party Code", Value: partyDetails?.PartyCode },
                        { Label: "Address", Value: partyDetails?.Address },
                        { Label: "Email", Value: partyDetails?.Email },
                        { Label: "Website", Value: partyDetails?.Website },
                    ]} containerStyle={{marginHorizontal: 0}}
                        />
                </View>
            )}
        </ScrollView>
    );
};

const OrdersScreen = (props) => {
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
            let partyId=  await DeviceStorage.getKey("selectedParty");
            var response = await (await request())
                .get(Api.Orders.ListByParty + "?PartyId=" + partyId+"&pageNo="+1+"&pageSize="+20)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code === 200) {
                    setOrders(response.data.Data);
                } else {
                    ToastMessage.Short(response.data.Message);
                }
            } else {
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
                <View style={{marginHorizontal: 8, marginTop: 8}}>
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.listItem}
                                onPress={() => props.navigation.navigate("OrderDetails", { orderId: order.Id })}
                            >
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                    <View>

                                        <Text style={[AppStyles.Text.BoldTitle, { marginBottom: 4 }]}>{order.CompanyName}</Text>
                                        <TouchableOpacity onPress={() => Contact.MakeCall(order.PartyMobileNo)} style={{ flexDirection: "row", alignItems: "center" }}>
                                            <BankingIcons.callIcon fill={"green"} height={18} width={18} />
                                            <Text style={[styles.orderInfo]}> {order.PartyMobileNo} </Text>
                                        </TouchableOpacity>
                                        <Text style={[styles.orderInfo, { color: "#040273" }]}>#{order.OrderNo} </Text>

                                        <Text style={styles.orderInfo}>Delivery Date: <DateDisplay date={order.EstimatedDeliveryDate} /> </Text>
                                        <Text style={styles.orderInfo}>Ordered Date: <DateDisplay date={order.OrderDate} /> </Text>

                                    </View>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "flex-end", marginTop: 4 }}>

                                    <Text style={[styles.orderInfo, { color: "green", alignSelf: "flex-end" }]}>Rs. {order?.TotalAmount?.toFixed(2)}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
                            <Text style={[AppStyles.Text.BoldTitle, { fontSize: 20 }]}>No Order for this party !!</Text>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};


const CollectionsScreen = (props) => {
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
            let partyId=  await DeviceStorage.getKey("selectedParty");
            var response = await (await request())
                .get(Api.Collections.ListByParty + "?partyId=" + partyId)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code === 200) {
                    setCollections(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Collections");
                }
            } else {
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
                <View style={{marginHorizontal: 8, marginTop: 8}}>
                    {collections.length > 0 ? (
                        collections.map((collection, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.listItem}
                                onPress={() =>
                                    props.navigation.navigate("CollectionDetails", { collection })
                                  }
                            >
                                <View>
                                    <Text style={AppStyles.Text.BoldTitle}>{collection.PartyName}</Text>
                                    <Text style={AppStyles.Text.Regular}>{`Received Amount: Rs.${collection.Amount}`}</Text>
                                    <Text style={AppStyles.Text.Regular}>
                                        Recieved Date: <DateDisplay date={collection.PaymentDate} />
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{ alignItems: "center" }}>
                            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
                            <Text style={[AppStyles.Text.BoldTitle, { fontSize: 20 }]}>No Collection for this party !!</Text>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};



const VisitsScreen = (props) => {
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
            let partyId=  await DeviceStorage.getKey("selectedParty");
            var response = await (await request())
                .get(Api.Visits.ListByParty + "?partyId=" + partyId)
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
                <View style={{marginHorizontal: 8, marginTop: 8}}>
                    {visits.length > 0 ? (
                        visits.map((visit) => (
                            <TouchableOpacity
                                key={visit.Id}
                                style={styles.listItem}
                                onPress={() => props.navigation.navigate("VisitDetails", { visit })}
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
                        <View style={{ alignItems: "center" }}>
                            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
                            <Text style={[AppStyles.Text.BoldTitle, { fontSize: 20 }]}>No Visits for this party !!</Text>
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};

const PartyDetails = (props) => {
    const { party } = props.route.params;
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        props.navigation.setOptions({
            title: party.PartyName,
        });
        setPartyId();
    }, []);

    const setPartyId = async () => {
       await DeviceStorage.saveKey("selectedParty", party.Id.toString());
       setIsLoading(false);
    };

  

    return (
        <>
            {isLoading ? 
            (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )  :
               ( <Tab.Navigator
                    screenOptions={{
                        tabBarScrollEnabled: true,
                        tabBarIndicatorStyle: { color: "red" },
                        tabBarPressColor: Colors.primary,
                    }}
                >
                    <Tab.Screen name="Overview" component={OverviewScreen}/>
                    <Tab.Screen name="Orders" component={OrdersScreen} />
                    <Tab.Screen name="Collections" component={CollectionsScreen} />
                    <Tab.Screen name="Visits" component={VisitsScreen} />
                </Tab.Navigator>)}
           
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    listItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    imageStyle: {
        marginRight: 10,
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

export default PartyDetails;


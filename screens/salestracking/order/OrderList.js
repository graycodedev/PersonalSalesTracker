import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import { useFocusEffect } from "@react-navigation/native";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import { DateDisplay, TimeDisplay } from "../../../components/DateDisplay";
import AppStyles from "../../../assets/theme/AppStyles";
import WarningModal from "../../../components/WarningModal";
import { Contact } from "../../../constants/Contact";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const OrderList = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Orders",
        });
    }, [])

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
                .get(Api.Orders.List)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });
            if (response != undefined) {
                if (response.data.Code == 200) {
                    console.log(response.data.Data[0])
                    setOrders(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Notes");
                }
            } else {
                ToastMessage.Short("Error Loading Notes");
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
                    {orders.length > 0 ? (
                        orders.map((order, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.orderItem}
                                onPress={() => navigation.navigate("DeliverDetails", { deliverId: order.Id })}
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
                        <View style={styles.noDataContainer}>
                            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
                            <Text style={[AppStyles.Text.BoldTitle, { fontSize: 20 }]}>No orders available</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    navigation.navigate("AddOrder");
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
    orderItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    orderInfo: {
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
    noDataContainer: {
        alignItems: "center",
        marginTop: 20,
    },
});

export default OrderList;

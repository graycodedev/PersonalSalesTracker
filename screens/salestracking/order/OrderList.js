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
import DateDisplay from "../../../components/DateDisplay";
import AppStyles from "../../../assets/theme/AppStyles";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const OrderList = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Order List",
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
                    setOrders(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Notes");
                }
            } else {
                ToastMessage.Short("Error Loading Notes");
            }
        } finally {
            // alert("finallu");
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
                    {orders.map((order) => (
                        <TouchableOpacity
                            key={order.value}
                            style={styles.orderItem}
                            onPress={() => navigation.navigate("OrderDetails", { order })}
                        >
                            <Image source={order.image} style={styles.orderImage} />
                            <View>
                                <Text style={[AppStyles.Text.BoldTitle, {marginBottom:4}]}>Product Name</Text>
                                <Text style={styles.orderInfo}>Order Date: <DateDisplay date={order.OrderDate} /></Text>
                                <Text style={styles.orderInfo}>Estimated Delivery:<DateDisplay date={order.EstimatedDeliveryDate} /> </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
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
        flexDirection: "row",
        alignItems: "center",
    },
    orderImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
    },
    orderName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
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
});

export default OrderList;
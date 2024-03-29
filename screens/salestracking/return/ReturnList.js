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
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import AppStyles from "../../../assets/theme/AppStyles";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ReturnList = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Return List",
        });
    }, [])

    const [returns, setReturns] = useState([]);
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
                .get(Api.Returns.List)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setReturns(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Returns");
                }
            } else {
                ToastMessage.Short("Error Loading Returns");
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
                    {returns.length > 0 ? (
                        returns.map((returnItem) => (
                            <TouchableOpacity
                                key={returnItem.Id}
                                style={styles.returnItem}
                                onPress={() => navigation.navigate("ReturnDetails", { returnItem })}
                            >
                                <View>
                                    <Text style={[AppStyles.Text.BoldTitle, { marginBottom: 4 }]}>{returnItem.ReturnReasonTitle}</Text>
                                    <Text style={styles.returnText}>Product: {returnItem.ProductName}</Text>
                                    <Text style={styles.returnText}>Quantity: {returnItem.Quantity}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.noDataContainer}>
                            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
                            <Text style={[AppStyles.Text.BoldTitle, { fontSize: 20 }]}>No return items available</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    navigation.navigate("ReturnOrder");
                }}
            >
                <BankingIcons.plus fill="white" />
            </TouchableOpacity>
        </View >
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
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
    },
    returnItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    returnText: {
        fontSize: 16,
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        position: "absolute",
        bottom: 30,
        right: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    noDataContainer: {
        alignItems: "center",
        marginTop: 20,
    },
});

export default ReturnList;

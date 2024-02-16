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
import DateDisplay from "../../../components/DateDisplay";
import AppStyles from "../../../assets/theme/AppStyles";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const AdvanceList = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Advance List",
        });
    }, [])

    const [advances, setAdvances] = useState([]);
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
                .get(Api.Advance.ListByUser)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setAdvances(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Advances");
                }
            } else {
                ToastMessage.Short("Error Loading Advances");
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
                    {advances.map((advance) => {
                        return (
                            <TouchableOpacity
                                key={advance.Id}
                                style={styles.advanceItem}
                                onPress={() => navigation.navigate("AdvanceDetails", { advance })}
                            >
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={AppStyles.Text.BoldTitle}>Rs. {advance.Amount}</Text>
                                        {advance.IsApproved == true ? <Text style={[styles.advanceText, { color: 'green' }]}>Approved</Text> : advance.IsCancelled ? <Text style={[styles.advanceText, { color: 'red' }]}>Cancelled</Text> : <Text style={[styles.advanceText, { color: 'orange' }]}>Pending</Text>}
                                    </View>
                                    <View>
                                        <Text style={styles.advanceText}>For: <DateDisplay date={advance.ForDate} /></Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}



                </ScrollView>
            )}

            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    navigation.navigate("RequestAdvance");
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
    advanceItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    advanceName: {
        fontSize: 20,
        fontWeight: '700',
    },
    advanceText: {
        fontSize: 16,
        color: "#333",
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

export default AdvanceList;

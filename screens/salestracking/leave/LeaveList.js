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

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const LeaveList = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Leave List",
        });
    }, [])

    const [leaves, setLeaves] = useState([]);
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
                .get(Api.Leave.ListByUser)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setLeaves(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Leaves");
                }
            } else {
                ToastMessage.Short("Error Loading Leaves");
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
                    {leaves.map((leave) => (
                        <TouchableOpacity
                            key={leave.Id}
                            style={styles.leaveItem}
                            onPress={() => navigation.navigate("LeaveDetails", { leave })}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <Text style={styles.leaveType}>{leave.LeaveType}</Text>
                                    <Text style={styles.leaveDate}>From: {leave.FromDate} To: {leave.ToDate}</Text>
                                    <Text style={styles.leaveRemarks}>Remarks: {leave.Remarks}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    navigation.navigate("RequestLeave");
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
        backgroundColor: Colors.background,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
    },
    leaveItem: {
        backgroundColor: Colors.white,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 10,
    },
    leaveType: {
        fontSize: 18,
        fontWeight: "bold",
    },
    leaveDate: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    leaveRemarks: {
        fontSize: 14,
        color: Colors.textSecondary,
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
});

export default LeaveList;

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
                    {leaves.map((leave) => {
                        const fromDate = new Date(leave.FromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        const toDate = new Date(leave.ToDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                        return (
                            <TouchableOpacity
                                key={leave.Id}
                                style={styles.leaveItem}
                                onPress={() => navigation.navigate("LeaveDetails", { leave })}
                            >
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <Text style={styles.leaveTitle}>{leave.LeaveTypeName}</Text>
                                        {leave.IsApproved == true ? <Text style={[styles.leaveText, { color: 'green' }]}>Approved</Text> : leave.IsCancelled ? <Text style={[styles.leaveText, { color: 'red' }]}>Cancelled</Text> : <Text style={[styles.leaveText, { color: 'orange' }]}>Pending</Text>}
                                    </View>
                                    <View>

                                        <Text style={styles.leaveText}>From: {fromDate}</Text>
                                        <Text style={styles.leaveText}>To: {toDate}</Text>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}


                </ScrollView>
            )
            }

            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    navigation.navigate("RequestLeave");
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
    leaveItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    leaveTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    leaveText: {
        fontSize: 16,
    },
    leaveRemarks: {
        fontSize: 14,
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

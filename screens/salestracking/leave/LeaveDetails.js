import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import qs from "qs"

import Api from "../../../constants/Api";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import * as BankingIcons from "../../../components/BankingIcons";
import WarningModal from "../../../components/WarningModal";

const LeaveDetails = ({ route, navigation }) => {
    const { leave } = route.params;
    const [leaveDetails, setLeaveDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const fromDate = new Date(leave.FromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const toDate = new Date(leave.ToDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    useFocusEffect(
        React.useCallback(() => {
            getDetail();
            return () => { };
        }, [])
    );

    useEffect(() => {
        getDetail();
        setIsLoading(false);
    }, []);

    const getDetail = async () => {
        var response = await (await request())
            .get(Api.Leave.Details + "?id=" + leave.Id)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setLeaveDetails(response.data.Data);
            } else {
                ToastMessage.Short("Error Loading Leave Detail");
            }
        } else {
            ToastMessage.Short("Error Loading Leave Detail");
        }
    };


    const updateLeave = () => {
        navigation.navigate('RequestLeave', { update: true, leave: leaveDetails });
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <View style={styles.item}>
                        <Text style={styles.leaveInfo}>Leave Type:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.leaveData}>{leave.LeaveType}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.leaveInfo}>From:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.leaveData}>{fromDate}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.leaveInfo}>To:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.leaveData}>{toDate}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.leaveInfo}>Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.leaveData}>{leave.Remarks}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.leaveInfo}>Status:</Text>
                        <View style={styles.dataView}>
                            {leave.IsApproved == true ? <Text style={[styles.leaveData, { color: 'green' }]}>Approved</Text> : leave.IsCancelled ? <Text style={[styles.leaveData, { color: 'red' }]}>Cancelled</Text> : <Text style={[styles.leaveData, { color: 'orange' }]}>Pending</Text>}
                        </View>
                    </View>

                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                        onPress={() => {
                            updateLeave()
                        }}
                    >
                        <BankingIcons.Edit fill={"white"} height={25} width={25} />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
    itemContainer: {
        backgroundColor: 'white',
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        justifyContent: 'space-between',
        padding: 10,
    },
    leaveInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    leaveData: {
        fontSize: 20,
        textAlign: 'right'
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
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1,
    }
});

export default LeaveDetails;

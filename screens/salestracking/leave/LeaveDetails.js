import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import qs from "qs"

import Api from "../../../constants/Api";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import * as BankingIcons from "../../../components/BankingIcons";
import WarningModal from "../../../components/WarningModal";
import DetailCard from "../../../components/DetailCard";

const LeaveDetails = ({ route, navigation }) => {
    const { leave } = route.params;
    const fromDate = new Date(leave.FromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const toDate = new Date(leave.ToDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const leaveDetails = [
        { Label: "Leave Type", Value: leave.LeaveTypeName },
        { Label: "From", Value: fromDate },
        { Label: "To", Value: toDate },
        { Label: "Remarks", Value: leave.Remarks },
        { Label: "Status", Value: leave.IsApproved ? "Approved" : leave.IsCancelled ? "Cancelled" : "Pending" },
    ];

    const updateLeave = () => {
        navigation.navigate('RequestLeave', { update: true, leave: leave });
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={leaveDetails} />

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                    onPress={updateLeave}
                >
                    <BankingIcons.Edit fill={"white"} height={25} width={25} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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

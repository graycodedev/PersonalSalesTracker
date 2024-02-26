import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ToastMessage from "../../../components/Toast/Toast";
import * as BankingIcons from "../../../components/BankingIcons";
import DetailCard from "../../../components/DetailCard";
import { Colors } from "../../style/Theme";
import { DateDisplay, TimeDisplay } from "../../../components/DateDisplay";


const LeaveDetails = ({ route, navigation }) => {
    const { leave } = route.params;
    const fromDate = new Date(leave.FromDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const toDate = new Date(leave.ToDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    useEffect(() => {
        navigation.setOptions({
            title: "Leave Details",
        });
    }, []);

    const updateLeave = () => {
        navigation.navigate('RequestLeave', { update: true, leave });
    };

    const leaveDetailsArray = [
        { Label: "Leave Type", Value: leave.LeaveTypeName },
        { Label: "From", Value: fromDate },
        { Label: "To", Value: toDate },
        { Label: "Remarks", Value: leave.Remarks },
        {
            Label: "Status", Value: leave.IsApproved == true ?
                <Text style={{ color: 'green' }}>Approved</Text> :
                leave.IsCancelled ?
                    <Text style={{ color: 'red' }}>Cancelled</Text> :
                    <Text style={{ color: 'orange' }}>Pending</Text>
        },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={leaveDetailsArray} />

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

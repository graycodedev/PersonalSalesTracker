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
import DateDisplay from "../../../components/DateDisplay";
import DetailCard from "../../../components/DetailCard";

const AdvanceDetails = ({ route, navigation }) => {
    const { advance } = route.params;
    const [advanceDetails, setAdvanceDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const forDate = new Date(advance.ForDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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
            .get(Api.Advance.Details + "?id=" + advance.Id)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setAdvanceDetails(response.data.Data);
            } else {
                ToastMessage.Short("Error Loading Advance Detail");
            }
        } else {
            ToastMessage.Short("Error Loading Advance Detail");
        }
    };

    const updateAdvance = () => {
        navigation.navigate('RequestAdvance', { update: true, advance: advanceDetails });
    };

    const advanceDetailsArray = [
        { Label: "Amount", Value: `Rs. ${advance.Amount}` },
        { Label: "For", Value: forDate },
        { Label: "Remarks", Value: advance.Remarks },
        { Label: "Status", Value: advance.IsApproved ? "Approved" : advance.IsCancelled ? "Cancelled" : "Pending" },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={advanceDetailsArray} />

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                    onPress={updateAdvance}
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

export default AdvanceDetails;

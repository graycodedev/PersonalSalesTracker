import React from "react";
import { ScrollView } from "react-native";
import DetailCard from "../../../components/DetailCard";
import { Colors } from "../../style/Theme";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import * as BankingIcons from "../../../components/BankingIcons";

const ReturnDetails = ({ route, navigation }) => {
    const { returnItem } = route.params;

    const returnDetails = [
        { Label: "Return Reason", Value: returnItem.ReturnReasonTitle },
        { Label: "Product", Value: returnItem.ProductName },
        { Label: "Quantity", Value: returnItem.Quantity.toString() },
        { Label: "Remarks", Value: returnItem.Remarks },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={returnDetails} />
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

export default ReturnDetails;

import React, { useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import DetailCard from "../../../components/DetailCard";
import {DateDisplay} from "../../../components/DateDisplay";

const CollectionDetails = ({ navigation, route }) => {
    useEffect(() => {
        const { collection } = route.params;
        navigation.setOptions({
            title: collection ? `Collection Details - ${collection.PartyName}` : "Collection Details",
        });
    }, [route.params]);

    const { collection } = route.params;

    const collectionDetails = [
        {
            Label: "Party Name",
            Value: collection.PartyName
        },
        {
            Label: "Received Amount",
            Value: collection.Amount
        },
        {
            Label: "Received Date",
            Value: <DateDisplay date={collection.PaymentDate} />
        },
        {
            Label: "Received Mode",
            Value: collection.PaymentMode
        },
        {
            Label: "Note",
            Value: collection.Remarks
        },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={collectionDetails} />
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
});

export default CollectionDetails;

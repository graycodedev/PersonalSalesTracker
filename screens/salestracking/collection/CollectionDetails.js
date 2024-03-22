import React, { useEffect } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import DetailCard from "../../../components/DetailCard";
import {DateDisplay} from "../../../components/DateDisplay";
import ImageCard from "../../../components/ImageCard";
import Api from "../../../constants/Api";

const CollectionDetails = ({ navigation, route }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Collection Details"
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
        >
            <DetailCard details={collectionDetails} />
            {collection?.Image && <ImageCard containerStyle={{
      width: "100%", paddingHorizontal: 20}} uri={Api.BaseUrl + collection.Image.slice(1)}/>}
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

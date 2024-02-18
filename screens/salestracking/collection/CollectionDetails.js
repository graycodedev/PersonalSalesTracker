import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { useLayoutEffect } from "react";
import DetailCard from "../../../components/DetailCard";

const CollectionDetails = ({ route, navigation }) => {

    const { party } = route.params;

    useEffect(() => {
        navigation.setOptions({
            title: party.name,
        });
    }, [])

    const collectionDetails = [
        { Label: "Party Name", Value: party.name },
        { Label: "Received Amount", Value: party.amount },
        { Label: "Received Date", Value: party.date },
        { Label: "Received Mode", Value: party.mode },
        { Label: "Note", Value: party.note },
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
    )
};

export default CollectionDetails;

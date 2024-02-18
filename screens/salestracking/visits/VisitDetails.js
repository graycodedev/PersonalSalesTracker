import React from "react";
import { ScrollView } from "react-native";
import DetailCard from "../../../components/DetailCard";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import { View, TouchableOpacity, StyleSheet } from "react-native";

const VisitDetails = ({ route, navigation }) => {
    const { visit } = route.params;

    const visitDetails = [
        { Label: "Name", Value: visit.PartyName ? visit.PartyName : visit.LocationName },
        { Label: "Visit Date", Value: visit.VisitDate },
        { Label: "Remarks", Value: visit.Remarks },
    ];

    const updateVisit = () => {
        navigation.navigate('AddVisit', { update: true, visit: visit });
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={visitDetails} />

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                    onPress={updateVisit}
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

export default VisitDetails;

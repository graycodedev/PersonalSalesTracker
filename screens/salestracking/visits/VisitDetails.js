import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// import { useFocusEffect } from "@react-navigation/native-stack";
import ToastMessage from "../../../components/Toast/Toast";
import * as BankingIcons from "../../../components/BankingIcons";
import WarningModal from "../../../components/WarningModal";
import DetailCard from "../../../components/DetailCard";
import { Colors } from "../../style/Theme";
import DateDisplay from "../../../components/DateDisplay";


const VisitDetails = (props) => {
    console.log(props.route.params.visit.VisitDate)
    const { visit } = props.route.params;
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // useFocusEffect(
    //     React.useCallback(() => {
    //         return () => { };
    //     }, [])
    // );

    useEffect(() => {
        // props.navigation.setOptions({
        //     title: "Visit Details",
        // });
    }, []);

    const deleteVisit = async () => {
        // Simulating API call
        ToastMessage.Short("Visit deleted successfully");
        setShowConfirmDelete(false);
        props.navigation.goBack();
    };

    const updateVisit = () => {
        props.navigation.navigate('AddVisit', { update: true, visit });
    };

    const visitDetails = [
        { Label: "Name", Value: visit.PartyName ? visit.PartyName : visit.LocationName },
        { Label: "Visit Date", Value: <DateDisplay date={visit.VisitDate} /> },
        { Label: "Remarks", Value: visit.Remarks },
    ];

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
                <TouchableOpacity
                    style={[styles.circle, { backgroundColor: "#e74c3c" }]}
                    onPress={() => setShowConfirmDelete(true)}
                >
                    <BankingIcons.DeleteIcon fill="white" />
                </TouchableOpacity>
            </View>
            {showConfirmDelete && (
                <WarningModal
                    text1={"Delete Visit?"}
                    text2={"Are you sure you want to delete the visit?"}
                    onConfirm={deleteVisit}
                    onCancel={() => setShowConfirmDelete(false)}
                    warning
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    buttons: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1,
    },
    circle: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default VisitDetails;

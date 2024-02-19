import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as BankingIcons from "../../../components/BankingIcons";
import DetailCard from "../../../components/DetailCard";
import { Colors } from "../../style/Theme";


const AdvanceDetails = ({ route, navigation }) => {
    const { advance } = route.params;

    useFocusEffect(
        React.useCallback(() => {
            return () => { };
        }, [])
    );

    useEffect(() => {
        navigation.setOptions({
            title: "Advance Details",
        });
    }, []);

    const updateAdvance = () => {
        navigation.navigate('RequestAdvance', { update: true, advance });
    };

    const advanceDetailsArray = [
        { Label: "Amount", Value: `Rs. ${advance.Amount}` },
        { Label: "For", Value: new Date(advance.ForDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
        { Label: "Remarks", Value: advance.Remarks },
        {
            Label: "Status", Value: advance.IsApproved == true ?
                <Text style={{ color: 'green' }}>Approved</Text> :
                advance.IsCancelled ?
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
            <DetailCard details={advanceDetailsArray} />

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                    onPress={() => {
                        updateAdvance()
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

export default AdvanceDetails;

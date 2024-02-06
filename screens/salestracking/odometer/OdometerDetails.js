import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import AppStyles from "../../../assets/theme/AppStyles";
import DetailCard from "../../../components/DetailCard";

const OdometerDetails = ({ navigation, route }) => {
    useEffect(() => {
        navigation.setOptions({
            title: odometer.StartOdometer,
        });
    }, [])

    const { odometer } = route.params;


    const odometerDetails=[
        {
         Label:"Start Odometer",
          Value:odometer.StartOdometer
        },
        {
         Label:"End Odometer",
          Value:odometer.EndOdometer
        },
        {
         Label:"Start Date",
          Value:new Date(odometer.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeStyle:"short" }) +", "+ new Date(odometer.StartDate).toLocaleDateString('en-US', {  month:'short', day: 'numeric' })
        },
        {
         Label:"End Date",
         Value:new Date(odometer.EndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeStyle:"short" }) +", "+ new Date(odometer.EndDate).toLocaleDateString('en-US', {  month:'short', day: 'numeric' })

        },
        {
         Label:"Remarks",
          Value:odometer.Remarks
        },
        {
         Label:"Admin Remarks",
          Value:odometer.AdminRemarks
        },
    ]

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={odometerDetails}/>
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
    itemContainer: {
        backgroundColor: 'white',
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        justifyContent: 'space-between',
        padding: 10,
        paddingVertical:4
    },
    odometerInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    odometerData: {
        fontSize: 20,
        textAlign: 'right'
    },
});

export default OdometerDetails;

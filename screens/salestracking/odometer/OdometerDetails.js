import React, { useEffect } from "react";
import {
    StyleSheet,
    ScrollView,
} from "react-native";
import DetailCard from "../../../components/DetailCard";

const OdometerDetails = ({ navigation, route }) => {
    useEffect(() => {
        navigation.setOptions({
            title: odometer.VehiclePlateNo,
        });
    }, [])

    const { odometer } = route.params;

console.log("odometer11",odometer)
    const odometerDetails=[
        {
         Label:"Start Odometer",
          Value:odometer.StartOdometer??''
        },
        {
         Label:"End Odometer",
          Value:odometer.EndOdometer??''
        },
        {
         Label:"Start Date",
          Value:odometer.StartDate?new Date(odometer.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }):''
        },
        {
         Label:"End Date",
         Value:odometer.EndDate?new Date(odometer.EndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }):''

        },
        {
         Label:"Remarks",
          Value:odometer.Remarks??''
        },
        {
         Label:"Admin Remarks",
          Value:odometer.AdminRemarks??''
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

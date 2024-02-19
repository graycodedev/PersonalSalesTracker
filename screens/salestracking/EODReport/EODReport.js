import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
import ReportCard from '../../../components/salestracking/ReportCard';
import * as SVG from "../../../components/BankingIcons";
import request from '../../../config/RequestManager';
import Api from '../../../constants/Api';
import ToastMessage from '../../../components/Toast/Toast';
import { Colors } from '../../style/Theme';
import Spinner from 'react-native-loading-spinner-overlay';

const EODReport = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false); // Set to false for static data
    const [reports, setReports] = useState({
        Visit: "Visit Data",
        NewOrder: "Order Data",
        OrderAmount: "Collection Data",
        NewCustomer: "Customer Data"
    }); // Static values for now

    /* Commented out
    useEffect(() => {
        (async () => getReport())();
    }, [])

    const getReport = async () => {
        var response = await (await request())
            .get(Api.Reports.Eod)
            .catch(function (error) {
                setIsLoading(false)
                ToastMessage.Short("Error! Contact Support");
            });
        console.log("reppp", response.data.Data)
        if (response != undefined) {
            if (response.data.Code == 200) {
                setReports(response.data.Data);
            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error Loading Notes");
        }
        setIsLoading(false);
        console.log("rep", response.data.Code)
    };
    */

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={styles.container}
        >
            <Spinner
                color={Colors.primary}
                visible={isLoading}
                textContent={"Loading report..."}
                textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
            />

            {reports && !isLoading && <>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                    <ReportCard icon={<SVG.visits />} title={"Visits"} subtitle={reports?.Visit} style={{ height: 160, width: "49%", backgroundColor: "#D9D6F4" }} />
                    <ReportCard icon={<SVG.order />} title={"Orders"} subtitle={reports?.NewOrder} style={{ height: 160, width: "49%", backgroundColor: "#EAF5D2" }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ReportCard icon={<SVG.collection />} title={"Collections"} subtitle={reports?.OrderAmount} style={{ height: 160, width: "49%", backgroundColor: "#e7feff" }} />
                    <ReportCard icon={<SVG.profile1 />} title={"New Customers"} subtitle={reports?.NewCustomer} style={{ height: 160, width: "49%", backgroundColor: "#FCF0C7" }} />
                </View>
            </>}



        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    chartContainer: {
        alignItems: 'center',
    },
});

export default EODReport;

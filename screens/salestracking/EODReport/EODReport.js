import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ReportCard from '../../../components/salestracking/ReportCard';
import * as SVG from "../../../components/BankingIcons";
import request from '../../../config/RequestManager';
import Api from '../../../constants/Api';
import ToastMessage from '../../../components/Toast/Toast';
import { Colors } from '../../style/Theme';
import Spinner from 'react-native-loading-spinner-overlay';

const EODReport = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState({});

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
                    <ReportCard icon={<View style={[styles.iconContainer, { borderWidth: 4, borderColor: "#FFBF00" }]}><SVG.visits /></View>} title={"Visits"} subtitle={reports?.Visit?.toString() || 'N/A'} style={{ margin: 10, marginBottom: 0, height: 160, width: "45%", backgroundColor: "#ffffff" }} />
                    <ReportCard icon={<View style={[styles.iconContainer, { borderWidth: 4, borderColor: "#007BA7" }]}><SVG.order /></View>} title={"Orders"} subtitle={reports?.NewOrder?.toString() || 'N/A'} style={{ margin: 10, marginBottom: 0, height: 160, width: "45%", backgroundColor: "#ffffff" }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ReportCard icon={<View style={[styles.iconContainer, { borderWidth: 4, borderColor: "#DC143C" }]}><SVG.collection /></View>} title={"Collections"} subtitle={reports?.OrderAmount?.toString() || 'N/A'} style={{ margin: 10, height: 160, width: "45%", backgroundColor: "#ffffff" }} />
                    <ReportCard icon={<View style={[styles.iconContainer, { borderWidth: 4, borderColor: "#50C878" }]}><SVG.profile1 /></View>} title={"New Customers"} subtitle={reports?.NewCustomer?.toString() || 'N/A'} style={{ margin: 10, height: 160, width: "45%", backgroundColor: "#ffffff" }} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ReportCard icon={<View style={[styles.iconContainer, { borderWidth: 4, borderColor: "#9966CC" }]}><SVG.delivery /></View>} title={"Orders Delivered"} subtitle={reports?.TotalOrderDelivered?.toString() || 'N/A'} style={{ margin: 10, height: 160, width: "45%", backgroundColor: "#ffffff" }} />
                    <ReportCard icon={<View style={[styles.iconContainer, { borderWidth: 4, borderColor: "#40E0D0" }]}><SVG.odometer /></View>} title={"Distance Travelled"} subtitle={reports?.TravelledDistance?.toString() || 'N/A'} style={{ margin: 10, height: 160, width: "45%", backgroundColor: "#ffffff" }} />
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
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 30,
        height: 60,
        width: 60,
    },
});

export default EODReport;

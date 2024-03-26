import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ReportCard from '../../../components/salestracking/ReportCard';
import * as SVG from "../../../components/BankingIcons";
import request from '../../../config/RequestManager';
import Api from '../../../constants/Api';
import ToastMessage from '../../../components/Toast/Toast';
import { Colors } from '../../style/Theme';
import Spinner from 'react-native-loading-spinner-overlay';

const EODReport = (props) => {
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
                    <ReportCard icon={<View style={[styles.iconContainer]}><SVG.visits fill={"#FFBF00"}/></View>} title={"Visits"} subtitle={reports?.Visit?.toString() || 'N/A'} style={styles.tile} navigation={()=>props.navigation.navigate("Visits")}/>
                    <ReportCard icon={<View style={[styles.iconContainer]}><SVG.order fill={"#007BA7"}/></View>} title={"Orders"} subtitle={reports?.NewOrder?.toString() || 'N/A'} style={styles.tile} navigation={()=>props.navigation.navigate("OrderList")}/>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ReportCard icon={<View style={[styles.iconContainer, ]}><SVG.collection fill={"#DC143C"}/></View>} title={"Order Amount"} subtitle={reports?.OrderAmount?.toString() || 'N/A'} style={styles.tile} navigation={()=>props.navigation.navigate("OrderList")}/>
                    <ReportCard icon={<View style={[styles.iconContainer]}><SVG.profile1 fill={"#50C878"}/></View>} title={"New Customers"} subtitle={reports?.NewCustomer?.toString() || 'N/A'} style={styles.tile} navigation={()=>props.navigation.navigate("PartyList")}/>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <ReportCard icon={<View style={[styles.iconContainer]}><SVG.delivery fill={"#9966CC"}/></View>} title={"Orders Delivered"} subtitle={reports?.TotalOrderDelivered?.toString() || 'N/A'} style={styles.tile} navigation={()=>props.navigation.navigate("OrderList")}/>
                    <ReportCard icon={<View style={[styles.iconContainer]}><SVG.odometer fill={"#40E0D0"}/></View>} title={"Distance Travelled"} subtitle={reports?.TravelledDistance?.toString() || 'N/A'} style={styles.tile} navigation={()=>props.navigation.navigate("OdometerList")}/>
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
    tile: {
        margin: 10,
        marginBottom: 0,
        height: 160,
        width: "45%",
        backgroundColor: "#ffffff" 
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
        borderWidth: 0, borderColor: Colors.primary 
    },
});

export default EODReport;

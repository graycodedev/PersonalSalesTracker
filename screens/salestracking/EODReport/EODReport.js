import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
import ReportCard from '../../../components/salestracking/ReportCard';
import * as SVG from "../../../components/BankingIcons"

const EODReport = ({ navigation }) => {
    // Static values for now
    const data = {
        labels: ['9AM', '12PM', '3PM', '6PM'],
        datasets: [
            {
                data: [50, 30, 100, 20],
                color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`,
                strokeWidth: 2
            }
        ],
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={styles.container}
        >
            {/* <View style={styles.chartContainer}>
                <LineChart
                    data={data}
                    width={400}
                    height={250}
                    chartConfig={{
                        backgroundColor: '#eee',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </View> */}
               
            <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom: 8}}>
            <ReportCard icon={ <SVG.visits />} title={"Visits"} subtitle={"10"} style={{height: 160,width: "49%", backgroundColor:"#D9D6F4" }}/>
            <ReportCard icon={ <SVG.order />} title={"Orders"} subtitle={"5"} style={{height: 160,width: "49%", backgroundColor:"#EAF5D2"}}/>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>

            <ReportCard icon={ <SVG.visits />} title={"Collections"} subtitle={"Rs.90900"} style={{height: 160,width: "49%" ,backgroundColor:"#e7feff"}}/>
            <ReportCard icon={ <SVG.order />} title={"New Customers"} subtitle={"3"} style={{height: 160,width: "49%", backgroundColor:"#FCF0C7"}}/>
            </View>
           
            
            
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

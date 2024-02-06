import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const EODReport = ({ navigation }) => {
    const data = {
        labels: ['9AM', '12PM', '3PM', '6PM'],
        datasets: [
            {
                data: [50, 30, 10000, 20],
                color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`,
                strokeWidth: 2
            }
        ],
        legend: ["Sales Count", "Visit Count", "Collection Amount", "Travel Km"]
    };

    const screenWidth = Dimensions.get("window").width;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>EOD Report</Text>
            <View style={styles.chartContainer}>
                <LineChart
                    data={data}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#eee',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={styles.chartStyle}
                />
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
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16
    }
});

export default EODReport;

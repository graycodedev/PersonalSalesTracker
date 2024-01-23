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

const OdometerDetails = ({ navigation, route }) => {
    useEffect(() => {
        navigation.setOptions({
            title: odometer.StartOdometer,
        });
    }, [])

    const { odometer } = route.params;

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>

                <View style={styles.itemContainer}>

                    <View style={styles.item}>
                        <Text style={styles.odometerInfo}>Start Odometer:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.odometerData}>{odometer.StartOdometer}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.odometerInfo}>End Odometer:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.odometerData}>{odometer.EndOdometer}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.odometerInfo}>Start Date:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.odometerData}>{odometer.StartDate}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.odometerInfo}>End Date:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.odometerData}>{odometer.EndDate}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.odometerInfo}>Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.odometerData}>{odometer.Remarks}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.odometerInfo}>Admin Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.odometerData}>{odometer.AdminRemarks}</Text>
                        </View>
                    </View>

                </View>
            </View>
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

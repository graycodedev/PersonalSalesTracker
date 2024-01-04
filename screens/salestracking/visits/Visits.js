import React, { useEffect, useState } from "react";
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

const Visits = ({ navigation }) => {

    const [visits, setVisits] = useState([
        {
            value: 0,
            name: "Graycode Technology Pvt. Ltd.",
            location: "Kathmandu",
            date: "2080/12/30",
            date2: "2080/12/31",
            remark: "Remark 1"
        },
        {
            value: 1,
            name: "Party 2",
            location: "Location 2",
            date: "Date 2",
            date2: "2080/12/31",
            remark: "Remark 1",


        },
        {
            value: 2,
            name: "Party 3",
            location: "Location 3",
            date: "Date 3",
            date2: "2080/12/31",
            remark: "Remark 1"



        },
        {
            value: 3,
            name: "Party 4",
            location: "Location 4",
            date: "Date 4",
            date2: "2080/12/31",
            remark: "Remark 1"



        },
    ]);


    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                {visits.map((visit) => (
                    <TouchableOpacity
                        key={visit.value}
                        style={styles.visitItem}
                        onPress={() =>
                            navigation.navigate("VisitDetails", { visit })
                        }
                    >
                        <Text style={styles.visitName}>{visit.name}</Text>
                        <Text style={styles.visitText}>{visit.location}</Text>
                    </TouchableOpacity>
                ))
                }
            </View >

            <View>
                <TouchableOpacity
                    style={styles.circle}
                    onPress={() => {
                        navigation.navigate("AddVisit", { parties: visits });
                    }}
                >
                    <BankingIcons.plus fill="white" />
                </TouchableOpacity>
            </View>

        </ScrollView >
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
    visitItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    visitName: {
        fontSize: 20,
        fontWeight: '700',
    },
    visitText: {
        fontSize: 16,
        color: "#333",
    },
    circle: {
        backgroundColor: Colors.primary,
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Visits;

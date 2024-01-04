import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const VisitDetails = ({ route, navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: visit.name,
        });
    }, [])

    const { visit } = route.params;

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
                        <Text style={styles.visitInfo}>Party Name:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.visitData}>{visit.name}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.visitInfo}>Location:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.visitData}>{visit.location}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.visitInfo}>Visit Date:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.visitData}>{visit.date}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.visitInfo}>Visit Added:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.visitData}>{visit.date2}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.visitInfo}>Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.visitData}>{visit.remark}</Text>
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
    visitInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    visitData: {
        fontSize: 20,
        textAlign: 'right'
    },
});

export default VisitDetails;

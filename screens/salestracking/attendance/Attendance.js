import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";

const Attendance = () => {
    const [markedDates, setMarkedDates] = useState({
        // Absent days
        "2024-01-11": { marked: true, dotColor: "red" },
        "2024-01-21": { marked: true, dotColor: "red" },
        // Saturdays
        "2024-01-06": { marked: true, dotColor: "#f39b11" },
        "2024-01-13": { marked: true, dotColor: "#f39b11" },
        "2024-01-20": { marked: true, dotColor: "#f39b11" },
        "2024-01-27": { marked: true, dotColor: "#f39b11" },
    });

    const startDate = new Date("2024-01-01");
    const endDate = new Date("2024-01-31");
    let currentDate = startDate;
    while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        if (!markedDates[dateString]) {

            markedDates[dateString] = { marked: true, dotColor: "green" };
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const renderDay = (day) => {
        const isMarked = markedDates[day.dateString];

        return (
            <View style={[styles.dayContainer, isMarked && { backgroundColor: isMarked.dotColor }]}>
                <Text style={[styles.dayText, isMarked && { color: "white" }]}>{day.day}</Text>
            </View>
        );
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <Calendar
                    markedDates={markedDates}
                    markingType={"multi-dot"}
                    onDayPress={(day) => {
                        console.log("Selected day:", day);
                    }}
                    dayComponent={({ date }) => renderDay(date)}
                    hideExtraDays={true}
                />
                <View style={styles.countContainer}>
                    <View style={styles.countItem}>
                        <Text style={styles.countText}>Present Days</Text>
                        <Text
                            style={[
                                styles.countValue,
                                { backgroundColor: "green", color: "white" },
                            ]}
                        >
                            {Object.keys(markedDates).filter((date) => markedDates[date].dotColor === "green").length}
                        </Text>
                    </View>
                    <View style={styles.countItem}>
                        <Text style={styles.countText}>Absent Days</Text>
                        <Text
                            style={[
                                styles.countValue,
                                { backgroundColor: "red", color: "white" },
                            ]}
                        >
                            2
                        </Text>
                    </View>
                    <View style={styles.countItem}>
                        <Text style={styles.countText}>Holidays</Text>
                        <Text
                            style={[
                                styles.countValue,
                                { backgroundColor: "#f39b11", color: "white" },
                            ]}
                        >
                            4
                        </Text>
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
    countContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    countItem: {
        alignItems: "center",
    },
    countText: {
        fontSize: 16,
    },
    countValue: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 5,
        height: 50,
        width: 50,
        borderRadius: 25,
        textAlign: "center",
        textAlignVertical: "center",
    },
    dayContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    dayText: {
        fontSize: 16,
    },
});

export default Attendance;

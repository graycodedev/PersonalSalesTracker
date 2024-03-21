import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import request from "../../../config/RequestManager";
import Api from "../../../constants/Api";

const Attendance = () => {
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        var response = await (await request())
            .get(Api.Attendances.List)
            .catch(function (error) {
                console.log("Error! Contact Support");
            });

        if (response != undefined) {
            if (response.data.Code == 200) {
                const attendanceData = response.data.Data;
                const newMarkedDates = {};

                attendanceData.forEach((attendance) => {
                    const date = attendance.AttendanceDate.split("T")[0];
                    const dateObj = new Date(date);
                    const dayOfWeek = dateObj.getDay();

                    // Mark all Saturdays as holidays
                    if (dayOfWeek === 6) { // 6 is Saturday in JavaScript Date
                        newMarkedDates[date] = {
                            marked: true,
                            dotColor: "#f39b11", // color for holidays
                        };
                    } else {
                        newMarkedDates[date] = {
                            marked: true,
                            dotColor: attendance.IsCheckIn ? "green" : "red",
                        };
                    }
                });

                // Additional loop to mark all Saturdays in the month as holidays
                const year = new Date().getFullYear();
                const month = new Date().getMonth();
                for (let i = 1; i <= 31; i++) {
                    const date = new Date(Date.UTC(year, month, i));
                    if (date.getMonth() !== month) break;  // Month has ended
                    if (date.getUTCDay() === 6) {  // 6 is Saturday
                        const dateString = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
                        newMarkedDates[dateString] = {
                            marked: true,
                            dotColor: "#f39b11", // color for holidays
                        };
                    }
                }

                setMarkedDates(newMarkedDates);
            } else {
                console.log(response.data.Message);
            }
        } else {
            console.log("Error Loading Attendance");
        }
    };



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
                        // console.log("Selected day:", day);
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
                            {Object.keys(markedDates).filter((date) => markedDates[date].dotColor === "red").length}
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
                            {Object.keys(markedDates).filter((date) => markedDates[date].dotColor === "#f39b11").length}
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
    dayContainer: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
    },
    dayText: {
        fontSize: 16,
    },
    countContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginTop: 32,
    },
    countItem: {
        alignItems: "center",
    },
    countText: {
        fontSize: 16,
        color: "#777777",
    },
    countValue: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 16,
    },
});

export default Attendance;

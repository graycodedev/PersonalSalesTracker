import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { RegularInputText } from "../../../components/Input";
import DropDownPicker from "react-native-dropdown-picker";
import { ActivityIndicator } from "react-native";
import { ButtonPrimary } from "../../../components/Button";

const AddLeave = () => {

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: "Add Leave",
        });
    }, [])

    const [remark, setRemark] = useState("");

    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState(new Date());
    const [selectedToDate, setSelectedToDate] = useState(new Date());

    const onChangeFromDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedFromDate;
        setShowFromDatePicker(false);
        setSelectedFromDate(currentDate);
    };

    const onChangeToDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedToDate;
        setShowToDatePicker(false);
        setSelectedToDate(currentDate);
    };

    const formattedFromDate = selectedFromDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const formattedToDate = selectedToDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const [isLoading, setIsLoading] = useState(false);

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>

                <View style={{ marginBottom: 10 }}>
                    <DropDownPicker
                        containerStyle={{ height: 50 }}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            fontFamily: "Regular",
                            borderColor: "#fff",
                            borderWidth: 0,
                        }}
                        itemStyle={{
                            justifyContent: "flex-start",
                            fontFamily: "Medium",
                            color: "red",
                        }}
                        labelStyle={{
                            fontFamily: "Medium",
                            color: "#9A9A9A",
                        }}
                        arrowColor={"#9A9A9A"}
                        placeholder="Leave Type"
                        label="Leave Type"
                        items={[
                            { label: 'Sick Leave', value: '0' },
                            { label: 'Personal Leave', value: '1' },
                            { label: 'Others', value: '2' },
                        ]}
                    />
                </View>

                <View>
                    <Text style={{ fontFamily: "Medium" }}>From:</Text>
                    <TouchableOpacity onPress={() => setShowFromDatePicker(true)}>
                        <RegularInputText
                            key="from"
                            placeholder="From Date"
                            value={formattedFromDate}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showFromDatePicker && (
                        <DateTimePicker
                            value={selectedFromDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeFromDate}
                        />
                    )}
                </View>

                <View>
                    <Text style={{ fontFamily: "Medium" }}>To:</Text>
                    <TouchableOpacity onPress={() => setShowToDatePicker(true)}>
                        <RegularInputText
                            key="to"
                            placeholder="To Date"
                            value={formattedToDate}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showToDatePicker && (
                        <DateTimePicker
                            value={selectedToDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeToDate}
                        />
                    )}
                </View>

                <View>
                    <RegularInputText
                        key="remark"
                        placeholder="Remarks"
                        onChangeText={(text) => {
                            setRemark(text)
                        }}
                        value={remark}
                        multiline={true}
                        numberOfLines={5}
                        style={{ height: 100, alignItems: 'flex-start', borderWidth: 0 }}
                    />
                </View>

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={() => {
                            setIsLoading(true);
                        }}
                    >
                        <ButtonPrimary title={"Save"} />
                        <ActivityIndicator
                            animating={isLoading}
                            color="#ffa500"
                            style={styles.activityIndicator}
                        ></ActivityIndicator>
                    </TouchableOpacity>
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
});

export default AddLeave;

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ActivityIndicator } from "react-native";
import { ButtonPrimary } from "../../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { RegularInputText } from "../../../components/Input";
import DropDownPicker from "react-native-dropdown-picker";

const GetAdvance = () => {

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: "Get Advance",
        });
    }, [])

    const [remark, setRemark] = useState("");
    const [amount, setAmount] = useState("");

    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState(new Date());
    const [selectedToDate, setSelectedToDate] = useState(new Date());

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
    };

    const formattedDate = selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    useEffect(() => {
    }, [selectedDate]);

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
                        placeholder="Purpose"
                        label="Purpose"
                        items={[
                            { label: 'purpose 1', value: '0' },
                            { label: 'purpose 2', value: '1' },
                            { label: 'purpose 3', value: '2' },
                        ]}
                    />
                </View>

                <View>
                    <Text style={{ fontFamily: "Medium", color: "#9A9A9A", }}>Date:</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <RegularInputText
                            key="date"
                            placeholder="Received Date"
                            value={formattedDate}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                </View>

                <View>
                    <RegularInputText
                        key="amount"
                        placeholder="Amount"
                        onChangeText={(text) => {
                            setAmount(text)
                        }}
                        value={amount}
                        keyboardType="numeric"
                    />
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

export default GetAdvance;

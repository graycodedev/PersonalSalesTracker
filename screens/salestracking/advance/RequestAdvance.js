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
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from "qs";
import Api from "../../../constants/Api";
import ToastMessage from "../../../components/Toast/Toast";
import request from "../../../config/RequestManager";

const RequestAdvance = (props) => {
    const update = props.route.params?.update;
    const advance = props.route.params?.advance;
    const [amount, setAmount] = useState(advance?.Amount);
    const [remarks, setRemarks] = useState(advance?.Remarks);
    const [forDate, setForDate] = useState(new Date(advance?.ForDate) || new Date());
    const [addedOn, setAddedOn] = useState(advance?.AddedOn || new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: update ? "Update Advance" : "Request Advance",
        });
    }, [])

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || forDate;
        setShowDatePicker(false);
        setForDate(currentDate);
    };

    const saveAdvance = async () => {
        let strData = qs.stringify({
            Id: update ? advance.Id : 0,
            CompanyId: 1,
            UserId: 1,
            Amount: amount,
            ForDate: forDate,
            Remarks: remarks,
            AddedBy: 0,
            AddedOn: addedOn,
            IsApproved: false,
            IsCancelled: false,
        })
        setIsLoading(true);
        var response = await (await request())
            .post(Api.Advance.Request, strData)
            .catch(function (error) {
                setIsLoading(false);
                ToastMessage.Short("Error Occurred Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setIsLoading(false);
                navigation.goBack();
                return response.data.Data;
            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error Occurred Contact Support");
        }
        setIsLoading(false);
    }

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View>
                    <RegularInputText
                        key="amount"
                        placeholder="Amount"
                        onChangeText={(text) => {
                            setAmount(text)
                        }}
                        value={amount.toString()}
                        keyboardType="numeric"
                    />
                </View>

                <View>
                    <Text style={{ fontFamily: "Medium", color: "#9A9A9A", }}>For Date:</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <RegularInputText
                            key="forDate"
                            placeholder="For Date"
                            value={forDate.toLocaleDateString()}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={forDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                </View>

                <View>
                    <RegularInputText
                        key="remark"
                        placeholder="Remarks"
                        onChangeText={(text) => {
                            setRemarks(text)
                        }}
                        value={remarks}
                        multiline={true}
                        numberOfLines={5}
                        style={{ height: 100, alignItems: 'flex-start', borderWidth: 0 }}
                    />
                </View>

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={() => {
                            saveAdvance()
                        }}
                    >
                        <ButtonPrimary title={update ? "Update" : "Save"} />
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

export default RequestAdvance;

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
import qs from "qs";
import Api from "../../../constants/Api";
import ToastMessage from "../../../components/Toast/Toast";
import request from "../../../config/RequestManager";

const RequestLeave = (props) => {
    const update = props.route.params?.update;
    const leave = props.route.params?.leave;
    const [remark, setRemark] = useState(leave?.Remarks);
    const [leaveType, setLeaveType] = useState(leave?.LeaveType);
    const [fromDate, setFromDate] = useState(leave ? new Date(leave.FromDate) : new Date());
    const [toDate, setToDate] = useState(leave ? new Date(leave.ToDate) : new Date());
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: update ? "Update Leave" : "Add Leave",
        });
    }, [])

    const saveLeave = async () => {
        let strData = qs.stringify({
            Id: update ? leave.Id : 0,
            CompanyId: 1,
            UserId: 0,
            LeaveType: leaveType,
            FromDate: fromDate,
            ToDate: toDate,
            Remarks: remark,
            AddedBy: 0,
            AddedOn: new Date(),
            IsApproved: false,
            IsCancelled: false,
        })
        setIsLoading(true);
        var response = await (await request())
            .post(Api.Leave.Apply, strData)
            .catch(function (error) {
                setIsLoading(false);
                ToastMessage.Short("Error! Contact Support");
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
            ToastMessage.Short("Error! Contact Support");
        }
        setIsLoading(false);
    }

    const onChangeFromDate = (event, selectedDate) => {
        const currentDate = selectedDate || fromDate;
        setShowFromDatePicker(false);
        setFromDate(currentDate);
    };

    const onChangeToDate = (event, selectedDate) => {
        const currentDate = selectedDate || toDate;
        setShowToDatePicker(false);
        setToDate(currentDate);
    };

    const formattedFromDate = fromDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const formattedToDate = toDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);

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
                    <Text style={{ fontFamily: "Medium", color: "#9A9A9A", }}>From:</Text>
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
                            value={fromDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeFromDate}
                        />
                    )}
                </View>

                <View>
                    <Text style={{ fontFamily: "Medium", color: "#9A9A9A", }}>To:</Text>
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
                            value={toDate}
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
                            saveLeave()
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

export default RequestLeave;

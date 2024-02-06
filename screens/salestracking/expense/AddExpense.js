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

const AddExpense = (props) => {
    const update = props.route.params?.update;
    const expense = props.route.params?.expense;
    const [remark, setRemark] = useState(expense?.Remarks);
    const [expenseType, setExpenseType] = useState(expense?.ExpenseTypeName);
    const [amount, setAmount] = useState(expense?.Amount);
    const [isLoading, setIsLoading] = useState(false);
    const [expenseTypes, setExpenseTypes] = useState([]);

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: update ? "Update Expense" : "Add Expense",
        });
        fetchExpenseTypes();
    }, []);

    const fetchExpenseTypes = async () => {
        var response = await (await request())
            .get(Api.ExpenseTypes.ActiveList)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setExpenseTypes(response.data.Data);
            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error! Contact Support");
        }
    };

    const saveExpense = async () => {
        let strData = qs.stringify({
            Id: update ? expense.Id : 0,
            CompanyId: 1,
            ExpenseTypeId: expenseType,
            Amount: amount,
            Remarks: remark,
            IsActive: true,
        })
        setIsLoading(true);
        var response = await (await request())
            .post(Api.Expenses.Save, strData)
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
                        placeholder="Expense Type"
                        label="Expense Type"
                        items={expenseTypes.map((expenseType) => ({
                            label: expenseType.ExpenseTypeName,
                            value: expenseType.Id,
                        }))}
                        onChangeItem={item => setExpenseType(item.value)}
                    />
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
                            saveExpense()
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

export default AddExpense;

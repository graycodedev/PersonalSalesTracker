import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ExpenseList = (props) => {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
    };

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Expenses.ActiveList)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setExpenses(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Expenses");
                }
            } else {
                ToastMessage.Short("Error Loading Expenses");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        props.navigation.setOptions({
            title: "Expenses",
        });
        getList();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getList();
            return () => {
                // Cleanup function (optional)
                // Additional cleanup logic (if needed)
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    style={{ width: "100%", backgroundColor: "#eee", flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {expenses.map((expense,index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.expenseItem}
                            onPress={() => props.navigation.navigate("ExpenseDetails", { expense })}
                        >
                            <View>
                                <Text style={styles.expenseInfo}>Expense Type: {expense.ExpenseTypeName}</Text>
                                <Text style={styles.expenseInfo}>Expense Amount: Rs.{expense.Amount}</Text>
                                <Text style={styles.expenseInfo}>Remarks: {expense.Remarks}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    props.navigation.navigate("AddExpense");
                }}
            >
                <BankingIcons.plus fill="white" />
            </TouchableOpacity>
        </View>
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
    expenseItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    expenseName: {
        fontSize: 20,
        fontWeight: '700',
    },
    expenseInfo: {
        fontSize: 16,
        color: "#333",
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        margin: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    circle: {
        backgroundColor: Colors.primary,
        width: 50,
        height: 50,
        position: "absolute",
        bottom: 20,
        right: 20,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ExpenseList;

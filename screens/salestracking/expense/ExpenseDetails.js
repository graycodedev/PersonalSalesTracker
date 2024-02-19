import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import DetailCard from "../../../components/DetailCard";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";

const ExpenseDetails = ({ navigation, route }) => {
    const { expense } = route.params;

    useEffect(() => {
        navigation.setOptions({
            title: expense.ExpenseTypeName + " Expense",
        });
    }, []);

    const expenseDetailsArray = [
        { Label: "Expenses Type", Value: expense.ExpenseTypeName },
        { Label: "Amount", Value: `Rs.${expense.Amount}` },
        { Label: "Remarks", Value: expense.Remarks },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={expenseDetailsArray} />
        </ScrollView>
    );
};

export default ExpenseDetails;

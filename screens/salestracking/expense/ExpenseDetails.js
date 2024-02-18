import React from "react";
import { ScrollView } from "react-native";
import DetailCard from "../../../components/DetailCard";
import { Colors } from "../../style/Theme";

const ExpenseDetails = ({ navigation, route }) => {
    const { expense } = route.params;

    const expenseDetails = [
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
            <DetailCard details={expenseDetails} />
        </ScrollView>
    );
};

export default ExpenseDetails;

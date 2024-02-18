import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";

const ExpenseDetails = ({ navigation, route }) => {
    const { expense } = route.params;
    useEffect(() => {
        navigation.setOptions({
            title: expense.ExpenseTypeName +" Expense",
        });
    }, [])


    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>

                <View style={styles.itemContainer}>

                    <View style={styles.item}>
                        <Text style={styles.expenseInfo}>Expenses Type:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.expenseData}>{expense.ExpenseTypeName}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.expenseInfo}>Amount:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.expenseData}>Rs.{expense.Amount}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.expenseInfo}>Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.expenseData}>{expense.Remarks}</Text>
                        </View>
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
    itemContainer: {
        backgroundColor: 'white',
        elevation: 2,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: "#fff",
        justifyContent: 'space-between',
        padding: 10,
    },
    expenseInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    expenseData: {
        fontSize: 20,
        textAlign: 'right'
    },
});

export default ExpenseDetails;

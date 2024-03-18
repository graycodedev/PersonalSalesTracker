import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import AppStyles from "../../../assets/theme/AppStyles";
import WarningModal from "../../../components/WarningModal";
import { Contact } from "../../../constants/Contact";
import * as BankingIcons from "../../../components/BankingIcons";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const PaymentDueList = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Payment Due",
        });
    }, []);

    const [paymentsDue, setPaymentsDue] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
        setIsLoading(false);
    };

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.PaymentDue.ListByParty)
                .catch(function (error) {
                    console.error("Error fetching Payment Due data:", error);
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code === 200) {
                    setPaymentsDue(response.data.Data.PaymentDueReportDetail);
                } else {
                    console.error("Error Loading Payment Due. Response:", response);
                    ToastMessage.Short("Error Loading Payment Due");
                }
            } else {
                console.error("Undefined response while fetching Payment Due data");
                ToastMessage.Short("Error Loading Payment Due");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useEffect(() => {
    }, [paymentsDue]);

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
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {paymentsDue.length>0 ? paymentsDue.map((paymentDue, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.paymentDueItem}
                            onPress={() =>
                                navigation.navigate("PaymentDueDetails", {
                                    paymentDueId: paymentDue.Id,
                                })
                            }
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 4,
                                }}
                            >
                                <View>
                                <Text
                                        style={[AppStyles.Text.BoldTitle]}
                                    >
                                    Party Name: {paymentDue?.PartyName}
                                    </Text>
                                    <Text
                                        style={[AppStyles.Text.BoldTitle, { marginBottom: 4 }]}
                                    >
                                        Order No: #{paymentDue.OrderNo}
                                    </Text>
                                    <Text style={styles.paymentDueInfo}>
                                        Due Days: {paymentDue.DueDate} days
                                    </Text>
                                    <Text style={styles.paymentDueInfo}>
                                        Total Amount: Rs.{paymentDue.TotalAmount}
                                    </Text>
                                    <Text style={styles.paymentDueInfo}>
                                        Amount Receivable: Rs.{paymentDue.AmountToBeReceived}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )): 
                    <View style={styles.noDataContainer}>
            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
            <Text style={[styles.noDataText, { fontSize: 20 }]}>No dues remaining</Text>
          </View>
                    }
                </ScrollView>
            )}
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
    paymentDueItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    paymentDueInfo: {
        fontSize: 16,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        margin: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
     noDataText: {
    fontSize: 20,
  },
   noDataContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default PaymentDueList;

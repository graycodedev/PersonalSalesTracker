import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import qs from "qs"

import Api from "../../../constants/Api";
import Spinner from "react-native-loading-spinner-overlay";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import * as BankingIcons from "../../../components/BankingIcons";
import WarningModal from "../../../components/WarningModal";

const ReturnDetails = ({ route, navigation }) => {
    const { returnItem } = route.params;
    const [returnDetails, setReturnDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            getDetail();
            return () => { };
        }, [])
    );

    useEffect(() => {
        getDetail();
        setIsLoading(false);
    }, []);

    const getDetail = async () => {
        var response = await (await request())
            .get(Api.Returns.Details + "?id=" + returnItem.Id)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setReturnDetails(response.data.Data);
            } else {
                ToastMessage.Short("Error Loading Return Detail");
            }
        } else {
            ToastMessage.Short("Error Loading Return Detail");
        }
    };

    const updateReturn = () => {
        navigation.navigate('RequestReturn', { update: true, return: returnDetails });
    };

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
                        <Text style={styles.returnInfo}>Return Reason:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.returnData}>{returnItem.ReturnReasonTitle}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.returnInfo}>Product:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.returnData}>{returnItem.ProductName}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.returnInfo}>Quantity:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.returnData}>{returnItem.Quantity}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.returnInfo}>Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.returnData}>{returnItem.Remarks}</Text>
                        </View>
                    </View>

                </View>

                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                        onPress={() => {
                            updateReturn()
                        }}
                    >
                        <BankingIcons.Edit fill={"white"} height={25} width={25} />
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
    returnInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    returnData: {
        fontSize: 20,
        textAlign: 'right'
    },
    circle: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    buttons: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1,
    }
});

export default ReturnDetails;

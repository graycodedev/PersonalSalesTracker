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

const AdvanceDetails = ({ route, navigation }) => {
    const { advance } = route.params;
    const [advanceDetails, setAdvanceDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
            .get(Api.Advance.Details + "?id=" + advance.Id)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setAdvanceDetails(response.data.Data);
            } else {
                ToastMessage.Short("Error Loading Advance Detail");
            }
        } else {
            ToastMessage.Short("Error Loading Advance Detail");
        }
    };

    const deleteAdvance = async () => {
        let data = qs.stringify({
            id: advance.Id,
        });
        var response = await (await request())
            .post(Api.Advance.Delete, data)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setShowConfirmDelete(false);
                ToastMessage.Short(response.data.Message);
                navigation.goBack();
            } else {
                ToastMessage.Short("Error deleting the advance");
            }
        } else {
            ToastMessage.Short("Error deleting the advance");
        }
    };

    const updateAdvance = () => {
        navigation.navigate('RequestAdvance', { update: true, advance: advanceDetails });
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
                        <Text style={styles.advanceInfo}>Amount:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.advanceData}>Rs. {advance.Amount}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.advanceInfo}>For:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.advanceData}>{advance.ForDate}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.advanceInfo}>Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.advanceData}>{advance.Remarks}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.advanceInfo}>Status:</Text>
                        <View style={styles.dataView}>
                            {advance.IsApproved && <Text style={styles.advanceData}>Approved</Text>}
                            {advance.IsCancelled && <Text style={styles.advanceData}>Cancelled</Text>}
                            {!advance.IsApproved && !advance.IsCancelled && <Text style={styles.advanceData}>Pending</Text>}
                        </View>
                    </View>

                </View>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                    onPress={() => {
                        updateAdvance()
                    }}
                >
                    <BankingIcons.Edit fill={"white"} height={25} width={25} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.circle, { backgroundColor: "#FF5F7F" }]}
                    onPress={() => {
                        setShowConfirmDelete(true)
                    }}
                >
                    <BankingIcons.DeleteIcon fill="white" />
                </TouchableOpacity>
            </View>
            {showConfirmDelete && (
                <WarningModal
                    text1={"Delete Advance?"}
                    text2={"Are you sure you want to delete the advance?"}
                    onConfirm={deleteAdvance}
                    onCancel={() => {
                        setShowConfirmDelete(false)
                    }}
                    warning
                />
            )}
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
    advanceInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    advanceData: {
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

export default AdvanceDetails;

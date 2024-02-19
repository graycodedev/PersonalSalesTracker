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

const VisitDetails = (props) => {
    const { visit } = props.route.params;
    const [visitDetails, setVisitDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            getDetail();
            return () => { };
        }, [])
    );

    useEffect(() => {
        props.navigation.setOptions({
            title: "Visit Details",
        });
        getDetail();
        setIsLoading(false);
    }, []);

    const getDetail = async () => {
        var response = await (await request())
            .get(Api.Visits.Details + "?id=" + visit.Id)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setVisitDetails(response.data.Data);
            } else {
                ToastMessage.Short("Error Loading Visit Detail");
            }
        } else {
            ToastMessage.Short("Error Loading Visit Detail");
        }
    };

    const deleteVisit = async () => {
        let data = qs.stringify({
            id: visit.Id,
        });
        var response = await (await request())
            .post(Api.Visits.Delete, data)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setShowConfirmDelete(false);
                ToastMessage.Short(response.data.Message);
                props.navigation.goBack();
            } else {
                ToastMessage.Short("Error deleting the visit");
            }
        } else {
            ToastMessage.Short("Error deleting the visit");
        }
    };

    const updateVisit = () => {
        props.navigation.navigate('AddVisit', { update: true, visit: visitDetails });
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
                        <Text style={styles.visitInfo}>Name:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.visitData}>{visit.PartyName ? visit.PartyName : visit.LocationName}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.visitInfo}>Visit Date:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.visitData}>{visit.VisitDate}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.visitInfo}>Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.visitData}>{visit.Remarks}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                    onPress={() => {
                        updateVisit()
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
                    text1={"Delete Visit?"}
                    text2={"Are you sure you want to delete the visit?"}
                    onConfirm={deleteVisit}
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
    visitInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    visitData: {
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

export default VisitDetails;
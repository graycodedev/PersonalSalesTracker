import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import AppStyles from "../../../assets/theme/AppStyles";
import DetailCard from "../../../components/DetailCard";

const ReturnDetails = ({ route, navigation }) => {
    const { returnItem } = route.params;

    useEffect(() => {
        navigation.setOptions({
            title: "Return Details",
        });
    }, []);

    const returnDetailsArray = [
        { Label: "Return Reason", Value: returnItem.ReturnReasonTitle },
        { Label: "Product", Value: returnItem.ProductName },
        { Label: "Quantity", Value: returnItem.Quantity.toString() },
        { Label: "Remarks", Value: returnItem.Remarks },
    ];

    const updateReturn = () => {
        navigation.navigate('RequestReturn', { update: true, return: returnItem });
    };

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={returnDetailsArray} />

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, { marginBottom: 8, backgroundColor: Colors.primary }]}
                    onPress={updateReturn}
                >
                    <BankingIcons.Edit fill={"white"} height={25} width={25} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    buttons: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 1,
    },
    circle: {
        backgroundColor: "white",
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ReturnDetails;

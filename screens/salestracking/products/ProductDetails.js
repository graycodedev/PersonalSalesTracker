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

const ProductDetails = ({ navigation, route }) => {
    useEffect(() => {
        navigation.setOptions({
            title: product.ProductName,
        });
    }, [])

    const { product } = route.params;

    const productDetails = [
        {
            Label: "Product Name",
            Value: product.ProductName
        },
        {
            Label: "Product Code",
            Value: product.ProductCode
        },
        {
            Label: "Min. Selling Price",
            Value: `Rs.${product.MinimumSellingPrice}`
        },
        {
            Label: "Max. Selling Price",
            Value: `Rs.${product.MaximumSellingPrice}`
        },
        {
            Label: "Prefered Selling Price",
            Value: `Rs.${product.PreferedSellingPrice}`
        },
        {
            Label: "Note",
            Value: product.Note
        },
    ];

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <DetailCard details={productDetails} />
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

export default ProductDetails;

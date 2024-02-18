import React from "react";
import { ScrollView } from "react-native";
import DetailCard from "../../../components/DetailCard";
import { Colors } from "../../style/Theme";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import * as BankingIcons from "../../../components/BankingIcons";

const ProductDetails = ({ navigation, route }) => {
    const { product } = route.params;

    const productDetails = [
        { Label: "Product Name", Value: product.ProductName },
        { Label: "Product Code", Value: product.ProductCode },
        { Label: "Min. Selling Price", Value: `Rs.${product.MinimumSellingPrice}` },
        { Label: "Max. Selling Price", Value: `Rs.${product.MaximumSellingPrice}` },
        { Label: "Preferred Selling Price", Value: `Rs.${product.PreferedSellingPrice}` },
        { Label: "Note", Value: product.Note },
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

export default ProductDetails;

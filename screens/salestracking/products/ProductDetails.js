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

const ProductDetails = ({ navigation, route }) => {
    useEffect(() => {
        navigation.setOptions({
            title: product.name,
        });
    }, [])

    const { product } = route.params;


    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>

                <View style={styles.itemContainer}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={product.image} style={styles.productImage} />
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.productInfo}>Product Name:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.productData}>{product.name}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.productInfo}>Product Code:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.productData}>{product.code}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.productInfo}>Marked price:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.productData}>Rs.{product.MP}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.productInfo}>Selling Price:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.productData}>Rs.{product.SP}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.productInfo}>Remarks:</Text>
                        <View style={styles.dataView}>
                            <Text style={styles.productData}>{product.remark}</Text>
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
    productInfo: {
        fontSize: 20,
    },
    dataView: {
        width: '50%'
    },
    productData: {
        fontSize: 20,
        textAlign: 'right'
    },
    productImage: {
        height: 200,
        width: 200,
    },
});

export default ProductDetails;
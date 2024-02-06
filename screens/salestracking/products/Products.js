import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Products = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
    };

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Products.ActiveList)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });


            if (response != undefined) {
                if (response.data.Code == 200) {
                    setProducts(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Products");
                }
            } else {
                ToastMessage.Short("Error Loading Products");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getList();
            return () => {
                // Cleanup function (optional)
                // Additional cleanup logic (if needed)
            };
        }, [])
    );

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
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {products.map((product, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.productItem}
                            onPress={() => navigation.navigate("ProductDetails", { product })}
                        >
                            <Image source={product.productImagePath} style={styles.productImage} />
                            <View>
                                <Text style={styles.productName}>{product.ProductName}</Text>
                                <Text style={styles.productInfo}>Product Code: {product.ProductCode}</Text>
                                <Text style={styles.productInfo}>Marked Price: Rs.{product.MaximumSellingPrice}</Text>
                                <Text style={styles.productInfo}>Selling Price: Rs.{product.PreferedSellingPrice}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
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
    productItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        height: 60,
        width: 60,
    },
    productName: {
        fontSize: 20,
        fontWeight: '700',
    },
    productInfo: {
        fontSize: 16,
        color: "#333",
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        margin: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
    circle: {
        backgroundColor: Colors.primary,
        width: 50,
        height: 50,
        position: "absolute",
        bottom: 20,
        right: 20,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Products;

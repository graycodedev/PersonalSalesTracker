import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";

const Products = ({ navigation }) => {
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Product 1",
            image: require("../../../assets/imgs/khalti.png"),
            MP: 50,
            SP: 40,
            remark: "Discounted",
            code: "1234"
        },
        {
            id: 2,
            name: "Product 2",
            image: require("../../../assets/imgs/adslLogo.png"),
            MP: 60,
            SP: 55,
            remark: "New",
            code: "2345"
        },
    ]);



    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View>
                    {products.map((product) => (
                        <TouchableOpacity key={product.id} style={styles.productItem}
                            onPress={() =>
                                navigation.navigate("ProductDetails", { product })
                            }
                        >
                            <Image source={product.image} style={styles.productImage} />
                            <View>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productInfo}>Product Code: {product.code}</Text>
                                <Text style={styles.productInfo}>Marked Price: Rs.{product.MP}</Text>
                                <Text style={styles.productInfo}>Selling Price: Rs.{product.SP}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
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
});

export default Products;
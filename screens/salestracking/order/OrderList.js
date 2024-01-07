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

const OrdersList = ({ navigation }) => {

    useEffect(() => {
        navigation.setOptions({
            title: "Order List",
        });
    }, [])

    const [orders, setOrders] = useState([
        {
            value: 0,
            name: "HP Omen 5",
            price: "98000",
            type: "Gaming (HP)",
            image: require("../../../assets/imgs/khalti.png"),
        },
        {
            value: 1,
            name: "HP Omen 9",
            price: "120000",
            type: "Gaming (HP)",
            image: require("../../../assets/imgs/adslLogo.png"),
        },
        {
            value: 2,
            name: "HP pavillion 56",
            price: "70000",
            type: "Notebook (HP)",
            image: require("../../../assets/imgs/adslLogo.png"),
        },
        {
            value: 3,
            name: "HP pavillion 80",
            price: "129000",
            type: "Notebook (HP)",
            image: require("../../../assets/imgs/adslLogo.png"),
        },
        {
            value: 4,
            name: "Lenovo g553",
            price: "30000",
            type: "Notebook (Lenovo)",
            image: require("../../../assets/imgs/adslLogo.png"),
        },
        {
            value: 5,
            name: "Lenovo g556",
            price: "50000",
            type: "Notebook (Lenovo)",
            image: require("../../../assets/imgs/adslLogo.png"),
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%", backgroundColor: "#eee" }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.container}>
                    <View>
                        {orders.map((order) => (
                            <TouchableOpacity
                                key={order.value}
                                style={styles.orderItem}
                                onPress={() =>
                                    navigation.navigate("OrderDetails", { order })
                                }
                            >
                                <Image source={order.image} style={styles.orderImage} />
                                <View>
                                    <Text style={styles.orderName}>{order.name}</Text>
                                    <Text style={styles.orderInfo}>{`Price: Rs. ${order.price} (per PC)`}</Text>
                                    <Text style={styles.orderInfo}>{`Type: ${order.type}`}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.circle}
                onPress={() =>
                    navigation.navigate("AddOrder", { orders })
                }
            >
                <BankingIcons.plus fill="white" />
            </TouchableOpacity>
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
    orderItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderImage: {
        height: 60,
        width: 60,
        marginRight: 15,
    },
    orderName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    orderInfo: {
        fontSize: 16,
    },
    circle: {
        backgroundColor: Colors.primary,
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});

export default OrdersList;

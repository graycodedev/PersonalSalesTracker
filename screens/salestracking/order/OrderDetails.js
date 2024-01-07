import React, { useEffect, useState } from "react";
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

const OrderDetails = ({ navigation }) => {
    const [orders, setOrders] = useState([
        {
            value: 0,
            name: "Product 1",
            price: "Rs. 200",
            type: "Electronics",
        },
        {
            value: 1,
            name: "Product 2",
            price: "Rs. 150",
            type: "Clothing",
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);

    return (
        <View>
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
                                <Text style={styles.orderName}>{order.name}</Text>
                                <Text style={styles.orderInfo}>{`Price: ${order.price}`}</Text>
                                <Text style={styles.orderInfo}>{`Type: ${order.type}`}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View>
                <TouchableOpacity
                    style={styles.circle}
                    onPress={() => {
                        navigation.navigate('AddOrder', { orderNames: orders.map(order => order.name) });
                    }}
                >
                    <BankingIcons.plus fill="white" />
                </TouchableOpacity>
            </View>
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

export default OrderDetails;

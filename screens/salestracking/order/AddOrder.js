import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
} from "react-native";
import { CustomDropdown } from "../../../components/CustomDropdown";
import { ButtonPrimary } from "../../../components/Button";
import { ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RegularInputText } from "../../../components/Input";
import { Colors } from "../../style/Theme";

const AddOrder = ({ navigation, route }) => {
    const { selectedOrder, orders } = route.params || {};
    const { name, price, type, image } = selectedOrder || {};

    const [selectedParty, setSelectedParty] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProductName, setSelectedProductName] = useState(null);
    const [selectedProductPrice, setSelectedProductPrice] = useState(null);
    const [quantity, setQuantity] = useState('');

    const [selectedProducts, setSelectedProducts] = useState([]);

    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [applyVAT, setApplyVAT] = useState(false);

    const handleSubmit = () => {

        if (selectedProductName && selectedProductPrice && quantity) {
            const newProduct = {
                name: selectedProductName,
                price: selectedProductPrice,
                quantity: quantity,
            };

            setSelectedProducts((prevProducts) => [...prevProducts, newProduct]);

            setSelectedProductName(null);
            setSelectedProductPrice(null);
            setQuantity('');
        }

        setModalVisible(false);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || selectedDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
    };

    const formattedDate = selectedDate.toLocaleDateString("en-UK", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                {/* <CustomDropdown
                    items={orders.map((order, index) => ({
                        label: order.name,
                        value: index,
                    }))}
                    placeholder="Select Party"
                    searchablePlaceholder="Search Party"
                    itemSelected={(item) => setSelectedParty(item.value)}
                /> */}

                <View>
                    <Text style={{ fontFamily: "Medium", marginTop: 10, marginBottom: -5 }}>
                        Date:
                    </Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <RegularInputText
                            key="date"
                            placeholder="Date"
                            value={formattedDate}
                            editable={false}
                        />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                </View>

                <View style={styles.ordersView}>
                    <Text style={{ marginBottom: 10 }}>Products</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                        {selectedProducts.map((product, index) => (
                            <View key={index} style={styles.orderItem}>
                                <Text style={styles.orderName}>{product.name}</Text>
                                <Text style={styles.orderInfo}>{product.quantity} at Rs.{product.price}</Text>
                            </View>
                        ))}
                        {selectedProducts.length === 0 && (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontFamily: "Medium", color: "#9A9A9A", fontSize: 20 }}>
                                    + Empty! Click below to Add Products
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <ButtonPrimary title={"Add Product"} />
                        <ActivityIndicator
                            animating={isLoading}
                            color="#ffa500"
                            style={styles.activityIndicator}
                        />
                    </TouchableOpacity>

                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={styles.modalContainer}>
                                {selectedProductName ? (
                                    <>
                                        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
                                            {selectedProductName}
                                        </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                            <Text style={{ fontSize: 20, marginRight: 20 }}>
                                                Price: Rs. {selectedProductPrice}
                                            </Text>
                                            <Text style={{ fontSize: 18, marginRight: 10 }}>Quantity:</Text>
                                            <TextInput
                                                style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, paddingLeft: 10, width: 80 }}
                                                keyboardType="numeric"
                                                placeholder="Enter Qty"
                                                onChangeText={(text) => setQuantity(text)}
                                            />
                                        </View>
                                        <Text style={{ fontSize: 20, marginBottom: 10 }}>
                                            Final Amount: Rs. {selectedProductPrice * quantity}
                                        </Text>
                                        <View style={{ flexDirection: 'row', marginHorizontal: 10, alignSelf: 'flex-end', }}>
                                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                                <Text style={{ fontSize: 20, color: Colors.primary, marginRight: 15, }}>Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={handleSubmit}>
                                                <Text style={{ fontSize: 20, color: Colors.primary }}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                                            Select a Product
                                        </Text>
                                        {/* {orders.map((order) => (
                                            <TouchableOpacity
                                                key={order.value}
                                                onPress={() => {
                                                    setSelectedProductName(order.name);
                                                    setSelectedProductPrice(order.price);
                                                    setQuantity('1');
                                                }}
                                            >
                                                <Text style={{ fontSize: 18, marginBottom: 10 }}>{order.name}</Text>
                                            </TouchableOpacity>
                                        ))} */}
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                                            <Text style={{ fontSize: 18, color: "red", marginTop: 10 }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </Modal>
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
    scrollView: {
        height: 250,
        flex: 1,
    },
    ordersView: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginVertical: 30,
        padding: 10,
    },
    activityIndicator: {
        marginTop: 10,
    },
    modalContainer: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: "white",
        padding: 20,
        height: 350,
        width: 350,
    },
    orderItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        alignItems: 'flex-start',
    },
    orderName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    orderInfo: {
        fontSize: 16,
    },
});

export default AddOrder;

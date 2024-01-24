import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { RegularInputText } from "../../../components/Input";
import DropDownPicker from "react-native-dropdown-picker";
import { ActivityIndicator } from "react-native";
import { ButtonPrimary } from "../../../components/Button";
import qs from "qs";
import Api from "../../../constants/Api";
import ToastMessage from "../../../components/Toast/Toast";
import request from "../../../config/RequestManager";

const ReturnOrder = (props) => {
    const update = props.route.params?.update;
    const returnItem = props.route.params?.returnItem;
    const [remark, setRemark] = useState(returnItem?.Remarks);
    const [returnReason, setReturnReason] = useState(returnItem?.ReturnReasonTitle);
    const [productName, setProductName] = useState(returnItem?.ProductName);
    const [quantity, setQuantity] = useState(returnItem?.Quantity);
    const [isLoading, setIsLoading] = useState(false);
    const [returnReasons, setReturnReasons] = useState([]);
    const [productNames, setProductNames] = useState([]);

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: update ? "Update Order Return" : "Return Order",
        });
        fetchReturnReasons();
        fetchProductNames();
    }, []);

    const fetchReturnReasons = async () => {
        var response = await (await request())
            .get(Api.ReturnReasons.List)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setReturnReasons(response.data.Data);
            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error! Contact Support");
        }
    };

    const fetchProductNames = async () => {
        var response = await (await request())
            .get(Api.Products.List)
            .catch(function (error) {
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setProductNames(response.data.Data);
            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error! Contact Support");
        }
    };

    const saveReturn = async () => {
        let strData = qs.stringify({
            Id: update ? returnItem.Id : 0,
            CompanyId: 1,
            UserId: 0,
            ReturnReasonTitle: returnReason,
            ProductName: productName,
            Quantity: quantity,
            Remarks: remark,
            AddedBy: 0,
            AddedOn: new Date(),
            IsApproved: false,
            IsCancelled: false,
        })
        setIsLoading(true);
        var response = await (await request())
            .post(Api.Returns.Save, strData)
            .catch(function (error) {
                setIsLoading(false);
                ToastMessage.Short("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setIsLoading(false);
                navigation.goBack();
                return response.data.Data;
            } else {
                ToastMessage.Short(response.data.Message);
            }
        } else {
            ToastMessage.Short("Error! Contact Support");
        }
        setIsLoading(false);
    }

    const isFormFilled = remark && returnReason && productName && quantity;

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View style={{ marginBottom: 10 }}>
                    <DropDownPicker
                        containerStyle={{ height: 50 }}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            fontFamily: "Regular",
                            borderColor: "#fff",
                            borderWidth: 0,
                        }}
                        itemStyle={{
                            justifyContent: "flex-start",
                            fontFamily: "Medium",
                            color: "red",
                        }}
                        labelStyle={{
                            fontFamily: "Medium",
                            color: "#9A9A9A",
                        }}
                        arrowColor={"#9A9A9A"}
                        placeholder="Return Reason"
                        label="Return Reason"
                        items={returnReasons.map((returnReason) => ({
                            label: returnReason.ReturnReasonTitle,
                            value: returnReason.Id,
                        }))}
                        onChangeItem={item => setReturnReason(item.value)}
                    />
                </View>

                <View style={{ marginBottom: 10 }}>
                    <DropDownPicker
                        containerStyle={{ height: 50 }}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 10,
                            fontFamily: "Regular",
                            borderColor: "#fff",
                            borderWidth: 0,
                        }}
                        itemStyle={{
                            justifyContent: "flex-start",
                            fontFamily: "Medium",
                            color: "red",
                        }}
                        labelStyle={{
                            fontFamily: "Medium",
                            color: "#9A9A9A",
                        }}
                        arrowColor={"#9A9A9A"}
                        placeholder="Product Name"
                        label="Product Name"
                        items={productNames.map((product) => ({
                            label: product.ProductName,
                            value: product.Id,
                        }))}
                        onChangeItem={item => setProductName(item.value)}
                    />
                </View>

                <View>
                    <RegularInputText
                        key="quantity"
                        placeholder="Quantity"
                        onChangeText={(text) => {
                            setQuantity(text)
                        }}
                        value={quantity}
                        keyboardType="numeric"
                    />
                </View>

                <View>
                    <RegularInputText
                        key="remark"
                        placeholder="Remarks"
                        onChangeText={(text) => {
                            setRemark(text)
                        }}
                        value={remark}
                        multiline={true}
                        numberOfLines={5}
                        style={{ height: 100, alignItems: 'flex-start', borderWidth: 0 }}
                    />
                </View>

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (isFormFilled) {
                                saveReturn();
                            }
                        }}
                        disabled={!isFormFilled}
                    >
                        <ButtonPrimary title={update ? "Update" : "Save"} />
                        <ActivityIndicator
                            animating={isLoading}
                            color="#ffa500"
                            style={styles.activityIndicator}
                        ></ActivityIndicator>
                    </TouchableOpacity>
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
});

export default ReturnOrder;

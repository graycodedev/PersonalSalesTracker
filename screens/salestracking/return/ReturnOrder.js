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
import { AutoCompleteList } from "../../../components/AutoCompleteList";
import Toast from "../../../components/Toast";

const ReturnOrder = (props) => {
    const update = props.route.params?.update;
    const returnItem = props.route.params?.returnItem;
    console.log("item",returnItem)
    const [remark, setRemark] = useState(returnItem?.Remarks);
    const [returnReason, setReturnReason] = useState();
    const [productName, setProductName] = useState();
    const [quantity, setQuantity] = useState(returnItem?.Quantity);
    const [isLoading, setIsLoading] = useState(false);
    const [returnReasons, setReturnReasons] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [showPartiesList, setShowPartiesList] = useState(false);
    const [selectedParty, setSelectedParty] = useState();
    const [toastMessage, setToastMessage]= useState("");

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: update ? "Update Order Return" : "Return Order",
        });
        if(update){
            setReturnReason({value: returnItem?.OrderReturnReasonId, label: returnItem?.ReturnReasonTitle});
            setProductName({value: returnItem?.ProductId, label: returnItem?.ProductName});
        }
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

    const updateSelectedParty = (item) => {
        setSelectedParty(item);
        setShowPartiesList(false);
      };
    
      const onClose = () => {
        setShowPartiesList(false);
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
        console.log("REason",returnReason)
        let strData = qs.stringify({
            Id: update ? returnItem.Id : 0,
            OrderReturnReasonId: returnReason.value,
            ProductId: productName.value,
            Quantity: quantity,
            Remarks: remark,
            PartyId: update?returnItem?.PartyId:selectedParty.Id, 
        }); 
        console.log(strData);
        setIsLoading(true);
        var response = await (await request())
            .post(Api.Returns.Save, strData)
            .catch(function (error) {
                setIsLoading(false);
                setToastMessage("Error! Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setIsLoading(false);
                navigation.goBack();
                return response.data.Data;
            } else {
                setToastMessage(response.data.Message);
            }
        } else {
            setToastMessage("Error! Contact Support");
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
            <View style={{ marginBottom: 15, zIndex: 98 }}>
          <TouchableOpacity
            onPress={() => setShowPartiesList(true)}
            style={{
              paddingLeft: 10,
              paddingVertical: 14,
              backgroundColor: "white",
              borderRadius: 5,
            }}
          >
            <Text style={{ fontFamily: "Regular", fontSize: 14 }}>
              {" "}
              {!selectedParty ? update?returnItem?.PartyName??"No Party Name":"Add Party" : selectedParty.PartyName}
            </Text>
          </TouchableOpacity>
          {showPartiesList && (
            <AutoCompleteList
              autocompleteurl={Api.Parties.List}
              noItemFoundText={"No parties found!"}
              searchablePlaceholder="Search Party"
              itemSelected={updateSelectedParty}
              visible={showPartiesList}
              onClose={() => onClose()}
              renderItem={(item) => (
                <View style={styles.item}>
                  <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>
                    {item.PartyName}
                  </Text>
                  <Text style={{ fontFamily: "SemiBold", fontSize: 14 }}>
                    {item.ContactPersonName}
                  </Text>
                  <Text style={{ fontFamily: "Regular", fontSize: 14 }}>
                    {item.Email}
                  </Text>
                </View>
              )}
            />
          )}
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
                        placeholder={update?returnReason?.label:"Return Reason"}
                        label="Return Reason"
                        items={returnReasons.map((returnReason) => ({
                            label: returnReason.ReturnReasonTitle,
                            value: returnReason.Id,
                        }))}
                        onChangeItem={item => setReturnReason(item)}
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
                        placeholder={update?productName?.label:"Product Name"}
                        label="Product Name"
                        items={productNames.map((product) => ({
                            label: product.ProductName,
                            value: product.Id,
                        }))}
                        onChangeItem={item => setProductName(item)}
                    />
                </View>

                <View>
                    <RegularInputText
                        key="quantity"
                        placeholder={update?quantity.toString():"Quantity"}
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
            {toastMessage.length>0  && <Toast message={toastMessage} isVisible={toastMessage.length>0} />}
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
    item: {
        padding: 8,
        borderBottomColor: "#e2e2e2",
        borderBottomWidth: 1,
        marginBottom: 5,
        backgroundColor: "#fff",
        paddingLeft: 18,
      },
});

export default ReturnOrder;

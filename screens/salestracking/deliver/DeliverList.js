import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { ButtonPrimary } from "../../../components/Button";
import { useFocusEffect } from "@react-navigation/native";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import DateDisplay from "../../../components/DateDisplay";
import AppStyles from "../../../assets/theme/AppStyles";
import WarningModal from "../../../components/WarningModal";

import qs from "qs"

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const DeliverList = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            title: "Orders to Deliver",
        });
    }, [])

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showConfirmDelivery, setShowConfirmDelivery]= useState(false);
    const [selectedOrderId, setSelectedOrderId]= useState();

    const onRefresh = () => {
        wait(2000).then(() => {
            setRefreshing(false);
            getList();
        });
        setIsLoading(false);
    };

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Dispatch.DispatchedList)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });
            if (response != undefined) {
                if (response.data.Code == 200) {
                    console.log(response.data.Data[0])
                    setOrders(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Notes");
                }
            } else {
                ToastMessage.Short("Error Loading Notes");
            }
        } finally {
            // alert("finallu");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getList();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true)
            getList();
            return () => {
                // Cleanup function (optional)
                // Additional cleanup logic (if needed)
            };
        }, [])
    );

     const confirmDelivery =async()=>{
        await deliverOrder();
        // products.splice(deleteIndex, 1);
        // setSelectedProducts(products);
       
    }
    const deliverOrder = async (id) => {
        console.log("dfd", Api.Deliver.Save + "?id=" + selectedOrderId)
        var response = await (await request())
          .post(Api.Deliver.Save , qs.stringify({id: selectedOrderId}))
          .catch(function (error) {
            
            ToastMessage.Short("Error! Contact Support");
          });
        if (response != undefined) {
          if (response.data.Code == 200) {
            ToastMessage.Short(response.data.Message);
            await getList();
            setShowConfirmDelivery(false); 
          } else {
            ToastMessage.Short("Error delivering the order");
          }
        } else {
          ToastMessage.Short("Error delivering the order");
        }
      };

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
                    {orders.length> 0 && orders.map((order) => (
                        <TouchableOpacity
                            key={order.value}
                            style={styles.orderItem}
                            onPress={() => navigation.navigate("DeliverDetails", { deliverId: order.Id })}
                        >
                            <View>
                                <Text style={[AppStyles.Text.BoldTitle, {marginBottom:4}]}>{order.CompanyName}</Text>
                                <Text style={[styles.orderInfo, {color: "#040273"}]}>#{order.OrderNo} </Text>
                                
                                <Text style={styles.orderInfo}>Delivery Date:<DateDisplay date={order.EstimatedDeliveryDate} /> </Text>
                            </View>
                            <TouchableOpacity style={{flexDirection:'row', alignItems:'center', borderColor: Colors.primary, borderWidth: 1, justifyContent:"center",  padding: 4, borderRadius: 4}} onPress={()=>{
                                setSelectedOrderId(order.Id); 
                                setShowConfirmDelivery(true);
                            }}>
                                <Text style={[styles.orderInfo, {color: "#040273", fontFamily:"SemiBold"}]}>deliver</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )
                    
                    )}

{orders.length==0 && 

<View style={{alignItems:"center"}}>
    <BankingIcons.warning height={60} width={60} fill={"#FFD21E"} />
    <Text style={[AppStyles.Text.BoldTitle, {fontSize: 20}]}>No deliverable orders found!!</Text>
</View>
}
                </ScrollView>
            )}
             {showConfirmDelivery && (
            <WarningModal
              text1={"Deliver the order?"}
              text2={"Do you want to mark the order as delivered?"}
              onConfirm={confirmDelivery}
              onCancel={() => {
                setShowConfirmDelivery(false)
              }}
            />
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
    orderItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent:'space-between'
    },
    orderImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
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
        position: "absolute",
        bottom: 20,
        right: 20,
        borderRadius: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: "center",
        margin: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
    },
});

export default DeliverList;
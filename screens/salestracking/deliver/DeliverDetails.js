import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import * as BankingIcons from "../../../components/BankingIcons";
import { ButtonPrimary } from "../../../components/Button";
import { RegularInputText } from "../../../components/Input";
import { Colors } from "../../style/Theme";
import Api from "../../../constants/Api";
import WarningModal from "../../../components/WarningModal";
import ToastMessage from "../../../components/Toast/Toast";
import request from "../../../config/RequestManager";
import qs from "qs";
import Spinner from "react-native-loading-spinner-overlay";
import helpers from "../../../constants/Helpers";

const DeliverDetails = ({ navigation, route }) => {
  const [deliver, setDeliver] = useState();
  const deliverId = route?.params?.deliverId;
  const [isLoading, setIsLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showPartiesList, setShowPartiesList] = useState(false);
  const [showConfirmDelivery, setShowConfirmDelivery] = useState(false);
  const [notes, setNotes] = useState("");
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      title: "Order Details",
    });
    if (deliverId) {
      setDeliveryDate(new Date());
    } else {
      var today = new Date();
      var tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      setDeliveryDate(tomorrow);
    }

    (async () => await getDetail())();
    setIsLoading(false);
  }, []);

  const getDetail = async () => {
    let userId = await helpers.GetUserId();
    setUserId(userId);
    var response = await (await request())
      .get(Api.Orders.Details + "?id=" + deliverId)
      .catch(function (error) {
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        setDeliver(response.data.Data);
      } else {
        ToastMessage.Short("Error Loading Deliver Details");
      }
    } else {
      ToastMessage.Short("Error Loading Deliver Details");
    }
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

  const confirmDelivery = async () => {
    await deliverOrder();
  };

  const deliverOrder = async (id) => {
    var response = await (await request())
      .post(Api.Deliver.Save, qs.stringify({ id: deliverId }))
      .catch(function (error) {
        ToastMessage.Short("Error! Contact Support");
      });
    if (response != undefined) {
      if (response.data.Code == 200) {
        setShowConfirmDelivery(false);
        navigation.goBack();
      } else {
        ToastMessage.Short(response.data.Message);
      }
    } else {
      ToastMessage.Short("Error delivering the order");
    }
  };

  return (
    <ScrollView
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", backgroundColor: "#eee" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {!isLoading && deliver ? (
        <>
          <View style={styles.container}>
            <View>
              <Text
                style={{ fontFamily: "Medium", marginTop: 10, marginBottom: 4 }}
              >
                Delivery Date:
              </Text>
              {deliver?.EstimatedDeliveryDate && (
                <View>
                  <RegularInputText
                    key="deliverydate"
                    placeholder="Date"
                    value={new Date(
                      deliver.EstimatedDeliveryDate
                    ).toLocaleDateString("en-UK", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                    editable={false}
                  />
                </View>
              )}
            </View>
            <View style={{ marginBottom: 15, zIndex: 99 }}>
              <View
                style={[styles.addDashedBox, { width: "100%" }]}
                onPress={() => setShowPartiesList(true)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: "Regular", fontSize: 16 }}>
                    {" "}
                    {deliver.PartyOutputVM.PartyName}
                  </Text>
                </View>
              </View>
            </View>

            {deliver?.OrderDetailOutputVM && (
              <View style={styles.ordersView}>
                <Text
                  style={{
                    fontFamily: "SemiBold",
                    fontSize: 16,
                    marginBottom: 4,
                  }}
                >
                  Products
                </Text>
                <View>
                  {deliver?.OrderDetailOutputVM.map((product, index) => (
                    <TouchableOpacity key={index} style={styles.orderItem}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={styles.orderName}>
                          {product?.ProductName ?? "n/a"}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text style={styles.orderInfo}>
                            Qty: {product.SoldQuantity}{" "}
                          </Text>
                          <Text style={styles.orderInfo}>
                            Rate: Rs.{product.Rate.toFixed(2)}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.orderInfo,
                              { fontSize: 16, fontFamily: "SemiBold" },
                            ]}
                          >
                            Rs.
                            {(product.SoldQuantity * product.Rate).toFixed(2)}{" "}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {deliver?.OrderDetailOutputVM && (
              <View
                style={{
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: "black",
                  padding: 8,
                  marginVertical: 8,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>
                    Qty:
                  </Text>

                  <Text
                    style={{
                      fontFamily: "SemiBold",
                      fontSize: 16,
                      marginLeft: 4,
                    }}
                  >
                    {deliver?.OrderDetailOutputVM.reduce(
                      (sum, item) => sum + item.SoldQuantity,
                      0
                    )}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontFamily: "SemiBold", fontSize: 16 }}>
                    Total Amount:
                  </Text>

                  <Text
                    style={{
                      fontFamily: "SemiBold",
                      fontSize: 16,
                      marginLeft: 4,
                    }}
                  >
                    {deliver?.OrderDetailOutputVM.reduce(
                      (sum, item) => sum + item.SoldQuantity * item.Rate,
                      0
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}

            <RegularInputText
              key="notes"
              placeholder="Notes"
              onChangeText={(text) => {
                setNotes(text);
              }}
              value={deliver.CustomerNote}
              multiline={true}
              numberOfLines={5}
              style={{ height: 100, alignItems: "flex-start", borderWidth: 0 }}
              editable={false}
            />

            {deliver?.IsDispatched &&
              !deliver?.IsCancelled &&
              !deliver?.IsDelivered &&
              userId != 0 &&
              userId == deliver?.DeliveryPersonUserId && (
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmDelivery(true);
                  }}
                >
                  <ButtonPrimary title={"CONFIRM DELIVERY"} />
                </TouchableOpacity>
              )}

<View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.circle, {backgroundColor:Colors.primary}]}
                    onPress={()=>{
                      navigation.navigate("AddOrder", {orderId:deliverId})
                  }}
                >
                  
                    <BankingIcons.Edit fill="white" height={25} width={25}/>
                </TouchableOpacity>
               
            </View>
          </View>

          {showConfirmDelivery && (
            <WarningModal
              text1={"Delete Order Item?"}
              text2={"Are you sure you want to delete this order?"}
              onConfirm={confirmDelivery}
              onCancel={() => {
                setShowConfirmDelivery(false);
              }}
              warning
            />
          )}
        </>
      ) : (
        <Spinner
          color={Colors.primary}
          visible={isLoading}
          textContent={"We are processing..."}
          textStyle={{ color: "#fff", fontFamily: "Light", fontSize: 14 }}
        />
      )}
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
    marginTop: 4,
    marginBottom: 4,
  },
  activityIndicator: {
    marginTop: 10,
  },
  modalContainer: {
    justifyContent: "space-around",
    alignItems: "flex-start",
    backgroundColor: "white",
    padding: 20,
    height: 350,
    width: 350,
  },
  orderItem: {
    backgroundColor: "#F8E6F3",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    justifyContent: "center",
  },
  orderName: {
    fontSize: 16,
    fontFamily: "SemiBold",
  },
  orderInfo: {
    fontSize: 16,
  },
  item: {
    padding: 8,
    borderBottomColor: "#e2e2e2",
    borderBottomWidth: 1,
    marginBottom: 5,
    backgroundColor: "#fff",
    paddingLeft: 18,
  },
  addDashedBox: {
    borderColor: "gray",
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 6,
    alignItems: "center",
    paddingHorizontal: 8,
    backgroundColor: "white",
    paddingVertical: 5,
    width: "40%",
    alignSelf: "center",
    borderStyle: "dashed",
  },
  buttons:{
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1,
  
  }, 
  circle: {
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent:"center",
    alignItems:"center", 
}, 
});

export default DeliverDetails;

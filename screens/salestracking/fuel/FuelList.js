import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import PageStyle from "../../style/pageStyle";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import * as BankingIcons from "../../../components/BankingIcons";
import AppStyles from "../../../assets/theme/AppStyles";
import { Contact } from "../../../constants/Contact";
import { DateDisplay, TimeDisplay } from "../../../components/DateDisplay";

const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

const FuelList = (props ) => {
    useEffect(() => {
        props.navigation.setOptions({
            title: "Fuels",
        });
    }, [])

    const [fuels, setFuels] = useState([]);
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
                .get(Api.Fuel.List)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    setFuels(response.data.Data);
                } else {
                    ToastMessage.Short("Error Loading Parties");
                }
            } else {
                ToastMessage.Short("Error Loading Parties");
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
           
                 {fuels.length > 0 ? (<ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    style={{ width: "100%", backgroundColor: "#eee", flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {fuels.map((fuelVehicle, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.partyItem}
                        >
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <Text style={[AppStyles.Text.BoldTitle, {marginBottom: 4}]}>{fuelVehicle.VehicleName}</Text>
                               {new Date().toDateString() === new Date(fuelVehicle?.FuelDate)?.toDateString() && <TouchableOpacity onPress={()=>{
                                        props.navigation.navigate("AddFuel", {fuelVehicle: fuelVehicle})
                                    }}>
                                    <BankingIcons.Edit  height={18} width={18} fill={Colors.primary} style={{marginRight: 8}}/>

                                    </TouchableOpacity>}
                            </View>
                            <Text style={styles.partyInfo}>{`${fuelVehicle.PlateNo}`}</Text>
                            <View style={{flexDirection:"row"}}>
                      <DateDisplay date={fuelVehicle?.FuelDate} />
                      <View style={{marginLeft: 6}}>
                          <TimeDisplay time={fuelVehicle?.FuelDate} />
                      </View>
                      </View>
                           
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            </View>
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                            <Text style={styles.partyInfo}>{`${fuelVehicle.FuelUnit.toFixed(2)} liters`}</Text>
                            <Text style={styles.partyInfo}>{`Rs: ${fuelVehicle.FuelAmount}`}</Text></View>
                             
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
          <View style={styles.noDataContainer}>
            <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
            <Text style={[styles.noDataText, { fontSize: 20 }]}>No Fuel Lists available</Text>
          </View>
        )}

            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    props.navigation.navigate("AddFuel");
                }}
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
    partyItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    partyName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    partyInfo: {
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
    orderInfo: {
        fontSize: 16,
        marginLeft: 4
    },
    noDataContainer: {
        alignItems: "center",
        marginTop: 20,
      },
      noDataText: {
        fontSize: 20,
      },
});

export default FuelList;

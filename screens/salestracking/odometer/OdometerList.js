import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator, 
    Animated, 
    Modal
} from "react-native";
import PageStyle from "../../style/pageStyle";
import { useNavigation } from "@react-navigation/native";
import { ButtonPrimary } from "../../../components/Button";
import * as BankingIcons from "../../../components/BankingIcons";
import { Colors } from "../../style/Theme";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";
import Api from "../../../constants/Api";
import AppStyles from "../../../assets/theme/AppStyles";
import { useFocusEffect } from "@react-navigation/native";


const OdometerList = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [odometers, setOdometers] = useState([]);

    const [isClicked, setIsClicked] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isClicked) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isClicked, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Adjust as needed
  });

    useEffect(() => {
        navigation.setOptions({
            title: "Odometer List",
        });
        getList();
    }, [])

    const getList = async () => {
        try {
            var response = await (await request())
                .get(Api.Odometers.List)
                .catch(function (error) {
                    ToastMessage.Short("Error! Contact Support");
                });

            if (response != undefined) {
                if (response.data.Code == 200) {
                    console.log(response.data.Data[0]);
                    setOdometers(response.data.Data);
                    
                } else {
                    ToastMessage.Short("Error Loading Odometers");
                }
            } else {
                ToastMessage.Short("Error Loading Odometers");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      getList();
      return () => {
        // Cleanup function (optional)
        // Additional cleanup logic (if needed)
      };
    }, [])
  );

    return (
        <View style={[styles.container]}>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%", backgroundColor: "#eee" }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {isLoading ? (
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                ) : (
                    <View>
                        {odometers.length > 0 ? odometers.map((odometer) => (
                            <TouchableOpacity key={odometer.Id} style={styles.tripItem}
                                onPress={() =>
                                    navigation.navigate("OdometerDetails", { odometer })
                                }
                            >
                                <View>
                                    <Text style={AppStyles.Text.BoldTitle}>{ new Date(odometer.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                                    <Text style={AppStyles.Text.Regular}>{odometer?.VehicleName+ " - " + odometer?.VehiclePlateNo}</Text>
                                    <Text style={styles.tripInfo}>Start Odometer: {odometer.StartOdometer}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                     <Text style={styles.tripInfo}>End Odometer: {odometer?.EndOdometer || ''}</Text>
                                        {odometer.EndOdometer == undefined && (
                                            <TouchableOpacity style={{flexDirection:'row', alignItems:'center', borderColor: Colors.primary, borderWidth: 1, justifyContent:"center", borderRadius: 4, padding: 4, paddingVertical: 2}}    onPress={() => navigation.navigate('EndTrip', {odometer: odometer})}>
                                                    <Text style={[ {color: "#040273", fontFamily:"SemiBold", fontSize: 16}]}>end trip</Text>
                                                </TouchableOpacity>
                                            // <TouchableOpacity
                                            //     style={styles.endTripButton}
                                            //     onPress={() => navigation.navigate('EndTrip')}
                                            // >
                                            //     <Text style={styles.endTripButtonText}>End Trip</Text>
                                            // </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )): 
                        <View style={{ alignItems: "center", paddingTop: 20 }}>
                        <BankingIcons.norecords height={60} width={60} fill={"#FFD21E"} />
                        <Text style={[AppStyles.Text.BoldTitle, { fontSize: 20 }]}>No odometers available !!</Text>
                      </View>
                    }
                    </View>
                )}
            </ScrollView>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => {
                    // navigation.navigate('StartTrip');
                    setIsClicked(!isClicked)
                }}
            >
                <BankingIcons.plus fill="white" />
            </TouchableOpacity>
            {isClicked &&
            <Modal
            transparent={true}
            animationType="slide"
            style={{ backgroundColor: "white" }}
          >
            <TouchableOpacity
              style={[
                styles.modalContainer,
                {
                  paddingHorizontal: 0,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }
                
              ]}
              onPress={()=>setIsClicked(false)}
            >
              <Animated.View style={[styles.overlay, { flex: 1, transform: [{ translateY }] }]}>
              <View
                style={styles.modal}
               
            >
              
                <View style={styles.background}>
                <TouchableOpacity style={{alignItems:"center", flexDirection:"row"}} onPress={() => {
                        setIsClicked(false);
                        navigation.navigate('FuelList');
                    }}>
                        <View style={{ padding: 2, borderRadius: 3}}>
                            <Text style={{fontFamily:"SemiBold"}}>Fuel List{"  "}</Text>
                        </View>
                        <View style={{width: 30, height: 30, borderRadius: 20, backgroundColor:Colors.primary, alignItems:"center", justifyContent:"center", marginLeft: 4}}>
                            <BankingIcons.Menu fill={"white"} height={17} width={17}/>
                            
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems:"center", flexDirection:"row", marginTop: 4}} onPress={() => {
                        setIsClicked(false);
                        navigation.navigate('AddFuel');
                    }}>
                        <View style={{ padding: 2, borderRadius: 3}}>
                            <Text style={{fontFamily:"SemiBold"}}>Add Fuel{" "}</Text>
                        </View>
                        <View style={{width: 30, height: 30, borderRadius: 20, backgroundColor:Colors.primary, alignItems:"center", justifyContent:"center", marginLeft: 4}}>
                            <BankingIcons.Gasoline fill={"white"} height={20} width={20}/>
                            
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems:"center",  flexDirection:"row", marginTop: 4}}  onPress={() => {
                        setIsClicked(false);
                        navigation.navigate('StartTrip');
                    }}>
                         <View style={{ padding: 2, borderRadius: 3}}>
                            <Text style={{fontFamily:"SemiBold"}}>Start Trip</Text>
                        </View>
                    <View style={{width: 30, height: 30, borderRadius: 20, backgroundColor:Colors.primary, alignItems:"center", justifyContent:"center", marginLeft: 4}}>
                        <BankingIcons.odometer fill={"white"} height={20} width={20}/>
                    </View>
                    </TouchableOpacity>
                   
                </View>
            </View>
            </Animated.View>
            </TouchableOpacity>
          </Modal>
             }
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
    tripItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    tripName: {
        fontSize: 20,
        fontWeight: '700',
    },
    tripInfo: {
        fontSize: 16,
        color: "#333",
    },
    endTripButton: {

    },
    endTripButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: Colors.primary,
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
    }, 
    modal:{
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center"
    }, 
    button: {
        padding: 20,
        backgroundColor: 'blue',
        borderRadius: 10,
      },
      icon: {
        width: 50,
        height: 50,
      },
      overlay: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 40,
        alignItems: 'center',
        backgroundColor: "blue"
      },
      smallIcon: {
        width: 20,
        height: 20,
        opacity: 0.5,
      },
      background: {
        // backgroundColor: "blue", 
        // width: "100%"
      },
      modalContainer: {
        flex: 1,
      },
       modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});

export default OdometerList;

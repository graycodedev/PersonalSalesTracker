import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator, 
    Animated
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

    return (
        <View style={styles.container}>
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
                        {odometers.map((odometer) => (
                            <TouchableOpacity key={odometer.Id} style={styles.tripItem}
                                onPress={() =>
                                    navigation.navigate("OdometerDetails", { odometer })
                                }
                            >
                                <View>
                                    <Text style={AppStyles.Text.BoldTitle}>{ new Date(odometer.StartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                                    <Text style={styles.tripInfo}>Start Odometer: {odometer.StartOdometer}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.tripInfo}>End Odometer: {odometer.EndOdometer || ''}</Text>
                                        {odometer.EndOdometer == undefined && (
                                            <TouchableOpacity
                                                style={styles.endTripButton}
                                                onPress={() => navigation.navigate('EndTrip')}
                                            >
                                                <Text style={styles.endTripButtonText}>End Trip</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
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
            {isClicked && <TouchableOpacity
                style={styles.modal}
                onPress={() => {
                    navigation.navigate('StartTrip');
                }}
            >
                <Animated.View style={[styles.overlay, { transform: [{ translateY }] }]}>
                <View style={styles.background} >
                <BankingIcons.BellIcon fill={Colors.primary} />
                <BankingIcons.BankIcon fill={Colors.primary} />
                </View>
      </Animated.View>
            </TouchableOpacity>}
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
        backgroundColor: "red",
        position: 'absolute',
        bottom: 100,
        right: 100,
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
        right: 100,
        alignItems: 'center',
        backgroundColor: "red"
      },
      smallIcon: {
        width: 20,
        height: 20,
        opacity: 0.5,
      },
      background: {
        backgroundColor: "red", 
        width: "100%"
      },
});

export default OdometerList;

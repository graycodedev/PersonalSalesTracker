import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Text,
    Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ButtonPrimary } from "../../../components/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { RegularInputText, AmountInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";
import * as Location from 'expo-location';
import qs from "qs";
import Api from "../../../constants/Api";
import request from "../../../config/RequestManager";
import ToastMessage from "../../../components/Toast/Toast";

const EndTrip = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [endOdometer, setEndOdometer] = useState('');
    const [location, setLocation] = useState(null);

    useEffect(() => {
        navigation.setOptions({
            title: "End Trip",
        });
    }, [])

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.uri);
        }
    };

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            ToastMessage.Short('Permission to access location was denied');
            return;
        }

        let location= await Location.getCurrentPositionAsync({ accuracy: Platform.OS=="android" ? Location.Accuracy.Low : Location.Accuracy.Lowest});
        setLocation(location);
    };

    const saveTrip = async () => {
        if (!location) {
            ToastMessage.Short('Location not available');
            return;
        }

        let strData = qs.stringify({
            Id: 0,
            SalesPersonUserId: 1,
            VehicleNo: 1,
            EndLatitude: location.coords.latitude,
            EndLongitude: location.coords.longitude,
            EndOdometer: endOdometer,
            EndDate: new Date(),
            EndOdometerImage: selectedImage,
        })
        setIsLoading(true);
        var response = await (await request())
            .post(Api.Odometers.End, strData)
            .catch(function (error) {
                setIsLoading(false);
                ToastMessage.Short("Error Occurred Contact Support");
            });
        if (response != undefined) {
            if (response.data.Code == 200) {
                setIsLoading(false);
                navigation.goBack();
                return response.data.Data;
            } else {
                console.log('Server response:', response.data);
                ToastMessage.Short(response.data.Message || "An error occurred");
            }
        } else {
            ToastMessage.Short("Error Occurred. Contact Support");
        }
        setIsLoading(false);
    }

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>
                <View>
                    <RegularInputText
                        key="endOdometer"
                        placeholder="End Odometer"
                        onChangeText={(text) => {
                            setEndOdometer(text)
                        }}
                        value={endOdometer}
                        keyboardType="numeric"
                    />
                </View>

                <View style={{ margin: 30 }}>
                    <TouchableOpacity onPress={getLocation}>
                        <ButtonPrimary title={"Get Location"} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontFamily: "Medium", marginBottom: 20 }}>Odometer Image</Text>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={pickImage}>
                        <View style={styles.ImagePicker}>
                            {selectedImage ? (
                                <Image style={styles.image} source={{ uri: selectedImage }} />
                            ) : (
                                <Image style={styles.defaultImage} source={require('../../../assets/newImg/plus.png')} />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 30 }}>
                    <TouchableOpacity
                        onPress={saveTrip}
                    >
                        <ButtonPrimary title={"End Trip"} />
                        <ActivityIndicator
                            animating={isLoading}
                            color="#ffa500"
                            style={styles.activityIndicator}
                        ></ActivityIndicator>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        padding: 10,
        alignContent: "center",
        justifyContent: "flex-start",
    },
    itemContainer: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
    },
    ImagePicker: {
        height: 150,
        width: 150,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#9A9A9A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    defaultImage: {
        width: '50%',
        height: '50%',
        resizeMode: 'cover',
        opacity: 0.1
    }
});

export default EndTrip;

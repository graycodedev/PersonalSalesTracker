import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ButtonPrimary } from "../../../components/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import * as BankingIcons from "../../../components/BankingIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../style/Theme";
import { TextInput } from "react-native-gesture-handler";
import { RegularInputText, AmountInputText } from "../../../components/Input";
import PageStyle from "../../style/pageStyle";

const StartTrip = () => {

    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: "Start Trip",
        });
    }, [])

    const [isLoading, setIsLoading] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImage(result.uri);
        }
    };

    const [start, setStart] = useState('')

    return (
        <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", backgroundColor: "#eee" }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <View style={styles.container}>

                <View style={{ marginBottom: 15, zIndex: 99 }}>
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
                        placeholder="Purpose"
                        label="Purpose"
                        items={[
                            { label: 'vacation', value: '0' },
                            { label: 'collection', value: '1' },
                        ]}
                    />
                </View>

                <View>
                    <RegularInputText
                        key="start"
                        placeholder="Start KM"
                        onChangeText={(text) => {
                            setStart(text)
                        }}
                        value={start}
                        multiline={true}
                        numberOfLines={5}
                    />
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
                        onPress={() => {
                            setIsLoading(true);
                        }}
                    >
                        <ButtonPrimary title={"Start Trip"} />
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

export default StartTrip;